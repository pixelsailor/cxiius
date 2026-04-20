import type { DesignPortfolioEntry, DesignPortfolioProjectType } from '$lib/content/design-portfolio';
import { circaYearFromString } from '$lib/utils/circa-year';

export type PortfolioFilterKey = 'all' | DesignPortfolioProjectType;

const VALID_TYPES: DesignPortfolioProjectType[] = ['branding', 'illustration', 'ui'];

export { circaYearFromString };

export function parseFilter(raw: string | null): PortfolioFilterKey {
	if (raw === null || raw === '' || raw === 'all') return 'all';
	if (VALID_TYPES.includes(raw as DesignPortfolioProjectType)) return raw as DesignPortfolioProjectType;
	return 'all';
}

/** Parse `type` from a raw query string (used by tests and href parsing helpers). */
export function typeQueryFromSearch(search: string): string | null {
	const q = search.startsWith('?') ? search.slice(1) : search;
	if (q === '') return null;
	for (const part of q.split('&')) {
		const eq = part.indexOf('=');
		if (eq === -1) continue;
		const key = part.slice(0, eq);
		const value = part.slice(eq + 1);
		if (key === 'type') return decodeURIComponent(value);
	}
	return null;
}

export function typeQueryFromPageHref(href: string): string | null {
	const q = href.indexOf('?');
	if (q === -1) return null;
	const hash = href.indexOf('#', q);
	const search = hash === -1 ? href.slice(q) : href.slice(q, hash);
	return typeQueryFromSearch(search);
}

export function filterEntries(entries: DesignPortfolioEntry[], key: PortfolioFilterKey): DesignPortfolioEntry[] {
	if (key === 'all') return entries;
	return entries.filter((e) => e.projectType === key);
}

/**
 * Hero is always chosen from the full entry list (not the active filter), so the hero does not
 * disappear or re-resolve when the selected type excludes that project from the grid.
 */
export function pickHero(entries: DesignPortfolioEntry[]): DesignPortfolioEntry {
	const featured = entries.find((e) => e.featuredAsHero === true);
	if (featured !== undefined) return featured;
	return entries.reduce((best, cur) => {
		const cy = circaYearFromString(cur.circa);
		const by = circaYearFromString(best.circa);
		if (cy > by) return cur;
		if (cy < by) return best;
		return best;
	});
}
