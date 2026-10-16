export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, statusCode: HttpStatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  public toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        ...(this.details !== undefined ? { details: this.details } : {}),
      },
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, HTTP_STATUS.BAD_REQUEST, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier ? `${resource} with id '${identifier}' was not found` : `${resource} was not found`;
    super(message, HTTP_STATUS.NOT_FOUND, 'NOT_FOUND');
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, 'DATABASE_ERROR', details);
  }
}
