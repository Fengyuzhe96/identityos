'use client';

import React from 'react';
import { Eye, Crosshair } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { motion } from 'framer-motion';

export default function LensToggle() {
  const lens = useIdentityStore((state) => state.lens);
  const setLens = useIdentityStore((state) => state.setLens);

  return (
    <div className="flex flex-wrap md:flex-nowrap gap-4 md:gap-6 mb-8 md:mb-12 border-b border-zinc-800 pb-2 md:pb-4 w-full overflow-x-auto no-scrollbar whitespace-nowrap">
      <button
        onClick={() => setLens('micro')}
        className={`flex items-center gap-2 pb-2 md:pb-4 -mb-[9px] md:-mb-[17px] relative transition-colors ${lens === 'micro' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <Crosshair size={18} className="shrink-0" />
        <span className="uppercase tracking-widest text-xs md:text-sm font-semibold">Тактика (Дневная линза)</span>
        {lens === 'micro' && (
          <motion.div
            layoutId="active-lens"
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => setLens('macro')}
        className={`flex items-center gap-2 pb-2 md:pb-4 -mb-[9px] md:-mb-[17px] relative transition-colors ${lens === 'macro' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <Eye size={18} className="shrink-0" />
        <span className="uppercase tracking-widest text-xs md:text-sm font-semibold">Стратегия (Годовая линза)</span>
        {lens === 'macro' && (
          <motion.div
            layoutId="active-lens"
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-white"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
}
