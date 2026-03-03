'use client';

import React from 'react';
import { Activity, Zap, AlertTriangle } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 max-w-md w-full shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4 text-zinc-500">
            <Activity size={32} />
          </div>
          <h3 className="text-xl font-medium text-white">Сенсорика Системы</h3>
          <p className="text-zinc-400 text-sm">Вы только что выполнили действие: <br/><span className="text-white italic">"{task.text}"</span></p>
        </div>

        <div className="space-y-4">
          <p className="text-center font-medium text-zinc-300">Это действие приблизило вас к Vision? В процессе вы чувствовали себя...</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => processFeedback('alive')}
              className="p-4 border border-zinc-800 rounded hover:bg-white hover:text-black transition-all flex flex-col items-center gap-2"
            >
              <Zap size={20} />
              <span className="font-semibold uppercase tracking-wider text-sm">Живым</span>
              <span className="text-xs opacity-50">+20 XP</span>
            </button>
            <button 
              onClick={() => processFeedback('dead')}
              className="p-4 border border-zinc-800 rounded hover:bg-red-950 hover:border-red-900 transition-all flex flex-col items-center gap-2 text-zinc-400 hover:text-red-400"
            >
              <AlertTriangle size={20} />
              <span className="font-semibold uppercase tracking-wider text-sm">Мертвым</span>
              <span className="text-xs opacity-50">Коррекция</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
