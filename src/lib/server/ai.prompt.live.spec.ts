/**
 * Developer-only: real Anthropic calls through completeAiChat (no SDK mocks).
 * Run with: npm run test:ai-live (see README — ADR-009: not a substitute for /api/ai in production).
 *
 * Gated by RUN_AI_LIVE=1 and ANTHROPIC_API_KEY; excluded from default server Vitest project pattern
 * except via the `ai-live` project (tests skip when gate is off — no network).
 */

import { loadEnv } from 'vite';
import { describe, it, expect } from 'vitest';

import { AiRequestSchema } from './ai.schemas';
import { completeAiChat } from './ai.service';

for (const [key, value] of Object.entries(loadEnv('development', process.cwd(), ''))) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}

function liveGateOpen(): boolean {
  return process.env.RUN_AI_LIVE === '1' && Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

describe.skipIf(!liveGateOpen())('completeAiChat (live Anthropic)', () => {
  it('returns non-empty assistant text for a valid request', async () => {
    const body = AiRequestSchema.parse({
      input: 'Reply with exactly: ok',
      turnstileToken: 'dev-bypass-not-used-here'
    });
    const apiKey = process.env.ANTHROPIC_API_KEY ?? '';
    const result = await completeAiChat(apiKey, body);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.text.trim().length).toBeGreaterThan(0);
    }
  });
});
