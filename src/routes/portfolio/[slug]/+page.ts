import { getDesignPortfolio } from '$lib/content/design-portfolio';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = async (): Promise<{ slug: string }[]> => {
	const list = await getDesignPortfolio();
	return list.map((e) => ({ slug: e.slug }));
};

export const load: PageLoad = async ({ params }) => {
	const list = await getDesignPortfolio();
	const entry = list.find((e) => e.slug === params.slug);
	return {
		title: entry !== undefined ? entry.name : 'Portfolio project',
		slug: params.slug
	};
};
