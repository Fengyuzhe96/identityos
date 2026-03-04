'use client';

import React from 'react';
import { Zap, CheckCircle2, Circle } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface QuestListProps {
  onCompleteTask: (task: any) => void;
}

const listVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariant: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function QuestList({ onCompleteTask }: QuestListProps) {
  const dailyLevers = useIdentityStore((state) => state.dailyLevers);
  const resetLevers = useIdentityStore((state) => state.resetLevers);
  const setAppState = useIdentityStore((state) => state.setAppState);

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-4 mb-6 md:mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-light text-white mb-1 md:mb-2">Ежедневные Квесты</h2>
          <p className="text-sm md:text-base text-zinc-500">Выполнение рычагов — единственный способ прокачки.</p>
        </div>
        <button
          onClick={() => setAppState('forcefield')}
          className="flex items-center justify-center sm:justify-start gap-2 text-sm bg-white text-black w-full sm:w-auto px-4 py-3 sm:py-2 rounded font-medium hover:bg-zinc-200 transition-colors"
        >
          <Zap size={16} />
          Forcefield Mode
        </button>
      </div>

      <motion.div
        variants={listVariant}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence>
          {dailyLevers.map((lever) => (
            <motion.div
              key={lever.id}
              layout
              variants={itemVariant}
              onClick={() => !lever.completed && onCompleteTask(lever)}
              className={`group p-4 md:p-5 rounded-lg border flex items-start sm:items-center gap-3 sm:gap-4 cursor-pointer transition-all duration-300
                ${lever.completed ? 'bg-zinc-900/50 border-zinc-800 opacity-60' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}`}
            >
              <div className="text-zinc-400 group-hover:text-white transition-colors shrink-0 mt-0.5 sm:mt-0">
                {lever.completed ? <CheckCircle2 className="text-white" size={24} /> : <Circle size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-base md:text-lg transition-all break-words ${lever.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
                  {lever.text}
                </p>
              </div>
              {lever.feeling && (
                <div className="text-xs uppercase tracking-widest flex items-center gap-1">
                  {lever.feeling === 'alive' ? (
                    <span className="text-green-500">Жив</span>
                  ) : (
                    <span className="text-red-500">Мертв</span>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {dailyLevers.every(l => l.completed) && dailyLevers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="mt-8 text-center p-8 border border-zinc-800 rounded-lg"
        >
          <p className="text-zinc-400 mb-4">Все рычаги на сегодня задействованы. Цикл завершен.</p>
          <button onClick={resetLevers} className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white border-b border-zinc-700 pb-1">
            Сбросить цикл (для демо)
          </button>
        </motion.div>
      )}

      <div className="mt-16 text-center">
        <button
          onClick={() => (window as any).triggerPatternBreaker?.()}
          className="text-xs text-zinc-700 hover:text-zinc-400 transition-colors uppercase tracking-widest"
        >
          [ Тест: Прерыватель автопилота ]
        </button>
      </div>
    </div>
  );
}
