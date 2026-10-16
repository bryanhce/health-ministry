import React from 'react';
import { HeadacheEntryDTO } from '@/frontend/domain/headache.types';
import { PainBadge } from '@/frontend/components/ui/Badge';
import { formatDuration } from '@/frontend/utils/formatters';
import { formatDisplayDate, formatRelativeDate } from '@/frontend/utils/dateUtils';
import { Clock, Edit2, Trash2 } from 'lucide-react';

export interface HeadacheCardProps {
  entry: HeadacheEntryDTO;
  onEdit: (entry: HeadacheEntryDTO) => void;
  onDelete: (id: string) => void;
}

export function HeadacheCard({ entry, onEdit, onDelete }: HeadacheCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Card Header: Date & Severity Badge */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div>
          <span className="text-xs font-bold text-teal-600 dark:text-teal-400 block">
            {formatRelativeDate(entry.date)}
          </span>
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {formatDisplayDate(entry.date)}
          </span>
        </div>
        <PainBadge severity={entry.painSeverity} />
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mb-2">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-medium">Duration:</span>
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {formatDuration(entry.durationMinutes)}
        </span>
      </div>

      {/* Notes / Triggers */}
      {entry.notes && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
          {entry.notes}
        </div>
      )}

      {/* Mobile-Friendly Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onEdit(entry)}
          className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 hover:bg-teal-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          aria-label={`Edit headache from ${entry.date}`}
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          className="min-h-[44px] min-w-[44px] px-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
          aria-label={`Delete headache from ${entry.date}`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
