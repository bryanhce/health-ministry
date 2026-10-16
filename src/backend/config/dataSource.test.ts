import { describe, it, expect } from 'vitest';
import { getDataSource } from '@/backend/config/dataSource';
import { HeadacheEntry } from '@/backend/headache/entity/HeadacheEntry';

describe('given database configuration', () => {
  it('when getDataSource is called without external DATABASE_URL, then returns initialized in-memory data source', async () => {
    const ds = await getDataSource();
    expect(ds.isInitialized).toBe(true);

    const repo = ds.getRepository(HeadacheEntry);
    const count = await repo.count();
    expect(typeof count).toBe('number');
  });
});
