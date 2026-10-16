import {
  CreateHeadacheInput,
  HeadacheEntryDTO,
  UpdateHeadacheInput,
} from '@/frontend/domain/headache.types';

const API_ENDPOINTS = {
  ENTRIES: '/api/entries',
  ENTRY_BY_ID: (id: string) => `/api/entries/${id}`,
  SEED: '/api/seed',
} as const;

export class ApiError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    let errorCode: string | undefined;
    let errorDetails: unknown;

    try {
      const errorJson = await res.json();
      if (errorJson.error) {
        errorMessage = errorJson.error.message || errorMessage;
        errorCode = errorJson.error.code;
        errorDetails = errorJson.error.details;
      }
    } catch {
      // response wasn't JSON
    }

    throw new ApiError(errorMessage, res.status, errorCode, errorDetails);
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return res.json();
}

export async function fetchEntries(): Promise<HeadacheEntryDTO[]> {
  const res = await fetch(API_ENDPOINTS.ENTRIES, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await handleResponse<{ data: HeadacheEntryDTO[] }>(res);
  return json.data;
}

export async function fetchEntryById(id: string): Promise<HeadacheEntryDTO> {
  const res = await fetch(API_ENDPOINTS.ENTRY_BY_ID(id), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await handleResponse<{ data: HeadacheEntryDTO }>(res);
  return json.data;
}

export async function createEntry(input: CreateHeadacheInput): Promise<HeadacheEntryDTO> {
  const res = await fetch(API_ENDPOINTS.ENTRIES, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await handleResponse<{ data: HeadacheEntryDTO }>(res);
  return json.data;
}

export async function updateEntry(id: string, input: UpdateHeadacheInput): Promise<HeadacheEntryDTO> {
  const res = await fetch(API_ENDPOINTS.ENTRY_BY_ID(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const json = await handleResponse<{ data: HeadacheEntryDTO }>(res);
  return json.data;
}

export async function deleteEntry(id: string): Promise<void> {
  const res = await fetch(API_ENDPOINTS.ENTRY_BY_ID(id), {
    method: 'DELETE',
  });
  await handleResponse<void>(res);
}

export async function seedEntries(): Promise<{ message: string; data: HeadacheEntryDTO[] }> {
  const res = await fetch(API_ENDPOINTS.SEED, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<{ message: string; data: HeadacheEntryDTO[] }>(res);
}
