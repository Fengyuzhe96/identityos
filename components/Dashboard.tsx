'use client';

import React, { useState } from 'react';
import { Brain, Eye, ShieldAlert, Target, Activity } from 'lucide-react';
import { useIdentityStore, EgoLevel } from '@/store/useIdentityStore';
import LensToggle from './LensToggle';
import QuestList from './QuestList';
import CyberneticFeedback from './CyberneticFeedback';
import PatternBreaker from './PatternBreaker';

const EGO_TITLES: Record<EgoLevel, string> = {
  1: 'Конформист (Автопилот)',
  2: 'Искатель (Осознание)',
  3: 'Архитектор (Проектирование)',
  4: 'Стратег (Управление)',
  5: 'Творец (Идентичность)'
};

export default function Dashboard() {
  const profile = useIdentityStore();
  const [feedbackTask, setFeedbackTask] = useState<any>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-white selection:text-black">
      {/* HEADER */}
      <header className="border-b border-zinc-800/50 p-6 flex justify-between items-center bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Brain className="text-white" size={24} />
          <span className="font-semibold tracking-wide">IdentityOS</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-zinc-500 uppercase tracking-widest">Уровень Эго</div>
            <div className="text-sm font-medium">{EGO_TITLES[profile.egoLevel]}</div>
          </div>
          <div className="w-32 h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-500" 
              style={{ width: `${(profile.xp % 50) / 50 * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-8">
        <LensToggle />

        {/* LENS CONTENT */}
        {profile.lens === 'macro' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* Vision / Anti-Vision */}
            <div className="space-y-6">
              <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-900/50"></div>
                <div className="flex items-center gap-2 mb-4 text-red-400">
                  <ShieldAlert size={20} />
                  <h3 className="font-semibold tracking-wide uppercase text-sm">Anti-Vision (Поражение)</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed">{profile.antiVision}</p>
              </div>

              <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-white"></div>
                <div className="flex items-center gap-2 mb-4 text-white">
                  <Eye size={20} />
                  <h3 className="font-semibold tracking-wide uppercase text-sm">Vision (Победа)</h3>
                </div>
                <p className="text-zinc-300 leading-relaxed">{profile.vision}</p>
              </div>
            </div>

            {/* Goals */}
            <div className="space-y-6">
              <div className="p-6 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-4 text-zinc-300">
                  <Target size={20} />
                  <h3 className="font-semibold tracking-wide uppercase text-sm">Главная Миссия (1 Год)</h3>
                </div>
                <p className="text-xl font-light text-white">{profile.yearGoal}</p>
              </div>

              <div className="p-6 border border-zinc-800 rounded-lg">
                <div className="flex items-center gap-2 mb-4 text-zinc-300">
                  <Activity size={20} />
                  <h3 className="font-semibold tracking-wide uppercase text-sm">Битва с боссом (1 Месяц)</h3>
                </div>
                <p className="text-xl font-light text-white">{profile.monthProject}</p>
              </div>
              
              <div className="p-6 border border-dashed border-zinc-700 rounded-lg bg-zinc-900/20">
                <h3 className="font-semibold tracking-wide uppercase text-xs text-zinc-500 mb-2">Ограничения игры (Constraints)</h3>
                <p className="text-sm text-zinc-400 italic">"{profile.constraints}"</p>
              </div>
            </div>
          </div>
        ) : (
          <QuestList onCompleteTask={(task) => setFeedbackTask(task)} />
        )}
      </main>

      {/* MODALS & OVERLAYS */}
      {feedbackTask && (
        <CyberneticFeedback 
          task={feedbackTask} 
          onClose={() => setFeedbackTask(null)} 
        />
      )}
      <PatternBreaker />
    </div>
  );
}
