import { describe, expect, it } from 'vitest';
import { getNeighborSlugs } from './portfolio-neighbors';

describe('getNeighborSlugs', () => {
	const ordered = ['a', 'b', 'c', 'd'] as const;

	it('returns wrapped neighbors for a middle entry', () => {
		expect(getNeighborSlugs(ordered, 'b')).toEqual({ prevSlug: 'a', nextSlug: 'c' });
	});

	it('wraps previous from first to last', () => {
		expect(getNeighborSlugs(ordered, 'a')).toEqual({ prevSlug: 'd', nextSlug: 'b' });
	});

	it('wraps next from last to first', () => {
		expect(getNeighborSlugs(ordered, 'd')).toEqual({ prevSlug: 'c', nextSlug: 'a' });
	});

	it('uses the same slug for prev and next when the list has one entry', () => {
		expect(getNeighborSlugs(['solo'], 'solo')).toEqual({ prevSlug: 'solo', nextSlug: 'solo' });
	});

	it('returns null when currentSlug is missing', () => {
		expect(getNeighborSlugs(ordered, 'missing')).toBeNull();
	});
});
