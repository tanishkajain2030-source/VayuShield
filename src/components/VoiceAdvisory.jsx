import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const VoiceAdvisory = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState('en-IN');
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const updateVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Browser speech synthesis not supported.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    const matchedVoice = voices.find(v => v.lang.includes(lang.split('-')[0]));
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
      <select 
        value={lang} 
        onChange={(e) => setLang(e.target.value)}
        className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg p-2 focus:outline-none"
      >
        <option value="en-IN">English (India)</option>
        <option value="hi-IN">Hindi (हिंदी)</option>
        <option value="ta-IN">Tamil (தமிழ்)</option>
        <option value="te-IN">Telugu (తెలుగు)</option>
      </select>

      <button
        onClick={handleSpeak}
        className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
          isPlaying ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
        }`}
      >
        {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
        {isPlaying ? 'Stop Speech' : 'Listen Advisory'}
      </button>
    </div>
  );
};

export default VoiceAdvisory;