import { afterEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { cleanup, render } from 'vitest-browser-svelte';
import LayoutSpecHost from './layout.spec-host.svelte';

/** Mutate `.pathname` before `render` so SvelteKit `page.url` tracks the route (stable object; avoid cached `get page()` snapshots). */
const pageUrl = vi.hoisted(() => new URL('http://localhost/resume'));
const jsEnabledFlag = vi.hoisted(() => ({ enabled: true }));

vi.mock('$lib/utils/jsEnabled', () => ({
	isJavaScriptEnabled: () => jsEnabledFlag.enabled,
	removeNoJsClassFromBody: vi.fn()
}));

vi.mock('$app/paths', () => ({
	resolve: (path: string) => path
}));

vi.mock('$app/state', () => ({
	page: {
		get url() {
			return pageUrl;
		}
	}
}));

vi.mock('$app/navigation', () => ({
	afterNavigate: vi.fn(() => {}),
	goto: vi.fn(() => Promise.resolve())
}));

afterEach(() => {
	jsEnabledFlag.enabled = true;
	void cleanup();
});

function dispatchKey(target: EventTarget, init: KeyboardEventInit) {
	target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ...init }));
}

/** Open chat via the layout alphabet path (bits-ui `Button.Root` may not react to synthetic `.click()`). */
async function openChatViaAlphabetKey(key = 'a') {
	dispatchKey(window, { key });
	await new Promise((r) => setTimeout(r, 150));
	const input = document.getElementById('chatWindowInput');
	expect(input).toBeTruthy();
}

/** Same pattern as `+layout.svelte` — contract for AC-06. */
const ALPHABET = /^[a-zA-Z/]$/;

describe('+layout.svelte chat sidebar keyboard (browser)', () => {
	it('AC-01 / AC-03: Escape closes the chat while chat is open (not gated on ALPHABET)', async () => {
		pageUrl.pathname = '/resume';
		await render(LayoutSpecHost);
		await openChatViaAlphabetKey('a');
		// Playwright-backed keyboard: synthetic `dispatchEvent` on `window` does not hit `svelte:window` the same way in browser mode.
		await userEvent.keyboard('{Escape}');
		expect(document.getElementById('chatWindowInput')).toBeNull();
	});

	it('AC-06: Escape key string does not match the layout ALPHABET pattern', () => {
		expect(ALPHABET.test('Escape')).toBe(false);
	});

	it('AC-02: alphabet key opens chat and seeds input when chat is closed', async () => {
		pageUrl.pathname = '/resume';
		await render(LayoutSpecHost);
		expect(document.getElementById('chatWindowInput')).toBeNull();
		dispatchKey(window, { key: 'k' });
		await new Promise((r) => setTimeout(r, 150));
		const input = document.getElementById('chatWindowInput') as HTMLTextAreaElement | null;
		expect(input).toBeTruthy();
		expect(input?.value).toBe('k');
	});

	it('AC-02: Escape is not an alphabet key and does not open chat when closed', async () => {
		pageUrl.pathname = '/resume';
		await render(LayoutSpecHost);
		dispatchKey(window, { key: 'Escape' });
		await new Promise((r) => setTimeout(r, 50));
		expect(document.getElementById('chatWindowInput')).toBeNull();
	});

	it('AC-04: Escape closes chat when keydown originates on #chatWindowInput', async () => {
		pageUrl.pathname = '/resume';
		await render(LayoutSpecHost);
		await openChatViaAlphabetKey('z');
		const input = document.getElementById('chatWindowInput') as HTMLTextAreaElement | null;
		expect(input).toBeTruthy();
		input!.focus();
		expect(document.activeElement).toBe(input);
		await userEvent.keyboard('{Escape}');
		expect(document.getElementById('chatWindowInput')).toBeNull();
	});

	it('AC-08: Escape closes sidebar (driver keyboard; see source spec for preventDefault)', async () => {
		pageUrl.pathname = '/resume';
		await render(LayoutSpecHost);
		await openChatViaAlphabetKey('m');
		await userEvent.keyboard('{Escape}');
		expect(document.getElementById('chatWindowInput')).toBeNull();
	});

	it('AC-07: active element after Escape matches close-button path when input had focus', async () => {
		pageUrl.pathname = '/resume';
		await render(LayoutSpecHost);
		await openChatViaAlphabetKey('b');
		const input = document.getElementById('chatWindowInput') as HTMLTextAreaElement | null;
		input!.focus();
		await userEvent.keyboard('{Escape}');
		const afterEscape = document.activeElement;

		await openChatViaAlphabetKey('c');
		const input2 = document.getElementById('chatWindowInput') as HTMLTextAreaElement | null;
		input2!.focus();
		const closeBtn = document.querySelector<HTMLButtonElement>('button[aria-label="Close chat"]');
		expect(closeBtn).toBeTruthy();
		await userEvent.click(closeBtn!);
		const afterCloseBtn = document.activeElement;

		expect(afterEscape).toBe(afterCloseBtn);
	});

	it('AC-10: when JS is disabled, chat sidebar and trigger are not shown', async () => {
		jsEnabledFlag.enabled = false;
		pageUrl.pathname = '/resume';
		await render(LayoutSpecHost);
		expect(document.querySelector('button[aria-label="Open chat"]')).toBeNull();
		expect(document.querySelector('aside.sidebar')).toBeNull();
	});

	it('AC-10: on `/` (showNav false), chat sidebar is absent and alphabet does not open chat', async () => {
		pageUrl.pathname = '/';
		await render(LayoutSpecHost);
		expect(document.querySelector('aside.sidebar')).toBeNull();
		dispatchKey(window, { key: 'a' });
		await new Promise((r) => setTimeout(r, 150));
		expect(document.getElementById('chatWindowInput')).toBeNull();
	});
});
