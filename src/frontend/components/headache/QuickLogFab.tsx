import React from 'react';
import { Plus } from 'lucide-react';

export interface QuickLogFabProps {
  onClick: () => void;
}

export function QuickLogFab({ onClick }: QuickLogFabProps) {
  return (
    <div className="fixed bottom-6 right-5 z-40 sm:hidden">
      <button
        type="button"
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-xl shadow-teal-500/35 flex items-center justify-center active:scale-95 transition-transform cursor-pointer focus:outline-none focus:ring-4 focus:ring-teal-400/40"
        aria-label="Quick log headache episode"
      >
        <Plus className="w-7 h-7 stroke-[2.5]" />
      </button>
    </div>
  );
}
