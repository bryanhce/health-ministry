import {
  DynamoDBClient,
  DescribeTableCommand,
  CreateTableCommand,
} from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  ScanCommand,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { HeadacheEntry } from '@/backend/headache/entity/HeadacheEntry';
import { IHeadacheRepository } from '@/backend/headache/repository/IHeadacheRepository';

const REPOSITORY_CONSTANTS = {
  DEFAULT_TABLE_NAME: 'headache_entries',
  DEFAULT_REGION: 'us-east-1',
  DEFAULT_CREDENTIAL_KEY: 'dummy',
  BATCH_CHUNK_SIZE: 25,
  POLL_INTERVAL_MS: 500,
  MAX_INIT_RETRIES: 20,
} as const;

interface DynamoDBHeadacheRecord {
  id: string;
  date: string;
  painSeverity: number;
  durationMinutes: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export class DynamoDBHeadacheRepository implements IHeadacheRepository {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private tableName: string;
  private initPromise: Promise<void> | null = null;

  constructor() {
    const endpoint = process.env.DYNAMODB_ENDPOINT;
    if (!endpoint || endpoint.trim().length === 0) {
      throw new Error(
        'Fatal Startup Error: DYNAMODB_ENDPOINT environment variable must be provided. DynamoDB connection failed on startup.',
      );
    }

    this.tableName = process.env.DYNAMODB_TABLE_NAME || REPOSITORY_CONSTANTS.DEFAULT_TABLE_NAME;

    this.client = new DynamoDBClient({
      endpoint,
      region: process.env.AWS_REGION || REPOSITORY_CONSTANTS.DEFAULT_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || REPOSITORY_CONSTANTS.DEFAULT_CREDENTIAL_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || REPOSITORY_CONSTANTS.DEFAULT_CREDENTIAL_KEY,
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client, {
      marshallOptions: {
        removeUndefinedValues: true,
      },
    });
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = this.ensureTable();
    }
    await this.initPromise;
  }

  private async ensureTable(): Promise<void> {
    try {
      await this.client.send(
        new DescribeTableCommand({
          TableName: this.tableName,
        }),
      );
    } catch (err: unknown) {
      const isNotFound =
        err instanceof Error &&
        (err.name === 'ResourceNotFoundException' ||
          err.message.includes('Cannot do operations on a non-existent table') ||
          err.message.includes('ResourceNotFoundException'));

      if (!isNotFound) {
        throw err;
      }

      await this.client.send(
        new CreateTableCommand({
          TableName: this.tableName,
          KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
          AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
          BillingMode: 'PAY_PER_REQUEST',
        }),
      );

      let isActive = false;
      let retries = 0;
      while (!isActive && retries < REPOSITORY_CONSTANTS.MAX_INIT_RETRIES) {
        const desc = await this.client.send(
          new DescribeTableCommand({
            TableName: this.tableName,
          }),
        );
        if (desc.Table?.TableStatus === 'ACTIVE') {
          isActive = true;
          break;
        }
        retries += 1;
        await new Promise((resolve) => setTimeout(resolve, REPOSITORY_CONSTANTS.POLL_INTERVAL_MS));
      }
    }
  }

  private toEntity(item: DynamoDBHeadacheRecord): HeadacheEntry {
    return {
      id: item.id,
      date: item.date,
      painSeverity: Number(item.painSeverity),
      durationMinutes: Number(item.durationMinutes),
      notes: item.notes ?? null,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    };
  }

  private toItem(entry: HeadacheEntry): DynamoDBHeadacheRecord {
    return {
      id: entry.id,
      date: entry.date,
      painSeverity: entry.painSeverity,
      durationMinutes: entry.durationMinutes,
      notes: entry.notes ?? null,
      createdAt: entry.createdAt instanceof Date ? entry.createdAt.toISOString() : new Date(entry.createdAt).toISOString(),
      updatedAt: entry.updatedAt instanceof Date ? entry.updatedAt.toISOString() : new Date(entry.updatedAt).toISOString(),
    };
  }

  private async scanAllRecords(): Promise<DynamoDBHeadacheRecord[]> {
    let items: DynamoDBHeadacheRecord[] = [];
    let exclusiveStartKey: Record<string, unknown> | undefined;

    do {
      const response = await this.docClient.send(
        new ScanCommand({
          TableName: this.tableName,
          ExclusiveStartKey: exclusiveStartKey,
        }),
      );
      if (response.Items) {
        items = items.concat(response.Items as DynamoDBHeadacheRecord[]);
      }
      exclusiveStartKey = response.LastEvaluatedKey as Record<string, unknown> | undefined;
    } while (exclusiveStartKey);

    return items;
  }

  async findAll(): Promise<HeadacheEntry[]> {
    await this.ensureInitialized();
    const records = await this.scanAllRecords();
    return records
      .map((item) => this.toEntity(item))
      .sort((a, b) => {
        const dateComparison = b.date.localeCompare(a.date);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
  }

  async findPaginated(limit: number, offset: number): Promise<{ entries: HeadacheEntry[]; total: number }> {
    await this.ensureInitialized();
    const all = await this.findAll();
    const total = all.length;
    const entries = all.slice(offset, offset + limit);
    return { entries, total };
  }

  async findById(id: string): Promise<HeadacheEntry | null> {
    await this.ensureInitialized();
    const response = await this.docClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { id },
      }),
    );

    if (!response.Item) {
      return null;
    }

    return this.toEntity(response.Item as DynamoDBHeadacheRecord);
  }

