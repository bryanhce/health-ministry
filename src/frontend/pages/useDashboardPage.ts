import { useState } from 'react';
import { useHeadaches } from '@/frontend/hooks/useHeadaches';
import { useDashboardStats } from '@/frontend/hooks/useDashboardStats';
import { CreateHeadacheInput, HeadacheEntryDTO } from '@/frontend/domain/headache.types';

export function useDashboardPage() {
  const {
    entries,
    isLoading: isLoadingEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    seedEntries,
    isSeeding,
  } = useHeadaches();

  const {
    stats,
    isLoading: isLoadingStats,
  } = useDashboardStats();

  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HeadacheEntryDTO | null>(null);

  const handleOpenCreateModal = () => {
    setEditingEntry(null);
    setIsLogModalOpen(true);
  };

  const handleOpenEditModal = (entry: HeadacheEntryDTO) => {
    setEditingEntry(entry);
    setIsLogModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogModalOpen(false);
    setEditingEntry(null);
  };

  const handleSubmitEntry = async (data: CreateHeadacheInput) => {
    if (editingEntry) {
      await updateEntry({ id: editingEntry.id, input: data });
    } else {
      await createEntry(data);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this headache entry?');
    if (!confirmed) return;
    await deleteEntry(id);
  };

  const handleSeedData = async () => {
    await seedEntries();
  };

  return {
    entries,
    stats,
    isLoading: isLoadingEntries || isLoadingStats,
    isLogModalOpen,
    editingEntry,
    isSeeding,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSubmitEntry,
    handleDeleteEntry,
    handleSeedData,
  };
}
