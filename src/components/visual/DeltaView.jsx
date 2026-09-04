import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingUp, Sparkles } from 'lucide-react';

const DeltaView = ({ currentProfile, score }) => {
  const getDeltaInfo = () => {
    if (currentProfile === 'asthma') return { delta: '+48 Impact Delta', desc: 'Asthma bronchial sensitivity amplification active.', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
    if (currentProfile === 'senior') return { delta: '+35 Impact Delta', desc: 'Cardiovascular strain baseline elevated.', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    if (currentProfile === 'athlete') return { delta: '+5 Impact Delta', desc: 'High inhalation rate during workout windows.', color: 'text-teal-300', bg: 'bg-teal-500/10 border-teal-500/30' };
    return { delta: '+0 Baseline Delta', desc: 'Standard physiological exposure reference.', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  };

  const delta = getDeltaInfo();

  return (
    <motion.div
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-teal-500/30 backdrop-blur-2xl space-y-3 shadow-xl hover:border-teal-400/60 hover:shadow-teal-500/10 cursor-pointer transition-all"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-teal-300 flex items-center gap-2">
              Personalized Risk Delta
              <Sparkles size={14} className="text-teal-400 animate-pulse" />
            </h3>
            <p className="text-xs font-semibold text-slate-300 mt-0.5">
              Same Environment <span className="text-teal-400">→</span> <span className="text-white capitalize">{currentProfile} Profile</span>
            </p>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-2xl border ${delta.bg} flex items-center gap-2 shadow-inner`}>
          <TrendingUp size={16} className={delta.color} />
          <span className={`text-sm font-black tracking-wide ${delta.color}`}>{delta.delta}</span>
        </div>
      </div>

      <p className="text-xs font-medium text-slate-300 leading-relaxed pl-1">
        {delta.desc}
      </p>
    </motion.div>
  );
};

export default DeltaView;