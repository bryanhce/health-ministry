import { HeadacheEntry } from '@/backend/headache/entity/HeadacheEntry';

export interface IHeadacheRepository {
  findAll(): Promise<HeadacheEntry[]>;
  findPaginated(limit: number, offset: number): Promise<{ entries: HeadacheEntry[]; total: number }>;
  findById(id: string): Promise<HeadacheEntry | null>;
  findByDateRange(startDate: string, endDate: string): Promise<HeadacheEntry[]>;
  create(data: Omit<Partial<HeadacheEntry>, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeadacheEntry>;
  update(id: string, data: Partial<HeadacheEntry>): Promise<HeadacheEntry | null>;
  delete(id: string): Promise<boolean>;
  saveMany(entries: Omit<Partial<HeadacheEntry>, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<HeadacheEntry[]>;
  count(): Promise<number>;
  clear(): Promise<void>;
}
