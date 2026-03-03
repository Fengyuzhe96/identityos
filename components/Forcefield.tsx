'use client';

import React from 'react';
import { Maximize, X } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';

interface ForcefieldProps {
  onTaskComplete: (task: any) => void;
}

export default function Forcefield({ onTaskComplete }: ForcefieldProps) {
  const setAppState = useIdentityStore((state) => state.setAppState);
  const dailyLevers = useIdentityStore((state) => state.dailyLevers);
  
  const uncompletedTasks = dailyLevers.filter(t => !t.completed);
  const activeTask = uncompletedTasks.length > 0 ? uncompletedTasks[0] : null;

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 relative font-sans">
      <button 
        onClick={() => setAppState('dashboard')}
        className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>
      
      <div className="max-w-2xl text-center space-y-12">
        <div className="flex justify-center mb-8 animate-pulse text-zinc-700">
          <Maximize size={48} />
        </div>
        <h2 className="text-sm tracking-widest uppercase text-zinc-500 mb-4">Forcefield Mode Active</h2>
        
        {activeTask ? (
          <div className="space-y-8 animate-in fade-in duration-700">
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
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-700">
            <h1 className="text-4xl md:text-6xl font-light text-zinc-400">Все рычаги активированы</h1>
            <p className="text-zinc-500">Система в равновесии. Отдыхайте.</p>
          </div>
        )}
      </div>
    </div>
  );
}
