import { headacheController } from '@/backend/headache/controller/headache.controller';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  return headacheController.list();
}

export async function POST(req: Request): Promise<Response> {
  return headacheController.create(req);
}
