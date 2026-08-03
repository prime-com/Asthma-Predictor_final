import React, { useState } from 'react';
import type { RiskAssessmentResult, PatientProfile } from '../types/asthma';
import { ClipboardList, CheckCircle, AlertTriangle, ShieldAlert, Printer, Edit2, Save, PhoneCall } from 'lucide-react';

interface ActionPlanProps {
  result: RiskAssessmentResult;
  profile: PatientProfile;
  onNavigateToEmergency: () => void;
}

export const ActionPlan: React.FC<ActionPlanProps> = ({
  result,
  profile,
  onNavigateToEmergency
}) => {
  const [controllerDose, setControllerDose] = useState('Budesonide / Formoterol (160/4.5 mcg) - 2 puffs twice daily');
  const [relieverDose, setRelieverDose] = useState('Albuterol / Salbutamol (90 mcg) - 2 puffs as needed');
  const [isEditing, setIsEditing] = useState(false);

  const personalBest = profile.personalBestPEFR || 500;
  const greenMin = Math.round(personalBest * 0.8);
  const yellowMin = Math.round(personalBest * 0.5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-950/40 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" /> Personalized Clinical Protocol
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Personal Asthma Action Plan (GINA Standard)
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Customized for <strong>{profile.name}</strong> based on personal best peak flow ({personalBest} L/min). Your current assessed zone is highlighted below.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            {isEditing ? <Save className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-4 h-4 text-cyan-400" />}
            <span>{isEditing ? 'Done Editing' : 'Customize Doses'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="btn-primary text-xs flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Plan</span>
          </button>
        </div>
      </div>

      {/* Action Plan Zones Stack */}
      <div className="space-y-6">
        
        {/* GREEN ZONE: Doing Well */}
        <div className={`glass-panel p-6 border-l-8 transition-all ${
          result.zone === 'green'
            ? 'border-l-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
            : 'border-l-emerald-500/50 opacity-85'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-emerald-400 font-heading">
                    GREEN ZONE: Doing Well (Controlled)
                  </h3>
                  {result.zone === 'green' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 uppercase">
                      ACTIVE ZONE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Peak Flow Range: {greenMin} to {personalBest} L/min (80% to 100% of personal best)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-xs text-slate-300">
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider mb-2 text-[11px]">
                Clinical Status
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li>No shortness of breath, cough, or wheezing.</li>
                <li>Sleeping well throughout the night without asthma symptoms.</li>
                <li>Can perform normal daily activities and exercise without restriction.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider mb-2 text-[11px]">
                Daily Controller Medication Routine
              </h4>
              {isEditing ? (
                <textarea
                  value={controllerDose}
                  onChange={(e) => setControllerDose(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-lg p-2 text-xs text-white outline-none"
                  rows={2}
                />
              ) : (
                <p className="p-3 rounded-xl bg-slate-900/60 border border-white/5 font-medium text-emerald-300">
                  {controllerDose}
                </p>
              )}
              <p className="text-[11px] text-slate-400 mt-2">
                * Note: Always rinse mouth with water after inhaling steroid controller medications.
              </p>
            </div>
          </div>
        </div>

        {/* YELLOW ZONE: Getting Worse */}
        <div className={`glass-panel p-6 border-l-8 transition-all ${
          result.zone === 'yellow'
            ? 'border-l-amber-500 bg-amber-950/30 ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10'
            : 'border-l-amber-500/50 opacity-85'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-amber-400 font-heading">
                    YELLOW ZONE: Caution / Flare-Up
                  </h3>
                  {result.zone === 'yellow' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 uppercase">
                      ACTIVE ZONE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Peak Flow Range: {yellowMin} to {greenMin - 1} L/min (50% to 79% of personal best)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-xs text-slate-300">
            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider mb-2 text-[11px]">
                Warning Signs & Symptoms
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-slate-300">
                <li>Increased coughing, chest tightness, or wheezing.</li>
                <li>Waking up at night due to respiratory distress.</li>
                <li>Reduced stamina during walking or light physical tasks.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white uppercase tracking-wider mb-2 text-[11px]">
                Reliever Escalation Steps
              </h4>
              {isEditing ? (
                <textarea
                  value={relieverDose}
                  onChange={(e) => setRelieverDose(e.target.value)}
                  className="w-full bg-slate-900 border border-white/20 rounded-lg p-2 text-xs text-white outline-none"
                  rows={2}
                />
              ) : (
                <p className="p-3 rounded-xl bg-slate-900/60 border border-white/5 font-medium text-amber-300">
                  {relieverDose}
                </p>
              )}
              <p className="text-[11px] text-slate-400 mt-2">
                If peak flow does not return to Green Zone within 48 hours, contact your physician.
              </p>
            </div>
          </div>
        </div>

        {/* RED ZONE: Medical Emergency */}
        <div className={`glass-panel p-6 border-l-8 transition-all ${
          result.zone === 'red'
            ? 'border-l-rose-500 bg-rose-950/40 ring-2 ring-rose-500/50 shadow-xl shadow-rose-500/20 pulse-emergency'
            : 'border-l-rose-500/50 opacity-85'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg border border-rose-500/30">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-rose-400 font-heading">
                    RED ZONE: Severe Medical Emergency
                  </h3>
                  {result.zone === 'red' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/30 text-rose-300 font-bold border border-rose-500/50 uppercase">
                      CRITICAL ALERT
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-mono mt-0.5">
                  Peak Flow Range: &lt; {yellowMin} L/min (Less than 50% of personal best)
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToEmergency}
              className="btn-primary bg-gradient-to-r from-rose-600 to-red-600 text-xs flex items-center justify-center gap-2 py-2 px-4 shadow-lg shadow-rose-600/40"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>Launch 4x4 Inhalation Emergency Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-xs text-slate-300">
            <div>
              <h4 className="font-semibold text-rose-300 uppercase tracking-wider mb-2 text-[11px]">
                Severe Danger Signals
              </h4>
              <ul className="space-y-1.5 list-disc list-inside text-rose-200 font-medium">
                <li>Severe breathlessness - cannot complete a sentence without pausing for breath.</li>
                <li>Reliever inhaler gives no relief or wears off in under 3 hours.</li>
                <li>Ribs or neck muscles pulling in tightly during breathing (retractions).</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/30 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                Immediate Emergency Steps
              </h4>
              <ol className="space-y-1.5 list-decimal list-inside text-rose-100">
                <li>Take 4 separate puffs of rescue inhaler (Albuterol) with spacer immediately.</li>
                <li>Sit upright and stay calm. Do not lie down.</li>
                <li>If breathing remains difficult after 4 minutes, call 911 / Emergency.</li>
              </ol>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
