import type { AssessmentInput, RiskAssessmentResult, RiskFactorContribution, ActionZone, RiskTier } from '../types/asthma';

export function calculateAsthmaRisk(input: AssessmentInput): RiskAssessmentResult {
  const { profile, symptoms, environmental } = input;

  // 1. PEFR Percentage Calculation
  const personalBest = profile.personalBestPEFR || 450;
  const currentPEFR = symptoms.currentPEFR || personalBest;
  const pefrPercentage = Math.round((currentPEFR / personalBest) * 100);

  let pefrScore = 0;
  let pefrImpact: 'low' | 'moderate' | 'high' | 'severe' = 'low';
  if (pefrPercentage >= 80) {
    pefrScore = Math.max(0, (100 - pefrPercentage) * 0.75); // 0 to 15
    pefrImpact = 'low';
  } else if (pefrPercentage >= 60) {
    pefrScore = 20 + (80 - pefrPercentage) * 1.5; // 20 to 50
    pefrImpact = 'moderate';
  } else if (pefrPercentage >= 50) {
    pefrScore = 50 + (60 - pefrPercentage) * 2.5; // 50 to 75
    pefrImpact = 'high';
  } else {
    pefrScore = 75 + Math.min(25, (50 - pefrPercentage) * 1.0); // 75 to 100
    pefrImpact = 'severe';
  }

  // 2. Daytime Symptoms Score (0-7 days/week)
  let daytimeScore = 0;
  if (symptoms.daytimeSymptomsPerWeek <= 1) daytimeScore = 5;
  else if (symptoms.daytimeSymptomsPerWeek <= 3) daytimeScore = 30;
  else if (symptoms.daytimeSymptomsPerWeek <= 5) daytimeScore = 65;
  else daytimeScore = 95;

  // 3. Nocturnal Awakenings Score (0-7 nights/week)
  let nightScore = 0;
  if (symptoms.nocturnalAwakeningsPerWeek === 0) nightScore = 0;
  else if (symptoms.nocturnalAwakeningsPerWeek <= 1) nightScore = 35;
  else if (symptoms.nocturnalAwakeningsPerWeek <= 3) nightScore = 70;
  else nightScore = 100;

  // 4. Rescue Inhaler Usage Score (puffs/week)
  let rescueScore = 0;
  if (symptoms.rescueInhalerPuffsPerWeek <= 2) rescueScore = 0;
  else if (symptoms.rescueInhalerPuffsPerWeek <= 6) rescueScore = 30;
  else if (symptoms.rescueInhalerPuffsPerWeek <= 12) rescueScore = 70;
  else rescueScore = 100;

  // 5. Activity Limitation Score
  let activityScore = 0;
  switch (symptoms.activityLimitation) {
    case 'none': activityScore = 0; break;
    case 'mild': activityScore = 25; break;
    case 'moderate': activityScore = 65; break;
    case 'severe': activityScore = 95; break;
  }

  // Combined Clinical Symptoms Sub-score (0-100)
  const clinicalSubScore = Math.round(
    daytimeScore * 0.25 +
    nightScore * 0.35 +
    rescueScore * 0.25 +
    activityScore * 0.15
  );

  // 6. Environmental Exposure Sub-score
  let aqiScore = Math.min(100, (environmental.aqi / 200) * 100);
  let pollenScore = 0;
  switch (environmental.pollenLevel) {
    case 'low': pollenScore = 10; break;
    case 'moderate': pollenScore = 40; break;
    case 'high': pollenScore = 75; break;
    case 'very_high': pollenScore = 100; break;
  }

  let triggerMultiplier = 1.0;
  if (environmental.moldExposure) triggerMultiplier += 0.15;
  if (environmental.coldAirExposure) triggerMultiplier += 0.15;
  if (profile.isSmoker || profile.secondhandSmokeExposure) triggerMultiplier += 0.25;

  let stressAdd = 0;
  if (environmental.stressLevel === 'moderate') stressAdd = 15;
  if (environmental.stressLevel === 'high') stressAdd = 35;

  const environmentalSubScore = Math.min(100, Math.round(
    (aqiScore * 0.5 + pollenScore * 0.3 + stressAdd * 0.2) * triggerMultiplier
  ));

  // Overall Weighted Score Computation:
  // PEFR (35%), Clinical Symptoms (45%), Environmental Risk (20%)
  const rawRiskScore = (pefrScore * 0.35) + (clinicalSubScore * 0.45) + (environmentalSubScore * 0.20);
  const finalRiskScore = Math.min(99, Math.max(1, Math.round(rawRiskScore)));

  // Risk Tier & Zone Assignment
  let riskTier: RiskTier = 'low';
  let zone: ActionZone = 'green';

  if (finalRiskScore < 25 && pefrPercentage >= 80) {
    riskTier = 'low';
    zone = 'green';
  } else if (finalRiskScore < 55 && pefrPercentage >= 65) {
    riskTier = 'moderate';
    zone = 'yellow';
  } else if (finalRiskScore < 80 || pefrPercentage >= 50) {
    riskTier = 'high';
    zone = 'yellow';
  } else {
    riskTier = 'critical';
    zone = 'red';
  }

  // Mandatory Red Zone trigger if PEFR < 50% or severe night awakenings + high rescue
  if (pefrPercentage < 50 || (symptoms.nocturnalAwakeningsPerWeek >= 4 && symptoms.rescueInhalerPuffsPerWeek >= 12)) {
    zone = 'red';
    riskTier = 'critical';
  }

  // Build Contributing Factors Breakdown
  const contributingFactors: RiskFactorContribution[] = [
    {
      name: 'Peak Expiratory Flow (PEFR)',
      category: 'pefr',
      score: Math.round(pefrScore),
      weight: 0.35,
      impact: pefrImpact,
      description: `${pefrPercentage}% of personal best (${currentPEFR} L/min vs ${personalBest} L/min target)`
    },
    {
      name: 'Nocturnal Awakenings',
      category: 'clinical',
      score: nightScore,
      weight: 0.20,
      impact: nightScore > 60 ? 'severe' : nightScore > 30 ? 'high' : 'low',
      description: symptoms.nocturnalAwakeningsPerWeek === 0 ? 'No night disturbances' : `${symptoms.nocturnalAwakeningsPerWeek} awakenings/week due to asthma`
    },
    {
      name: 'Rescue Inhaler Frequency',
      category: 'medication',
      score: rescueScore,
      weight: 0.18,
      impact: rescueScore > 60 ? 'severe' : rescueScore > 30 ? 'moderate' : 'low',
      description: `${symptoms.rescueInhalerPuffsPerWeek} reliever puffs/week`
    },
    {
      name: 'Air Quality & Triggers',
      category: 'environmental',
      score: environmentalSubScore,
      weight: 0.15,
      impact: environmentalSubScore > 60 ? 'high' : environmentalSubScore > 30 ? 'moderate' : 'low',
      description: `AQI: ${environmental.aqi} (${getAqiStatusText(environmental.aqi)}), Pollen: ${environmental.pollenLevel}`
    },
    {
      name: 'Activity Limitation',
      category: 'clinical',
      score: activityScore,
      weight: 0.12,
      impact: activityScore > 60 ? 'severe' : activityScore > 20 ? 'moderate' : 'low',
      description: `Physical restriction level: ${symptoms.activityLimitation}`
    }
  ];

  // Clinical Recommendations & Action Protocol
  const clinicalRecommendations: string[] = [];
  const immediateActions: string[] = [];

  if (zone === 'green') {
    clinicalRecommendations.push('Asthma is well controlled. Continue current daily controller (ICS) medication as prescribed.');
    clinicalRecommendations.push('Maintain regular exercise and log peak flow readings 2-3 times per week.');
    clinicalRecommendations.push('Keep rescue inhaler readily accessible during sports and outdoors.');
    immediateActions.push('Take standard morning/evening controller inhaler dose.');
    immediateActions.push('Monitor local AQI before intense outdoor workouts.');
  } else if (zone === 'yellow') {
    clinicalRecommendations.push('Caution: Asthma symptoms or lung function indicate an early flare-up / loss of control.');
    clinicalRecommendations.push('Initiate your Yellow Zone Action Plan: increase controller inhaler or add reliever as per doctor guidance.');
    clinicalRecommendations.push('Avoid outdoor exposure during peak pollen and high PM2.5 hours.');
    immediateActions.push('Use rescue inhaler (2 puffs) every 4 hours as needed for symptoms.');
    immediateActions.push('Re-check PEFR in 1-2 hours. If no improvement, contact your physician.');
  } else {
    clinicalRecommendations.push('CRITICAL MEDICAL ALERT: Severe asthma exacerbation detected!');
    clinicalRecommendations.push('Immediate medical evaluation required. Do not delay seeking medical care.');
    clinicalRecommendations.push('Follow Emergency Red Zone protocol immediately.');
    immediateActions.push('Take 2 to 4 puffs of rapid-acting reliever inhaler (SABA) immediately with spacer.');
    immediateActions.push('Sit upright, stay calm, and re-assess in 10-15 minutes.');
    immediateActions.push('Call emergency services (911 or local hotline) if breathing remains restricted or speaking in full sentences is impossible.');
  }

  // Calculate confidence score based on completeness
  const confidenceScore = 92;

  return {
    riskScore: finalRiskScore,
    riskTier,
    zone,
    confidenceScore,
    pefrPercentage,
    contributingFactors,
    clinicalRecommendations,
    immediateActions,
    assessedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

function getAqiStatusText(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  return 'Very Unhealthy / Hazardous';
}
