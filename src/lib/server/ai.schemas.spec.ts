import { describe, it, expect } from 'vitest';

import { AiRequestSchema } from './ai.schemas';

describe('AiRequestSchema', () => {
  it('accepts trimmed input within 500 chars', () => {
    const r = AiRequestSchema.safeParse({ input: '  hello  ', turnstileToken: 'token' });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.input).toBe('hello');
      expect(r.data.turnstileToken).toBe('token');
    }
  });

  it('rejects empty and whitespace-only', () => {
    expect(AiRequestSchema.safeParse({ input: '', turnstileToken: 'token' }).success).toBe(false);
    expect(AiRequestSchema.safeParse({ input: '   ', turnstileToken: 'token' }).success).toBe(false);
  });

  it('rejects over 500 characters', () => {
    const r = AiRequestSchema.safeParse({ input: 'x'.repeat(501), turnstileToken: 'token' });
    expect(r.success).toBe(false);
  });

  it('rejects unknown top-level fields', () => {
    const r = AiRequestSchema.safeParse({ input: 'ok', turnstileToken: 'token', model: 'x' });
    expect(r.success).toBe(false);
  });

  it('rejects missing turnstileToken', () => {
    const r = AiRequestSchema.safeParse({ input: 'ok' });
    expect(r.success).toBe(false);
  });

  it('rejects empty turnstileToken', () => {
    const r = AiRequestSchema.safeParse({ input: 'ok', turnstileToken: '   ' });
    expect(r.success).toBe(false);
  });
});
