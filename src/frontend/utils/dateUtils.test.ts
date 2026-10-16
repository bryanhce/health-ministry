import { describe, it, expect } from 'vitest';
import {
  getTodayLocalString,
  formatDisplayDate,
  formatRelativeDate,
} from '@/frontend/utils/dateUtils';

describe('dateUtils', () => {
  it('given current execution context, when getTodayLocalString is called, then returns valid YYYY-MM-DD date format', () => {
    const today = getTodayLocalString();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('given date string YYYY-MM-DD, when formatDisplayDate is called, then returns readable localized date', () => {
    const formatted = formatDisplayDate('2026-10-15');
    expect(formatted).toContain('Oct');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2026');
  });

  it('given today date string, when formatRelativeDate is called, then returns Today', () => {
    const today = getTodayLocalString();
    expect(formatRelativeDate(today)).toBe('Today');
  });
});
