export type Gender = 'male' | 'female' | 'other';
export type StayDuration = '<6m' | '6m-1y' | '1-2.5y' | '>2.5y';
export type SeverityLevel = 'low' | 'mid' | 'high';

export interface PatientInput {
  age: number;
  gender: Gender;
  smoking: boolean;
  familyHistory: boolean;
  coughing: boolean;
  wheezing: boolean;
  shortnessOfBreath: boolean;
  chestTightness: boolean;
  nighttimeSymptoms: boolean;
  location: string;
  durationOfStay: StayDuration;
}

export interface PredictionResult {
  severity: SeverityLevel;
  riskScore: number; // 0 - 100%
  explanation: string;
  contributingFactors: Array<{
    name: string;
    impact: 'low' | 'moderate' | 'high';
    description: string;
  }>;
  recommendations: string[];
}
