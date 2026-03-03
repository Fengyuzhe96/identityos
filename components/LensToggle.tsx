'use client';

import React from 'react';
import { Eye, Crosshair } from 'lucide-react';
import { useIdentityStore } from '@/store/useIdentityStore';

export default function LensToggle() {
  const lens = useIdentityStore((state) => state.lens);
  const setLens = useIdentityStore((state) => state.setLens);

  return (
    <div className="flex gap-4 mb-12 border-b border-zinc-800 pb-4">
      <button 
        onClick={() => setLens('micro')}
        className={`flex items-center gap-2 pb-4 -mb-[17px] border-b-2 transition-colors ${lens === 'micro' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
      >
        <Crosshair size={18} />
        <span className="uppercase tracking-widest text-sm font-semibold">Тактика (Дневная линза)</span>
      </button>
      <button 
        onClick={() => setLens('macro')}
        className={`flex items-center gap-2 pb-4 -mb-[17px] border-b-2 transition-colors ${lens === 'macro' ? 'border-white text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
      >
        <Eye size={18} />
        <span className="uppercase tracking-widest text-sm font-semibold">Стратегия (Годовая линза)</span>
      </button>
    </div>
  );
}
