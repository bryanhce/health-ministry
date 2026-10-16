import React from 'react';
import { getSeverityColors, getSeverityLabel } from '@/frontend/utils/formatters';

export interface PainBadgeProps {
  severity: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function PainBadge({ severity, size = 'md', showLabel = true }: PainBadgeProps) {
  const colors = getSeverityColors(severity);
  const label = getSeverityLabel(severity);

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium ${colors.badgeBg} ${colors.badgeBorder} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dotColor}`} />
      <span>{severity}/10</span>
      {showLabel && <span className="opacity-90 font-normal">· {label}</span>}
    </span>
  );
}
