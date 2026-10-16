import { headacheController } from '@/backend/headache/controller/headache.controller';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<Response> {
  return headacheController.list(req);
}

export async function POST(req: Request): Promise<Response> {
  return headacheController.create(req);
}
