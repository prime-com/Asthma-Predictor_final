import React from 'react';
import type { AssessmentInput, RiskAssessmentResult } from '../types/asthma';
import { Activity, Thermometer, ShieldAlert, CheckCircle2, ChevronRight, HeartPulse, Sliders, HelpCircle } from 'lucide-react';

interface RiskPredictorProps {
  input: AssessmentInput;
  onChangeInput: (newInput: AssessmentInput) => void;
  result: RiskAssessmentResult;
  onNavigateToActionPlan: () => void;
}

export const RiskPredictor: React.FC<RiskPredictorProps> = ({
  input,
  onChangeInput,
  result,
  onNavigateToActionPlan
}) => {
  const { profile, symptoms, environmental } = input;

  const handleProfileChange = (key: string, value: any) => {
    onChangeInput({
      ...input,
      profile: { ...profile, [key]: value }
    });
  };

  const handleSymptomChange = (key: string, value: any) => {
    onChangeInput({
      ...input,
      symptoms: { ...symptoms, [key]: value }
    });
  };

  const handleEnvironmentalChange = (key: string, value: any) => {
    onChangeInput({
      ...input,
      environmental: { ...environmental, [key]: value }
    });
  };

  const getScoreColorClass = (score: number) => {
    if (score < 25) return 'text-emerald-400';
    if (score < 55) return 'text-amber-400';
    if (score < 80) return 'text-orange-400';
    return 'text-rose-400';
  };

  const getZoneBgGlow = () => {
    if (result.zone === 'green') return 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-500/30';
    if (result.zone === 'yellow') return 'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30';
    return 'from-rose-500/20 via-red-500/10 to-transparent border-rose-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Introduction */}
      <div className="glass-panel p-6 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950/40 border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" /> Multi-Factor Clinical Predictor
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Asthma Flare & Risk Score Calculator
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Adjust clinical parameters, peak expiratory flow (PEFR), and environmental exposure below. Our model calculates asthma exacerbation risk based on Global Initiative for Asthma (GINA) protocols.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="text-xs text-slate-400">Assessed Model</div>
            <div className="text-xs font-bold text-cyan-400">{result.confidenceScore}% Confidence Score</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Interactive Assessment Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Lung Function & Peak Flow */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-semibold font-heading">
                <HeartPulse className="w-5 h-5 text-cyan-400" />
                <span>1. Lung Function & Peak Flow (PEFR)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                {result.pefrPercentage}% Target
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Personal Best Peak Flow (L/min)
                </label>
                <input
                  type="number"
                  value={profile.personalBestPEFR}
                  onChange={(e) => handleProfileChange('personalBestPEFR', Math.max(200, Number(e.target.value)))}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-cyan-400 outline-none"
                  min={200}
                  max={800}
                />
                <p className="text-[11px] text-slate-400 mt-1">Normal adult baseline: 350-650 L/min</p>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">
                  Current PEFR Reading (L/min)
                </label>
                <input
                  type="number"
                  value={symptoms.currentPEFR}
                  onChange={(e) => handleSymptomChange('currentPEFR', Math.max(100, Number(e.target.value)))}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-cyan-400 outline-none"
                  min={100}
                  max={800}
                />
                <p className="text-[11px] text-slate-400 mt-1">Measured via peak flow meter</p>
              </div>
            </div>

            {/* PEFR Slider */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>PEFR Meter Quick Adjustment</span>
                <span className="font-semibold text-cyan-400">{symptoms.currentPEFR} L/min ({result.pefrPercentage}%)</span>
              </div>
              <input
                type="range"
                min={150}
                max={profile.personalBestPEFR}
                value={symptoms.currentPEFR}
                onChange={(e) => handleSymptomChange('currentPEFR', Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span className="text-rose-400">&lt;50% (Emergency Zone)</span>
                <span className="text-amber-400">50-79% (Caution Zone)</span>
                <span className="text-emerald-400">80-100% (Safe Zone)</span>
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Symptoms (ACT Parameters) */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-semibold font-heading">
                <Sliders className="w-5 h-5 text-teal-400" />
                <span>2. Clinical Symptoms & Medication Frequency</span>
              </div>
              <span className="text-xs text-slate-400">Past 7 Days</span>
            </div>

            {/* Daytime Symptoms Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Daytime Coughing / Wheezing Frequency</span>
                <span className="font-semibold text-teal-300">{symptoms.daytimeSymptomsPerWeek} days / week</span>
              </div>
              <input
                type="range"
                min={0}
                max={7}
                value={symptoms.daytimeSymptomsPerWeek}
                onChange={(e) => handleSymptomChange('daytimeSymptomsPerWeek', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Nocturnal Awakenings Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Nocturnal Awakenings (Night Disturbance)</span>
                <span className="font-semibold text-amber-300">{symptoms.nocturnalAwakeningsPerWeek} nights / week</span>
              </div>
              <input
                type="range"
                min={0}
                max={7}
                value={symptoms.nocturnalAwakeningsPerWeek}
                onChange={(e) => handleSymptomChange('nocturnalAwakeningsPerWeek', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Rescue Inhaler Puffs Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Rescue Inhaler (SABA) Usage</span>
                <span className="font-semibold text-rose-300">{symptoms.rescueInhalerPuffsPerWeek} puffs / week</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={symptoms.rescueInhalerPuffsPerWeek}
                onChange={(e) => handleSymptomChange('rescueInhalerPuffsPerWeek', Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Physical Activity Limitation */}
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-2">
                Physical Activity Restriction
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['none', 'mild', 'moderate', 'severe'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleSymptomChange('activityLimitation', level)}
                    className={`py-2 px-1 text-xs rounded-xl border capitalize font-semibold transition-all ${
                      symptoms.activityLimitation === level
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow'
                        : 'bg-slate-900/40 text-slate-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Environmental Triggers */}
          <div className="glass-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-white font-semibold font-heading">
                <Thermometer className="w-5 h-5 text-amber-400" />
                <span>3. Environmental & Air Quality Triggers</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Air Quality Index (AQI)</span>
                  <span className="font-bold text-amber-400">{environmental.aqi} AQI</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={300}
                  value={environmental.aqi}
                  onChange={(e) => handleEnvironmentalChange('aqi', Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Pollen Exposure</label>
                <select
                  value={environmental.pollenLevel}
                  onChange={(e) => handleEnvironmentalChange('pollenLevel', e.target.value)}
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
                >
                  <option value="low">Low Pollen</option>
                  <option value="moderate">Moderate Pollen</option>
                  <option value="high">High Pollen</option>
                  <option value="very_high">Very High Pollen</option>
                </select>
              </div>
            </div>

            {/* Environmental Checkboxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={environmental.coldAirExposure}
                  onChange={(e) => handleEnvironmentalChange('coldAirExposure', e.target.checked)}
                  className="rounded bg-slate-900 border-white/20 accent-cyan-400"
                />
                <span>Cold Weather Exposure</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={environmental.moldExposure}
                  onChange={(e) => handleEnvironmentalChange('moldExposure', e.target.checked)}
                  className="rounded bg-slate-900 border-white/20 accent-cyan-400"
                />
                <span>Damp / Mold Exposure</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.secondhandSmokeExposure}
                  onChange={(e) => handleProfileChange('secondhandSmokeExposure', e.target.checked)}
                  className="rounded bg-slate-900 border-white/20 accent-cyan-400"
                />
                <span>Smoke Exposure</span>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: Real-time Output & Risk Gauge (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Risk Result Card */}
          <div className={`glass-panel p-6 bg-gradient-to-b ${getZoneBgGlow()} relative overflow-hidden transition-all duration-300`}>
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Calculated Risk Output
              </span>
              <span className="text-xs font-mono text-slate-400">Updated: {result.assessedAt}</span>
            </div>

            {/* Central Score Meter */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Radial Arc */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  {/* Animated Risk Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * result.riskScore) / 100}
                    strokeLinecap="round"
                    className={`transition-all duration-700 ease-out ${getScoreColorClass(result.riskScore)}`}
                    fill="transparent"
                  />
                </svg>

                {/* Score Number Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className={`text-4xl font-extrabold font-heading ${getScoreColorClass(result.riskScore)}`}>
                    {result.riskScore}%
                  </span>
                  <span className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
                    Risk Index
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border ${
                  result.zone === 'green' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                  result.zone === 'yellow' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  <ShieldAlert className="w-4 h-4" />
                  <span>{result.riskTier} Risk Tier ({result.zone.toUpperCase()} ZONE)</span>
                </div>
              </div>
            </div>

            {/* Contributing Risk Drivers */}
            <div className="mt-6 space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Contributing Factor Analysis
              </h4>
              <div className="space-y-2.5">
                {result.contributingFactors.map((factor, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{factor.name}</span>
                      <span className={`font-mono font-semibold ${
                        factor.impact === 'severe' ? 'text-rose-400' :
                        factor.impact === 'high' ? 'text-amber-400' : 'text-slate-400'
                      }`}>
                        {factor.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          factor.impact === 'severe' ? 'bg-rose-500' :
                          factor.impact === 'high' ? 'bg-amber-500' :
                          factor.impact === 'moderate' ? 'bg-cyan-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                    <p className="text-[11px] text-slate-400">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Immediate Action Protocol Box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Recommended Action Protocol
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {result.immediateActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={onNavigateToActionPlan}
                className="w-full mt-2 btn-primary text-xs flex items-center justify-center gap-2 py-2.5"
              >
                <span>View Complete Asthma Action Plan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Medical Disclaimer Note */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Clinical Note:</strong> This predictor provides decision support based on GINA Guidelines and environmental air data. It does not replace emergency medical treatment. In severe breathing distress, dial 911 immediately.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
