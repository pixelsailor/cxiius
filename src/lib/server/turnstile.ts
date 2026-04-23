type TurnstileSiteVerifyResponse = {
	success: boolean;
	'error-codes'?: string[];
};

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function isLocalHostname(hostname: string): boolean {
	return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

export function shouldBypassTurnstileForLocalDev(secret: string | undefined, requestUrl: string): boolean {
	if (secret && secret.trim().length > 0) {
		return false;
	}

	try {
		const { hostname } = new URL(requestUrl);
		return isLocalHostname(hostname);
	} catch {
		return false;
	}
}

export async function verifyTurnstileToken(args: {
	secret: string;
	token: string;
	remoteIp: string;
}): Promise<boolean> {
	const body = new URLSearchParams();
	body.set('secret', args.secret);
	body.set('response', args.token);
	body.set('remoteip', args.remoteIp);

	try {
		const res = await fetch(TURNSTILE_VERIFY_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: body.toString()
		});
		if (!res.ok) {
			return false;
		}

		const json = (await res.json()) as TurnstileSiteVerifyResponse;
		return json.success === true;
	} catch {
		return false;
	}
}

export function isSameOriginRequest(request: Request): boolean {
	const origin = request.headers.get('origin');
	if (!origin) {
		return false;
	}
	try {
		const requestOrigin = new URL(request.url).origin;
		return new URL(origin).origin === requestOrigin;
	} catch {
		return false;
	}
}

export function hasAllowedFetchSite(request: Request): boolean {
	const fetchSite = request.headers.get('sec-fetch-site');
	if (!fetchSite) {
		return false;
	}
	return fetchSite === 'same-origin' || fetchSite === 'same-site' || fetchSite === 'none';
}
