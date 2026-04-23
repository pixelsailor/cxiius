import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';
import { getDesignPortfolio } from '$lib/content/projects';
import { load, prerender } from './+page.js';
import type { PageData } from './$types';

describe('portfolio +page load', () => {
	it('exports prerender true', () => {
		expect(prerender).toBe(true);
	});

	it('load returns serialisable data: filterKey, entries, filteredEntries, hero', async () => {
		const url = new URL('http://localhost/portfolio?type=ui');
		const raw = await load({ url } as Parameters<typeof load>[0]);
		expect(raw).toBeTruthy();
		const data = raw as PageData;
		expect(data.filterKey).toBe('ui');
		expect(Array.isArray(data.entries)).toBe(true);
		expect(Array.isArray(data.filteredEntries)).toBe(true);
		expect(data.filteredEntries.every((e) => e.projectType === 'ui')).toBe(true);
		expect(data.hero).toBeDefined();
		expect(typeof data.hero.slug).toBe('string');
		for (const v of Object.values(data)) {
			expect(v).not.toBeInstanceOf(Promise);
		}
	});

	it('load entries match portfolio-only getter order and membership (AC-06)', async () => {
		const expected = await getDesignPortfolio();
		const url = new URL('http://localhost/portfolio');
		const raw = await load({ url } as Parameters<typeof load>[0]);
		const data = raw as PageData;
		expect(data.entries.map((e) => e.slug)).toEqual(expected.map((e) => e.slug));
	});

	it('invalid type query defaults to all filtered list', async () => {
		const url = new URL('http://localhost/portfolio?type=invalid');
		const raw = await load({ url } as Parameters<typeof load>[0]);
		expect(raw).toBeTruthy();
		const data = raw as PageData;
		expect(data.filterKey).toBe('all');
		expect(data.filteredEntries.length).toBe(data.entries.length);
	});

	it('does not use +page.server.ts for this route', () => {
		const p = join(process.cwd(), 'src/routes/portfolio/+page.server.ts');
		expect(existsSync(p)).toBe(false);
	});

	it('portfolio Svelte routes do not defer primary page data with {#await} (AC-14)', async () => {
		for (const rel of ['src/routes/portfolio/+page.svelte', 'src/routes/portfolio/[slug]/+page.svelte']) {
			const s = await readFile(join(process.cwd(), rel), 'utf8');
			expect(s).not.toContain('{#await');
		}
	});
});
