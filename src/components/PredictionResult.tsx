import type { PredictionResult as PredictionResultType, PatientInput } from '../types/asthma';
import { ShieldCheck, AlertTriangle, ShieldAlert, ChevronRight, MapPin, RefreshCw, Clock } from 'lucide-react';

interface PredictionResultProps {
  input: PatientInput;
  result: PredictionResultType;
  onReset: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  input,
  result,
  onReset
}) => {
  const getSeverityConfig = () => {
    switch (result.severity) {
      case 'low':
        return {
          colorClass: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
          glowClass: 'pulse-low',
          icon: ShieldCheck,
          title: 'Low Severity Risk',
          desc: 'Your clinical symptoms and environmental exposure score suggest low risk. Keep maintaining a healthy routine.'
        };
      case 'mid':
        return {
          colorClass: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
          glowClass: 'pulse-mid',
          icon: AlertTriangle,
          title: 'Moderate Severity Risk',
          desc: 'Your symptoms and local cumulative air exposure suggest moderate risk of asthma symptoms. Monitor environmental triggers.'
        };
      case 'high':
        return {
          colorClass: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
          glowClass: 'pulse-high',
          icon: ShieldAlert,
          title: 'High Severity Risk',
          desc: 'Alert: Your clinical symptoms combined with high time-weighted AQI exposure suggest a high risk of flare-ups. Consult your healthcare provider.'
        };
    }
  };

  const config = getSeverityConfig();
  const SeverityIcon = config.icon;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
      
      {/* LEFT COLUMN: Main Risk Score & Prediction Badge (5 cols) */}
      <div className="lg:col-span-5 space-y-6">
        <div className={`glass-panel p-6 border-t-4 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300 ${
          result.severity === 'low' ? 'border-t-emerald-500' :
          result.severity === 'mid' ? 'border-t-amber-500' : 'border-t-rose-500'
        }`}>
          
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">
            Prediction Output
          </span>

          {/* Radial score circle */}
          <div className="relative w-40 h-40 flex items-center justify-center mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray={263.8}
                strokeDashoffset={263.8 - (263.8 * result.riskScore) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${
                  result.severity === 'low' ? 'text-emerald-400' :
                  result.severity === 'mid' ? 'text-amber-400' : 'text-rose-400'
                }`}
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold font-heading text-white">{result.riskScore}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Risk Score</span>
            </div>
          </div>

          {/* Severity Pill */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${config.colorClass} ${config.glowClass}`}>
            <SeverityIcon className="w-4 h-4" />
            <span>{config.title}</span>
          </div>

          <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-sm">
            {config.desc}
          </p>

          <button
            onClick={onReset}
            className="w-full mt-6 btn-secondary text-xs flex items-center justify-center gap-2 py-2.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Predict Another Patient</span>
          </button>
        </div>

        {/* Location & Exposure details */}
        <div className="glass-panel p-5 space-y-3 font-mono text-xs">
          <h4 className="font-semibold font-heading text-white text-xs uppercase tracking-wider border-b border-white/5 pb-2">
            Mapped Exposure Context
          </h4>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> Location:</span>
            <span className="font-bold text-white">{input.location}</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Duration of Stay:</span>
            <span className="font-bold text-white">
              {input.durationOfStay === '<6m' ? 'Less than 6 months' :
               input.durationOfStay === '6m-1y' ? '6 months to 1 year' :
               input.durationOfStay === '1-2.5y' ? '1 to 2.5 years' : 'More than 2.5 years'}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Factor Analysis & Guidelines (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* Factor analysis */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-heading border-b border-white/10 pb-3">
            Contributing Risk Factors
          </h3>

          <div className="space-y-3.5">
            {result.contributingFactors.map((factor, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-medium">{factor.name}</span>
                  <span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                    factor.impact === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    factor.impact === 'moderate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {factor.impact}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action recommendations */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-heading border-b border-white/10 pb-3">
            Preventative Action Guidelines
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {result.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};
