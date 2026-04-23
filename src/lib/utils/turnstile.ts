type TurnstileApi = {
	render: (
		container: HTMLElement | string,
		options: {
			sitekey: string;
			size: 'invisible';
			callback: (token: string) => void;
			'error-callback': () => void;
			'expired-callback': () => void;
			'timeout-callback': () => void;
		}
	) => string;
	execute: (widgetId: string) => void;
	reset: (widgetId: string) => void;
};

declare global {
	interface Window {
		turnstile?: TurnstileApi;
	}
}

const TURNSTILE_SCRIPT_ID = 'cf-turnstile-script';
const TURNSTILE_CONTAINER_ID = 'cxii-turnstile-container';

let loadScriptPromise: Promise<void> | null = null;
let widgetId: string | null = null;
let pendingTokenResolver: ((token: string | null) => void) | null = null;

async function resolveTurnstileSiteKey(): Promise<string | null> {
	// Prefer SvelteKit public env in runtime contexts where it's available.
	try {
		const mod = await import('$env/dynamic/public');
		const publicKey = mod.env.PUBLIC_TURNSTILE_SITE_KEY?.trim();
		if (publicKey) {
			return publicKey;
		}
	} catch {
		// Fall through to Vite env fallback.
	}

	// Fallback for local/build-time contexts.
	const vitePublicKey = (import.meta.env.PUBLIC_TURNSTILE_SITE_KEY as string | undefined)?.trim();
	if (vitePublicKey) {
		return vitePublicKey;
	}

	// Support optional VITE_ prefix if user sets that locally.
	const vitePrefixedKey = (import.meta.env.VITE_PUBLIC_TURNSTILE_SITE_KEY as string | undefined)?.trim();
	if (vitePrefixedKey) {
		return vitePrefixedKey;
	}

	return null;
}

function resolvePendingToken(token: string | null): void {
	if (!pendingTokenResolver) {
		return;
	}
	const resolve = pendingTokenResolver;
	pendingTokenResolver = null;
	resolve(token);
}

function ensureContainer(): HTMLElement {
	let container = document.getElementById(TURNSTILE_CONTAINER_ID);
	if (!container) {
		container = document.createElement('div');
		container.id = TURNSTILE_CONTAINER_ID;
		container.style.position = 'fixed';
		container.style.bottom = '-9999px';
		container.style.left = '-9999px';
		document.body.appendChild(container);
	}
	return container;
}

async function loadTurnstileScript(): Promise<void> {
	if (typeof window === 'undefined') {
		throw new Error('turnstile_unavailable');
	}
	if (window.turnstile) {
		return;
	}
	if (loadScriptPromise) {
		return loadScriptPromise;
	}

	loadScriptPromise = new Promise<void>((resolve, reject) => {
		const existing = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
		if (existing) {
			existing.addEventListener('load', () => resolve(), { once: true });
			existing.addEventListener('error', () => reject(new Error('turnstile_script_failed')), { once: true });
			return;
		}

		const script = document.createElement('script');
		script.id = TURNSTILE_SCRIPT_ID;
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
		script.async = true;
		script.defer = true;
		script.addEventListener('load', () => resolve(), { once: true });
		script.addEventListener('error', () => reject(new Error('turnstile_script_failed')), { once: true });
		document.head.appendChild(script);
	});

	return loadScriptPromise;
}

async function ensureTurnstileWidget(): Promise<string | null> {
	const siteKey = await resolveTurnstileSiteKey();
	if (!siteKey) {
		return null;
	}
	await loadTurnstileScript();
	if (!window.turnstile) {
		throw new Error('turnstile_unavailable');
	}
	if (widgetId) {
		return widgetId;
	}

	const container = ensureContainer();
	widgetId = window.turnstile.render(container, {
		sitekey: siteKey,
		size: 'invisible',
		callback: (token: string) => resolvePendingToken(token),
		'error-callback': () => resolvePendingToken(null),
		'expired-callback': () => resolvePendingToken(null),
		'timeout-callback': () => resolvePendingToken(null)
	});
	return widgetId;
}

export async function requestTurnstileToken(): Promise<string | null> {
	const id = await ensureTurnstileWidget();
	if (!id) {
		return null;
	}
	if (!window.turnstile) {
		return null;
	}

	return new Promise<string | null>((resolve) => {
		const timeout = window.setTimeout(() => {
			resolvePendingToken(null);
		}, 8000);

		pendingTokenResolver = (token) => {
			clearTimeout(timeout);
			resolve(token);
		};

		try {
			window.turnstile?.reset(id);
			window.turnstile?.execute(id);
		} catch {
			clearTimeout(timeout);
			resolvePendingToken(null);
		}
	});
}
