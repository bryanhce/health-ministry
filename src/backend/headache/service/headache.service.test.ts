import { describe, it, expect, beforeEach } from 'vitest';
import { HeadacheService } from '@/backend/headache/service/headache.service';
import { IHeadacheRepository } from '@/backend/headache/repository/IHeadacheRepository';
import { HeadacheEntry } from '@/backend/headache/entity/HeadacheEntry';
import { NotFoundError, ValidationError } from '@/backend/shared/errors/AppError';

class MockHeadacheRepository implements IHeadacheRepository {
  private entries: HeadacheEntry[] = [];

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
    this.entries.unshift(entry);
    return entry;
  }

  async update(id: string, data: Partial<HeadacheEntry>): Promise<HeadacheEntry | null> {
    const index = this.entries.findIndex((e) => e.id === id);
    if (index === -1) return null;

    this.entries[index] = {
      ...this.entries[index],
      ...data,
      updatedAt: new Date(),
    };
    return this.entries[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.entries.findIndex((e) => e.id === id);
    if (index === -1) return false;
    this.entries.splice(index, 1);
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

describe('HeadacheService', () => {
  let mockRepo: MockHeadacheRepository;
  let service: HeadacheService;

  beforeEach(() => {
    mockRepo = new MockHeadacheRepository();
    service = new HeadacheService(mockRepo);
  });

  it('given valid input data, when createEntry is called, then creates and returns new headache entry', async () => {
    const result = await service.createEntry({
      date: '2026-10-16',
      painSeverity: 7,
      durationMinutes: 120,
      notes: 'Throbbing migraine with light sensitivity',
    });

    expect(result.id).toBeDefined();
    expect(result.date).toBe('2026-10-16');
    expect(result.painSeverity).toBe(7);
    expect(result.durationMinutes).toBe(120);
    expect(result.notes).toBe('Throbbing migraine with light sensitivity');
  });

  it('given missing date, when createEntry is called, then throws ValidationError', async () => {
    await expect(
      service.createEntry({
        date: '',
        painSeverity: 5,
        durationMinutes: 60,
      }),
    ).rejects.toThrow(ValidationError);
  });

  it('given an existing entry id, when getEntryById is called, then returns the correct entry', async () => {
    const created = await service.createEntry({
      date: '2026-10-15',
      painSeverity: 4,
      durationMinutes: 45,
    });

    const found = await service.getEntryById(created.id);
    expect(found.id).toBe(created.id);
    expect(found.painSeverity).toBe(4);
  });

  it('given a non-existent entry id, when getEntryById is called, then throws NotFoundError', async () => {
    await expect(service.getEntryById('non-existent-id')).rejects.toThrow(NotFoundError);
  });

  it('given existing entry, when updateEntry is called, then updates the entry fields', async () => {
    const created = await service.createEntry({
      date: '2026-10-14',
      painSeverity: 5,
      durationMinutes: 90,
      notes: 'Initial note',
    });

    const updated = await service.updateEntry(created.id, {
      painSeverity: 8,
      notes: 'Worsened over time',
    });

    expect(updated.painSeverity).toBe(8);
    expect(updated.notes).toBe('Worsened over time');
    expect(updated.durationMinutes).toBe(90);
  });

  it('given existing entry, when deleteEntry is called, then removes the entry', async () => {
    const created = await service.createEntry({
      date: '2026-10-14',
      painSeverity: 6,
      durationMinutes: 60,
    });

    await service.deleteEntry(created.id);
    await expect(service.getEntryById(created.id)).rejects.toThrow(NotFoundError);
  });

  it('given seed request, when seedEntries is called, then populates realistic sample data', async () => {
    const result = await service.seedEntries();
    expect(result.count).toBeGreaterThan(10);

    const all = await service.getAllEntries();
    expect(all.length).toBe(result.count);
  });
});
