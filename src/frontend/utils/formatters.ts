import {
  PainSeverityCategory,
  PAIN_SEVERITY_LEVELS,
} from '@/frontend/domain/headache.types';

export function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return '0m';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

export function getSeverityCategory(severity: number): PainSeverityCategory {
  if (severity <= PAIN_SEVERITY_LEVELS.MILD_MAX) {
    return 'MILD';
  }
  if (severity <= PAIN_SEVERITY_LEVELS.MODERATE_MAX) {
    return 'MODERATE';
  }
  if (severity <= PAIN_SEVERITY_LEVELS.SEVERE_MAX) {
    return 'SEVERE';
  }
  return 'DEBILITATING';
}

export function getSeverityLabel(severity: number): string {
  switch (getSeverityCategory(severity)) {
    case 'MILD':
      return 'Mild';
    case 'MODERATE':
      return 'Moderate';
    case 'SEVERE':
      return 'Severe';
    case 'DEBILITATING':
      return 'Debilitating';
  }
}

export interface SeverityColorConfig {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  hex: string;
}

export function getSeverityColors(severity: number): SeverityColorConfig {
  const category = getSeverityCategory(severity);
  switch (category) {
    case 'MILD':
      return {
        badgeBg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
        badgeText: 'text-emerald-700 dark:text-emerald-400',
        badgeBorder: 'border-emerald-200 dark:border-emerald-800',
        dotColor: 'bg-emerald-500',
        hex: '#10b981',
      };
    case 'MODERATE':
      return {
        badgeBg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
        badgeText: 'text-amber-700 dark:text-amber-400',
        badgeBorder: 'border-amber-200 dark:border-amber-800',
        dotColor: 'bg-amber-500',
        hex: '#f59e0b',
      };
    case 'SEVERE':
      return {
        badgeBg: 'bg-orange-50 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300',
        badgeText: 'text-orange-700 dark:text-orange-400',
        badgeBorder: 'border-orange-200 dark:border-orange-800',
        dotColor: 'bg-orange-500',
        hex: '#f97316',
      };
    case 'DEBILITATING':
      return {
        badgeBg: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300',
        badgeText: 'text-rose-700 dark:text-rose-400',
        badgeBorder: 'border-rose-200 dark:border-rose-800',
        dotColor: 'bg-rose-600',
        hex: '#e11d48',
      };
  }
}
