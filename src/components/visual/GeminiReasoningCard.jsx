import React from 'react';
import { Terminal, Sparkles } from 'lucide-react';

const GeminiReasoningCard = ({ profile, reasoning }) => {
  return (
    <div className="rounded-2xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-md overflow-hidden shadow-xl">
      {/* Human-built Terminal Header */}
      <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500/80" />
          </div>
          <span className="text-[11px] font-mono text-slate-400 ml-2 flex items-center gap-1.5">
            <Terminal size={13} className="text-teal-400" />
            gemini-1.5-pro // medical_reasoning.py
          </span>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 flex items-center gap-1">
          <Sparkles size={10} /> LIVE INFERENCE
        </span>
      </div>

      <div className="p-4 space-y-2 font-mono text-xs">
        <div className="text-slate-400 flex items-center gap-2">
          <span className="text-teal-400">$</span>
          <span>eval_pathophysiology --profile=<span className="text-teal-300 font-bold">{profile}</span></span>
        </div>
        <p className="text-slate-200 leading-relaxed pl-3 border-l-2 border-teal-500/40 text-[11px] font-normal">
          {reasoning || "PM2.5 particles (<2.5 µm) bypass upper respiratory filtration, penetrating deep into alveolar pulmonary tissue. For asthmatic profiles, this triggers rapid mast-cell degranulation and severe bronchial hyper-responsiveness."}
        </p>
      </div>
    </div>
  );
};

export default GeminiReasoningCard;