import { describe, it, expect } from 'vitest';
import { DESIGN_PORTFOLIO_PROJECT_TYPES, getDesignPortfolio, type DesignPortfolioEntry } from './design-portfolio';

/** Remote URL, site-root static path, or bare filename under `static/` (e.g. hero composed with `/images/` in the route). */
function isImageRef(s: string): boolean {
	if (s.startsWith('https://')) return true;
	if (s.startsWith('/images/')) return true;
	return /^[a-zA-Z0-9._-]+\.(webp|png|jpe?g)$/i.test(s);
}

describe('getDesignPortfolio', () => {
	it('returns a Promise of entries', async () => {
		const p = getDesignPortfolio();
		expect(p).toBeInstanceOf(Promise);
		const entries = await p;
		expect(Array.isArray(entries)).toBe(true);
		expect(entries.length).toBeGreaterThan(0);
	});

	it('exposes expected fields on each entry', async () => {
		const entries = await getDesignPortfolio();
		for (const e of entries) {
			expect(typeof e.slug).toBe('string');
			expect(typeof e.name).toBe('string');
			expect(DESIGN_PORTFOLIO_PROJECT_TYPES).toContain(e.projectType);
			expect(isImageRef(e.images.thumbnail)).toBe(true);
			expect(isImageRef(e.images.hero)).toBe(true);
			expect(isImageRef(e.images.full)).toBe(true);
			expect(typeof e.circa).toBe('string');
			expect(Array.isArray(e.technologies)).toBe(true);
			expect(typeof e.summary).toBe('string');
			expect(typeof e.description).toBe('string');
		}
	});

	it('uses placehold.co for remote placeholders where applicable', async () => {
		const entries = await getDesignPortfolio();
		for (const e of entries) {
			for (const url of [e.images.thumbnail, e.images.hero, e.images.full]) {
				if (url.startsWith('https://')) {
					expect(url).toContain('placehold.co');
				}
			}
		}
	});

	it('has at most one featuredAsHero in seed data', async () => {
		const entries = await getDesignPortfolio();
		const featured = entries.filter((e: DesignPortfolioEntry) => e.featuredAsHero === true);
		expect(featured.length).toBeLessThanOrEqual(1);
	});
});
