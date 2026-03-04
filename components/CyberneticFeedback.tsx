'use client';

import React from 'react';
import { Activity, Zap, AlertTriangle } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { motion } from 'framer-motion';

interface CyberneticFeedbackProps {
  task: any;
  onClose: () => void;
}

export default function CyberneticFeedback({ task, onClose }: CyberneticFeedbackProps) {
  const completeTask = useIdentityStore((state) => state.completeTask);

  const processFeedback = (feeling: 'alive' | 'dead') => {
    completeTask(task.id, feeling);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 max-w-md w-full shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4 text-zinc-500">
            <Activity size={32} />
          </div>
          <h3 className="text-xl font-medium text-white">Сенсорика Системы</h3>
          <p className="text-zinc-400 text-sm">Вы только что выполнили действие: <br /><span className="text-white italic">"{task.text}"</span></p>
        </div>

        <div className="space-y-4">
          <p className="text-center font-medium text-zinc-300">Это действие приблизило вас к Vision? В процессе вы чувствовали себя...</p>

          <div className="grid grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => processFeedback('alive')}
              className="p-4 border border-zinc-800 rounded hover:bg-white hover:text-black transition-colors flex flex-col items-center gap-2"
            >
              <Zap size={20} />
              <span className="font-semibold uppercase tracking-wider text-sm">Живым</span>
              <span className="text-xs opacity-50">+20 XP</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => processFeedback('dead')}
              className="p-4 border border-zinc-800 rounded hover:bg-red-950 hover:border-red-900 transition-colors flex flex-col items-center gap-2 text-zinc-400 hover:text-red-400"
            >
              <AlertTriangle size={20} />
              <span className="font-semibold uppercase tracking-wider text-sm">Мертвым</span>
              <span className="text-xs opacity-50">Коррекция</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
