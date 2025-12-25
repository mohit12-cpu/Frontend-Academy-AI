
import React from 'react';
import { Achievement } from '../types';

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      
      <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Your Achievements</h3>
      
      <div className="flex flex-wrap gap-4">
        {achievements.map((ach) => (
          <div 
            key={ach.id}
            className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
              ach.unlocked ? 'bg-white/10 border border-white/20' : 'opacity-30 grayscale'
            }`}
          >
            <span className="text-2xl">{ach.icon}</span>
            <div className="hidden sm:block">
              <p className="text-xs font-bold leading-none">{ach.title}</p>
              <p className="text-[10px] text-slate-400 mt-1">{ach.unlocked ? 'Unlocked' : 'Locked'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
