import type { PatientInput, PredictionResult, SeverityLevel } from '../types/asthma';

// Mock location base AQI values representing historical CPCB statistics in Mumbai
const LOCATION_AQI_DATABASE: Record<string, number> = {
  'Bandra (West)': 110,
  'Chembur': 175,
  'Colaba': 72,
  'Borivali (East)': 88,
  'Kurla': 160,
  'Worli': 95,
  'Mulund (West)': 120,
  'Sion': 165,
  'Thane (Belapur)': 140,
  'Navi Mumbai (Vashi)': 115,
  'Kalyan': 150,
  'Pune (Shivajinagar)': 125,
  'Nagpur': 105,
  'Nashik': 80,
  'Ghatkopar': 155,
  'Andheri (West)': 102
};

export function predictAsthmaRisk(input: PatientInput): PredictionResult {
  const {
    age,
    smoking,
    familyHistory,
    coughing,
    wheezing,
    shortnessOfBreath,
    chestTightness,
    nighttimeSymptoms,
    location,
    durationOfStay
  } = input;

  // 1. Base clinical risk calculation from symptoms count
  let clinicalScore = 0;
  if (age < 12 || age > 65) clinicalScore += 10; // pediatric & geriatric high-risk multiplier
  let activeSymptomsCount = 0;
  if (coughing) { clinicalScore += 15; activeSymptomsCount++; }
  if (wheezing) { clinicalScore += 20; activeSymptomsCount++; }
  if (shortnessOfBreath) { clinicalScore += 25; activeSymptomsCount++; }
  if (chestTightness) { clinicalScore += 15; activeSymptomsCount++; }
  if (nighttimeSymptoms) { clinicalScore += 25; activeSymptomsCount++; }

  // 2. Personal medical background triggers
  let backgroundScore = 0;
  if (smoking) backgroundScore += 20;
  if (familyHistory) backgroundScore += 15;

  // 3. Environmental exposure score (CPCB dynamic calculation)
  const baseAQI = LOCATION_AQI_DATABASE[location] || 100;
  
  // Stay duration multiplier (cumulative exposure)
  let stayMultiplier = 1.0;
  if (durationOfStay === '<6m') stayMultiplier = 0.6;
  else if (durationOfStay === '6m-1y') stayMultiplier = 0.9;
  else if (durationOfStay === '1-2.5y') stayMultiplier = 1.1;
  else if (durationOfStay === '>2.5y') stayMultiplier = 1.35;

  const exposureScore = Math.min(100, Math.round((baseAQI / 200) * 100 * stayMultiplier));

  // 4. Combined Risk Index
  // Weighted: 50% Symptoms + 20% Medical History + 30% CPCB Environmental Exposure
  const finalRiskScore = Math.min(
    99,
    Math.max(1, Math.round(clinicalScore * 0.5 + backgroundScore * 0.2 + exposureScore * 0.3))
  );

  // 5. Determine multi-class Severity prediction (Low, Mid, High)
  let severity: SeverityLevel = 'low';
  if (finalRiskScore >= 70) {
    severity = 'high';
  } else if (finalRiskScore >= 30) {
    severity = 'mid';
  } else {
    severity = 'low';
  }

  // Generate contributing factors list
  const contributingFactors = [
    {
      name: 'Clinical Symptoms Profile',
      impact: activeSymptomsCount >= 4 ? 'high' : activeSymptomsCount >= 2 ? 'moderate' : 'low' as any,
      description: activeSymptomsCount === 0 
        ? 'No active symptoms reported.' 
        : `Reported ${activeSymptomsCount} symptoms (primarily ${shortnessOfBreath ? 'breathlessness' : ''} ${wheezing ? 'wheezing' : ''}).`
    },
    {
      name: 'CPCB Environmental Exposure',
      impact: exposureScore >= 70 ? 'high' : exposureScore >= 35 ? 'moderate' : 'low' as any,
      description: `Mapped CPCB AQI is ${baseAQI} at ${location}. Duration of stay (${durationOfStay}) yields a cumulative exposure score of ${exposureScore}/100.`
    },
    {
      name: 'Predisposition & History',
      impact: (smoking || familyHistory) ? 'moderate' : 'low' as any,
      description: `${smoking ? 'Active/Passive tobacco smoke exposure.' : ''} ${familyHistory ? 'Positive genetic family history of asthma.' : ''}`
    }
  ];

  // Recommendations checklist based on GINA
  const recommendations: string[] = [];
  if (severity === 'low') {
    recommendations.push('Keep maintaining active lung health and aerobic exercises.');
    recommendations.push('Monitor daily local outdoor weather conditions before heavy workouts.');
    recommendations.push('Ensure standard allergen avoidance if you have pet or dust allergies.');
  } else if (severity === 'mid') {
    recommendations.push('Consider scheduling a routine spirometry lung checkup with your physician.');
    recommendations.push('Minimize heavy outdoor cardiovascular exercise during peak morning AQI hours in ' + location + '.');
    recommendations.push('Identify specific triggers (dust mites, tree pollen, damp mold) and reduce exposure.');
  } else {
    recommendations.push('Schedule an urgent clinical evaluation with a certified pulmonologist.');
    recommendations.push('Avoid outdoor exposure entirely on high PM2.5 / smog days in ' + location + '.');
    recommendations.push('Ensure you carry a rapid-acting reliever inhaler (e.g., Albuterol/Salbutamol) at all times.');
    recommendations.push('Establish a formal daily controller medication (ICS) plan with your doctor.');
  }

  return {
    severity,
    riskScore: finalRiskScore,
    explanation: `Based on your symptoms and a calculated CPCB environmental exposure index of ${exposureScore}/100.`,
    contributingFactors,
    recommendations
  };
}
