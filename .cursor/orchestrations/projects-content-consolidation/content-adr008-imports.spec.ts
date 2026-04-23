import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

async function listContentModuleTsFiles(dir: string): Promise<string[]> {
	const out: string[] = [];
	const entries = await readdir(dir, { withFileTypes: true });
	for (const e of entries) {
		const p = join(dir, e.name);
		if (e.isDirectory()) {
			out.push(...(await listContentModuleTsFiles(p)));
		} else if (e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts')) {
			out.push(p);
		}
	}
	return out;
}

async function walkSrcSourceFiles(dir: string): Promise<string[]> {
	const out: string[] = [];
	const entries = await readdir(dir, { withFileTypes: true });
	for (const e of entries) {
		const p = join(dir, e.name);
		if (e.isDirectory()) {
			if (e.name === 'node_modules' || e.name === '.svelte-kit') continue;
			out.push(...(await walkSrcSourceFiles(p)));
		} else if (
			e.isFile() &&
			/\.(ts|svelte|js|mjs)$/.test(e.name) &&
			!e.name.includes('.spec.') &&
			!e.name.includes('.test.')
		) {
			out.push(p);
		}
	}
	return out;
}

describe('ADR-008 content client boundary (AC-09)', () => {
	it('no $lib/content module imports server-only or private env', async () => {
		const root = join(process.cwd(), 'src/lib/content');
		const files = await listContentModuleTsFiles(root);
		expect(files.length).toBeGreaterThan(0);
		for (const f of files) {
			const text = await readFile(f, 'utf8');
			expect(text).not.toContain('$lib/server');
			expect(text).not.toContain('$env/static/private');
		}
	});
});

describe('design-portfolio removal (AC-01)', () => {
	it('legacy file is absent and src does not import $lib/content/design-portfolio', async () => {
		expect(existsSync(join(process.cwd(), 'src/lib/content/design-portfolio.ts'))).toBe(false);
		const files = await walkSrcSourceFiles(join(process.cwd(), 'src'));
		expect(files.length).toBeGreaterThan(0);
		for (const f of files) {
			const text = await readFile(f, 'utf8');
			expect(text).not.toContain('$lib/content/design-portfolio');
		}
	});
});
