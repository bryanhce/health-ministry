import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createEntry,
  deleteEntry,
  fetchEntries,
  seedEntries,
  updateEntry,
} from '@/frontend/api/headacheApi';
import { CreateHeadacheInput, UpdateHeadacheInput } from '@/frontend/domain/headache.types';
import { DASHBOARD_QUERY_KEYS } from '@/frontend/hooks/useDashboardStats';

export const HEADACHE_QUERY_KEYS = {
  all: ['headaches'] as const,
  lists: () => [...HEADACHE_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...HEADACHE_QUERY_KEYS.all, 'detail', id] as const,
} as const;

export function useHeadaches() {
  const queryClient = useQueryClient();

  const entriesQuery = useQuery({
    queryKey: HEADACHE_QUERY_KEYS.lists(),
    queryFn: fetchEntries,
  });

  const invalidateData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: HEADACHE_QUERY_KEYS.all }),
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEYS.all }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: (input: CreateHeadacheInput) => createEntry(input),
    onSuccess: invalidateData,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateHeadacheInput }) =>
      updateEntry(id, input),
    onSuccess: invalidateData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: invalidateData,
  });

  const seedMutation = useMutation({
    mutationFn: seedEntries,
    onSuccess: invalidateData,
  });

  return {
    entries: entriesQuery.data ?? [],
    isLoading: entriesQuery.isLoading,
    isError: entriesQuery.isError,
    error: entriesQuery.error,
    refetch: entriesQuery.refetch,
    createEntry: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateEntry: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteEntry: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    seedEntries: seedMutation.mutateAsync,
    isSeeding: seedMutation.isPending,
  };
}
