'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';

const PATTERN_BREAKER_QUESTIONS = [
  "Что ты сейчас избегаешь?",
  "Если бы кто-то снимал последние 2 часа, что бы он сказал о твоих целях?",
  "Ты сейчас действуешь из страха или из видения?",
  "Это действие подтверждает твою новую идентичность?",
  "Какую 'невыносимую истину' ты сейчас игнорируешь?"
];

export default function PatternBreaker() {
  const appState = useIdentityStore((state) => state.appState);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (appState !== 'dashboard') return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        trigger();
      }
    }, 30000); 

    return () => clearInterval(interval);
  }, [appState]);

  const trigger = () => {
    const randomQuestion = PATTERN_BREAKER_QUESTIONS[Math.floor(Math.random() * PATTERN_BREAKER_QUESTIONS.length)];
    setMsg(randomQuestion);
    setTimeout(() => setMsg(null), 10000);
  };

  // Expose trigger globally for the test button in Dashboard
  useEffect(() => {
    (window as any).triggerPatternBreaker = trigger;
    return () => { delete (window as any).triggerPatternBreaker; };
  }, []);

  if (!msg) return null;

  return (
    <div className="fixed bottom-8 right-8 bg-white text-black p-6 rounded shadow-2xl z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <div className="flex gap-4 items-start">
        <AlertTriangle className="text-red-600 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-2 text-red-600">Системное прерывание</h4>
          <p className="text-lg font-medium leading-snug">{msg}</p>
        </div>
      </div>
    </div>
  );
}
