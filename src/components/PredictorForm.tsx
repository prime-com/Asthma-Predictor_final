import React, { useState } from 'react';
import type { PatientInput, Gender, StayDuration } from '../types/asthma';
import { User, Activity, Wind, ArrowRight, ArrowLeft } from 'lucide-react';

interface PredictorFormProps {
  onSubmit: (data: PatientInput) => void;
}

const MUMBAI_LOCATIONS = [
  'Bandra (West)',
  'Chembur',
  'Colaba',
  'Borivali (East)',
  'Kurla',
  'Worli',
  'Mulund (West)',
  'Sion',
  'Thane (Belapur)',
  'Navi Mumbai (Vashi)',
  'Kalyan',
  'Pune (Shivajinagar)',
  'Nagpur',
  'Nashik',
  'Ghatkopar',
  'Andheri (West)'
];

export const PredictorForm: React.FC<PredictorFormProps> = ({ onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PatientInput>({
    age: 25,
    gender: 'male',
    smoking: false,
    familyHistory: false,
    coughing: false,
    wheezing: false,
    shortnessOfBreath: false,
    chestTightness: false,
    nighttimeSymptoms: false,
    location: MUMBAI_LOCATIONS[0],
    durationOfStay: '1-2.5y'
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleToggle = (field: keyof PatientInput) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field] as any
    }));
  };

  const handleInputChange = (field: keyof PatientInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmitForm} className="glass-panel p-6 space-y-6 max-w-2xl mx-auto">
      {/* Progress Indicators */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            Step {step} of 3
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((num) => (
            <div
              key={num}
              className={`h-1.5 w-10 rounded-full transition-all duration-300 ${
                num <= step ? 'bg-cyan-500' : 'bg-white/10'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* STEP 1: Personal Info & Medical History */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 font-heading font-semibold text-white">
            <User className="w-5 h-5 text-cyan-400" />
            <span>1. Demographics & History</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Age</label>
              <input
                type="number"
                min={1}
                max={120}
                value={formData.age}
                onChange={(e) => handleInputChange('age', Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-cyan-400 outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div
              onClick={() => handleToggle('smoking')}
              className={`toggle-card ${formData.smoking ? 'selected' : ''}`}
            >
              <div>
                <span className="text-xs font-semibold text-white block">Active / Passive Smoker</span>
                <span className="text-[10px] text-slate-400">Exposed to regular smoke inhalation</span>
              </div>
              <div className={`w-4 h-4 rounded border transition-all ${
                formData.smoking ? 'bg-cyan-500 border-cyan-400' : 'border-white/20'
              }`}></div>
            </div>

            <div
              onClick={() => handleToggle('familyHistory')}
              className={`toggle-card ${formData.familyHistory ? 'selected' : ''}`}
            >
              <div>
                <span className="text-xs font-semibold text-white block">Family History of Asthma</span>
                <span className="text-[10px] text-slate-400">Parents or close relatives diagnosed</span>
              </div>
              <div className={`w-4 h-4 rounded border transition-all ${
                formData.familyHistory ? 'bg-cyan-500 border-cyan-400' : 'border-white/20'
              }`}></div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Symptoms Assessment */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 font-heading font-semibold text-white">
            <Activity className="w-5 h-5 text-teal-400" />
            <span>2. Symptoms Assessment</span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed mb-2">
            Select the clinical symptoms you have experienced regularly within the past few weeks (mapped to Thakur's dataset parameters).
          </p>

          <div className="space-y-3">
            {[
              { id: 'coughing', label: 'Frequent Coughing', desc: 'Persistent coughing, especially dry or ticklish' },
              { id: 'wheezing', label: 'Wheezing / Whistling Sounds', desc: 'Whistling sound when breathing in or out' },
              { id: 'shortnessOfBreath', label: 'Shortness of Breath', desc: 'Difficulty breathing or running out of breath quickly' },
              { id: 'chestTightness', label: 'Chest Tightness or Pressure', desc: 'Heavy weight or squeezing sensation in the chest' },
              { id: 'nighttimeSymptoms', label: 'Nighttime Awakenings', desc: 'Waking up due to coughing, wheezing, or tightness' }
            ].map((symptom) => (
              <div
                key={symptom.id}
                onClick={() => handleToggle(symptom.id as any)}
                className={`toggle-card ${formData[symptom.id as keyof PatientInput] ? 'selected' : ''}`}
              >
                <div>
                  <span className="text-xs font-semibold text-white block">{symptom.label}</span>
                  <span className="text-[10px] text-slate-400">{symptom.desc}</span>
                </div>
                <div className={`w-4 h-4 rounded border transition-all ${
                  formData[symptom.id as keyof PatientInput] ? 'bg-cyan-500 border-cyan-400' : 'border-white/20'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Environmental Location & Stay Duration */}
      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 font-heading font-semibold text-white">
            <Wind className="w-5 h-5 text-amber-400" />
            <span>3. Environmental Exposure (CPCB Mapping)</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Select Your Primary Location / Area
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              >
                {MUMBAI_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                This will map your exposure using historical CPCB AQI data for this location.
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Duration of Stay / Exposure in this location
              </label>
              <select
                value={formData.durationOfStay}
                onChange={(e) => handleInputChange('durationOfStay', e.target.value as StayDuration)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-cyan-400 outline-none"
              >
                <option value="<6m">Less than 6 months</option>
                <option value="6m-1y">6 months to 1 year</option>
                <option value="1-2.5y">1 to 2.5 years</option>
                <option value=">2.5y">More than 2.5 years</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Helps calculate your time-weighted cumulative environmental trigger score.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <div></div>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="submit"
            className="btn-primary text-xs bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center gap-1.5"
          >
            Predict Asthma Risk <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
};
