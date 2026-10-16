import React from 'react';
import { getSeverityColors, getSeverityLabel } from '@/frontend/utils/formatters';

export interface SliderProps {
  value: number; // 1 to 10
  onChange: (value: number) => void;
  label?: string;
}

export function Slider({ value, onChange, label = 'Pain Severity' }: SliderProps) {
  const colors = getSeverityColors(value);
  const severityLabel = getSeverityLabel(value);

  const ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="w-full space-y-3">
      {/* Header with Current Rating and Live Badge */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors duration-200 ${colors.badgeBg} ${colors.badgeBorder}`}
          >
            <span className={`w-2 h-2 rounded-full ${colors.dotColor}`} />
            {severityLabel} ({value}/10)
          </span>
        </div>
      </div>

      {/* Touch-Friendly Range Track */}
      <div className="relative pt-1 pb-2">
        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600 transition-all focus:outline-none"
          style={{
            accentColor: colors.hex,
          }}
          aria-label="Pain severity scale from 1 to 10"
        />

        {/* 1-10 Tick Selector for 1-Tap Mobile Rating */}
        <div className="flex justify-between mt-2 gap-1">
          {ticks.map((num) => {
            const isSelected = num === value;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onChange(num)}
                className={`w-7 h-8 sm:w-8 sm:h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'text-white shadow-md scale-110'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                style={isSelected ? { backgroundColor: colors.hex } : undefined}
                aria-label={`Select pain level ${num}`}
              >
                {num}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
