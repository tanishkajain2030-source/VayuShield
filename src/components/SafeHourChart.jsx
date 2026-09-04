import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

const SafeHourChart = ({ hourlyData }) => {
  const defaultData = hourlyData || [
    { time: '06:00', aqi: 180 },
    { time: '09:00', aqi: 220 },
    { time: '12:00', aqi: 140 },
    { time: '15:00', aqi: 95 },
    { time: '18:00', aqi: 110 },
    { time: '21:00', aqi: 190 },
  ];

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-200">24-Hour AQI & Safe Windows</h3>
          <p className="text-xs text-slate-400">Green shaded area shows safest outdoor hours</p>
        </div>
        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-medium">
          Optimal: 14:00 - 18:00
        </span>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={defaultData}>
            <defs>
              <linearGradient id="aqiColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#64748B" fontSize={12} />
            <YAxis stroke="#64748B" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
            <ReferenceArea x1="12:00" x2="18:00" fill="#10B981" fillOpacity={0.15} />
            <Area type="monotone" dataKey="aqi" stroke="#EF4444" fillOpacity={1} fill="url(#aqiColor)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SafeHourChart;