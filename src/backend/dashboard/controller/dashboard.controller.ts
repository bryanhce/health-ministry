import { NextResponse } from 'next/server';
import { DashboardService } from '@/backend/dashboard/service/dashboard.service';
import { AppError, HTTP_STATUS } from '@/backend/shared/errors/AppError';

export class DashboardController {
  private service: DashboardService;

  constructor(service?: DashboardService) {
    this.service = service ?? new DashboardService();
  }

  async getStats(): Promise<NextResponse> {
    try {
      const stats = await this.service.getDashboardStats();
      return NextResponse.json({ data: stats }, { status: HTTP_STATUS.OK });
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(error.toJSON(), { status: error.statusCode });
      }

      const message = error instanceof Error ? error.message : 'An unexpected error occurred';
      return NextResponse.json(
        {
          error: {
            message,
            code: 'INTERNAL_SERVER_ERROR',
          },
        },
        { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
      );
    }
  }
}

export const dashboardController = new DashboardController();
