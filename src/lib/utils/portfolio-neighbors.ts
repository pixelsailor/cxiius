/**
 * Wrapped prev/next slugs in a fixed order. Returns null when `currentSlug` is absent.
 */
export function getNeighborSlugs(orderedSlugs: readonly string[], currentSlug: string): { prevSlug: string; nextSlug: string } | null {
	const i = orderedSlugs.indexOf(currentSlug);
	if (i === -1) {
		return null;
	}
	const n = orderedSlugs.length;
	const prevSlug = orderedSlugs[(i - 1 + n) % n];
	const nextSlug = orderedSlugs[(i + 1) % n];
	return { prevSlug, nextSlug };
}
