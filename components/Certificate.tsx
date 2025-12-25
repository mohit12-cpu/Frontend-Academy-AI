
import React from 'react';

interface CertificateProps {
  onClose: () => void;
  mastery: number;
}

const Certificate: React.FC<CertificateProps> = ({ onClose, mastery }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white max-w-2xl w-full rounded-[3rem] p-1 shadow-2xl overflow-hidden relative border-8 border-slate-900">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
        
        <div className="p-12 text-center space-y-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-blue-50/30">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-4xl shadow-xl border-4 border-blue-500">
              🎓
            </div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.4em]">Certificate of Excellence</h2>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Frontend Mastery</h1>
          </div>
          
          <div className="space-y-4 max-w-md mx-auto">
            <p className="text-slate-500 italic font-serif text-lg leading-relaxed">
              This confirms that the student has successfully completed the interactive curriculum with a total mastery score of
            </p>
            <div className="text-6xl font-black text-slate-900 tabular-nums">
              {mastery}%
            </div>
          </div>
          
          <div className="pt-8 flex justify-between items-end px-4 border-t border-slate-100">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date Issued</p>
              <p className="text-sm font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 relative opacity-10">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signed By</p>
              <p className="text-sm font-black text-blue-600 font-serif italic">Gemini AI Mentor</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 pt-4">
            <button 
              onClick={() => window.print()}
              className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Print Certificate
            </button>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Back to Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
