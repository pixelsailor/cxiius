import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

describe('src/lib/content/INDEX.md inventory (AC-12)', () => {
	it('documents unified projects.ts, includeInPortfolio, image rules, and getters', async () => {
		const text = await readFile(join(process.cwd(), 'src/lib/content/INDEX.md'), 'utf8');
		expect(text).toContain('`projects.ts`');
		expect(text).toContain('includeInPortfolio');
		expect(text).toContain('getDesignPortfolio()');
		expect(text).toContain('getProjects()');
		expect(text).toContain('thumbnail');
		expect(text).toContain('Non-portfolio');
		expect(text).not.toContain('design-portfolio.ts');
	});
});
