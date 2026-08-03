import React, { useState } from 'react';
import { Bot, Send, Pill, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const PRESET_QUESTIONS = [
  'What is the difference between controller and reliever inhalers?',
  'How do I use a spacer chamber correctly?',
  'What should I do if my Peak Flow drops into the Yellow zone?',
  'How does high PM2.5 air pollution trigger asthma attacks?'
];

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  'controller': 'Controller inhalers (ICS - Inhaled Corticosteroids) reduce airway inflammation and swelling over time. They must be taken daily as prescribed, even when you feel 100% fine! Reliever inhalers (SABA like Albuterol) quickly relax smooth muscles around the airways during acute tightness or wheezing.',
  'spacer': 'Spacer chambers slow down the mist released from MDIs, ensuring up to 70% more medication lands deep in the lungs rather than the back of the throat. 1) Shake inhaler. 2) Insert into spacer. 3) Seal lips on mouthpiece. 4) Press 1 puff. 5) Breathe in slowly for 4-5 seconds and hold breath for 10 seconds.',
  'yellow': 'A Yellow zone peak flow reading (50-79% of personal best) means early airway constriction. Initiate your Yellow Zone Action Plan: take 2-4 puffs of reliever inhaler, check for triggers (pollen/dust), and re-measure peak flow in 1-2 hours. If no response in 24 hours, contact your physician.',
  'pm25': 'PM2.5 particles (fine particulate matter under 2.5 micrometers) penetrate deep into the pulmonary alveoli, causing bronchial oxidative stress and acute smooth muscle spasms. On high PM2.5 days (>35 µg/m³), use an N95 mask outdoors and run HEPA air purifiers inside.'
};

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Hello! I am your AsthmaPulse AI assistant. Ask me anything about GINA guidelines, inhaler techniques, allergen management, or peak flow zones.',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate AI response
    setTimeout(() => {
      let reply = 'Asthma management is most effective when combining daily controller medication with environmental trigger avoidance and peak flow monitoring. Always consult your pulmonologist for individual medical prescriptions.';
      const lower = query.toLowerCase();

      if (lower.includes('controller') || lower.includes('reliever') || lower.includes('difference')) {
        reply = KNOWLEDGE_RESPONSES['controller'];
      } else if (lower.includes('spacer') || lower.includes('use')) {
        reply = KNOWLEDGE_RESPONSES['spacer'];
      } else if (lower.includes('yellow') || lower.includes('drop')) {
        reply = KNOWLEDGE_RESPONSES['yellow'];
      } else if (lower.includes('pm2') || lower.includes('pollution') || lower.includes('trigger')) {
        reply = KNOWLEDGE_RESPONSES['pm25'];
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950/40 border border-cyan-500/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Bot className="w-4 h-4" /> AI Health Knowledge Assistant
          </div>
          <h2 className="text-2xl font-bold text-white font-heading">
            Interactive Asthma Guide & Assistant
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Instant answer engine trained on GINA Clinical Guidelines, inhaler spacer administration, and allergen reduction strategies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Chat Conversation Interface (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-5 flex flex-col h-[520px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 text-slate-200 border border-white/10 rounded-tl-none'
                }`}>
                  <p>{msg.text}</p>
                  <span className="text-[10px] text-slate-400 block mt-1 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Preset Question Chips */}
          <div className="py-3 border-t border-white/10 flex flex-wrap gap-1.5">
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900/80 text-cyan-300 border border-cyan-500/20 hover:border-cyan-500/50 transition-all text-left truncate max-w-full"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-2 border-t border-white/10"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about asthma symptoms, inhalers, or triggers..."
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="btn-primary p-2.5 rounded-xl shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Column: Quick Reference Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Controller vs Reliever */}
          <div className="glass-panel p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-cyan-400" /> Controller vs Reliever Inhalers
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20">
                <span className="font-bold text-cyan-300 block">Daily Controller (ICS)</span>
                <p className="text-slate-300 mt-1">Prevents swelling and calms airway hypersensitivity. Must be taken every single day regardless of symptoms.</p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/20">
                <span className="font-bold text-rose-300 block">Rescue Reliever (SABA)</span>
                <p className="text-slate-300 mt-1">Provides rapid relief during acute chest tightness or asthma attack by relaxing airway muscles in 5 minutes.</p>
              </div>
            </div>
          </div>

          {/* Card 2: Proper Spacer Technique */}
          <div className="glass-panel p-5 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Valved Holding Chamber (Spacer)
            </h3>
            <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
              <li>Shake inhaler 5 seconds and insert into spacer base.</li>
              <li>Exhale completely away from spacer.</li>
              <li>Place mouthpiece firmly between teeth and seal lips.</li>
              <li>Press canister ONCE and inhale slowly for 4-5 seconds.</li>
              <li>Hold breath for 10 seconds before exhaling softly.</li>
            </ol>
          </div>

        </div>

      </div>
    </div>
  );
};
