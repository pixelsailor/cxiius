import { describe, expect, it } from 'vitest';

import {
	hasAllowedFetchSite,
	isSameOriginRequest,
	shouldBypassTurnstileForLocalDev
} from './turnstile';

describe('turnstile helpers', () => {
	it('allows local bypass only when secret is missing', () => {
		expect(shouldBypassTurnstileForLocalDev('', 'http://localhost:4173/api/ai')).toBe(true);
		expect(shouldBypassTurnstileForLocalDev(undefined, 'http://127.0.0.1:4173/api/ai')).toBe(true);
		expect(shouldBypassTurnstileForLocalDev('configured-secret', 'http://localhost:4173/api/ai')).toBe(false);
	});

	it('validates same-origin requests', () => {
		const req = new Request('https://cxii.us/api/ai', {
			method: 'POST',
			headers: {
				Origin: 'https://cxii.us'
			}
		});
		expect(isSameOriginRequest(req)).toBe(true);
	});

	it('rejects cross-origin requests', () => {
		const req = new Request('https://cxii.us/api/ai', {
			method: 'POST',
			headers: {
				Origin: 'https://evil.example'
			}
		});
		expect(isSameOriginRequest(req)).toBe(false);
	});

	it('allows same-site fetch metadata', () => {
		const req = new Request('https://cxii.us/api/ai', {
			method: 'POST',
			headers: {
				'sec-fetch-site': 'same-site'
			}
		});
		expect(hasAllowedFetchSite(req)).toBe(true);
	});

	it('rejects missing fetch metadata', () => {
		const req = new Request('https://cxii.us/api/ai', {
			method: 'POST'
		});
		expect(hasAllowedFetchSite(req)).toBe(false);
	});
});
