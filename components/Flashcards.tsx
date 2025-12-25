
import React, { useState } from 'react';
import { Flashcard } from '../types';

interface FlashcardsProps {
  cards: Flashcard[];
}

const Flashcards: React.FC<FlashcardsProps> = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const card = cards[currentIndex];

  if (!cards.length) return (
    <div className="flex justify-center p-12">
      <div className="w-8 h-8 border-4 border-slate-100 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div 
        onClick={() => setIsFlipped(!isFlipped)}
        className="group perspective-1000 w-full max-w-sm h-72 cursor-pointer touch-none"
      >
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center shadow-2xl hover:border-blue-500 transition-colors">
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Recall Term</span>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{card.term}</h3>
            <div className="mt-8 flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Click to Flip
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center shadow-2xl text-white">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">Definition</span>
            <p className="text-xl font-medium leading-tight tracking-tight">{card.definition}</p>
            <p className="mt-8 text-[10px] font-bold text-slate-500 uppercase">Tap to reset</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex gap-1.5">
          {cards.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-200'}`} />
          ))}
        </div>
        <button 
          onClick={handleNext}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl"
        >
          Next Card
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};

export default Flashcards;
