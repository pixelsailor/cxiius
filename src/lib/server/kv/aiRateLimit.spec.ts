import { describe, it, expect, vi, beforeEach } from 'vitest';

import { consumeAiRateLimit, estimateAiTokens, hashRateLimitKey } from './aiRateLimit';

function createMockKv(store: Map<string, string>) {
  return {
    async get(key: string) {
      return store.get(key) ?? null;
    },
    async put(key: string, value: string, opts?: { expirationTtl?: number }) {
      void opts;
      store.set(key, value);
    }
  } as unknown as KVNamespace;
}

describe('estimateAiTokens', () => {
  it('includes output allowance', () => {
    expect(estimateAiTokens(0)).toBeGreaterThan(500);
    expect(estimateAiTokens(400)).toBe(600);
  });
});

describe('hashRateLimitKey', () => {
  it('returns rl-prefixed hex', async () => {
    const h = await hashRateLimitKey('1.2.3.4', 'salt');
    expect(h.startsWith('rl:')).toBe(true);
    expect(h.length).toBeGreaterThan(10);
  });
});

describe('consumeAiRateLimit', () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = new Map();
  });

  it('denies when salt is too short', async () => {
    const kv = createMockKv(store);
    const r = await consumeAiRateLimit(kv, 'short', '1.1.1.1', 100);
    expect(r.denied).toBe(true);
  });

  it('allows first request and records state', async () => {
    const kv = createMockKv(store);
    const r = await consumeAiRateLimit(kv, 'longenoughsalt', '1.1.1.1', 100);
    expect(r.denied).toBe(false);
    expect(store.size).toBe(1);
  });

  it('denies on kv get failure (fail closed)', async () => {
    const kv = {
      get: vi.fn().mockRejectedValue(new Error('kv down'))
    } as unknown as KVNamespace;
    const r = await consumeAiRateLimit(kv, 'longenoughsalt', '1.1.1.1', 100);
    expect(r.denied).toBe(true);
  });

  it('denies sixth request within 30s window', async () => {
    const kv = createMockKv(store);
    const salt = 'longenoughsalt';
    const ip = '9.9.9.9';
    for (let i = 0; i < 5; i++) {
      const r = await consumeAiRateLimit(kv, salt, ip, 10);
      expect(r.denied).toBe(false);
    }
    const blocked = await consumeAiRateLimit(kv, salt, ip, 10);
    expect(blocked.denied).toBe(true);
    expect(blocked).toMatchObject({ type: 'requests' });
  });
});
