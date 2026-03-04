'use client';

import React from 'react';
import { Eye, Crosshair } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';
import { motion } from 'framer-motion';

export default function LensToggle() {
  const lens = useIdentityStore((state) => state.lens);
  const setLens = useIdentityStore((state) => state.setLens);

  return (
    <div className="flex gap-4 mb-12 border-b border-zinc-800 pb-4">
      <button
        onClick={() => setLens('micro')}
        className={`flex items-center gap-2 pb-4 -mb-[17px] relative transition-colors ${lens === 'micro' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <Crosshair size={18} />
        <span className="uppercase tracking-widest text-sm font-semibold">Тактика (Дневная линза)</span>
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
        className={`flex items-center gap-2 pb-4 -mb-[17px] relative transition-colors ${lens === 'macro' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <Eye size={18} />
        <span className="uppercase tracking-widest text-sm font-semibold">Стратегия (Годовая линза)</span>
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
