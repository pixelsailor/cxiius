import { z } from 'zod';

/** ADR-009: single opaque `input` string, max 500 characters; reject extra fields. */
export const AiRequestSchema = z
	.object({
		input: z.string().trim().min(1).max(500)
	})
	.strict();
