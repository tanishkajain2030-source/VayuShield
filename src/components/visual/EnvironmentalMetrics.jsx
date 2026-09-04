import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Thermometer, Droplets, Sun, Activity } from 'lucide-react';

const EnvironmentalMetrics = ({ envData, isSpike }) => {
  // Safe extraction supporting camelCase, snake_case, and mock fallback keys
  const pm25Value = isSpike ? 350 : (envData?.pm25 ?? envData?.pm2_5 ?? envData?.aqi ?? 48);
  const pm10Value = isSpike ? 480 : (envData?.pm10 ?? 82);
  const tempValue = envData?.temperature ?? envData?.temp ?? 28;
  const humidityValue = envData?.humidity ?? 62;
  const uvValue = envData?.uv_index ?? envData?.uv ?? 4;

  // Dynamic status evaluation
  const getAQIStatus = (val) => {
    if (val === '--' || val === null || val === undefined) return { status: 'Optimal', color: 'text-teal-400' };
    if (val > 150) return { status: 'Hazardous', color: 'text-rose-400' };
    if (val > 50) return { status: 'Unhealthy', color: 'text-amber-400' };
    return { status: 'Optimal', color: 'text-teal-400' };
  };

  const pm25Info = getAQIStatus(pm25Value);
  const pm10Info = getAQIStatus(pm10Value);

  const metrics = [
    { 
      label: 'PM2.5', 
      value: pm25Value, 
      unit: 'µg/m³', 
      status: pm25Info.status, 
      icon: Wind, 
      color: pm25Info.color 
    },
    { 
      label: 'PM10', 
      value: pm10Value, 
      unit: 'µg/m³', 
      status: pm10Info.status, 
      icon: Activity, 
      color: pm10Info.color 
    },
    { 
      label: 'Temp', 
      value: tempValue, 
      unit: '°C', 
      status: 'Optimal', 
      icon: Thermometer, 
      color: 'text-slate-300' 
    },
    { 
      label: 'Humidity', 
      value: humidityValue, 
      unit: '%', 
      status: 'Normal', 
      icon: Droplets, 
      color: 'text-slate-300' 
    },
    { 
      label: 'UV Index', 
      value: uvValue, 
      unit: '/11', 
      status: Number(uvValue) > 6 ? 'High' : 'Moderate', 
      icon: Sun, 
      color: 'text-amber-400' 
    },
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

            {/* Enlarged Metric Display */}
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                {m.value}
              </span>
              <span className="text-xs font-semibold text-slate-400">{m.unit}</span>
            </div>

            <div className="flex items-center gap-2 mt-2.5 pt-2 border-t border-slate-800/60">
              <span 
                className={`w-2 h-2 rounded-full ${
                  m.status === 'Unhealthy' || m.status === 'Hazardous' 
                    ? 'bg-rose-500 animate-ping' 
                    : 'bg-teal-400'
                }`} 
              />
              <span className={`text-xs font-bold uppercase tracking-wide ${m.color}`}>
                {m.status}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default EnvironmentalMetrics;