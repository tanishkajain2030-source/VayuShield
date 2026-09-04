import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RiskGauge from './components/RiskGauge';
import VoiceAdvisory from './components/VoiceAdvisory';
import SafeHourChart from './components/SafeHourChart';
import ExportPdfButton from './components/ExportPdfButton';
import ParticleBackground from './components/ParticleBackground';

// Visual Architecture Components
import DeltaView from './components/visual/DeltaView';
import PhysiologicalScan from './components/visual/PhysiologicalScan';
import EnvironmentalMetrics from './components/visual/EnvironmentalMetrics';
import ActionMitigation from './components/visual/ActionMitigation';
import AQIMapView from './components/visual/AQIMapView';
import GeminiReasoningCard from './components/visual/GeminiReasoningCard';

import { Shield, Zap, AlertTriangle, Search, SlidersHorizontal, Activity, Sparkles } from 'lucide-react';

function App() {
  const [profile, setProfile] = useState('asthma');
  const [citySearch, setCitySearch] = useState('New Delhi');
  const [isSimulatedSpike, setIsSimulatedSpike] = useState(false);

  const getRiskScore = () => {
    let base = 30;
    if (profile === 'asthma') base = 78;
    if (profile === 'athlete') base = 35;
    if (profile === 'senior') base = 65;
    return isSimulatedSpike ? Math.min(base + 35, 98) : base;
  };

  const currentScore = getRiskScore();

  const getAdvisoryText = () => {
    if (isSimulatedSpike) return "ALERT: Sudden surge in PM2.5 detected. High environmental hazard. Indoor isolation advised immediately.";
    if (profile === 'asthma') return "Elevated vulnerability detected for Asthma profile. Air sensitivity is high—limit outdoor physical exposure.";
    if (profile === 'senior') return "Moderate risk for elderly profile. PM2.5 levels may trigger slight respiratory discomfort.";
    if (profile === 'athlete') return "Optimal outdoor training window active. Environmental respiratory load is minimal.";
    return "Standard environmental conditions monitored. Air quality stable for routine activities.";
  };

  return (
    <div className="relative min-h-screen bg-slate-950/80 text-slate-100 selection:bg-teal-500 selection:text-slate-950 font-sans pb-12">
      {/* Background Pink Cloud Layer */}
      <ParticleBackground score={currentScore} />

      <motion.div 
        id="report-container" 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-5"
      >
        {/* ================= 1. PROMINENT HERO BRAND BANNER ================= */}
        <section className="px-6 py-5 bg-gradient-to-r from-slate-900/90 via-slate-900/95 to-slate-950/90 border border-slate-800/90 rounded-2xl backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            
            {/* Aesthetic Glowing Teal Emblem */}
            <div className="relative p-3.5 bg-slate-950/80 border border-teal-500/40 rounded-2xl shadow-[0_0_25px_rgba(20,184,166,0.25)] text-teal-400 group cursor-pointer transition-transform hover:scale-105">
              <Shield size={32} className="relative z-10 drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/20 to-emerald-500/0 blur-sm pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-3">
                {/* Tech Font Styling for VAYUSHIELD */}
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-teal-300 uppercase font-mono drop-shadow-sm">
                  VAYUSHIELD
                </h1>
                
                <span className="text-[11px] font-mono font-semibold px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center gap-1.5 shadow-inner">
                  <Sparkles size={11} className="text-teal-400 animate-pulse" />
                  v1.0 AI LIVE
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1 tracking-wide">
                Personalized Environmental Defense System
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800/80 shadow-inner">
            <Activity size={14} className="text-teal-400 animate-pulse" />
            <span>BIO-SENSITIVE AI GUARDIAN</span>
          </div>
        </section>

        {/* ================= 2. CONTROL TOOLBAR ================= */}
        <header className="px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Target Persona:</span>
          </div>

          {/* Integrated Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="Search city..."
                className="pl-7 pr-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500/60 w-32 sm:w-40 font-medium"
              />
            </div>

            {/* Persona Pills */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800/80">
              {[
                { id: 'standard', label: 'Standard' },
                { id: 'asthma', label: 'Asthma' },
                { id: 'senior', label: 'Senior' },
                { id: 'athlete', label: 'Athlete' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfile(p.id)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    profile === p.id 
                      ? 'bg-teal-500 text-slate-950 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Spike Simulator Button */}
            <button
              onClick={() => setIsSimulatedSpike(!isSimulatedSpike)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isSimulatedSpike 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
              }`}
            >
              <Zap size={13} className={isSimulatedSpike ? "text-rose-400 fill-rose-400" : "text-amber-400"} />
              {isSimulatedSpike ? "Spike Active" : "Simulate Spike"}
            </button>

            <ExportPdfButton targetElementId="report-container" />
          </div>
        </header>

        {/* ================= 3. ENLARGED LIVE TELEMETRY BAR ================= */}
        <EnvironmentalMetrics isSpike={isSimulatedSpike} />

        {/* ================= 4. BENTO GRID 1: RISK DELTA & AI REASONING ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DeltaView currentProfile={profile} score={currentScore} />
          <GeminiReasoningCard profile={profile} />
        </div>

        {/* ================= 5. MAIN RISK GAUGE WORKSPACE ================= */}
        <RiskGauge score={currentScore} advisory={getAdvisoryText()} />

        {/* ================= 6. BENTO GRID 2: RADAR MAP & PHYSIOLOGICAL SCAN ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AQIMapView city={citySearch} score={currentScore} />
          <PhysiologicalScan score={currentScore} />
        </div>

        {/* ================= 7. DEFENSE ACTIONS & VOICE ADVISORY ================= */}
        <ActionMitigation score={currentScore} />

        <VoiceAdvisory text={getAdvisoryText()} />

        <SafeHourChart />

        {/* Emergency Alert Banner */}
        <AnimatePresence>
          {currentScore >= 70 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wider">Critical Risk Protocol Active</h4>
                  <p className="text-xs text-slate-300">Activate indoor HEPA air purifiers & seal external vents.</p>
                </div>
              </div>
              <button 
                onClick={() => alert("Protocol Guidelines dispatched.")}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold cursor-pointer"
              >
                Action Plan
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="pt-4 text-center text-xs text-slate-500 border-t border-slate-900">
          VayuShield Automated Environmental Protection System
        </footer>
      </motion.div>
    </div>
  );
}

export default App;