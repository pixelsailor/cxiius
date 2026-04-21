import { describe, it, expect, vi, beforeEach } from 'vitest';

const { messagesCreate } = vi.hoisted(() => ({
	messagesCreate: vi.fn()
}));

vi.mock('@anthropic-ai/sdk', () => ({
	default: class {
		messages = { create: messagesCreate };
	}
}));

vi.mock('$lib/content/ai-assistant', () => ({
	getAiAssistantGuidelines: vi.fn(() => Promise.resolve('Guidelines'))
}));

vi.mock('./system-prompt.service', () => ({
	assembleSystemPromptFromSiteContent: vi.fn(() => Promise.resolve('Site'))
}));

import { completeAiChat } from './ai.service';

describe('completeAiChat', () => {
	beforeEach(() => {
		messagesCreate.mockReset();
	});

	it('returns UNKNOWN-style failure when API key is empty', async () => {
		const r = await completeAiChat('   ', { input: 'hello' });
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error.code).toBe('UNKNOWN');
	});

	it('returns assistant text when SDK succeeds', async () => {
		messagesCreate.mockResolvedValue({
			content: [{ type: 'text', text: 'Assistant reply' }]
		});
		const r = await completeAiChat('test-api-key', { input: 'Hello' });
		expect(r.ok).toBe(true);
		if (r.ok) expect(r.data.text).toBe('Assistant reply');
	});

	it('maps SDK errors to UPSTREAM_UNAVAILABLE', async () => {
		messagesCreate.mockRejectedValue(new Error('network'));
		const r = await completeAiChat('test-api-key', { input: 'Hello' });
		expect(r.ok).toBe(false);
		if (!r.ok) expect(r.error.code).toBe('UPSTREAM_UNAVAILABLE');
	});
});
