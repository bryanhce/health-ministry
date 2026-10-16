export type PainSeverityCategory = 'MILD' | 'MODERATE' | 'SEVERE' | 'DEBILITATING';

export interface HeadacheEntryDTO {
  id: string;
  date: string; // YYYY-MM-DD
  painSeverity: number; // 1-10
  durationMinutes: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMetadata {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface PaginatedHeadacheEntriesResponse {
  data: HeadacheEntryDTO[];
  pagination: PaginationMetadata;
}

export interface CreateHeadacheInput {
  date: string;
  painSeverity: number;
  durationMinutes: number;
  notes?: string | null;
}

export interface UpdateHeadacheInput {
  date?: string;
  painSeverity?: number;
  durationMinutes?: number;
  notes?: string | null;
}

export const PAIN_SEVERITY_LEVELS = {
  MILD_MIN: 1,
  MILD_MAX: 3,
  MODERATE_MIN: 4,
  MODERATE_MAX: 6,
  SEVERE_MIN: 7,
  SEVERE_MAX: 8,
  DEBILITATING_MIN: 9,
  DEBILITATING_MAX: 10,
} as const;

export const DURATION_PRESETS = [
  { label: '+30m', minutes: 30 },
  { label: '+1h', minutes: 60 },
  { label: '+2h', minutes: 120 },
  { label: '+4h', minutes: 240 },
] as const;
