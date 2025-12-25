
import React from 'react';
import { GroundingResource } from '../types';
import TextRenderer from './TextRenderer';

interface TrendingSectionProps {
  data: { text: string; links: GroundingResource[] } | null;
  loading: boolean;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ data, loading }) => {
  if (loading) return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 animate-pulse space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-50 rounded w-full"></div>
        <div className="h-3 bg-slate-50 rounded w-5/6"></div>
      </div>
    </div>
  );

  if (!data || data.links.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 text-orange-50 opacity-20 pointer-events-none">
         <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Fresh Web Insights</h3>
            <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">Grounded Search</p>
          </div>
        </div>
        
        <div className="text-slate-600 text-base md:text-lg leading-relaxed font-medium max-w-4xl border-l-4 border-orange-100 pl-6">
          <TextRenderer text={data.text} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {data.links.map((link, i) => (
            <a
              key={i}
              href={link.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-500 hover:bg-white hover:shadow-xl transition-all group min-h-[140px] relative overflow-hidden"
            >
              <div className="relative z-10">
                <h4 className="text-sm font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {link.title}
                </h4>
              </div>
              <div className="mt-4 flex items-center justify-between relative z-10">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Visit Source</span>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;
