import { headacheController } from '@/backend/headache/controller/headache.controller';

export const dynamic = 'force-dynamic';

export async function POST(): Promise<Response> {
  return headacheController.seed();
}
