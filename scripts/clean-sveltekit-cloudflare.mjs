import { rm } from 'node:fs/promises';
import path from 'node:path';

const RETRYABLE_CODES = new Set(['EBUSY', 'EPERM', 'ENOTEMPTY']);
const MAX_ATTEMPTS = 6;
const BASE_DELAY_MS = 120;
const TARGET_DIRS = ['cloudflare', 'output'].map((segment) => path.join(process.cwd(), '.svelte-kit', segment));

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeWithRetries(targetDir) {
	for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
		try {
			await rm(targetDir, { recursive: true, force: true });
			return;
		} catch (error) {
			const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
			if (!RETRYABLE_CODES.has(code) || attempt === MAX_ATTEMPTS) {
				throw error;
			}
			await sleep(BASE_DELAY_MS * attempt);
		}
	}
}

for (const targetDir of TARGET_DIRS) {
	await removeWithRetries(targetDir);
}
