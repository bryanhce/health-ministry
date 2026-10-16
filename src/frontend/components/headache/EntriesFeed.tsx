import React from 'react';
import { HeadacheEntryDTO } from '@/frontend/domain/headache.types';
import { HeadacheCard } from '@/frontend/components/headache/HeadacheCard';
import { HeadacheTable } from '@/frontend/components/headache/HeadacheTable';
import { Button } from '@/frontend/components/ui/Button';
import { Activity, ChevronDown, Plus, Sparkles } from 'lucide-react';

export interface EntriesFeedProps {
  entries: HeadacheEntryDTO[];
  totalCount: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  onEdit: (entry: HeadacheEntryDTO) => void;
  onDelete: (id: string) => void;
  onOpenLogModal: () => void;
  onSeedData: () => Promise<void>;
  isSeeding: boolean;
}

export function EntriesFeed({
  entries,
  totalCount,
  hasMore,
  isLoading,
  isLoadingMore = false,
  onLoadMore,
  onEdit,
  onDelete,
  onOpenLogModal,
  onSeedData,
  isSeeding,
}: EntriesFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse"
            />
          ))}
        </div>
        <div className="hidden md:block h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          No headache entries logged yet
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
          Start recording headache and migraine episodes to unlock 3-month averages, duration analytics, and frequency trends.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            onClick={onOpenLogModal}
            leftIcon={<Plus className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Log First Episode
          </Button>
          <Button
            variant="outline"
            onClick={onSeedData}
            isLoading={isSeeding}
            leftIcon={<Sparkles className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Load Demo Data
          </Button>
        </div>
      </div>
    );
  }

  const displayedCount = entries.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Logged Episodes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {hasMore || displayedCount < totalCount
              ? `Showing ${displayedCount} of ${totalCount} recorded ${totalCount === 1 ? 'episode' : 'episodes'}`
              : `Showing ${totalCount} recorded ${totalCount === 1 ? 'episode' : 'episodes'}`}
          </p>
        </div>
      </div>

      {/* Mobile Card Feed (< md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {entries.map((entry) => (
          <HeadacheCard
            key={entry.id}
            entry={entry}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Desktop Responsive Table (>= md) */}
      <div className="hidden md:block">
        <HeadacheTable
          entries={entries}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      {/* Backend-Driven Pagination: Load More Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center pt-2 gap-2">
          <Button
            variant="outline"
            onClick={onLoadMore}
            isLoading={isLoadingMore}
            rightIcon={!isLoadingMore ? <ChevronDown className="w-4 h-4" /> : undefined}
            className="w-full sm:w-auto min-w-[180px] font-semibold text-xs sm:text-sm shadow-xs hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
          >
            Load More
          </Button>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
            Showing {displayedCount} of {totalCount} episodes
          </span>
        </div>
      )}
    </div>
  );
}
