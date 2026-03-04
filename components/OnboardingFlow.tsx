'use client';

import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingFlow() {
  const triggerOnboardingComplete = useIdentityStore((state) => state.triggerOnboardingComplete);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    antiVision: '',
    vision: '',
    yearGoal: '',
    monthProject: '',
    constraints: '',
    leversInput: ''
  });

  const steps = [
    {
      title: "Протокол глубокого погружения",
      desc: "IdentityOS не фиксирует привычки. Она ломает старую идентичность. Приготовьтесь к честности.",
      type: "intro"
    },
    {
      title: "Точка диссонанса (Anti-Vision)",
      desc: "Что вы сейчас избегаете? Опишите 'кошмарное будущее' через 3 года, если вы продолжите жить так же, как сегодня. Какова невыносимая истина?",
      field: "antiVision",
      placeholder: "Если я ничего не изменю, я буду..."
    },
    {
      title: "Конструирование (Vision)",
      desc: "Если бы вы могли переписать код своей реальности, как выглядит ваш идеальный день через 3 года? Кто вы?",
      field: "vision",
      placeholder: "Мой идеальный день начинается с..."
    },
    {
      title: "Игровой Сезон (1-Year Goal)",
      desc: "Какое ОДНО конкретное достижение в этом году докажет, что вы перешли в новый 'игровой класс'?",
      field: "yearGoal",
      placeholder: "К концу года я..."
    },
    {
      title: "Битва с боссом (1-Month Project)",
      desc: "Какой интенсивный спринт на 30 дней вы начнете сегодня, чтобы получить новый навык или ресурс?",
      field: "monthProject",
      placeholder: "В этом месяце я полностью фокусируюсь на..."
    },
    {
      title: "Правила Игры (Constraints)",
      desc: "Творчество рождается из ограничений. Установите 1 жесткое правило для себя (например: 'Никаких соцсетей до 12:00').",
      field: "constraints",
      placeholder: "Мое абсолютное правило..."
    },
    {
      title: "Ежедневные рычаги",
      desc: "Назовите 2-3 приоритетных действия. Выполнение этих квестов — ЕДИНСТВЕННЫЙ способ прокачки. (вводите через запятую)",
      field: "leversInput",
      placeholder: "Писать 1 час, тренировка, холодный душ"
    }
  ];

  const handleNext = () => {
    if (step === steps.length - 1) {
      const leversArray = data.leversInput
        .split(',')
        .map((l, i) => ({ id: i, text: l.trim(), completed: false, feeling: null }))
        .filter(l => l.text !== '');

      triggerOnboardingComplete({ ...data, dailyLevers: leversArray });
    } else {
      setStep(s => s + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleNext();
    }
  };

  const current = steps[step];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 md:p-6 font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20, filter: 'blur(5px)' }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full max-w-xl"
        >

          <div className="mb-8 md:mb-12 flex flex-col md:flex-row items-start md:items-center justify-between text-[10px] md:text-xs text-zinc-600 uppercase tracking-widest font-mono gap-2 md:gap-0">
            <span>{step === 0 ? 'Инициализация' : `Раскопки ${step}/${steps.length - 1}`}</span>
            {step > 0 && <span>Уровень угрозы Эго: Высокий</span>}
          </div>

          <h1 className="text-3xl md:text-4xl font-light mb-4 text-zinc-100">{current.title}</h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-8">{current.desc}</p>

          {current.type !== 'intro' ? (
            <div className="space-y-6">
              <textarea
                autoFocus
                value={data[current.field as keyof typeof data]}
                onChange={(e) => setData({ ...data, [current.field as keyof typeof data]: e.target.value })}
                onKeyDown={handleKeyDown}
                placeholder={current.placeholder}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 md:p-6 text-lg md:text-xl focus:outline-none focus:border-white focus:bg-zinc-900 transition-all resize-none min-h-[120px] md:min-h-[150px] placeholder:text-zinc-700"
              />
              <div className="flex justify-between items-center text-xs md:text-sm text-zinc-500">
                <span>Будьте предельно честны.</span>
                <span>Ctrl + Enter</span>
              </div>
            </div>
          ) : (
            <div className="h-24"></div>
          )}

          <div className="mt-8 md:mt-12 flex justify-end">
            <button
              onClick={handleNext}
              disabled={current.field ? !data[current.field as keyof typeof data].trim() : false}
              className="w-full md:w-auto flex justify-center items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              {step === steps.length - 1 ? 'Сгенерировать Идентичность' : 'Продолжить'}
              <ChevronRight size={20} />
            </button>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
