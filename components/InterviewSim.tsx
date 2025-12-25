
import React, { useState, useRef, useEffect } from 'react';
import { geminiService, decodeBase64, encodeBase64, decodeAudioData } from '../services/geminiService';

interface InterviewSimProps {
  topic: string;
}

const InterviewSim: React.FC<InterviewSimProps> = ({ topic }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Ready to chat');
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

  const startInterview = async () => {
    try {
      setStatus('Connecting...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputContext = new AudioContext({ sampleRate: 16000 });
      
      const sessionPromise = geminiService.getLiveConnection(topic, {
        onopen: () => {
          setIsActive(true);
          setStatus('Interviewing Live');
          
          const source = inputContext.createMediaStreamSource(stream);
          const processor = inputContext.createScriptProcessor(4096, 1, 1);
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: { data: encodeBase64(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
            });
          };
          source.connect(processor);
          processor.connect(inputContext.destination);
        },
        onmessage: async (msg: any) => {
          const base64 = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64 && audioContextRef.current) {
            const ctx = audioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const buffer = await decodeAudioData(decodeBase64(base64), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
          }
          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => {
          setIsActive(false);
          setStatus('Session Ended');
        },
        onerror: (e: any) => {
          console.error(e);
          setStatus('Connection Error');
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (e) {
      console.error(e);
      setStatus('Microphone access required');
    }
  };

  const stopInterview = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      setIsActive(false);
      setStatus('Ready to chat');
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
         <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}></div>
      </div>
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/40">
           <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
           </svg>
        </div>
        <h3 className="text-xl font-bold">Interview Prep: {topic}</h3>
        <p className="text-slate-400 text-sm max-w-sm">
          Practice explaining this concept verbally to our AI Senior Mentor. Get real-time spoken feedback on your technical communication.
        </p>
        <p className="text-xs font-mono text-blue-400 uppercase tracking-widest">{status}</p>
        
        {!isActive ? (
          <button 
            onClick={startInterview}
            className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all transform hover:scale-105"
          >
            Start Live Practice
          </button>
        ) : (
          <button 
            onClick={stopInterview}
            className="bg-red-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-600 transition-all transform hover:scale-105"
          >
            End Practice
          </button>
        )}
      </div>
      
      {/* Decorative Audio Visualizer (Pure CSS) */}
      <div className="flex gap-1 justify-center mt-6 h-8 items-end opacity-40">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`w-1 bg-blue-500 rounded-full ${isActive ? 'animate-audio-bar' : 'h-1'}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
        ))}
      </div>
      
      <style>{`
        @keyframes audio-bar {
          0%, 100% { height: 4px; }
          50% { height: 32px; }
        }
        .animate-audio-bar { animation: audio-bar 0.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default InterviewSim;
