import { json } from '@sveltejs/kit';

import { AiRequestSchema } from '$lib/server/ai.schemas';
import { completeAiChat } from '$lib/server/ai.service';
import { consumeAiRateLimit, estimateAiTokens } from '$lib/server/kv/aiRateLimit';
import { hasAllowedFetchSite, isSameOriginRequest, shouldBypassTurnstileForLocalDev, verifyTurnstileToken } from '$lib/server/turnstile';

import type { RequestHandler } from './$types';

export const prerender = false;

function resolveClientIp(request: Request, getClientAddress: () => string): string {
  const cf = request.headers.get('CF-Connecting-IP');
  if (cf && cf.trim().length > 0) {
    return cf.trim();
  }
  try {
    return getClientAddress();
  } catch {
    return '0.0.0.0';
  }
}

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
  const env = platform?.env;
  if (!env?.RATE_LIMIT_KV) {
    return json({ error: 'service_unavailable' }, { status: 503 });
  }
  if (!isSameOriginRequest(request) || !hasAllowedFetchSite(request)) {
    return json({ error: 'forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_input' }, { status: 400 });
  }

  const parsed = AiRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: 'invalid_input' }, { status: 400 });
  }

  const clientIp = resolveClientIp(request, getClientAddress);
  const shouldBypassTurnstile = shouldBypassTurnstileForLocalDev(env.TURNSTILE_SECRET_KEY, request.url);
  if (!shouldBypassTurnstile) {
    const turnstileSecret = env.TURNSTILE_SECRET_KEY?.trim();
    if (!turnstileSecret) {
      return json({ error: 'service_unavailable' }, { status: 503 });
    }
    const turnstileOk = await verifyTurnstileToken({
      secret: turnstileSecret,
      token: parsed.data.turnstileToken,
      remoteIp: clientIp
    });
    if (!turnstileOk) {
      return json({ error: 'invalid_input' }, { status: 400 });
    }
  }

  const tokenEstimate = estimateAiTokens(parsed.data.input.length);

  const rl = await consumeAiRateLimit(env.RATE_LIMIT_KV, env.RATE_LIMIT_ID_SALT, clientIp, tokenEstimate);
  if (rl.denied) {
    return json(
      {
        error: rl.error,
        type: rl.type,
        retry_after: rl.retry_after
      },
      { status: 429 }
    );
  }

  const result = await completeAiChat(env.ANTHROPIC_API_KEY ?? '', parsed.data);
  if (!result.ok) {
    if (result.error.code === 'INVALID_INPUT') {
      return json({ error: 'invalid_input' }, { status: 400 });
    }
    return json({ error: 'upstream_unavailable' }, { status: 503 });
  }

  return json({ reply: result.data.text });
};
