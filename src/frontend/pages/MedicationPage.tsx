import React from 'react';
import { Pill } from 'lucide-react';
import { MEDICATION_PAGE_CONSTANTS } from '@/frontend/config/routes';

export function MedicationPage() {
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-14 text-center shadow-xs">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6 shadow-sm shadow-teal-500/10">
            <Pill className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
          </div>

          <div className="inline-flex mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {MEDICATION_PAGE_CONSTANTS.STATUS_BADGE}
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {MEDICATION_PAGE_CONSTANTS.PAGE_TITLE}
          </h1>

          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            {MEDICATION_PAGE_CONSTANTS.PAGE_DESCRIPTION}
          </p>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/80 max-w-md mx-auto">
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium">
              {MEDICATION_PAGE_CONSTANTS.EMPTY_STATE_DESCRIPTION}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
