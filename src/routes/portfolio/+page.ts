import { getDesignPortfolio } from '$lib/content/projects';
import { filterEntries, parseFilter, pickHero, typeQueryFromPageHref } from '$lib/utils/portfolio-load';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ url }) => {
  const entries = await getDesignPortfolio();
  // Prerender: `url.search` and `url.searchParams` are inaccessible; `href` is not.
  const filterKey = parseFilter(typeQueryFromPageHref(url.href));
  const filteredEntries = filterEntries(entries, filterKey);
  const hero = pickHero(entries);
  return {
    filterKey,
    entries,
    filteredEntries,
    hero
  };
};
