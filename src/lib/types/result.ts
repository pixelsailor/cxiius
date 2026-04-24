/**
 * Cross-cutting result and error types (ADR-005).
 * Used by `$lib/server/` services and route handlers.
 */

export type ErrorCode = 'RATE_LIMITED' | 'UPSTREAM_UNAVAILABLE' | 'INVALID_INPUT' | 'NOT_FOUND' | 'UNKNOWN';

export type AppError = {
  code: ErrorCode;
  message: string;
  detail?: string;
};

export type Result<T> = { ok: true; data: T } | { ok: false; error: AppError };
