import { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { RiskPredictor } from './components/RiskPredictor';
import { EnvironmentalMonitor } from './components/EnvironmentalMonitor';
import { ActionPlan } from './components/ActionPlan';
import { SymptomTracker } from './components/SymptomTracker';
import { EmergencyGuide } from './components/EmergencyGuide';
import { AIAssistant } from './components/AIAssistant';
import { DoctorReport } from './components/DoctorReport';
import { PATIENT_PRESETS } from './data/patientPresets';
import { calculateAsthmaRisk } from './utils/asthmaCalculator';
import type { PatientPreset, AssessmentInput } from './types/asthma';
import confetti from 'canvas-confetti';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('predictor');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-well-controlled');
  const [input, setInput] = useState<AssessmentInput>(PATIENT_PRESETS[0].input);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [showDoctorReportModal, setShowDoctorReportModal] = useState<boolean>(false);

  // Re-calculate risk score in real-time
  const result = useMemo(() => {
    return calculateAsthmaRisk(input);
  }, [input]);

  // Handle Preset Switching
  const handleSelectPreset = (preset: PatientPreset) => {
    setSelectedPresetId(preset.id);
    setInput(preset.input);

    // If Green zone, trigger celebratory confetti
    const newRes = calculateAsthmaRisk(preset.input);
    if (newRes.zone === 'green') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  // Theme Toggle Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-[var(--text-main)] transition-colors duration-300 pb-16">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        result={result}
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onOpenReportModal={() => setShowDoctorReportModal(true)}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        {activeTab === 'predictor' && (
          <RiskPredictor
            input={input}
            onChangeInput={(newInput) => {
              setSelectedPresetId('custom');
              setInput(newInput);
            }}
            result={result}
            onNavigateToActionPlan={() => setActiveTab('action-plan')}
          />
        )}

        {activeTab === 'environment' && (
          <EnvironmentalMonitor
            environmental={input.environmental}
            onChangeEnvironmental={(newEnv) => {
              setInput({ ...input, environmental: newEnv });
            }}
          />
        )}

        {activeTab === 'action-plan' && (
          <ActionPlan
            result={result}
            profile={input.profile}
            onNavigateToEmergency={() => setActiveTab('emergency')}
          />
        )}

        {activeTab === 'journal' && (
          <SymptomTracker
            profile={input.profile}
            currentPEFR={input.symptoms.currentPEFR}
          />
        )}

        {activeTab === 'emergency' && (
          <EmergencyGuide />
        )}

        {activeTab === 'ai-assistant' && (
          <AIAssistant />
        )}
      </main>

      {/* Doctor Report Modal */}
      {showDoctorReportModal && (
        <DoctorReport
          input={input}
          result={result}
          onClose={() => setShowDoctorReportModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 lg:px-8 mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <p>© 2026 AsthmaPulse AI Risk Predictor • GINA Decision Support System</p>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('predictor')} className="hover:text-cyan-400">Risk Predictor</button>
          <button onClick={() => setActiveTab('environment')} className="hover:text-cyan-400">Air Quality</button>
          <button onClick={() => setActiveTab('emergency')} className="hover:text-rose-400">Emergency Protocol</button>
        </div>
      </footer>

    </div>
  );
}

export default App;
