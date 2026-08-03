import type { PatientPreset } from '../types/asthma';

export const PATIENT_PRESETS: PatientPreset[] = [
  {
    id: 'preset-well-controlled',
    title: 'Alex Chen (Controlled Baseline)',
    description: '28-year-old active adult with well-controlled mild persistent asthma.',
    badge: 'Green Zone (Low Risk)',
    input: {
      profile: {
        name: 'Alex Chen',
        age: 28,
        gender: 'male',
        isSmoker: false,
        secondhandSmokeExposure: false,
        knownAllergies: ['Dust Mites'],
        personalBestPEFR: 520,
        hasAsthmaDiagnosis: true
      },
      symptoms: {
        daytimeSymptomsPerWeek: 1,
        nocturnalAwakeningsPerWeek: 0,
        rescueInhalerPuffsPerWeek: 1,
        activityLimitation: 'none',
        currentPEFR: 495 // 95%
      },
      environmental: {
        locationName: 'Seattle, WA',
        aqi: 32,
        pm25: 8.2,
        pm10: 15.0,
        pollenLevel: 'low',
        humidity: 55,
        temperature: 20,
        moldExposure: false,
        coldAirExposure: false,
        stressLevel: 'low'
      }
    }
  },
  {
    id: 'preset-seasonal-flare',
    title: 'Sarah Jenkins (Spring Pollen Flare)',
    description: '34-year-old female experiencing high grass & tree pollen sensitivity.',
    badge: 'Yellow Zone (Moderate Risk)',
    input: {
      profile: {
        name: 'Sarah Jenkins',
        age: 34,
        gender: 'female',
        isSmoker: false,
        secondhandSmokeExposure: false,
        knownAllergies: ['Tree Pollen', 'Grass', 'Cat Dander'],
        personalBestPEFR: 450,
        hasAsthmaDiagnosis: true
      },
      symptoms: {
        daytimeSymptomsPerWeek: 4,
        nocturnalAwakeningsPerWeek: 2,
        rescueInhalerPuffsPerWeek: 6,
        activityLimitation: 'mild',
        currentPEFR: 330 // 73%
      },
      environmental: {
        locationName: 'Atlanta, GA',
        aqi: 88,
        pm25: 24.5,
        pm10: 42.0,
        pollenLevel: 'very_high',
        humidity: 78,
        temperature: 26,
        moldExposure: false,
        coldAirExposure: false,
        stressLevel: 'moderate'
      }
    }
  },
  {
    id: 'preset-smog-exposure',
    title: 'Marcus Vance (Urban Smog & Cold Air)',
    description: '45-year-old commuter exposed to heavy traffic pollution and winter chill.',
    badge: 'Yellow Zone (High Risk)',
    input: {
      profile: {
        name: 'Marcus Vance',
        age: 45,
        gender: 'male',
        isSmoker: false,
        secondhandSmokeExposure: true,
        knownAllergies: ['Vehicle Exhaust', 'Mold'],
        personalBestPEFR: 480,
        hasAsthmaDiagnosis: true
      },
      symptoms: {
        daytimeSymptomsPerWeek: 5,
        nocturnalAwakeningsPerWeek: 3,
        rescueInhalerPuffsPerWeek: 10,
        activityLimitation: 'moderate',
        currentPEFR: 300 // 62%
      },
      environmental: {
        locationName: 'Chicago, IL',
        aqi: 156,
        pm25: 64.8,
        pm10: 110.0,
        pollenLevel: 'moderate',
        humidity: 40,
        temperature: 4,
        moldExposure: true,
        coldAirExposure: true,
        stressLevel: 'high'
      }
    }
  },
  {
    id: 'preset-severe-attack',
    title: 'Elena Rostova (Acute Attack Alert)',
    description: '19-year-old student with severe bronchial constriction and nocturnal awakening.',
    badge: 'Red Zone (Critical Risk)',
    input: {
      profile: {
        name: 'Elena Rostova',
        age: 19,
        gender: 'female',
        isSmoker: false,
        secondhandSmokeExposure: false,
        knownAllergies: ['Cat hair', 'Cockroach allergen', 'Cold air'],
        personalBestPEFR: 420,
        hasAsthmaDiagnosis: true
      },
      symptoms: {
        daytimeSymptomsPerWeek: 7,
        nocturnalAwakeningsPerWeek: 5,
        rescueInhalerPuffsPerWeek: 16,
        activityLimitation: 'severe',
        currentPEFR: 195 // 46% - Emergency zone
      },
      environmental: {
        locationName: 'Denver, CO',
        aqi: 175,
        pm25: 88.0,
        pm10: 140.0,
        pollenLevel: 'high',
        humidity: 25,
        temperature: 2,
        moldExposure: true,
        coldAirExposure: true,
        stressLevel: 'high'
      }
    }
  }
];
