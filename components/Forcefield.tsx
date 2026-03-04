'use client';

import React from 'react';
import { Maximize, X } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { motion } from 'framer-motion';

interface ForcefieldProps {
  onTaskComplete: (task: any) => void;
}

export default function Forcefield({ onTaskComplete }: ForcefieldProps) {
  const setAppState = useIdentityStore((state) => state.setAppState);
  const dailyLevers = useIdentityStore((state) => state.dailyLevers);

  const uncompletedTasks = dailyLevers.filter(t => !t.completed);
  const activeTask = uncompletedTasks.length > 0 ? uncompletedTasks[0] : null;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-4 md:p-6 relative font-sans">
      <button
        onClick={() => setAppState('dashboard')}
        className="absolute top-4 right-4 md:top-8 md:right-8 text-zinc-500 hover:text-white transition-colors"
      >
        <X size={28} className="md:w-8 md:h-8" />
      </button>

      <div className="max-w-2xl text-center space-y-12">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-8 text-zinc-700"
        >
          <Maximize size={48} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-sm tracking-widest uppercase text-zinc-500 mb-4"
        >
          Forcefield Mode Active
        </motion.h2>

        {activeTask ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">{activeTask.text}</h1>
            <p className="text-zinc-400 text-lg">Единственное, что имеет значение прямо сейчас.</p>
            <button
              onClick={() => {
                setAppState('dashboard');
                onTaskComplete(activeTask);
              }}
              className="mt-12 px-8 py-4 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-colors"
            >
              Квест выполнен
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-4xl md:text-6xl font-light text-zinc-400">Все рычаги активированы</h1>
            <p className="text-zinc-500">Система в равновесии. Отдыхайте.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
