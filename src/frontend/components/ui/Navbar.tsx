import React from 'react';
import { Activity, Database, Plus } from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';

export interface NavbarProps {
  onOpenLogModal: () => void;
  onSeedData: () => Promise<void>;
  isSeeding: boolean;
}

export function Navbar({ onOpenLogModal, onSeedData, isSeeding }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              Health Ministry
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                Migraine
              </span>
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Headache & Migraine Analytics
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onSeedData}
            isLoading={isSeeding}
            leftIcon={<Database className="w-3.5 h-3.5" />}
            title="Seed 90 days of realistic sample data"
            className="text-xs"
          >
            <span className="hidden sm:inline">Seed Demo Data</span>
            <span className="sm:hidden">Seed</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenLogModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-semibold shadow-sm text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">Log Headache</span>
            <span className="sm:hidden">Log</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
