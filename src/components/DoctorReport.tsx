import React from 'react';
import type { RiskAssessmentResult, AssessmentInput } from '../types/asthma';
import { X, Printer, FileText } from 'lucide-react';

interface DoctorReportProps {
  input: AssessmentInput;
  result: RiskAssessmentResult;
  onClose: () => void;
}

export const DoctorReport: React.FC<DoctorReportProps> = ({
  input,
  result,
  onClose
}) => {
  const { profile, symptoms, environmental } = input;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-white/20 rounded-2xl max-w-3xl w-full p-6 space-y-6 text-slate-100 shadow-2xl relative my-8">
        
        {/* Top Actions */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold font-heading">
              Clinical Assessment Summary for Physician
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <Printer className="w-4 h-4" />
              <span>Print Summary</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Printable Content Container */}
        <div className="space-y-6 text-xs text-slate-200">
          
          {/* Header Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-800/60 border border-white/5 font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">PATIENT NAME</span>
              <span className="font-bold text-white text-sm">{profile.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AGE / GENDER</span>
              <span className="font-bold text-white text-sm">{profile.age} yrs / {profile.gender.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ASSESSMENT DATE</span>
              <span className="font-bold text-cyan-400 text-sm">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CURRENT RISK TIER</span>
              <span className={`font-bold text-sm ${
                result.zone === 'green' ? 'text-emerald-400' :
                result.zone === 'yellow' ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {result.riskTier.toUpperCase()} ({result.riskScore}%)
              </span>
            </div>
          </div>

          {/* Section 1: Lung Function & PEFR */}
          <div className="space-y-2">
            <h4 className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] border-b border-white/10 pb-1">
              1. Spirometry & Peak Expiratory Flow Rate (PEFR)
            </h4>
            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-800/40">
              <div>
                <span className="text-slate-400 block">Personal Best PEFR</span>
                <span className="font-mono font-bold text-sm text-white">{profile.personalBestPEFR} L/min</span>
              </div>
              <div>
                <span className="text-slate-400 block">Current PEFR</span>
                <span className="font-mono font-bold text-sm text-cyan-400">{symptoms.currentPEFR} L/min</span>
              </div>
              <div>
                <span className="text-slate-400 block">% Personal Best</span>
                <span className="font-mono font-bold text-sm text-emerald-400">{result.pefrPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Symptom Frequency */}
          <div className="space-y-2">
            <h4 className="font-bold text-teal-300 uppercase tracking-wider text-[11px] border-b border-white/10 pb-1">
              2. Symptom Frequency & Asthma Control
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-800/40">
              <div>
                <span className="text-slate-400 block">Daytime Cough/Wheeze</span>
                <span className="font-semibold text-white">{symptoms.daytimeSymptomsPerWeek} days/week</span>
              </div>
              <div>
                <span className="text-slate-400 block">Nocturnal Awakenings</span>
                <span className="font-semibold text-white">{symptoms.nocturnalAwakeningsPerWeek} nights/week</span>
              </div>
              <div>
                <span className="text-slate-400 block">Reliever Inhaler Puffs</span>
                <span className="font-semibold text-white">{symptoms.rescueInhalerPuffsPerWeek} puffs/week</span>
              </div>
              <div>
                <span className="text-slate-400 block">Activity Restriction</span>
                <span className="font-semibold text-white capitalize">{symptoms.activityLimitation}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Environmental Triggers */}
          <div className="space-y-2">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-white/10 pb-1">
              3. Environmental & Trigger Exposure
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/40 space-y-1">
              <p><strong className="text-slate-300">Location & Air Quality:</strong> {environmental.locationName} (AQI: {environmental.aqi}, PM2.5: {environmental.pm25} µg/m³)</p>
              <p><strong className="text-slate-300">Pollen Exposure:</strong> {environmental.pollenLevel.replace('_', ' ')}</p>
              <p><strong className="text-slate-300">Known Allergies:</strong> {profile.knownAllergies.join(', ') || 'None reported'}</p>
            </div>
          </div>

          {/* Section 4: Clinical Recommendations */}
          <div className="space-y-2">
            <h4 className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] border-b border-white/10 pb-1">
              4. Assessed Action Plan & Recommendations
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300 p-3 rounded-lg bg-slate-800/40">
              {result.clinicalRecommendations.map((rec, idx) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Physician Sign-off Box */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-end gap-4 text-[11px] text-slate-400">
            <div>
              <p>AsthmaPulse AI Clinical Decision Support Engine v2.4</p>
              <p>Based on GINA Exacerbation Risk Calculator</p>
            </div>
            <div className="text-right">
              <div className="w-48 border-b border-white/30 mb-1"></div>
              <p>Attending Physician Signature / Date</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
