'use client';

import React from 'react';
import { useDashboardPage } from '@/frontend/pages/useDashboardPage';
import { Navbar } from '@/frontend/components/ui/Navbar';
import { DashboardStats } from '@/frontend/components/dashboard/DashboardStats';
import { FrequencyCharts } from '@/frontend/components/dashboard/FrequencyCharts';
import { EntriesFeed } from '@/frontend/components/headache/EntriesFeed';
import { QuickLogFab } from '@/frontend/components/headache/QuickLogFab';
import { HeadacheLogModal } from '@/frontend/components/headache/HeadacheLogModal';

export function DashboardPage() {
  const {
    entries,
    stats,
    isLoading,
    isLogModalOpen,
    editingEntry,
    isSeeding,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmitEntry,
    handleDeleteEntry,
    handleSeedData,
  } = useDashboardPage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Top Header Navbar */}
      <Navbar
        onOpenLogModal={handleOpenCreateModal}
        onSeedData={handleSeedData}
        isSeeding={isSeeding}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* KPI Stats Cards */}
        <DashboardStats stats={stats} isLoading={isLoading} />

        {/* Charts and Visual Analytics */}
        <FrequencyCharts stats={stats} />

        {/* Recent Headache Entries Feed */}
        <EntriesFeed
          entries={entries}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteEntry}
          onOpenLogModal={handleOpenCreateModal}
          onSeedData={handleSeedData}
          isSeeding={isSeeding}
        />
      </main>

      {/* Mobile Floating Action Button (1-Tap Logging) */}
      <QuickLogFab onClick={handleOpenCreateModal} />

      {/* Create / Edit Modal (keyed to reset form state declaratively without useEffect) */}
      <HeadacheLogModal
        key={editingEntry?.id ?? (isLogModalOpen ? 'open' : 'closed')}
        isOpen={isLogModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitEntry}
        initialEntry={editingEntry}
      />
    </div>
  );
}
