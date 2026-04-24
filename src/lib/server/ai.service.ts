/**
 * ADR-009: strict server-side model, max tokens, system prompt from controlled content only.
 * ADR-005: Result types, no throws, generic errors for upstream failures.
 */

import Anthropic from '@anthropic-ai/sdk';

import { getAiAssistantGuidelines } from '$lib/content/ai-assistant';
import type { Result } from '$lib/types/result';

import type { AiRequest } from './ai.types';
import { assembleSystemPromptFromSiteContent } from './system-prompt.service';

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_OUTPUT_TOKENS = 500;

const GENERIC_FAILURE_MESSAGE = 'Something went wrong. Please try again.';

function mapFailure(): Result<{ text: string }> {
  return {
    ok: false,
    error: {
      code: 'UPSTREAM_UNAVAILABLE',
      message: GENERIC_FAILURE_MESSAGE
    }
  };
}

function extractAssistantText(content: unknown[]): string | null {
  for (const block of content) {
    if (
      typeof block === 'object' &&
      block !== null &&
      'type' in block &&
      (block as { type: string }).type === 'text' &&
      'text' in block &&
      typeof (block as { text: unknown }).text === 'string'
    ) {
      return (block as { text: string }).text;
    }
  }
  return null;
}

/**
 * Runs a single-turn Messages completion. All provider parameters are fixed here.
 */
export async function completeAiChat(apiKey: string, body: AiRequest, options?: { fetchImpl?: typeof fetch }): Promise<Result<{ text: string }>> {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      ok: false,
      error: {
        code: 'UNKNOWN',
        message: GENERIC_FAILURE_MESSAGE
      }
    };
  }

  const [guidelines, siteContent] = await Promise.all([getAiAssistantGuidelines(), assembleSystemPromptFromSiteContent()]);
  const system = `${guidelines}\n\n${siteContent}`.trim();

  const client = new Anthropic({
    apiKey: apiKey.trim(),
    fetch: options?.fetchImpl ?? globalThis.fetch
  });

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      system,
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: body.input }]
        }
      ]
    });

    const text = extractAssistantText(response.content as unknown[]);
    if (text === null || text.length === 0) {
      return mapFailure();
    }

    return { ok: true, data: { text } };
  } catch {
    return mapFailure();
  }
}
