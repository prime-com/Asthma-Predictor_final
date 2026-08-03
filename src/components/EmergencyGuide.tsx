import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, Play, Pause, RotateCcw, Heart } from 'lucide-react';

export const EmergencyGuide: React.FC = () => {
  const [breathingState, setBreathingState] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timerSeconds, setTimerSeconds] = useState(4);
  const [isActive, setIsActive] = useState(false);
  const [completedPuffs, setCompletedPuffs] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            // Switch phase
            if (breathingState === 'Inhale') {
              setBreathingState('Hold');
              return 4;
            } else if (breathingState === 'Hold') {
              setBreathingState('Exhale');
              return 4;
            } else {
              setBreathingState('Inhale');
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, breathingState]);

  return (
    <div className="space-y-6">
      {/* Top Warning Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-rose-950/70 via-red-900/40 to-slate-950/70 border border-rose-500/40 pulse-emergency flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/30 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/50">
            <ShieldAlert className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider mb-1">
              <AlertTriangle className="w-4 h-4" /> Acute Asthma Attack Protocol
            </div>
            <h2 className="text-2xl font-bold text-white font-heading">
              Emergency 4x4 Inhalation Protocol
            </h2>
            <p className="text-sm text-rose-200 mt-1 max-w-2xl">
              If you or someone around you is suffering from severe breathlessness or cannot speak full sentences, follow this protocol immediately.
            </p>
          </div>
        </div>

        <a
          href="tel:911"
          className="btn-primary bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 px-5 py-3 shadow-lg shadow-rose-600/50 text-sm whitespace-nowrap"
        >
          <PhoneCall className="w-5 h-5 animate-bounce" />
          <span>Call 911 Immediately</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step-by-Step 4x4 Inhalation Protocol (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-heading border-b border-white/10 pb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              Standard First Aid (4x4 Inhaler Steps)
            </h3>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-extrabold flex items-center justify-center text-sm shrink-0 border border-cyan-500/30">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Sit Upright & Stay Calm</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Do not lie down. Sitting upright helps open your airway and allows maximum chest expansion.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 font-extrabold flex items-center justify-center text-sm shrink-0 border border-teal-500/30">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">1 Puff of Rescue Inhaler with Spacer</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Shake reliever inhaler (Albuterol / Salbutamol), insert into spacer chamber, press 1 puff into chamber.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-sm shrink-0 border border-amber-500/30">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Take 4 Slow Breaths</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Breathe in and out through the spacer mask 4 times (use the breathing circle coach on the right).
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 font-extrabold flex items-center justify-center text-sm shrink-0 border border-rose-500/30">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Repeat for 4 Puffs Total</h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Wait 1 minute between puffs. If no improvement after 4 puffs, repeat another 4 puffs while emergency medical services arrive.
                  </p>
                </div>
              </div>
            </div>

            {/* Completed Puffs Counter */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Completed Rescue Puffs Tracker:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCompletedPuffs(num === completedPuffs ? num - 1 : num)}
                    className={`w-9 h-9 rounded-xl font-mono font-bold text-xs border transition-all ${
                      num <= completedPuffs
                        ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                        : 'bg-slate-800 text-slate-400 border-white/10'
                    }`}
                  >
                    {num <= completedPuffs ? '✓' : `#${num}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Breathing Rhythm Visualizer & Coach (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 space-y-4 text-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Calm Breathing Coach Visualizer
            </h3>
            <p className="text-xs text-slate-400">
              Synchronize your inhalation with the expanding animated ring below.
            </p>

            {/* Breathing Animated Circle */}
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Outer pulsing glow ring */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    breathingState === 'Inhale'
                      ? 'bg-cyan-500/20 scale-110 border-2 border-cyan-400'
                      : breathingState === 'Hold'
                      ? 'bg-amber-500/20 scale-100 border-2 border-amber-400'
                      : 'bg-rose-500/20 scale-75 border-2 border-rose-400'
                  }`}
                ></div>

                {/* Inner countdown */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold font-heading text-white">
                    {timerSeconds}s
                  </span>
                  <span className="text-sm font-bold uppercase tracking-widest text-cyan-400 mt-1">
                    {breathingState}
                  </span>
                </div>
              </div>
            </div>

            {/* Play/Pause Controls */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setIsActive(!isActive)}
                className="btn-primary text-xs flex items-center gap-2 px-5 py-2.5"
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isActive ? 'Pause Coach' : 'Start Breathing Coach'}</span>
              </button>
              <button
                onClick={() => {
                  setIsActive(false);
                  setTimerSeconds(4);
                  setBreathingState('Inhale');
                }}
                className="btn-secondary text-xs p-2.5"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Quick Contact Directory */}
          <div className="glass-panel p-5 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Emergency Contact Directory
            </h4>
            <div className="space-y-2 text-xs">
              <a href="tel:911" className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-semibold hover:bg-rose-500/20 transition-all">
                <span>National Emergency Services</span>
                <span className="font-mono text-sm font-bold">911</span>
              </a>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 font-medium">
                <span>Pulmonology Clinic Desk</span>
                <span className="font-mono text-slate-400">1-800-555-ASTHMA</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
