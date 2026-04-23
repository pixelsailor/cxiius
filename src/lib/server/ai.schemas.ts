import { z } from 'zod';

/** ADR-009: single opaque `input` string + bot attestation token; reject extra fields. */
export const AiRequestSchema = z
	.object({
		input: z.string().trim().min(1).max(500),
		turnstileToken: z.string().trim().min(1).max(2048)
	})
	.strict();
