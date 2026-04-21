import { describe, it, expect } from 'vitest';

import { AiRequestSchema } from './ai.schemas';

describe('AiRequestSchema', () => {
	it('accepts trimmed input within 500 chars', () => {
		const r = AiRequestSchema.safeParse({ input: '  hello  ' });
		expect(r.success).toBe(true);
		if (r.success) expect(r.data.input).toBe('hello');
	});

	it('rejects empty and whitespace-only', () => {
		expect(AiRequestSchema.safeParse({ input: '' }).success).toBe(false);
		expect(AiRequestSchema.safeParse({ input: '   ' }).success).toBe(false);
	});

	it('rejects over 500 characters', () => {
		const r = AiRequestSchema.safeParse({ input: 'x'.repeat(501) });
		expect(r.success).toBe(false);
	});

	it('rejects unknown top-level fields', () => {
		const r = AiRequestSchema.safeParse({ input: 'ok', model: 'x' });
		expect(r.success).toBe(false);
	});
});
