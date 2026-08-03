export type Gender = 'male' | 'female' | 'other';
export type ActivityLimitation = 'none' | 'mild' | 'moderate' | 'severe';
export type PollenLevel = 'low' | 'moderate' | 'high' | 'very_high';
export type StressLevel = 'low' | 'moderate' | 'high';
export type RiskTier = 'low' | 'moderate' | 'high' | 'critical';
export type ActionZone = 'green' | 'yellow' | 'red';

export interface PatientProfile {
  name: string;
  age: number;
  gender: Gender;
  isSmoker: boolean;
  secondhandSmokeExposure: boolean;
  knownAllergies: string[];
  personalBestPEFR: number; // L/min (typically 350-650)
  hasAsthmaDiagnosis: boolean;
}

export interface ClinicalSymptoms {
  daytimeSymptomsPerWeek: number; // 0 to 7 days
  nocturnalAwakeningsPerWeek: number; // 0 to 7 nights
  rescueInhalerPuffsPerWeek: number; // puffs per week
  activityLimitation: ActivityLimitation;
  currentPEFR: number; // current Peak Expiratory Flow Rate
}

export interface EnvironmentalFactors {
  locationName: string;
  aqi: number; // 0 - 500
  pm25: number; // ug/m3
  pm10: number; // ug/m3
  pollenLevel: PollenLevel;
  humidity: number; // %
  temperature: number; // Celsius
  moldExposure: boolean;
  coldAirExposure: boolean;
  stressLevel: StressLevel;
}

export interface AssessmentInput {
  profile: PatientProfile;
  symptoms: ClinicalSymptoms;
  environmental: EnvironmentalFactors;
}

export interface RiskFactorContribution {
  name: string;
  category: 'clinical' | 'pefr' | 'environmental' | 'medication';
  score: number; // 0 - 100
  weight: number; // 0 - 1
  impact: 'low' | 'moderate' | 'high' | 'severe';
  description: string;
}

export interface RiskAssessmentResult {
  riskScore: number; // 0 to 100
  riskTier: RiskTier;
  zone: ActionZone;
  confidenceScore: number; // 85-98%
  pefrPercentage: number; // % of personal best
  contributingFactors: RiskFactorContribution[];
  clinicalRecommendations: string[];
  immediateActions: string[];
  assessedAt: string;
}

export interface LogEntry {
  id: string;
  date: string;
  pefr: number;
  pefrPercentage: number;
  daytimeSymptoms: number;
  nightAwakenings: number;
  rescuePuffs: number;
  aqi: number;
  zone: ActionZone;
  triggers: string[];
  notes?: string;
}

export interface PatientPreset {
  id: string;
  title: string;
  description: string;
  badge: string;
  input: AssessmentInput;
}
