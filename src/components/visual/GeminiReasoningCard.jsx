import React from 'react';
import { Terminal, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

const GeminiReasoningCard = ({ profile, aiAdvisory }) => {
  // Extract dynamic fields from Gemini API response with clean fallbacks
  const headline = aiAdvisory?.headline || "Evaluating Atmospheric Risk";
  const reasoningText = aiAdvisory?.advisory || "PM2.5 particles (<2.5 µm) bypass upper respiratory filtration, penetrating deep into alveolar pulmonary tissue. For asthmatic profiles, this triggers rapid mast-cell degranulation and severe bronchial hyper-responsiveness.";
  const precautions = aiAdvisory?.precautions || [];
  const safeWindow = aiAdvisory?.safe_window || "Calculating optimal window...";

  return (
    <div className="rounded-2xl bg-slate-950/90 border border-slate-800/80 backdrop-blur-md overflow-hidden shadow-xl flex flex-col justify-between">
      <div>
        {/* Terminal Header */}
        <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500/80" />
            </div>
            <span className="text-[11px] font-mono text-slate-400 ml-2 flex items-center gap-1.5">
              <Terminal size={13} className="text-teal-400" />
              gemini-2.5-flash // medical_reasoning.py
            </span>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 flex items-center gap-1">
            <Sparkles size={10} /> LIVE INFERENCE
          </span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 space-y-3 font-mono text-xs">
          {/* CLI Command Line */}
          <div className="text-slate-400 flex items-center gap-2">
            <span className="text-teal-400">$</span>
            <span>eval_pathophysiology --profile=<span className="text-teal-300 font-bold">{profile}</span></span>
          </div>

          {/* AI Headline Banner */}
          <div className="flex items-center gap-2 text-teal-300 font-bold text-xs bg-teal-500/10 p-2 rounded border border-teal-500/20">
            <ShieldAlert size={14} className="text-teal-400 shrink-0" />
            <span>{headline}</span>
          </div>

          {/* Dynamic Reasoning Output */}
          <p className="text-slate-200 leading-relaxed pl-3 border-l-2 border-teal-500/40 text-[11px] font-normal">
            {reasoningText}
          </p>

          {/* Dynamic Precautions List */}
          {precautions.length > 0 && (
            <div className="pt-2 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Protocol Precautions:</span>
              <ul className="space-y-1">
                {precautions.map((item, idx) => (
                  <li key={idx} className="text-[11px] text-slate-300 flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-teal-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Outdoor Safe Window Footer */}
      <div className="px-4 py-2.5 bg-slate-900/50 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Safe Outdoor Window:</span>
        <span className="text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
          {safeWindow}
        </span>
      </div>
    </div>
  );
};

export default GeminiReasoningCard;