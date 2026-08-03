import React from 'react';
import { Activity, Wind, ClipboardList, LineChart, AlertTriangle, Bot, FileText, Moon, Sun, UserCheck } from 'lucide-react';
import { PATIENT_PRESETS } from '../data/patientPresets';
import type { RiskAssessmentResult, PatientPreset } from '../types/asthma';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  result: RiskAssessmentResult;
  selectedPresetId: string;
  onSelectPreset: (preset: PatientPreset) => void;
  onOpenReportModal: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  result,
  selectedPresetId,
  onSelectPreset,
  onOpenReportModal,
  isDarkMode,
  toggleTheme
}) => {
  const getZoneBadgeClass = () => {
    switch (result.zone) {
      case 'green':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 pulse-safe';
      case 'yellow':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30 pulse-warning';
      case 'red':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30 pulse-emergency';
    }
  };

  const navItems = [
    { id: 'predictor', label: 'Risk Predictor', icon: Activity },
    { id: 'environment', label: 'Air & Triggers', icon: Wind },
    { id: 'action-plan', label: 'Action Plan', icon: ClipboardList },
    { id: 'journal', label: 'Symptom Journal', icon: LineChart },
    { id: 'emergency', label: 'Emergency Protocol', icon: AlertTriangle },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Logo & Brand */}
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
                GINA v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Clinical Risk Assessment & Real-Time Flare Predictor
            </p>
          </div>
        </div>

        {/* Preset Patient Selector & Current Zone Status */}
        <div className="flex items-center gap-3">
          {/* Patient Preset Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="font-medium text-slate-400 hidden lg:inline">Preset:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => {
                const preset = PATIENT_PRESETS.find(p => p.id === e.target.value);
                if (preset) onSelectPreset(preset);
              }}
              className="bg-transparent text-slate-200 font-semibold outline-none cursor-pointer pr-1"
            >
              <option value="custom" className="bg-slate-900 text-slate-200">Custom Evaluation</option>
              {PATIENT_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-200">
                  {preset.title}
                </option>
              ))}
            </select>
          </div>

          {/* Current Risk Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${getZoneBadgeClass()}`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span className="uppercase tracking-wider">
              {result.zone.toUpperCase()} ZONE • {result.riskScore}% RISK
            </span>
          </div>

          {/* Export Report Modal Trigger */}
          <button
            onClick={onOpenReportModal}
            className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3"
            title="Export Medical Summary Report"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Export Report</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-300 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-white/5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {tab.label}
              {tab.id === 'emergency' && result.zone === 'red' && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
