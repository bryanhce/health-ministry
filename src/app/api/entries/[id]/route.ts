import { headacheController } from '@/backend/headache/controller/headache.controller';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  return headacheController.getById(id);
}

export async function PUT(req: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  return headacheController.update(id, req);
}

export async function DELETE(_req: Request, context: RouteContext): Promise<Response> {
  const { id } = await context.params;
  return headacheController.delete(id);
}
