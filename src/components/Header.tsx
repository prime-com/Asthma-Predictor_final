import React from 'react';
import { Activity } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="glass-panel border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Activity className="w-6 h-6 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-white font-heading">
              Asthma<span className="gradient-text-cyan">Pulse AI</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30 uppercase tracking-wider">
              Thakur Model
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Clinical Symptoms & Mumbai CPCB Exposure Score Predictor
          </p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="btn-secondary text-xs py-2 px-4"
      >
        Reset Form
      </button>
    </header>
  );
};
