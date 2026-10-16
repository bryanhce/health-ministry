import React from 'react';
import { Modal } from '@/frontend/components/ui/Modal';
import { Button } from '@/frontend/components/ui/Button';
import { Input, Textarea } from '@/frontend/components/ui/Input';
import { Slider } from '@/frontend/components/ui/Slider';
import {
  CreateHeadacheInput,
  DURATION_PRESETS,
  HeadacheEntryDTO,
} from '@/frontend/domain/headache.types';
import { useHeadacheLogModal } from '@/frontend/components/headache/useHeadacheLogModal';
import { Clock } from 'lucide-react';

export interface HeadacheLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHeadacheInput) => Promise<void>;
  initialEntry?: HeadacheEntryDTO | null;
}

export function HeadacheLogModal(props: HeadacheLogModalProps) {
  const {
    date,
    setDate,
    painSeverity,
    setPainSeverity,
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
    isEditing,
  } = useHeadacheLogModal(props);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={isEditing ? 'Edit Headache Entry' : 'Log Headache Episode'}
      description={
        isEditing
          ? 'Update the details of your previous headache episode.'
          : 'Record your pain severity, duration, and any notable triggers.'
      }
      footer={
        <>
          <Button variant="ghost" type="button" onClick={props.onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="headache-log-form"
            isLoading={isSubmitting}
            className="min-w-[100px]"
          >
            {isEditing ? 'Update Entry' : 'Save Entry'}
          </Button>
        </>
      }
    >
      <form id="headache-log-form" onSubmit={handleSubmit} className="space-y-5">
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Date Input */}
        <Input
          type="date"
          label="Date of Episode"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="cursor-pointer [color-scheme:dark] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:[filter:brightness(0)_invert(1)]"
          required
        />

        {/* Pain Severity Slider (1-10) */}
        <div className="pt-2">
          <Slider value={painSeverity} onChange={setPainSeverity} />
        </div>

        {/* Duration Picker & Quick Presets */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              Duration
            </label>
            <span className="text-xs text-slate-500 font-medium">
              {durationHours}h {durationRemainingMinutes}m total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                type="number"
                min="0"
                max="168"
                label="Hours"
                value={durationHours}
                onChange={(e) => handleHoursChange(parseInt(e.target.value, 10))}
              />
            </div>
            <div>
              <Input
                type="number"
                min="0"
                max="59"
                label="Minutes"
                value={durationRemainingMinutes}
                onChange={(e) => handleMinutesChange(parseInt(e.target.value, 10))}
              />
            </div>
          </div>

          {/* Duration Quick Presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-medium mr-1">Quick Add:</span>
            {DURATION_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => addDurationMinutes(preset.minutes)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes / Triggers / Symptoms */}
        <Textarea
          label="Notes & Triggers (Optional)"
          placeholder="e.g. Visual aura, sensitivity to light, neck stiffness, skipped coffee, screen glare..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </form>
    </Modal>
  );
}