  async findByDateRange(startDate: string, endDate: string): Promise<HeadacheEntry[]> {
    await this.ensureInitialized();
    const response = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: '#date BETWEEN :startDate AND :endDate',
        ExpressionAttributeNames: {
          '#date': 'date',
        },
        ExpressionAttributeValues: {
          ':startDate': startDate,
          ':endDate': endDate,
        },
      }),
    );

    const items = (response.Items as DynamoDBHeadacheRecord[] | undefined) ?? [];
    return items
      .map((item) => this.toEntity(item))
      .sort((a, b) => {
        const dateComparison = a.date.localeCompare(b.date);
        if (dateComparison !== 0) {
          return dateComparison;
        }
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
  }

  async create(data: Omit<Partial<HeadacheEntry>, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeadacheEntry> {
    await this.ensureInitialized();
    const now = new Date();
    const entry: HeadacheEntry = {
      id: crypto.randomUUID(),
      date: data.date ?? now.toISOString().split('T')[0],
      painSeverity: data.painSeverity ?? 0,
      durationMinutes: data.durationMinutes ?? 0,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: this.toItem(entry),
      }),
    );

    return entry;
  }

  async update(id: string, data: Partial<HeadacheEntry>): Promise<HeadacheEntry | null> {
    await this.ensureInitialized();
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const now = new Date();
    const updatedEntry: HeadacheEntry = {
      ...existing,
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.painSeverity !== undefined ? { painSeverity: data.painSeverity } : {}),
      ...(data.durationMinutes !== undefined ? { durationMinutes: data.durationMinutes } : {}),
      ...(data.notes !== undefined ? { notes: data.notes } : {}),
      updatedAt: now,
    };

    await this.docClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: this.toItem(updatedEntry),
      }),
    );

    return updatedEntry;
  }

  async delete(id: string): Promise<boolean> {
    await this.ensureInitialized();
    const existing = await this.findById(id);
    if (!existing) {
      return false;
    }

    await this.docClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      }),
    );

    return true;
  }

  async saveMany(entries: Omit<Partial<HeadacheEntry>, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<HeadacheEntry[]> {
    await this.ensureInitialized();
    const now = new Date();
    const createdEntries: HeadacheEntry[] = entries.map((data) => ({
      id: crypto.randomUUID(),
      date: data.date ?? now.toISOString().split('T')[0],
      painSeverity: data.painSeverity ?? 0,
      durationMinutes: data.durationMinutes ?? 0,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    }));

    for (let i = 0; i < createdEntries.length; i += REPOSITORY_CONSTANTS.BATCH_CHUNK_SIZE) {
      const chunk = createdEntries.slice(i, i + REPOSITORY_CONSTANTS.BATCH_CHUNK_SIZE);
      await this.docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [this.tableName]: chunk.map((entry) => ({
              PutRequest: {
                Item: this.toItem(entry),
              },
            })),
          },
        }),
      );
    }

    return createdEntries;
  }

  async count(): Promise<number> {
    await this.ensureInitialized();
    const response = await this.docClient.send(
      new ScanCommand({
        TableName: this.tableName,
        Select: 'COUNT',
      }),
    );
    return response.Count ?? 0;
  }

  async clear(): Promise<void> {
    await this.ensureInitialized();
    const all = await this.findAll();

    for (let i = 0; i < all.length; i += REPOSITORY_CONSTANTS.BATCH_CHUNK_SIZE) {
      const chunk = all.slice(i, i + REPOSITORY_CONSTANTS.BATCH_CHUNK_SIZE);
      await this.docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [this.tableName]: chunk.map((entry) => ({
              DeleteRequest: {
                Key: { id: entry.id },
              },
            })),
          },
        }),
      );
    }
  }
}
