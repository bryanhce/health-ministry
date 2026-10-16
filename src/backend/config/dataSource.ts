import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { HeadacheEntrySchema } from '@/backend/headache/entity/HeadacheEntry';
import { newDb } from 'pg-mem';

declare global {
  // eslint-disable-next-line no-var
  var __typeorm_datasource__: DataSource | undefined;
  // eslint-disable-next-line no-var
  var __init_promise__: Promise<DataSource> | undefined;
}

async function createInMemoryDataSource(): Promise<DataSource> {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 15.0 (pg-mem)',
  });
  db.public.registerFunction({
    name: 'current_database',
    implementation: () => 'health_ministry',
  });
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    implementation: () => crypto.randomUUID(),
  });

  const ds = await db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [HeadacheEntrySchema],
  });

  await ds.initialize();
  await ds.synchronize();
  return ds;
}

function createPostgresDataSource(url: string): DataSource {
  return new DataSource({
    type: 'postgres',
    url,
    entities: [HeadacheEntrySchema],
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
  });
}

export async function getDataSource(): Promise<DataSource> {
  if (globalThis.__typeorm_datasource__?.isInitialized) {
    return globalThis.__typeorm_datasource__;
  }

  if (globalThis.__init_promise__) {
    return globalThis.__init_promise__;
  }

  globalThis.__init_promise__ = (async () => {
    const databaseUrl = process.env.DATABASE_URL;

    if (databaseUrl && databaseUrl.trim().length > 0) {
      try {
        const ds = createPostgresDataSource(databaseUrl);
        await ds.initialize();
        globalThis.__typeorm_datasource__ = ds;
        return ds;
      } catch (error) {
        console.warn('Failed to connect to external PostgreSQL, falling back to in-memory PostgreSQL:', error);
      }
    }

    const inMemoryDs = await createInMemoryDataSource();
    globalThis.__typeorm_datasource__ = inMemoryDs;
    return inMemoryDs;
  })();

  try {
    return await globalThis.__init_promise__;
  } finally {
    globalThis.__init_promise__ = undefined;
  }
}
