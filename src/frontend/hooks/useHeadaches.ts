import { useMemo } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEntry,
  deleteEntry,
  fetchEntries,
  seedEntries,
  updateEntry,
} from '@/frontend/api/headacheApi';
import { CreateHeadacheInput, UpdateHeadacheInput } from '@/frontend/domain/headache.types';
import { DASHBOARD_QUERY_KEYS } from '@/frontend/hooks/useDashboardStats';

export const HEADACHE_PAGINATION_LIMIT = 10;

export const HEADACHE_QUERY_KEYS = {
  all: ['headaches'] as const,
  infinite: () => [...HEADACHE_QUERY_KEYS.all, 'infinite'] as const,
  lists: () => [...HEADACHE_QUERY_KEYS.all, 'list'] as const,
  detail: (id: string) => [...HEADACHE_QUERY_KEYS.all, 'detail', id] as const,
} as const;

export function useHeadaches() {
  const queryClient = useQueryClient();

  const infiniteQuery = useInfiniteQuery({
    queryKey: HEADACHE_QUERY_KEYS.infinite(),
    queryFn: ({ pageParam = 0 }) =>
      fetchEntries({ limit: HEADACHE_PAGINATION_LIMIT, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
  });

  const entries = useMemo(() => {
    return infiniteQuery.data?.pages.flatMap((page) => page.data) ?? [];
  }, [infiniteQuery.data]);

  const totalCount = infiniteQuery.data?.pages[0]?.pagination.total ?? 0;
  const hasMore = !!infiniteQuery.hasNextPage;
  const isFetchingNextPage = infiniteQuery.isFetchingNextPage;

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
    entries,
    totalCount,
    hasMore,
    isFetchingNextPage,
    loadMore: () => infiniteQuery.fetchNextPage(),
    isLoading: infiniteQuery.isLoading,
    isError: infiniteQuery.isError,
    error: infiniteQuery.error,
    refetch: infiniteQuery.refetch,
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
