import { describe, it, expect } from 'vitest';
import { DESIGN_PORTFOLIO_PROJECT_TYPES, getDesignPortfolio, type DesignPortfolioEntry } from './design-portfolio';

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
			expect(e.images.thumbnail).toMatch(/^https:\/\//);
			expect(e.images.hero).toMatch(/^https:\/\//);
			expect(e.images.full).toMatch(/^https:\/\//);
			expect(typeof e.circa).toBe('string');
			expect(Array.isArray(e.technologies)).toBe(true);
			expect(typeof e.summary).toBe('string');
			expect(typeof e.description).toBe('string');
		}
	});

	it('uses placehold.co URLs for image fields in seed data', async () => {
		const entries = await getDesignPortfolio();
		for (const e of entries) {
			for (const url of [e.images.thumbnail, e.images.hero, e.images.full]) {
				expect(url).toContain('placehold.co');
			}
		}
	});

	it('has at most one featuredAsHero in seed data', async () => {
		const entries = await getDesignPortfolio();
		const featured = entries.filter((e: DesignPortfolioEntry) => e.featuredAsHero === true);
		expect(featured.length).toBeLessThanOrEqual(1);
	});
});
