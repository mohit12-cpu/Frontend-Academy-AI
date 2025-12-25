
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import TextRenderer from './TextRenderer';

interface CodeEditorProps {
  initialCode: string;
  topic: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, topic }) => {
  const [code, setCode] = useState(initialCode);
  const [review, setReview] = useState<string | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setReview(null);
  }, [initialCode]);

  const handleReview = async () => {
    setIsReviewing(true);
    setReview(null);
    const feedback = await geminiService.reviewCode(code, topic);
    setReview(feedback);
    setIsReviewing(false);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border-4 border-slate-900 overflow-hidden bg-slate-900 shadow-2xl">
        <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Sandbox: {topic}</span>
            <button
              onClick={handleReview}
              disabled={isReviewing}
              className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg font-black uppercase tracking-widest transition-all disabled:opacity-50 active:scale-95"
            >
              {isReviewing ? 'Analyzing...' : 'AI Review'}
            </button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-80 p-8 bg-transparent text-blue-300 font-mono text-sm focus:outline-none resize-none leading-relaxed selection:bg-blue-500/30"
        />
      </div>

      {review && (
        <div className="bg-white border-2 border-slate-200 rounded-[2rem] p-8 animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
          <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-xs mb-6">
            <div className="bg-blue-100 p-2 rounded-xl">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            AI Mentor Feedback
          </div>
          <div className="text-slate-700 font-medium leading-relaxed">
            <TextRenderer text={review} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
