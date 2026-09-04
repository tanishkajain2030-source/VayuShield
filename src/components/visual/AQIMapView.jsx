import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Radio } from 'lucide-react';

const AQIMapView = ({ city = "New Delhi", score = 65 }) => {
  const getRiskColor = () => {
    if (score < 40) return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)', text: 'text-emerald-400' };
    if (score < 70) return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', text: 'text-amber-400' };
    return { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.2)', text: 'text-rose-400' };
  };

  const colors = getRiskColor();

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <MapPin size={16} className="text-indigo-400 animate-bounce" />
          Live Geospatial Risk Radar — {city}
        </h3>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
          <Radio size={10} className="text-indigo-400 animate-pulse" /> Live Telemetry
        </span>
      </div>

      {/* Futuristic Radar Canvas */}
      <div className="relative h-60 w-full rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden flex items-center justify-center">
        {/* Radar Concentric Rings */}
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="absolute rounded-full border border-slate-800/60"
            style={{ width: `${ring * 30}%`, height: `${ring * 65}%` }}
          />
        ))}

        {/* Crosshair Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-[1px] bg-slate-800/50" />
          <div className="h-full w-[1px] bg-slate-800/50 absolute" />
        </div>

        {/* Pulsing Risk Aura Center */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: '120px',
            height: '120px',
            backgroundColor: colors.fill,
            border: `2px solid ${colors.stroke}`,
            boxShadow: `0 0 30px ${colors.fill}`,
          }}
        >
          <div className="p-2 rounded-full bg-slate-900 border border-slate-700 shadow-md">
            <Navigation size={18} className={`${colors.text} transform rotate-45`} />
          </div>
        </motion.div>

        {/* Floating Geo Labels */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-400">
          LAT: 28.6139° N | LNG: 77.2090° E
        </div>
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
          Coverage: 15km Sector
        </div>
      </div>
    </div>
  );
};

export default AQIMapView;