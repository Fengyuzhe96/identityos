'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-auto md:right-8 bg-white text-black p-4 md:p-6 rounded shadow-2xl z-50 max-w-[calc(100%-2rem)] md:max-w-sm"
        >
          <div className="flex gap-3 md:gap-4 items-start">
            <AlertTriangle className="text-red-600 shrink-0 mt-0.5 md:mt-1" size={20} />
            <div>
              <h4 className="font-bold uppercase tracking-widest text-[10px] md:text-xs mb-1 md:mb-2 text-red-600">Системное прерывание</h4>
              <p className="text-base md:text-lg font-medium leading-snug">{msg}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
