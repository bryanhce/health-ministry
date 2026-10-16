import { describe, it, expect, beforeEach } from 'vitest';
import { DashboardService } from '@/backend/dashboard/service/dashboard.service';
import { IHeadacheRepository } from '@/backend/headache/repository/IHeadacheRepository';
import { HeadacheEntry } from '@/backend/headache/entity/HeadacheEntry';

class MockHeadacheRepository implements IHeadacheRepository {
  public entries: HeadacheEntry[] = [];

  async findAll(): Promise<HeadacheEntry[]> {
    return [...this.entries];
  }

  async findById(id: string): Promise<HeadacheEntry | null> {
    return this.entries.find((e) => e.id === id) ?? null;
  }

  async findByDateRange(startDate: string, endDate: string): Promise<HeadacheEntry[]> {
    return this.entries.filter((e) => e.date >= startDate && e.date <= endDate);
  }

  async create(data: Omit<Partial<HeadacheEntry>, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeadacheEntry> {
    const entry: HeadacheEntry = {
      id: crypto.randomUUID(),
      date: data.date!,
      painSeverity: data.painSeverity!,
      durationMinutes: data.durationMinutes!,
      notes: data.notes ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.entries.push(entry);
    return entry;
  }

  async update(): Promise<HeadacheEntry | null> {
    return null;
  }

  async delete(): Promise<boolean> {
    return true;
  }

  async saveMany(entries: Omit<Partial<HeadacheEntry>, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<HeadacheEntry[]> {
    const created: HeadacheEntry[] = [];
    for (const data of entries) {
      const entry = await this.create(data);
      created.push(entry);
    }
    return created;
  }

  async count(): Promise<number> {
    return this.entries.length;
  }

  async clear(): Promise<void> {
    this.entries = [];
  }
}

describe('DashboardService', () => {
  let mockRepo: MockHeadacheRepository;
  let service: DashboardService;

  beforeEach(() => {
    mockRepo = new MockHeadacheRepository();
    service = new DashboardService(mockRepo);
  });

  it('given empty database, when getDashboardStats is called, then returns zeroed stats', async () => {
    const stats = await service.getDashboardStats();
    expect(stats.totalEntriesInWindow).toBe(0);
    expect(stats.averagePainSeverity).toBe(0);
    expect(stats.averageDurationMinutes).toBe(0);
    expect(stats.monthlyFrequency).toBe(0);
    expect(stats.weeklyFrequency).toBe(0);
  });

  it('given entries within 90-day window, when getDashboardStats is called, then calculates accurate 3-month averages and frequencies', async () => {
    const today = new Date();
    const d1 = new Date(today);
    d1.setDate(today.getDate() - 5);
    const d2 = new Date(today);
    d2.setDate(today.getDate() - 20);

    await mockRepo.create({
      date: d1.toISOString().split('T')[0],
      painSeverity: 4,
      durationMinutes: 60,
    });
    await mockRepo.create({
      date: d2.toISOString().split('T')[0],
      painSeverity: 8,
      durationMinutes: 180,
    });

    const stats = await service.getDashboardStats();
    expect(stats.totalEntriesInWindow).toBe(2);
    // (4 + 8) / 2 = 6.0
    expect(stats.averagePainSeverity).toBe(6);
    // (60 + 180) / 2 = 120
    expect(stats.averageDurationMinutes).toBe(120);
    expect(stats.severityBreakdown.moderate).toBe(1); // 4
    expect(stats.severityBreakdown.severe).toBe(1); // 8
    expect(stats.monthlyFrequency).toBeGreaterThan(0);
    expect(stats.weeklyFrequency).toBeGreaterThan(0);
  });

  it('given entries older than 90 days, when getDashboardStats is called, then excludes them from 3-month window', async () => {
    const today = new Date();
    const recentDate = new Date(today);
    recentDate.setDate(today.getDate() - 10);
    const oldDate = new Date(today);
    oldDate.setDate(today.getDate() - 120);

    await mockRepo.create({
      date: recentDate.toISOString().split('T')[0],
      painSeverity: 6,
      durationMinutes: 100,
    });
    await mockRepo.create({
      date: oldDate.toISOString().split('T')[0],
      painSeverity: 10,
      durationMinutes: 600,
    });

    const stats = await service.getDashboardStats();
    expect(stats.totalEntriesInWindow).toBe(1);
    expect(stats.averagePainSeverity).toBe(6);
  });
});
