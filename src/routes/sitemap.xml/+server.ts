import { getDesignPortfolio } from '$lib/content/projects';
import type { RequestHandler } from './$types';

const STATIC_ROUTES = ['/', '/about', '/resume', '/portfolio', '/playground'] as const;

function escapeXml(value: string): string {
	return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;
	const portfolioEntries = await getDesignPortfolio();
	const paths = [...STATIC_ROUTES, ...portfolioEntries.map((entry) => `/portfolio/${entry.slug}`)];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
	.map((path) => {
		const location = escapeXml(new URL(path, origin).toString());
		return `  <url><loc>${location}</loc></url>`;
	})
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
