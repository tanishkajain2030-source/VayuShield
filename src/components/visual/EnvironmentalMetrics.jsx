import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Thermometer, Droplets, Sun, Activity } from 'lucide-react';

const EnvironmentalMetrics = ({ isSpike }) => {
  const metrics = [
    { label: 'PM2.5', value: isSpike ? '184' : '48', unit: 'µg/m³', status: isSpike ? 'Unhealthy' : 'Moderate', icon: Wind, color: isSpike ? 'text-rose-400' : 'text-teal-400' },
    { label: 'PM10', value: isSpike ? '290' : '82', unit: 'µg/m³', status: isSpike ? 'Hazardous' : 'Good', icon: Activity, color: isSpike ? 'text-rose-400' : 'text-teal-400' },
    { label: 'Temp', value: '28', unit: '°C', status: 'Optimal', icon: Thermometer, color: 'text-slate-300' },
    { label: 'Humidity', value: '62', unit: '%', status: 'Normal', icon: Droplets, color: 'text-slate-300' },
    { label: 'UV Index', value: '4', unit: '/11', status: 'Moderate', icon: Sun, color: 'text-amber-400' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-lg hover:border-teal-500/40 transition-all cursor-default"
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold tracking-wider uppercase font-mono">
              <span>{m.label}</span>
              <Icon size={16} className={m.color} />
            </div>

            {/* Enlarged Metric Value Display */}
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">{m.value}</span>
              <span className="text-xs font-semibold text-slate-400">{m.unit}</span>
            </div>

            <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-800/60">
              <span className={`w-2 h-2 rounded-full ${m.status === 'Unhealthy' || m.status === 'Hazardous' ? 'bg-rose-500 animate-ping' : 'bg-teal-400'}`} />
              <span className={`text-xs font-bold uppercase tracking-wide ${m.color}`}>{m.status}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default EnvironmentalMetrics;