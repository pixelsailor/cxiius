import { describe, it, expect } from 'vitest';
import { circaYearFromString } from '$lib/utils/circa-year';
import { DESIGN_PORTFOLIO_PROJECT_TYPES, getDesignPortfolio, getProjects, type DesignPortfolioEntry, type DesignPortfolioImage, type ProjectContentEntry } from './projects';

/** Remote URL, site-root static path, or bare filename under `static/` (e.g. hero composed with `/images/` in the route). */
function isImageRef(s: string): boolean {
	if (s.startsWith('https://')) return true;
	if (s.startsWith('/images/')) return true;
	return /^[a-zA-Z0-9._-]+\.(webp|png|jpe?g)$/i.test(s);
}

function assertDesignPortfolioImage(img: DesignPortfolioImage): void {
	expect(typeof img.alt).toBe('string');
	expect(isImageRef(img.src)).toBe(true);
}

describe('getDesignPortfolio', () => {
	it('returns a Promise of entries', async () => {
		const p = getDesignPortfolio();
		expect(p).toBeInstanceOf(Promise);
		const entries = await p;
		expect(Array.isArray(entries)).toBe(true);
		expect(entries.length).toBeGreaterThan(0);
	});

	it('orders entries by circa year descending (most recent first)', async () => {
		const entries = await getDesignPortfolio();
		for (let i = 1; i < entries.length; i++) {
			const prev = circaYearFromString(entries[i - 1].circa);
			const cur = circaYearFromString(entries[i].circa);
			expect(prev).toBeGreaterThanOrEqual(cur);
		}
	});

	it('exposes expected fields on each portfolio entry', async () => {
		const entries = await getDesignPortfolio();
		for (const e of entries) {
			expect(e.includeInPortfolio).toBe(true);
			expect(typeof e.status).toBe('string');
			expect(typeof e.slug).toBe('string');
			expect(typeof e.name).toBe('string');
			expect(DESIGN_PORTFOLIO_PROJECT_TYPES).toContain(e.projectType);
			assertDesignPortfolioImage(e.images.thumbnail);
			if (e.images.hero !== undefined) {
				assertDesignPortfolioImage(e.images.hero);
			}
			assertDesignPortfolioImage(e.images.full);
			if (e.images.showcase !== undefined) {
				expect(Array.isArray(e.images.showcase)).toBe(true);
				for (const shot of e.images.showcase) {
					assertDesignPortfolioImage(shot);
				}
			}
			expect(typeof e.circa).toBe('string');
			expect(Array.isArray(e.technologies)).toBe(true);
			expect(typeof e.summary).toBe('string');
			expect(typeof e.description).toBe('string');
		}
	});

	it('uses placehold.co for remote placeholders where applicable', async () => {
		const entries = await getDesignPortfolio();
		const remoteUrls: string[] = [];
		for (const e of entries) {
			const urls = [e.images.thumbnail.src, e.images.full.src, ...(e.images.hero !== undefined ? [e.images.hero.src] : []), ...(e.images.showcase ?? []).map((img) => img.src)];
			for (const url of urls) {
				if (url.startsWith('https://')) remoteUrls.push(url);
			}
		}
		expect(remoteUrls.every((url) => url.includes('placehold.co'))).toBe(true);
	});

	it('has at most one featuredAsHero in seed data', async () => {
		const entries = await getDesignPortfolio();
		const featured = entries.filter((e: DesignPortfolioEntry) => e.featuredAsHero === true);
		expect(featured.length).toBeLessThanOrEqual(1);
	});

	it('excludes non-portfolio slugs from the portfolio list', async () => {
		const entries = await getDesignPortfolio();
		expect(entries.some((e) => e.slug === 'whats-for-dinner')).toBe(false);
	});
});

describe('getProjects', () => {
	it('returns a stable superset including non-portfolio entries', async () => {
		const all = await getProjects();
		const portfolio = await getDesignPortfolio();
		expect(all.length).toBeGreaterThanOrEqual(portfolio.length);
		const dinner = all.find((e) => e.slug === 'whats-for-dinner');
		expect(dinner).toBeDefined();
		if (dinner === undefined) {
			return;
		}
		expect(dinner.includeInPortfolio).toBe(false);
		expect('context' in dinner).toBe(true);
	});

	it('narrows personal-project shape when includeInPortfolio is false', async () => {
		const all: ProjectContentEntry[] = await getProjects();
		for (const e of all) {
			if (e.includeInPortfolio) {
				expect(e.images.thumbnail).toBeDefined();
				expect(e.images.full).toBeDefined();
			} else {
				expect('context' in e).toBe(true);
				if (e.slug === 'whats-for-dinner') {
					expect(e.projectType).toBeUndefined();
				}
			}
		}
	});
});
