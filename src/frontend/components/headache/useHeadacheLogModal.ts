import { useState } from 'react';
import { CreateHeadacheInput, HeadacheEntryDTO } from '@/frontend/domain/headache.types';
import { getTodayLocalString } from '@/frontend/utils/dateUtils';

export interface UseHeadacheLogModalProps {
  initialEntry?: HeadacheEntryDTO | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHeadacheInput) => Promise<void>;
}

export function useHeadacheLogModal({
  initialEntry,
  onClose,
  onSubmit,
}: UseHeadacheLogModalProps) {
  const [date, setDate] = useState<string>(
    initialEntry ? initialEntry.date : getTodayLocalString(),
  );
  const [painSeverity, setPainSeverity] = useState<number>(
    initialEntry ? initialEntry.painSeverity : 5,
  );
  const [durationMinutes, setDurationMinutes] = useState<number>(
    initialEntry ? initialEntry.durationMinutes : 60,
  );
  const [notes, setNotes] = useState<string>(
    initialEntry?.notes ?? '',
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const durationHours = Math.floor(durationMinutes / 60);
  const durationRemainingMinutes = durationMinutes % 60;

  const handleHoursChange = (hours: number) => {
    const validHours = Math.max(0, isNaN(hours) ? 0 : hours);
    setDurationMinutes(validHours * 60 + durationRemainingMinutes);
  };

  const handleMinutesChange = (mins: number) => {
    const validMins = Math.max(0, Math.min(59, isNaN(mins) ? 0 : mins));
    setDurationMinutes(durationHours * 60 + validMins);
  };

  const addDurationMinutes = (added: number) => {
    setDurationMinutes((prev) => Math.max(1, prev + added));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!date) {
      setErrorMessage('Please select a date');
      return;
    }

    if (durationMinutes <= 0) {
      setErrorMessage('Duration must be greater than 0 minutes');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        date,
        painSeverity,
        durationMinutes,
        notes: notes.trim().length > 0 ? notes.trim() : null,
      });
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save entry';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    date,
    setDate,
    painSeverity,
    setPainSeverity,
    durationMinutes,
    durationHours,
    durationRemainingMinutes,
    handleHoursChange,
    handleMinutesChange,
    addDurationMinutes,
    notes,
    setNotes,
    isSubmitting,
    errorMessage,
    handleSubmit,
    isEditing: Boolean(initialEntry),
  };
}
