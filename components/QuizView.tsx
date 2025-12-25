
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  topic: string;
  onComplete?: (score: number) => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, topic, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setQuizFinished(true);
      if (onComplete) onComplete(score);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
    setIsSubmitted(true);
  };

  if (questions.length === 0) return null;

  if (quizFinished) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-[2.5rem] p-12 text-center shadow-xl animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          🎉
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Quiz Completed!</h3>
        <p className="text-slate-500 font-medium mb-8">You mastered the basics of {topic}.</p>
        <div className="inline-block px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xl tabular-nums">
          Score: {score} / {questions.length}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">Knowledge Gate</h3>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">{topic}</p>
        </div>
        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
          {currentIndex + 1} / {questions.length}
        </span>
      </div>

      <div className="space-y-8">
        <p className="text-slate-800 font-bold text-xl leading-tight">{currentQuestion.question}</p>
        
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isCorrect = idx === currentQuestion.correctAnswer;
            const isSelected = selectedOption === idx;
            
            let buttonClass = "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
            if (isSelected) buttonClass = "border-blue-500 bg-blue-50 ring-2 ring-blue-100";
            if (isSubmitted) {
              if (isCorrect) buttonClass = "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100";
              else if (isSelected) buttonClass = "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-100";
              else buttonClass = "border-slate-100 opacity-50";
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group ${buttonClass}`}
              >
                <span className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-colors ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-400 group-hover:border-blue-300 group-hover:text-blue-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-bold text-sm">{option}</span>
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="p-6 bg-blue-50/50 rounded-3xl border-2 border-blue-100 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex gap-2 mb-2">
               <span className="text-lg">💡</span>
               <h4 className="font-black text-[10px] uppercase text-blue-600 tracking-widest">Explanation</h4>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed italic font-medium">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          {!isSubmitted ? (
            <button
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 disabled:opacity-30 transition-all shadow-xl shadow-slate-200"
            >
              Verify Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-200"
            >
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Challenge'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
