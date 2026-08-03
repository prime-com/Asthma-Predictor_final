import { useState } from 'react';
import { Header } from './components/Header';
import { PredictorForm } from './components/PredictorForm';
import { PredictionResult } from './components/PredictionResult';
import { predictAsthmaRisk } from './utils/asthmaCalculator';
import type { PatientInput, PredictionResult as ResultType } from './types/asthma';
import { Activity } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [inputData, setInputData] = useState<PatientInput | null>(null);
  const [result, setResult] = useState<ResultType | null>(null);

  const handleFormSubmit = (data: PatientInput) => {
    setInputData(data);
    const prediction = predictAsthmaRisk(data);
    setResult(prediction);

    if (prediction.severity === 'low') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleReset = () => {
    setInputData(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f1f5f9] pb-16">
      
      {/* Navbar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4">
        <Header onReset={handleReset} />
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-8">
        
        {!result ? (
          <div className="space-y-6">
            {/* Splash Intro Banner */}
            <div className="glass-panel p-6 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950/40 border border-cyan-500/20 max-w-2xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Activity className="w-4 h-4 animate-pulse" /> Environmental Health AI Model
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                Asthma Severity Risk Evaluator
              </h2>
              <p className="text-xs text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
                Assess clinical symptoms combined with 2.5 years of historical CPCB air pollution data mapping across 34 Mumbai sensor locations.
              </p>
            </div>

            {/* Assessment questionnaire wizard */}
            <PredictorForm onSubmit={handleFormSubmit} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Headline */}
            <div className="text-center max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white font-heading">
                Your Prediction Result
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Generated from multi-class severity prediction model parameters
              </p>
            </div>

            {/* Results Display */}
            {inputData && (
              <PredictionResult
                input={inputData}
                result={result}
                onReset={handleReset}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 lg:px-8 mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <p>© 2026 AsthmaPulse AI Predictor • CPCB Mumbai Air Quality Pipeline</p>
        <p>This evaluator does not replace emergency medical care.</p>
      </footer>

    </div>
  );
}

export default App;
