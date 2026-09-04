import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Heart, Eye, Stethoscope } from 'lucide-react';

const PhysiologicalScan = ({ score }) => {
  const getSystems = () => {
    const respiratory = Math.min(Math.round(score * 1.1), 99);
    const cardiovascular = Math.min(Math.round(score * 0.85), 95);
    const ocular = Math.min(Math.round(score * 0.65), 85);

    return [
      { name: 'Respiratory System', value: `${respiratory}%`, desc: 'Bronchial mucosal irritation load', icon: Activity, color: respiratory > 70 ? 'bg-rose-500' : 'bg-emerald-500', text: respiratory > 70 ? 'text-rose-400' : 'text-emerald-400' },
      { name: 'Cardiovascular Load', value: `${cardiovascular}%`, desc: 'Blood oxygen saturation pressure', icon: Heart, color: cardiovascular > 65 ? 'bg-amber-500' : 'bg-emerald-500', text: cardiovascular > 65 ? 'text-amber-400' : 'text-emerald-400' },
      { name: 'Ocular / Mucosal Strain', value: `${ocular}%`, desc: 'Particulate membrane exposure index', icon: Eye, color: ocular > 60 ? 'bg-amber-500' : 'bg-indigo-500', text: ocular > 60 ? 'text-amber-400' : 'text-indigo-400' },
    ];
  };

  const systems = getSystems();

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/90 backdrop-blur-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
          <Stethoscope size={18} className="text-indigo-400" />
          AI Physiological Strain Analysis
        </h3>
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          Real-time Bio Model
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {systems.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04, y: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="p-4.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5 hover:border-indigo-500/40 hover:bg-slate-900/80 cursor-pointer transition-all shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-white">
                  <Icon size={16} className={s.text} />
                  {s.name}
                </div>
                <span className={`text-base font-black ${s.text}`}>{s.value}</span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className={`h-full ${s.color} transition-all duration-700`} style={{ width: s.value }} />
              </div>

              <p className="text-[11px] font-medium text-slate-400">{s.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PhysiologicalScan;