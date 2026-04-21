/**
 * ADR-009 + ADR-010: per-IP-ish rate limits using KV with hashed keys and Zod-validated payloads.
 * On KV errors: fail closed (deny).
 */

import { z } from 'zod';

const REQUEST_WINDOW_MS = 30_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const TOKEN_WINDOW_MS = 5 * 60_000;
const MAX_TOKEN_ESTIMATE_PER_WINDOW = 10_000;

/** KV value: sliding-window markers (ADR-010: small JSON, TTL on write). */
const AiRateLimitStateSchema = z.object({
	requestAts: z.array(z.number()),
	tokenEvents: z.array(
		z.object({
			at: z.number(),
			est: z.number()
		})
	)
});

export type AiRateLimitDenied = {
	denied: true;
	error: 'rate_limit_exceeded';
	type: 'requests' | 'token_budget';
	retry_after: number;
};

export type AiRateLimitOk = { denied: false };

function pruneRequests(ts: number, requestAts: number[]): number[] {
	const cutoff = ts - REQUEST_WINDOW_MS;
	return requestAts.filter((t) => t >= cutoff);
}

function pruneTokens(ts: number, tokenEvents: { at: number; est: number }[]): { at: number; est: number }[] {
	const cutoff = ts - TOKEN_WINDOW_MS;
	return tokenEvents.filter((e) => e.at >= cutoff);
}

function sumTokenEstimates(tokenEvents: { at: number; est: number }[]): number {
	return tokenEvents.reduce((acc, e) => acc + e.est, 0);
}

export async function hashRateLimitKey(clientIp: string, salt: string): Promise<string> {
	const enc = new TextEncoder();
	const digest = await crypto.subtle.digest('SHA-256', enc.encode(`${clientIp}:${salt}`));
	const bytes = new Uint8Array(digest);
	let hex = '';
	for (let i = 0; i < bytes.length; i++) {
		hex += bytes[i].toString(16).padStart(2, '0');
	}
	return `rl:${hex}`;
}

function emptyState(): z.infer<typeof AiRateLimitStateSchema> {
	return { requestAts: [], tokenEvents: [] };
}

function parseState(raw: string | null): z.infer<typeof AiRateLimitStateSchema> {
	if (raw === null || raw === '') {
		return emptyState();
	}
	try {
		const json: unknown = JSON.parse(raw);
		const parsed = AiRateLimitStateSchema.safeParse(json);
		return parsed.success ? parsed.data : emptyState();
	} catch {
		return emptyState();
	}
}

/**
 * ADR-009: enforce request + token budgets before calling upstream.
 * Mutates KV on success (records this request).
 */
export async function consumeAiRateLimit(kv: KVNamespace, salt: string, clientIp: string, inputTokenEstimate: number): Promise<AiRateLimitOk | AiRateLimitDenied> {
	if (!salt || salt.length < 8) {
		return {
			denied: true,
			error: 'rate_limit_exceeded',
			type: 'requests',
			retry_after: 120
		};
	}

	let key: string;
	try {
		key = await hashRateLimitKey(clientIp, salt);
	} catch {
		return {
			denied: true,
			error: 'rate_limit_exceeded',
			type: 'requests',
			retry_after: 120
		};
	}

	const now = Date.now();
	let raw: string | null;
	try {
		raw = await kv.get(key);
	} catch {
		return {
			denied: true,
			error: 'rate_limit_exceeded',
			type: 'requests',
			retry_after: 120
		};
	}

	const state = parseState(raw);
	state.requestAts = pruneRequests(now, state.requestAts);
	state.tokenEvents = pruneTokens(now, state.tokenEvents);

	if (state.requestAts.length >= MAX_REQUESTS_PER_WINDOW) {
		const oldest = Math.min(...state.requestAts);
		const retry_after = Math.max(1, Math.ceil((oldest + REQUEST_WINDOW_MS - now) / 1000));
		return { denied: true, error: 'rate_limit_exceeded', type: 'requests', retry_after };
	}

	const tokenTotal = sumTokenEstimates(state.tokenEvents) + inputTokenEstimate;
	if (tokenTotal > MAX_TOKEN_ESTIMATE_PER_WINDOW) {
		const oldestTok = state.tokenEvents.length ? Math.min(...state.tokenEvents.map((e) => e.at)) : now;
		const retry_after = Math.max(1, Math.ceil((oldestTok + TOKEN_WINDOW_MS - now) / 1000));
		return { denied: true, error: 'rate_limit_exceeded', type: 'token_budget', retry_after };
	}

	state.requestAts.push(now);
	state.tokenEvents.push({ at: now, est: inputTokenEstimate });

	const serialized = JSON.stringify(state);
	const expirationTtl = 300;

	try {
		await kv.put(key, serialized, { expirationTtl });
	} catch {
		return {
			denied: true,
			error: 'rate_limit_exceeded',
			type: 'requests',
			retry_after: 120
		};
	}

	return { denied: false };
}

/** ADR-009 token estimate: input approximation + fixed output allowance. */
export function estimateAiTokens(inputLength: number, outputAllowance = 500): number {
	const inputApprox = Math.max(1, Math.ceil(inputLength / 4));
	return inputApprox + outputAllowance;
}
