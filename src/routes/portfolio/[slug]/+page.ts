import { getDesignPortfolio } from '$lib/content/projects';
import { getNeighborSlugs } from '$lib/utils/portfolio-neighbors';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = async (): Promise<{ slug: string }[]> => {
	const list = await getDesignPortfolio();
	return list.map((e) => ({ slug: e.slug }));
};

export const load: PageLoad = async ({ params }) => {
	const list = await getDesignPortfolio();
	const entry = list.find((e) => e.slug === params.slug) ?? null;
	const orderedSlugs = list.map((e) => e.slug);
	const neighbors = entry !== null ? getNeighborSlugs(orderedSlugs, params.slug) : null;
	return {
		title: entry !== null ? entry.name : 'Portfolio project',
		slug: params.slug,
		entry,
		prevSlug: neighbors !== null ? neighbors.prevSlug : null,
		nextSlug: neighbors !== null ? neighbors.nextSlug : null
	};
};
