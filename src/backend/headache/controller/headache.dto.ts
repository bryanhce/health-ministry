import { z } from 'zod';

export const HEADACHE_CONSTRAINTS = {
  MIN_PAIN_SEVERITY: 1,
  MAX_PAIN_SEVERITY: 10,
  MIN_DURATION_MINUTES: 1,
  MAX_DURATION_MINUTES: 10080, // 7 days max
  MAX_NOTES_LENGTH: 2000,
} as const;

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const createHeadacheSchema = z.object({
  date: z
    .string()
    .regex(DATE_REGEX, { message: 'Date must be formatted as YYYY-MM-DD' }),
  painSeverity: z
    .number()
    .int({ message: 'Pain severity must be an integer' })
    .min(HEADACHE_CONSTRAINTS.MIN_PAIN_SEVERITY, {
      message: `Pain severity must be at least ${HEADACHE_CONSTRAINTS.MIN_PAIN_SEVERITY}`,
    })
    .max(HEADACHE_CONSTRAINTS.MAX_PAIN_SEVERITY, {
      message: `Pain severity cannot exceed ${HEADACHE_CONSTRAINTS.MAX_PAIN_SEVERITY}`,
    }),
  durationMinutes: z
    .number()
    .int({ message: 'Duration must be an integer' })
    .min(HEADACHE_CONSTRAINTS.MIN_DURATION_MINUTES, {
      message: `Duration must be at least ${HEADACHE_CONSTRAINTS.MIN_DURATION_MINUTES} minute`,
    })
    .max(HEADACHE_CONSTRAINTS.MAX_DURATION_MINUTES, {
      message: `Duration cannot exceed ${HEADACHE_CONSTRAINTS.MAX_DURATION_MINUTES} minutes`,
    }),
  notes: z
    .string()
    .max(HEADACHE_CONSTRAINTS.MAX_NOTES_LENGTH, {
      message: `Notes cannot exceed ${HEADACHE_CONSTRAINTS.MAX_NOTES_LENGTH} characters`,
    })
    .nullable()
    .optional(),
});

export const updateHeadacheSchema = createHeadacheSchema.partial();

export const idParamSchema = z.string().uuid({ message: 'Invalid ID: must be a valid UUID' });

export type CreateHeadacheDTO = z.infer<typeof createHeadacheSchema>;
export type UpdateHeadacheDTO = z.infer<typeof updateHeadacheSchema>;
