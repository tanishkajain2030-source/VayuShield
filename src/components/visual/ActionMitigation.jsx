import React from 'react';
import { ShieldCheck, Fan, DoorClosed, Stethoscope } from 'lucide-react';

const ActionMitigation = ({ score }) => {
  const actions = [
    {
      title: 'Respiratory Defense',
      desc: score > 60 ? 'Wear N95/FFP2 Mask outdoors' : 'Standard outdoor activity allowed',
      icon: ShieldCheck,
      active: score > 60,
    },
    {
      title: 'Indoor Filtration',
      desc: score > 50 ? 'HEPA Filter on High mode' : 'HEPA Filter on Auto mode',
      icon: Fan,
      active: true,
    },
    {
      title: 'Ventilation Control',
      desc: score > 70 ? 'Seal external vents & windows' : 'Natural ventilation acceptable',
      icon: DoorClosed,
      active: score > 70,
    },
    {
      title: 'Medical Advisory',
      desc: score > 75 ? 'Keep inhaler/medication handy' : 'No emergency meds required',
      icon: Stethoscope,
      active: score > 65,
    },
  ];

  return (
    <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        Personalized Defense Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <div 
              key={i} 
              className={`p-3.5 rounded-2xl border transition-all ${
                act.active 
                  ? 'bg-slate-900 border-indigo-500/30 text-slate-200' 
                  : 'bg-slate-950/40 border-slate-800/50 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`p-2 rounded-xl ${act.active ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                  <Icon size={16} />
                </div>
                <h4 className="text-xs font-semibold text-white">{act.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{act.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActionMitigation;