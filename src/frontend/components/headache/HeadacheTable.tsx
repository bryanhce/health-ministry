import React from 'react';
import { HeadacheEntryDTO } from '@/frontend/domain/headache.types';
import { PainBadge } from '@/frontend/components/ui/Badge';
import { formatDuration } from '@/frontend/utils/formatters';
import { formatDisplayDate } from '@/frontend/utils/dateUtils';
import { Clock, Edit2, Trash2 } from 'lucide-react';

export interface HeadacheTableProps {
  entries: HeadacheEntryDTO[];
  onEdit: (entry: HeadacheEntryDTO) => void;
  onDelete: (id: string) => void;
}

export function HeadacheTable({ entries, onEdit, onDelete }: HeadacheTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Pain Severity</th>
            <th className="py-3.5 px-4">Duration</th>
            <th className="py-3.5 px-4">Notes & Triggers</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {entries.map((entry) => (
            <tr
              key={entry.id}
              className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {formatDisplayDate(entry.date)}
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <PainBadge severity={entry.painSeverity} />
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <span className="inline-flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium text-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {formatDuration(entry.durationMinutes)}
                </span>
              </td>
              <td className="py-3.5 px-4 max-w-xs text-xs text-slate-600 dark:text-slate-400 truncate">
                {entry.notes || <span className="text-slate-300 dark:text-slate-600">—</span>}
              </td>
              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(entry)}
                    className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Edit entry"
                    aria-label={`Edit headache from ${entry.date}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(entry.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Delete entry"
                    aria-label={`Delete headache from ${entry.date}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
