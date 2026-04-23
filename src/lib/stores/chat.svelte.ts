import { requestTurnstileToken } from '$lib/utils/turnstile';

export type ChatStatus = 'idle' | 'loading' | 'streaming' | 'complete' | 'error';

export type ChatMessage = {
	id: string;
	role: 'user' | 'assistant';
	body: string;
};

export class ChatState {
	messages = $state<ChatMessage[]>([]);
	status = $state<ChatStatus>('idle');
	lastError = $state<string | null>(null);

	clear() {
		this.messages = [];
		this.lastError = null;
		this.status = 'idle';
	}

	async submitUserText(raw: string) {
		const input = raw.trim();
		if (!input || input.length > 500) {
			this.lastError = 'Messages must be between 1 and 500 characters.';
			return;
		}
		if (this.status === 'loading') {
			return;
		}
		this.lastError = null;
		this.messages = [...this.messages, { id: crypto.randomUUID(), role: 'user', body: input }];
		this.status = 'loading';

		try {
			const turnstileToken = await requestTurnstileToken();
			if (!turnstileToken) {
				this.lastError = 'Verification failed. Please retry.';
				this.status = 'error';
				return;
			}

			const res = await fetch('/api/ai', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ input, turnstileToken })
			});

			let payload: unknown = null;
			try {
				payload = await res.json();
			} catch {
				payload = null;
			}

			if (res.ok && payload && typeof payload === 'object' && payload !== null && 'reply' in payload) {
				const reply = (payload as { reply: unknown }).reply;
				if (typeof reply === 'string' && reply.length > 0) {
					this.messages = [...this.messages, { id: crypto.randomUUID(), role: 'assistant', body: reply }];
					this.status = 'complete';
					return;
				}
			}

			if (res.status === 429 && payload && typeof payload === 'object' && payload !== null) {
				const p = payload as { error?: unknown; retry_after?: unknown };
				if (p.error === 'rate_limit_exceeded') {
					const r = typeof p.retry_after === 'number' ? p.retry_after : 60;
					this.lastError = `Too many requests. Please try again in about ${r} seconds.`;
					this.status = 'error';
					return;
				}
			}

			if (res.status === 400) {
				this.lastError = 'That message could not be sent. Check length and try again.';
				this.status = 'error';
				return;
			}

			if (res.status === 503) {
				this.lastError = 'The assistant is temporarily unavailable. Please try again later.';
				this.status = 'error';
				return;
			}

			this.lastError = 'Something went wrong. Please try again.';
			this.status = 'error';
		} catch {
			this.lastError = 'Something went wrong. Please try again.';
			this.status = 'error';
		}
	}
}
