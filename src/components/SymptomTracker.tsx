import React, { useState } from 'react';
import type { LogEntry, PatientProfile, ActionZone } from '../types/asthma';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { LineChart as ChartIcon, Plus, Calendar } from 'lucide-react';

interface SymptomTrackerProps {
  profile: PatientProfile;
  currentPEFR: number;
}

const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-1',
    date: 'Mon, Aug 28',
    pefr: 490,
    pefrPercentage: 94,
    daytimeSymptoms: 0,
    nightAwakenings: 0,
    rescuePuffs: 0,
    aqi: 35,
    zone: 'green',
    triggers: ['Clean Air'],
    notes: 'Felt great during morning walk.'
  },
  {
    id: 'log-2',
    date: 'Tue, Aug 29',
    pefr: 475,
    pefrPercentage: 91,
    daytimeSymptoms: 1,
    nightAwakenings: 0,
    rescuePuffs: 1,
    aqi: 45,
    zone: 'green',
    triggers: ['Mild Dust'],
    notes: 'Slight tickle in throat.'
  },
  {
    id: 'log-3',
    date: 'Wed, Aug 30',
    pefr: 410,
    pefrPercentage: 78,
    daytimeSymptoms: 3,
    nightAwakenings: 1,
    rescuePuffs: 4,
    aqi: 95,
    zone: 'yellow',
    triggers: ['Pollen', 'Humidity'],
    notes: 'Spring pollen spike outdoor.'
  },
  {
    id: 'log-4',
    date: 'Thu, Aug 31',
    pefr: 390,
    pefrPercentage: 75,
    daytimeSymptoms: 4,
    nightAwakenings: 2,
    rescuePuffs: 5,
    aqi: 120,
    zone: 'yellow',
    triggers: ['Pollen', 'Traffic Smog'],
    notes: 'Used rescue inhaler before bed.'
  },
  {
    id: 'log-5',
    date: 'Fri, Sep 01',
    pefr: 440,
    pefrPercentage: 84,
    daytimeSymptoms: 2,
    nightAwakenings: 0,
    rescuePuffs: 2,
    aqi: 60,
    zone: 'green',
    triggers: ['Pollen'],
    notes: 'Rinsed nose after coming inside.'
  },
  {
    id: 'log-6',
    date: 'Sat, Sep 02',
    pefr: 485,
    pefrPercentage: 93,
    daytimeSymptoms: 0,
    nightAwakenings: 0,
    rescuePuffs: 0,
    aqi: 30,
    zone: 'green',
    triggers: [],
    notes: 'Rest day, no symptoms.'
  }
];

export const SymptomTracker: React.FC<SymptomTrackerProps> = ({
  profile,
  currentPEFR
}) => {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPefr, setNewPefr] = useState(currentPEFR);
  const [newNotes, setNewNotes] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const personalBest = profile.personalBestPEFR || 500;
  const greenThreshold = Math.round(personalBest * 0.8);
  const yellowThreshold = Math.round(personalBest * 0.5);

  const availableTriggers = ['Tree Pollen', 'Grass Pollen', 'Dust Mites', 'Cold Air', 'Exercise', 'Vehicle Smog', 'Stress'];

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const percentage = Math.round((newPefr / personalBest) * 100);
    let zone: ActionZone = 'green';
    if (percentage < 50) zone = 'red';
    else if (percentage < 80) zone = 'yellow';

    const newEntry: LogEntry = {
      id: `log-${Date.now()}`,
      date: 'Today',
      pefr: newPefr,
      pefrPercentage: percentage,
      daytimeSymptoms: zone === 'green' ? 0 : 2,
      nightAwakenings: zone === 'red' ? 2 : 0,
      rescuePuffs: zone === 'green' ? 0 : zone === 'yellow' ? 2 : 6,
      aqi: 55,
      zone,
      triggers: selectedTriggers,
      notes: newNotes || 'Daily log entry.'
    };

    setLogs([...logs, newEntry]);
    setShowAddForm(false);
    setNewNotes('');
    setSelectedTriggers([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-slate-950/40 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ChartIcon className="w-4 h-4" /> Peak Flow & Symptom Analytics
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Asthma Longitudinal Journal & Trends
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Track daily peak expiratory flow rate (PEFR), symptom frequency, and environmental triggers to detect early seasonal patterns.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Daily Entry</span>
        </button>
      </div>

      {/* Add Log Modal/Form */}
      {showAddForm && (
        <form onSubmit={handleAddLog} className="glass-panel p-5 border border-cyan-500/30 space-y-4 animate-fadeIn">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> Today's Asthma Log Entry
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Peak Flow (PEFR) Reading (L/min)</label>
              <input
                type="number"
                value={newPefr}
                onChange={(e) => setNewPefr(Number(e.target.value))}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Daily Notes / Symptoms</label>
              <input
                type="text"
                value={newNotes}
                placeholder="e.g. Mild coughing after afternoon jog..."
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1.5">Triggers Encountered Today</label>
            <div className="flex flex-wrap gap-2">
              {availableTriggers.map((trig) => {
                const isSel = selectedTriggers.includes(trig);
                return (
                  <button
                    key={trig}
                    type="button"
                    onClick={() => toggleTrigger(trig)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      isSel ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-slate-900/60 text-slate-400 border-white/5'
                    }`}
                  >
                    {trig}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
            >
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* Main Chart Card */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-lg font-bold text-white font-heading">
              PEFR Trend vs Target Lines
            </h3>
            <p className="text-xs text-slate-400">Green zone limit: {greenThreshold} L/min • Yellow zone limit: {yellowThreshold} L/min</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 font-bold">
            Personal Best: {personalBest} L/min
          </span>
        </div>

        {/* Recharts Line Chart */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={logs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis domain={[150, personalBest + 50]} stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: 'rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <ReferenceLine y={greenThreshold} stroke="#10b981" strokeDasharray="4 4" label={{ value: '80% Green', fill: '#10b981', fontSize: 10 }} />
              <ReferenceLine y={yellowThreshold} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '50% Yellow', fill: '#f59e0b', fontSize: 10 }} />
              <Line
                type="monotone"
                dataKey="pefr"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', r: 5 }}
                activeDot={{ r: 8, fill: '#38bdf8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-panel p-6 space-y-4">
        <h3 className="text-base font-bold text-white font-heading">
          Recent Log Journal History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase bg-slate-900/60 border-b border-white/10 font-semibold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">PEFR (L/min)</th>
                <th className="p-3">% Personal Best</th>
                <th className="p-3">Status Zone</th>
                <th className="p-3">Triggers</th>
                <th className="p-3">Clinical Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-medium text-white">{log.date}</td>
                  <td className="p-3 font-mono font-bold text-cyan-400">{log.pefr}</td>
                  <td className="p-3 font-mono text-slate-300">{log.pefrPercentage}%</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.zone === 'green' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      log.zone === 'yellow' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {log.zone}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">
                    {log.triggers.length > 0 ? log.triggers.join(', ') : 'None recorded'}
                  </td>
                  <td className="p-3 text-slate-400 italic">{log.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
