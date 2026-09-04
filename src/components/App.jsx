import React from 'react';
import RiskGauge from './components/RiskGauge';
import VoiceAdvisory from './components/VoiceAdvisory';
import SafeHourChart from './components/SafeHourChart';
import ExportPdfButton from './components/ExportPdfButton';

function App() {
  const sampleAdvisory = "High PM2.5 levels detected. Outdoor exercise is not recommended for individuals with respiratory conditions.";

  return (
    <div className="min-h-screen bg-slate-950 p-8 flex justify-center text-slate-100">
      <div id="report-container" className="w-full max-w-4xl space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Personalized Health Advisory</h1>
          <ExportPdfButton targetElementId="report-container" />
        </div>

        <RiskGauge score={68} advisory={sampleAdvisory} />
        <VoiceAdvisory text={sampleAdvisory} />
        <SafeHourChart />
      </div>
    </div>
  );
}

export default App;