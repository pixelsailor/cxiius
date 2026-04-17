import { describe, it, expect } from 'vitest';
import type { DesignPortfolioEntry } from '$lib/content/design-portfolio';
import { circaYearFromString, filterEntries, parseFilter, pickHero, typeQueryFromPageHref, typeQueryFromSearch } from './portfolio-load';

function entry(overrides: Partial<DesignPortfolioEntry> & Pick<DesignPortfolioEntry, 'slug'>): DesignPortfolioEntry {
	return {
		name: 'N',
		projectType: 'ui',
		images: { thumbnail: 't', hero: 'h', full: 'f' },
		circa: '2000',
		technologies: [],
		summary: 's',
		description: 'd',
		...overrides
	};
}

describe('circaYearFromString', () => {
	it('parses leading four-digit year', () => {
		expect(circaYearFromString('2024 - product UI')).toBe(2024);
		expect(circaYearFromString('  2019 - Q2  ')).toBe(2019);
	});

	it('returns 0 when no leading year', () => {
		expect(circaYearFromString('no year here')).toBe(0);
		expect(circaYearFromString('')).toBe(0);
	});
});

describe('parseFilter', () => {
	it('maps null, empty, and all to all', () => {
		expect(parseFilter(null)).toBe('all');
		expect(parseFilter('')).toBe('all');
		expect(parseFilter('all')).toBe('all');
	});

	it('accepts valid project types', () => {
		expect(parseFilter('branding')).toBe('branding');
		expect(parseFilter('illustration')).toBe('illustration');
		expect(parseFilter('ui')).toBe('ui');
	});

	it('defaults invalid values to all', () => {
		expect(parseFilter('nope')).toBe('all');
		expect(parseFilter('BRANDING')).toBe('all');
	});
});

describe('typeQueryFromSearch', () => {
	it('matches URLSearchParams.get("type") for representative URLs (prerender-safe alternative)', () => {
		for (const href of ['http://localhost/portfolio', 'http://localhost/portfolio?type=ui', 'http://localhost/portfolio?type=branding&other=1']) {
			const u = new URL(href);
			expect(typeQueryFromSearch(u.search)).toBe(u.searchParams.get('type'));
		}
	});

	it('extracts type from query string with or without leading ?', () => {
		expect(typeQueryFromSearch('?type=ui')).toBe('ui');
		expect(typeQueryFromSearch('type=branding')).toBe('branding');
	});

	it('returns first type param when multiple', () => {
		expect(typeQueryFromSearch('?foo=1&type=illustration&type=ui')).toBe('illustration');
	});

	it('decodes URI-encoded values', () => {
		expect(typeQueryFromSearch('?type=ui%26x')).toBe('ui&x');
	});

	it('returns null when type absent or empty', () => {
		expect(typeQueryFromSearch('')).toBeNull();
		expect(typeQueryFromSearch('?other=1')).toBeNull();
	});
});

describe('typeQueryFromPageHref', () => {
	it('parses type from full page href before hash', () => {
		expect(typeQueryFromPageHref('https://example.com/portfolio?type=ui')).toBe('ui');
		expect(typeQueryFromPageHref('/portfolio?type=branding#section')).toBe('branding');
	});

	it('returns null when no query', () => {
		expect(typeQueryFromPageHref('/portfolio')).toBeNull();
	});
});

describe('filterEntries', () => {
	const entries: DesignPortfolioEntry[] = [entry({ slug: 'a', projectType: 'branding' }), entry({ slug: 'b', projectType: 'ui' })];

	it('returns all entries for all', () => {
		expect(filterEntries(entries, 'all')).toEqual(entries);
	});

	it('filters by project type', () => {
		expect(filterEntries(entries, 'branding').map((e) => e.slug)).toEqual(['a']);
		expect(filterEntries(entries, 'ui').map((e) => e.slug)).toEqual(['b']);
		expect(filterEntries(entries, 'illustration')).toEqual([]);
	});
});

describe('pickHero', () => {
	it('prefers featuredAsHero when present (first in array order)', () => {
		const entries: DesignPortfolioEntry[] = [entry({ slug: 'old', circa: '2099', featuredAsHero: true }), entry({ slug: 'newer', circa: '2099 - later' })];
		expect(pickHero(entries).slug).toBe('old');
	});

	it('picks greatest circa year when no featured flag', () => {
		const entries: DesignPortfolioEntry[] = [entry({ slug: 'y2020', circa: '2020' }), entry({ slug: 'y2024', circa: '2024 - Q1' }), entry({ slug: 'y2021', circa: '2021' })];
		expect(pickHero(entries).slug).toBe('y2024');
	});

	it('on tie keeps earlier array entry', () => {
		const entries: DesignPortfolioEntry[] = [entry({ slug: 'first', circa: '2020 - A' }), entry({ slug: 'second', circa: '2020 - B' })];
		expect(pickHero(entries).slug).toBe('first');
	});
});
