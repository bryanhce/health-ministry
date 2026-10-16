import { Between, Repository } from 'typeorm';
import { HeadacheEntry, HeadacheEntrySchema } from '@/backend/headache/entity/HeadacheEntry';
import { IHeadacheRepository } from '@/backend/headache/repository/IHeadacheRepository';
import { getDataSource } from '@/backend/config/dataSource';

export class TypeORMHeadacheRepository implements IHeadacheRepository {
  private repositoryPromise: Promise<Repository<HeadacheEntry>>;

  constructor(repository?: Repository<HeadacheEntry>) {
    if (repository) {
      this.repositoryPromise = Promise.resolve(repository);
    } else {
      this.repositoryPromise = getDataSource().then((ds) =>
        ds.getRepository<HeadacheEntry>(HeadacheEntrySchema),
      );
    }
  }

  private async getRepo(): Promise<Repository<HeadacheEntry>> {
    return this.repositoryPromise;
  }

  async findAll(): Promise<HeadacheEntry[]> {
    const repo = await this.getRepo();
    return repo.find({
      order: {
        date: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async findPaginated(limit: number, offset: number): Promise<{ entries: HeadacheEntry[]; total: number }> {
    const repo = await this.getRepo();
    const [entries, total] = await repo.findAndCount({
      order: {
        date: 'DESC',
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    });
    return { entries, total };
  }

  async findById(id: string): Promise<HeadacheEntry | null> {
    const repo = await this.getRepo();
    return repo.findOne({ where: { id } });
  }

  async findByDateRange(startDate: string, endDate: string): Promise<HeadacheEntry[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: {
        date: 'ASC',
      },
    });
  }

  async create(data: Omit<Partial<HeadacheEntry>, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeadacheEntry> {
    const repo = await this.getRepo();
    const entry = repo.create({
      id: crypto.randomUUID(),
      ...data,
    });
    return repo.save(entry);
  }

  async update(id: string, data: Partial<HeadacheEntry>): Promise<HeadacheEntry | null> {
    const repo = await this.getRepo();
    const existing = await repo.findOne({ where: { id } });
    if (!existing) {
      return null;
    }

    repo.merge(existing, data);
    return repo.save(existing);
  }

  async delete(id: string): Promise<boolean> {
    const repo = await this.getRepo();
    const result = await repo.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }

  async saveMany(entries: Omit<Partial<HeadacheEntry>, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<HeadacheEntry[]> {
    const repo = await this.getRepo();
    const withIds = entries.map((item) => ({
      id: crypto.randomUUID(),
      ...item,
    }));
    const created = repo.create(withIds);
    return repo.save(created);
  }

  async count(): Promise<number> {
    const repo = await this.getRepo();
    return repo.count();
  }

  async clear(): Promise<void> {
    const repo = await this.getRepo();
    await repo.clear();
  }
}
