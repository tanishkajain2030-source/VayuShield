import React from 'react';

const RiskGauge = ({ score = 65, advisory = "" }) => {
  const rotation = -90 + (score / 100) * 180;

  const getColor = (s) => {
    if (s < 25) return { text: '#10B981', label: 'Low Risk' };
    if (s < 50) return { text: '#F59E0B', label: 'Moderate Risk' };
    if (s < 75) return { text: '#F97316', label: 'High Risk' };
    return { text: '#EF4444', label: 'Severe Risk' };
  };

  const status = getColor(score);

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-xl flex flex-col items-center">
      <h3 className="text-lg font-semibold mb-4 text-slate-300">Personalized Risk Level</h3>
      
      <div className="relative w-48 h-24 overflow-hidden mb-2">
        <div className="w-48 h-48 border-[16px] border-slate-800 rounded-full border-t-emerald-500 border-r-amber-500 border-b-orange-500 border-l-red-600 transform -rotate-45" />
        <div 
          className="absolute bottom-0 left-1/2 w-1.5 h-20 bg-white origin-bottom rounded-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-slate-900 border-4 border-white rounded-full" />
      </div>

      <div className="text-2xl font-bold mt-2" style={{ color: status.text }}>
        {status.label} ({score}/100)
      </div>

      <p className="text-xs text-slate-400 mt-2 text-center max-w-xs">
        {advisory || "Loading health advisory..."}
      </p>
    </div>
  );
};

export default RiskGauge;