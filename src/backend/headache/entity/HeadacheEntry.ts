import { EntitySchema } from 'typeorm';

export class HeadacheEntry {
  id!: string;
  date!: string;
  painSeverity!: number;
  durationMinutes!: number;
  notes!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export const HeadacheEntrySchema = new EntitySchema<HeadacheEntry>({
  name: 'HeadacheEntry',
  target: HeadacheEntry,
  tableName: 'headache_entries',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid',
    },
    date: {
      type: 'date',
    },
    painSeverity: {
      name: 'pain_severity',
      type: 'int',
    },
    durationMinutes: {
      name: 'duration_minutes',
      type: 'int',
    },
    notes: {
      type: 'text',
      nullable: true,
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true,
    },
    updatedAt: {
      name: 'updated_at',
      type: 'timestamptz',
      updateDate: true,
    },
  },
});
