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
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-light text-white mb-2">Ежедневные Квесты</h2>
          <p className="text-zinc-500">Выполнение рычагов — единственный способ прокачки.</p>
        </div>
        <button
          onClick={() => setAppState('forcefield')}
          className="flex items-center gap-2 text-sm bg-white text-black px-4 py-2 rounded font-medium hover:bg-zinc-200 transition-colors"
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
              className={`group p-5 rounded-lg border flex items-center gap-4 cursor-pointer transition-all duration-300
                ${lever.completed ? 'bg-zinc-900/50 border-zinc-800 opacity-60' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}`}
            >
              <div className="text-zinc-400 group-hover:text-white transition-colors">
                {lever.completed ? <CheckCircle2 className="text-white" size={24} /> : <Circle size={24} />}
              </div>
              <div className="flex-1">
                <p className={`text-lg transition-all ${lever.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}`}>
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
