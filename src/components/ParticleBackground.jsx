import React from 'react';
import { motion } from 'framer-motion';

// Custom 3D Fluffy Cloud Vector matching your image
const CloudShape = ({ className }) => (
  <svg
    viewBox="0 0 240 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="70%" stopColor="#f472b6" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#c084fc" stopOpacity="0.2" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#881337" floodOpacity="0.3" />
      </filter>
    </defs>
    <path
      d="M50 110 C20 110 0 90 0 65 C0 45 15 28 35 25 C45 10 70 0 95 10 C110 -5 140 -2 155 15 C175 5 200 15 210 35 C228 38 240 55 240 75 C240 98 220 110 190 110 Z"
      fill="url(#cloudGrad)"
      filter="url(#shadow)"
    />
  </svg>
);

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-gradient-to-b from-slate-950 via-rose-950/70 to-fuchsia-950">
      
      {/* 1. Pink Ambient Atmospheric Glows */}
      <motion.div
        animate={{
          x: [-80, 80, -80],
          y: [-40, 40, -40],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] bg-pink-600/30"
      />

      <motion.div
        animate={{
          x: [80, -80, 80],
          y: [40, -40, 40],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 right-0 w-[750px] h-[750px] rounded-full blur-[160px] bg-rose-500/25"
      />

      {/* 2. Floating Translucent 3D Clouds */}
      {[
        { top: '8%', duration: 28, size: 'w-72 sm:w-96', delay: 0 },
        { top: '35%', duration: 38, size: 'w-80 sm:w-[480px]', delay: 6 },
        { top: '62%', duration: 32, size: 'w-64 sm:w-80', delay: 14 },
        { top: '80%', duration: 42, size: 'w-96 sm:w-[520px]', delay: 2 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          initial={{ x: '-100%' }}
          animate={{ x: '100vw' }}
          transition={{
            duration: cloud.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: cloud.delay,
          }}
          style={{ top: cloud.top }}
          className={`absolute ${cloud.size} opacity-80 backdrop-blur-[2px]`}
        >
          <CloudShape className="w-full h-auto" />
        </motion.div>
      ))}

      {/* 3. Floating Ambient Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-pink-200/50 shadow-[0_0_8px_rgba(244,114,182,0.6)]"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default ParticleBackground;