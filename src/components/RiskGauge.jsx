import React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const RiskGauge = ({ score = 68, advisory = "" }) => {
  const rotation = -90 + (score / 100) * 180;

  // 3D Tilt Spring Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getColor = (s) => {
    if (s < 25) return { text: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-500/10', label: 'Low Risk' };
    if (s < 50) return { text: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-500/10', label: 'Moderate Risk' };
    if (s < 75) return { text: 'text-orange-400', border: 'border-orange-500', bg: 'bg-orange-500/10', label: 'High Risk' };
    return { text: 'text-red-500', border: 'border-red-500', bg: 'bg-red-500/10', label: 'Severe Risk' };
  };

  const status = getColor(score);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="relative overflow-hidden p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-200"
    >
      <div style={{ transform: "translateZ(30px)" }} className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">Personalized Health Risk</h3>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${status.bg} ${status.text} ${status.border}`}>
          {status.label}
        </span>
      </div>

      <div style={{ transform: "translateZ(50px)" }} className="flex flex-col items-center my-4">
        <div className="relative w-56 h-28 overflow-hidden">
          <div className="w-56 h-56 border-[18px] border-slate-800/80 rounded-full border-t-emerald-500 border-r-amber-500 border-b-orange-500 border-l-red-600 transform -rotate-45" />
          <motion.div 
            initial={{ rotate: -90 }}
            animate={{ rotate: rotation }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            className="absolute bottom-0 left-1/2 w-1.5 h-24 bg-gradient-to-t from-slate-200 to-white origin-bottom rounded-full shadow-[0_0_15px_rgba(255,255,255,0.9)]"
            style={{ translateX: "-50%" }}
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-7 h-7 bg-slate-950 border-4 border-slate-200 rounded-full shadow-md" />
        </div>

        <div className="text-4xl font-extrabold mt-4 tracking-tight text-white">
          {score}<span className="text-xl text-slate-500 font-normal">/100</span>
        </div>
      </div>

      <div style={{ transform: "translateZ(20px)" }} className="mt-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/60 flex items-start gap-3">
        {score > 50 ? <ShieldAlert className="text-orange-400 shrink-0 mt-0.5" size={18} /> : <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />}
        <p className="text-xs leading-relaxed text-slate-300">
          {advisory || "Analyzing real-time physiological and environmental data..."}
        </p>
      </div>
    </motion.div>
  );
};

export default RiskGauge;