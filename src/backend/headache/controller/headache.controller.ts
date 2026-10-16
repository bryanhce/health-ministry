import { NextResponse } from 'next/server';
import { HeadacheService } from '@/backend/headache/service/headache.service';
import {
  createHeadacheSchema,
  updateHeadacheSchema,
  idParamSchema,
  paginationQuerySchema,
  PAGINATION_DEFAULTS,
} from '@/backend/headache/controller/headache.dto';
import { AppError, HTTP_STATUS } from '@/backend/shared/errors/AppError';
import { ZodError } from 'zod';

export class HeadacheController {
  private service: HeadacheService;

  constructor(service?: HeadacheService) {
    this.service = service ?? new HeadacheService();
  }

  async list(req?: Request): Promise<NextResponse> {
    try {
      let limit: number = PAGINATION_DEFAULTS.DEFAULT_LIMIT;
      let offset: number = PAGINATION_DEFAULTS.DEFAULT_OFFSET;

      if (req?.url) {
        const url = new URL(req.url);
        const queryParams = {
          limit: url.searchParams.get('limit') ?? undefined,
          offset: url.searchParams.get('offset') ?? undefined,
        };
        const parsed = paginationQuerySchema.parse(queryParams);
        limit = parsed.limit;
        offset = parsed.offset;
      }

      const result = await this.service.getPaginatedEntries({ limit, offset });

      return NextResponse.json(
        {
          data: result.entries,
          pagination: {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            hasMore: result.hasMore,
          },
        },
        { status: HTTP_STATUS.OK },
      );
    } catch (error) {
      return this.handleError(error, 'list');
    }
  }

  async getById(id: string): Promise<NextResponse> {
    try {
      const parsedId = idParamSchema.parse(id);
      const entry = await this.service.getEntryById(parsedId);
      return NextResponse.json({ data: entry }, { status: HTTP_STATUS.OK });
    } catch (error) {
      return this.handleError(error, 'getById');
    }
  }

  async create(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validatedData = createHeadacheSchema.parse(body);
      const created = await this.service.createEntry(validatedData);
      return NextResponse.json({ data: created }, { status: HTTP_STATUS.CREATED });
    } catch (error) {
      return this.handleError(error, 'create');
    }
  }

  async update(id: string, req: Request): Promise<NextResponse> {
    try {
      const parsedId = idParamSchema.parse(id);
      const body = await req.json();
      const validatedData = updateHeadacheSchema.parse(body);
      const updated = await this.service.updateEntry(parsedId, validatedData);
      return NextResponse.json({ data: updated }, { status: HTTP_STATUS.OK });
    } catch (error) {
      return this.handleError(error, 'update');
    }
  }

  async delete(id: string): Promise<NextResponse> {
    try {
      const parsedId = idParamSchema.parse(id);
      await this.service.deleteEntry(parsedId);
      return new NextResponse(null, { status: HTTP_STATUS.NO_CONTENT });
    } catch (error) {
      return this.handleError(error, 'delete');
    }
  }

  async seed(): Promise<NextResponse> {
    try {
      const result = await this.service.seedEntries();
      return NextResponse.json(
        {
          message: `Successfully seeded ${result.count} realistic headache entries.`,
          data: result.entries,
        },
        { status: HTTP_STATUS.CREATED },
      );
    } catch (error) {
      return this.handleError(error, 'seed');
    }
  }

  private handleError(error: unknown, context?: string): NextResponse {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.flatten().fieldErrors,
          },
        },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json(error.toJSON(), { status: error.statusCode });
    }

    console.error(`[HeadacheController] Unexpected error${context ? ` in ${context}` : ''}:`, error);

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

export const headacheController = new HeadacheController();
