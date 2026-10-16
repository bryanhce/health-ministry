import { dashboardController } from '@/backend/dashboard/controller/dashboard.controller';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  return dashboardController.getStats();
}
