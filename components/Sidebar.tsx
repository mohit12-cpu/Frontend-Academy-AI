
import React, { useState } from 'react';
import { MODULES } from '../constants';
import { Lesson } from '../types';

interface SidebarProps {
  onSelectLesson: (lesson: Lesson) => void;
  activeLessonId?: string;
  completedIds: Set<string>;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectLesson, activeLessonId, completedIds }) => {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([MODULES[0].id]));

  const toggleModule = (id: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className="w-64 border-r border-slate-200 h-full overflow-y-auto bg-white shrink-0">
      <div className="p-4 space-y-4">
        {MODULES.map((module) => {
          const isExpanded = expandedModules.has(module.id);
          const moduleCompletedCount = module.lessons.filter(l => completedIds.has(l.id)).length;
          const progress = (moduleCompletedCount / module.lessons.length) * 100;

          return (
            <div key={module.id} className="space-y-1">
              <button 
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="flex flex-col">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-[9px] font-bold text-blue-600">{Math.round(progress)}%</span>
                  </div>
                </div>
                <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isExpanded && (
                <ul className="space-y-1 mt-1 pl-1">
                  {module.lessons.map((lesson) => {
                    const isCompleted = completedIds.has(lesson.id);
                    const isActive = activeLessonId === lesson.id;
                    return (
                      <li key={lesson.id}>
                        <button
                          onClick={() => onSelectLesson(lesson)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-lg'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate pr-2">{lesson.title}</span>
                          {isCompleted && (
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isActive ? 'bg-blue-500' : 'bg-green-100'}`}>
                              <svg className={`w-2.5 h-2.5 ${isActive ? 'text-white' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
