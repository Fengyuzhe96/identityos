'use client';

import React, { useEffect, useState } from 'react';
import { X, Activity, TrendingUp, Zap, AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthProvider';
import { motion } from 'framer-motion';

interface DiaryEntry {
  id: string;
  lever_text: string;
  feeling: 'alive' | 'dead';
  xp_gained: number;
  recorded_at: string;
}

interface DayStat {
  date: string;
  alive: number;
  dead: number;
  total: number;
}

interface StateDiaryProps {
  onClose: () => void;
}

export default function StateDiary({ onClose }: StateDiaryProps) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [dayStats, setDayStats] = useState<DayStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDiary = async () => {
      const supabase = createClient();

      // Load last 30 days of entries
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data } = await supabase
        .from('state_diary')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', thirtyDaysAgo.toISOString())
        .order('recorded_at', { ascending: false });

      if (data) {
        setEntries(data);

        // Aggregate by day
        const statsMap = new Map<string, DayStat>();
        data.forEach((entry: DiaryEntry) => {
          const date = new Date(entry.recorded_at).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
          });
          if (!statsMap.has(date)) {
            statsMap.set(date, { date, alive: 0, dead: 0, total: 0 });
          }
          const stat = statsMap.get(date)!;
          if (entry.feeling === 'alive') stat.alive++;
          else stat.dead++;
          stat.total++;
        });

        setDayStats(Array.from(statsMap.values()).reverse());
      }

      setLoading(false);
    };

    loadDiary();
  }, [user]);

  const totalAlive = entries.filter((e) => e.feeling === 'alive').length;
  const totalDead = entries.filter((e) => e.feeling === 'dead').length;
  const totalXp = entries.reduce((sum, e) => sum + e.xp_gained, 0);
  const alivePercent = entries.length > 0 ? Math.round((totalAlive / entries.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-zinc-950 border border-zinc-800 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Activity size={20} className="text-zinc-400" />
            <h2 className="text-lg font-semibold text-white">Дневник состояний</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-600 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
          {loading ? (
            <div className="text-center text-zinc-600 py-12">Загрузка...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <Activity size={32} className="text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600">Пока нет записей.</p>
              <p className="text-zinc-700 text-sm mt-2">
                Выполняйте квесты и оценивайте состояние — данные появятся здесь.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-light text-white mb-1">{alivePercent}%</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Виталити</div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-light text-green-400 mb-1">{totalAlive}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Живой</div>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-light text-red-400 mb-1">{totalDead}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Мертвый</div>
                </div>
              </div>

              {/* Mini bar chart */}
              {dayStats.length > 0 && (
                <div>
                  <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
                    Активность за 30 дней • {totalXp} XP
                  </h3>
                  <div className="flex items-end gap-1 h-24">
                    {dayStats.map((stat) => {
                      const maxTotal = Math.max(...dayStats.map((s) => s.total), 1);
                      const height = (stat.total / maxTotal) * 100;
                      const aliveRatio = stat.total > 0 ? stat.alive / stat.total : 0;

                      return (
                        <div
                          key={stat.date}
                          className="flex-1 flex flex-col items-center gap-1 group relative"
                        >
                          <div
                            className="w-full rounded-sm transition-all relative overflow-hidden"
                            style={{ height: `${Math.max(height, 8)}%` }}
                          >
                            <div
                              className="absolute bottom-0 w-full bg-white/90 rounded-sm"
                              style={{ height: `${aliveRatio * 100}%` }}
                            />
                            <div
                              className="absolute top-0 w-full bg-red-500/60 rounded-sm"
                              style={{ height: `${(1 - aliveRatio) * 100}%` }}
                            />
                          </div>
                          <span className="text-[8px] text-zinc-700 group-hover:text-zinc-400 transition-colors">
                            {stat.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recent entries */}
              <div>
                <h3 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">
                  Последние записи
                </h3>
                <div className="space-y-2">
                  {entries.slice(0, 15).map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-zinc-900/30 border border-zinc-800/50"
                    >
                      {entry.feeling === 'alive' ? (
                        <Zap size={14} className="text-green-500 shrink-0" />
                      ) : (
                        <AlertTriangle size={14} className="text-red-500 shrink-0" />
                      )}
                      <span className="text-sm text-zinc-300 flex-1 truncate">
                        {entry.lever_text}
                      </span>
                      <span className="text-[10px] text-zinc-600 shrink-0">
                        +{entry.xp_gained} XP
                      </span>
                      <span className="text-[10px] text-zinc-700 shrink-0">
                        {new Date(entry.recorded_at).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
