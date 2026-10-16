import React from 'react';
import { Database, Plus } from 'lucide-react';
import { Button } from '@/frontend/components/ui/Button';
import { HEADACHE_SUBHEADER_CONSTANTS } from '@/frontend/config/routes';

export interface HeadacheSubHeaderProps {
  onOpenLogModal: () => void;
  onSeedData: () => Promise<void>;
  isSeeding: boolean;
}

export function HeadacheSubHeader({
  onOpenLogModal,
  onSeedData,
  isSeeding,
}: HeadacheSubHeaderProps) {
  return (
    <section
      aria-label="Headache Actions Header"
      className="sticky top-16 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex flex-row items-center justify-between gap-3">
        {/* Title and Subtitle */}
        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            {HEADACHE_SUBHEADER_CONSTANTS.PAGE_TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
            {HEADACHE_SUBHEADER_CONSTANTS.PAGE_DESCRIPTION}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onSeedData}
            isLoading={isSeeding}
            leftIcon={<Database className="w-3.5 h-3.5" />}
            title={HEADACHE_SUBHEADER_CONSTANTS.SEED_BUTTON_TOOLTIP}
            className="text-xs"
          >
            <span className="hidden sm:inline">
              {HEADACHE_SUBHEADER_CONSTANTS.SEED_BUTTON_TEXT}
            </span>
            <span className="sm:hidden">
              {HEADACHE_SUBHEADER_CONSTANTS.SEED_BUTTON_MOBILE_TEXT}
            </span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenLogModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="font-semibold shadow-sm text-xs sm:text-sm"
          >
            <span className="hidden sm:inline">
              {HEADACHE_SUBHEADER_CONSTANTS.LOG_BUTTON_TEXT}
            </span>
            <span className="sm:hidden">
              {HEADACHE_SUBHEADER_CONSTANTS.LOG_BUTTON_MOBILE_TEXT}
            </span>
          </Button>
        </div>
      </div>
    </section>
  );
}
