
import React, { useState, useEffect, useRef } from 'react';
import { Lesson, QuizQuestion, Flashcard, GroundingResource, Achievement } from './types';
import { MODULES } from './constants';
import { geminiService } from './services/geminiService';
import Sidebar from './components/Sidebar';
import CodeEditor from './components/CodeEditor';
import QuizView from './components/QuizView';
import ChatBot, { ChatBotHandle } from './components/ChatBot';
import Flashcards from './components/Flashcards';
import InterviewSim from './components/InterviewSim';
import TrendingSection from './components/TrendingSection';
import Achievements from './components/Achievements';
import Certificate from './components/Certificate';
import TextRenderer from './components/TextRenderer';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'quiz', title: 'Quiz Whiz', icon: '🧠', unlocked: false, description: 'Complete a quiz' },
  { id: 'code', title: 'Code Craftsman', icon: '💻', unlocked: false, description: 'Get a code review' },
  { id: 'interview', title: 'Pro Orator', icon: '🎙️', unlocked: false, description: 'Finish a live practice' },
  { id: 'module', title: 'Chapter Master', icon: '🏆', unlocked: false, description: 'Finish all lessons in a module' },
];

const App: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<Lesson>(MODULES[0].lessons[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [trending, setTrending] = useState<{ text: string, links: GroundingResource[] } | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  
  const [isLoadingMain, setIsLoadingMain] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  
  const chatbotRef = useRef<ChatBotHandle>(null);

  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('fe-academy-progress');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('fe-academy-badges');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  useEffect(() => {
    fetchContent(activeLesson);
    setIsMobileMenuOpen(false);
  }, [activeLesson.id]);

  useEffect(() => {
    localStorage.setItem('fe-academy-progress', JSON.stringify(Array.from(completedLessons)));
    localStorage.setItem('fe-academy-badges', JSON.stringify(achievements));
  }, [completedLessons, achievements]);

  const fetchContent = async (lesson: Lesson) => {
    setIsLoadingMain(true);
    setIsLoadingTrending(true);
    setExplanation(null);
    setQuizQuestions([]);
    setFlashcards([]);
    setTrending(null);

    const [exp, quiz, cards, trend] = await Promise.all([
      geminiService.getExplanation(lesson.title, lesson.difficulty),
      geminiService.generateQuiz(lesson.title),
      geminiService.generateFlashcards(lesson.title),
      geminiService.getLatestResources(lesson.title)
    ]);

    setExplanation(exp);
    setQuizQuestions(quiz);
    setFlashcards(cards);
    setTrending(trend);
    
    setIsLoadingMain(false);
    setIsLoadingTrending(false);
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => {
      const alreadyUnlocked = prev.find(a => a.id === id)?.unlocked;
      if (alreadyUnlocked) return prev;
      return prev.map(a => a.id === id ? { ...a, unlocked: true } : a);
    });
  };

  const markCompleted = (id: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    unlockAchievement('quiz');
    
    // Check if whole module is done
    const currentModule = MODULES.find(m => m.lessons.some(l => l.id === id));
    if (currentModule) {
      const allDone = currentModule.lessons.every(l => id === l.id || completedLessons.has(l.id));
      if (allDone) unlockAchievement('module');
    }
  };

  const handleFollowUp = () => {
    if (explanation && chatbotRef.current) {
      chatbotRef.current.openWithContext(`I just read this hint about ${activeLesson.title}: "${explanation}". Can you dive deeper into it?`);
    }
  };

  const totalLessons = MODULES.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const masteryPercentage = Math.round((completedLessons.size / totalLessons) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* Certification Portal */}
      {showCertificate && <Certificate mastery={masteryPercentage} onClose={() => setShowCertificate(false)} />}

      {/* Header */}
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <div className="bg-slate-900 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg group cursor-pointer" onClick={() => window.location.reload()}>
            <span className="text-white font-black text-xl italic group-hover:scale-110 transition-transform">F</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-tighter">Frontend Academy AI</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end gap-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Mastery Status</span>
            <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out" 
                style={{ width: `${masteryPercentage}%` }}
              ></div>
            </div>
          </div>
          {masteryPercentage === 100 ? (
            <button 
              onClick={() => setShowCertificate(true)}
              className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all animate-bounce"
            >
              Get Certificate 📜
            </button>
          ) : (
            <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-blue-100">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
              AI Mentor Online
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Navigation */}
        <div className={`
          fixed inset-y-0 left-0 w-64 bg-white z-50 transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 border-r border-slate-200
          ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        `}>
          <Sidebar 
            onSelectLesson={setActiveLesson} 
            activeLessonId={activeLesson.id}
            completedIds={completedLessons}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-12 scroll-smooth">
          <div className="max-w-4xl mx-auto space-y-16 md:space-y-24">
            
            {/* Header / Intro Section */}
            <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Achievements achievements={achievements} />
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                    {activeLesson.difficulty}
                  </span>
                  {completedLessons.has(activeLesson.id) && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">✓ Lesson Done</span>
                  )}
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.85]">
                  {activeLesson.title}
                </h2>
                <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                  {activeLesson.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                <div className="md:col-span-7 lg:col-span-8 bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 opacity-5">
                    <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  </div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Educational Foundation</h3>
                  <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed font-medium">
                    {activeLesson.content}
                  </div>
                </div>

                <div className="md:col-span-5 lg:col-span-4 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-900/20 flex flex-col justify-between group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-lg animate-pulse">✨</div>
                      <h3 className="font-black text-sm uppercase tracking-widest">AI Hint</h3>
                    </div>
                    {isLoadingMain ? (
                      <div className="space-y-3">
                        <div className="h-2.5 bg-slate-800 rounded w-full animate-pulse"></div>
                        <div className="h-2.5 bg-slate-800 rounded w-11/12 animate-pulse"></div>
                        <div className="h-2.5 bg-slate-800 rounded w-4/5 animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-300 leading-relaxed font-medium">
                        <TextRenderer text={explanation || ''} className="italic opacity-90" isDark={true} />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleFollowUp}
                    className="mt-8 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:translate-y-[-2px] active:translate-y-0"
                  >
                    Ask Follow Up
                  </button>
                </div>
              </div>
            </section>

            {/* Grounding & Trending Resources */}
            <div className="animate-in fade-in duration-1000">
               <TrendingSection data={trending} loading={isLoadingTrending} />
            </div>

            {/* Recall Lab */}
            <section className="space-y-10 py-12 border-y border-slate-200">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Recall Chamber</h2>
                <p className="text-slate-500 font-medium">Master the terminology via active recall.</p>
              </div>
              <Flashcards cards={flashcards} />
            </section>

            {/* The Code Lab */}
            <section className="space-y-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Code Laboratory</h2>
                  <p className="text-slate-500 text-sm mt-1">Practice in our AI-monitored playground.</p>
                </div>
                <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase border border-amber-100">Live Linter</div>
              </div>
              <div onClick={() => unlockAchievement('code')}>
                <CodeEditor initialCode={activeLesson.codeSnippet} topic={activeLesson.title} />
              </div>
            </section>

            {/* Quiz Gate */}
            <section className="space-y-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Assessment</h2>
              {quizQuestions.length > 0 ? (
                <QuizView 
                  questions={quizQuestions} 
                  topic={activeLesson.title} 
                  onComplete={() => markCompleted(activeLesson.id)}
                />
              ) : (
                <div className="p-20 border-4 border-dashed border-slate-100 rounded-[3rem] flex flex-col items-center gap-6">
                  <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Gemini is crafting questions...</p>
                </div>
              )}
            </section>

            {/* Vocal Practice */}
            <section className="space-y-8 pb-24">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Vocal Proficiency</h2>
              <div onClick={() => unlockAchievement('interview')}>
                <InterviewSim topic={activeLesson.title} />
              </div>
            </section>
          </div>
        </main>
      </div>

      <ChatBot ref={chatbotRef} />
    </div>
  );
};

export default App;
