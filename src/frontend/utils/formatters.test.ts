import { describe, it, expect } from 'vitest';
import {
  formatDuration,
  getSeverityCategory,
  getSeverityLabel,
  getSeverityColors,
} from '@/frontend/utils/formatters';

describe('formatters', () => {
  it('given duration in minutes, when formatDuration is called, then returns formatted hours and minutes', () => {
    expect(formatDuration(0)).toBe('0m');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(150)).toBe('2h 30m');
    expect(formatDuration(360)).toBe('6h');
  });

  it('given severity score 1-3, when getSeverityCategory is called, then returns MILD category and label', () => {
    expect(getSeverityCategory(1)).toBe('MILD');
    expect(getSeverityCategory(3)).toBe('MILD');
    expect(getSeverityLabel(2)).toBe('Mild');
    expect(getSeverityColors(2).hex).toBe('#10b981');
  });

  it('given severity score 4-6, when getSeverityCategory is called, then returns MODERATE category and label', () => {
    expect(getSeverityCategory(4)).toBe('MODERATE');
    expect(getSeverityCategory(6)).toBe('MODERATE');
    expect(getSeverityLabel(5)).toBe('Moderate');
    expect(getSeverityColors(5).hex).toBe('#f59e0b');
  });

  it('given severity score 7-8, when getSeverityCategory is called, then returns SEVERE category and label', () => {
    expect(getSeverityCategory(7)).toBe('SEVERE');
    expect(getSeverityCategory(8)).toBe('SEVERE');
    expect(getSeverityLabel(8)).toBe('Severe');
    expect(getSeverityColors(8).hex).toBe('#f97316');
  });

  it('given severity score 9-10, when getSeverityCategory is called, then returns DEBILITATING category and label', () => {
    expect(getSeverityCategory(9)).toBe('DEBILITATING');
    expect(getSeverityCategory(10)).toBe('DEBILITATING');
    expect(getSeverityLabel(10)).toBe('Debilitating');
    expect(getSeverityColors(10).hex).toBe('#e11d48');
  });
});
