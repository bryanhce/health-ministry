import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHeadacheLogModal } from '@/frontend/components/headache/useHeadacheLogModal';
import { HeadacheEntryDTO } from '@/frontend/domain/headache.types';

describe('useHeadacheLogModal', () => {
  it('given no initial entry, when initialized, then defaults date to today and severity to 5', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useHeadacheLogModal({
        isOpen: true,
        onClose,
        onSubmit,
      }),
    );

    expect(result.current.painSeverity).toBe(5);
    expect(result.current.durationMinutes).toBe(60);
    expect(result.current.isEditing).toBe(false);
  });

  it('given initial entry, when initialized, then populates fields from entry', () => {
    const entry: HeadacheEntryDTO = {
      id: 'uuid-123',
      date: '2026-10-10',
      painSeverity: 8,
      durationMinutes: 180,
      notes: 'Prescribed migraine meds taken',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const onClose = vi.fn();
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useHeadacheLogModal({
        initialEntry: entry,
        isOpen: true,
        onClose,
        onSubmit,
      }),
    );

    expect(result.current.date).toBe('2026-10-10');
    expect(result.current.painSeverity).toBe(8);
    expect(result.current.durationMinutes).toBe(180);
    expect(result.current.notes).toBe('Prescribed migraine meds taken');
    expect(result.current.isEditing).toBe(true);
  });

  it('given preset duration addition, when addDurationMinutes is invoked, then increases total minutes', () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();

    const { result } = renderHook(() =>
      useHeadacheLogModal({
        isOpen: true,
        onClose,
        onSubmit,
      }),
    );

    act(() => {
      result.current.addDurationMinutes(60);
    });

    expect(result.current.durationMinutes).toBe(120);
    expect(result.current.durationHours).toBe(2);
    expect(result.current.durationRemainingMinutes).toBe(0);
  });

  it('given valid form inputs, when handleSubmit is triggered, then invokes onSubmit and closes modal', async () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    const { result } = renderHook(() =>
      useHeadacheLogModal({
        isOpen: true,
        onClose,
        onSubmit,
      }),
    );

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent;

    await act(async () => {
      await result.current.handleSubmit(mockEvent);
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
