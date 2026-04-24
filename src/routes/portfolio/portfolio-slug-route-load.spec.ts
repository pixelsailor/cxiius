import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getDesignPortfolio } from '$lib/content/projects';
import { entries, load, prerender } from './[slug]/+page.js';
import type { PageData } from './[slug]/$types';

describe('portfolio [slug] +page load', () => {
  it('exports prerender true (AC-01)', () => {
    expect(prerender).toBe(true);
  });

  it('load returns serialisable data including prevSlug and nextSlug (AC-02)', async () => {
    const list = await getDesignPortfolio();
    const slug = list[0]?.slug ?? '';
    const raw = await load({ params: { slug } } as Parameters<typeof load>[0]);
    expect(raw).toBeTruthy();
    const data = raw as PageData;
    for (const v of Object.values(data)) {
      expect(v).not.toBeInstanceOf(Promise);
    }
  });

  it('returns matching prevSlug and nextSlug from getDesignPortfolio order (AC-03)', async () => {
    const list = await getDesignPortfolio();
    const slugs = list.map((e) => e.slug);
    const mid = slugs[Math.floor(slugs.length / 2)] ?? '';
    const i = slugs.indexOf(mid);
    const raw = await load({ params: { slug: mid } } as Parameters<typeof load>[0]);
    const data = raw as PageData;
    expect(data.entry).not.toBeNull();
    expect(data.prevSlug).toBe(slugs[(i - 1 + slugs.length) % slugs.length]);
    expect(data.nextSlug).toBe(slugs[(i + 1) % slugs.length]);
  });

  it('returns null entry and null neighbors for unknown slug (AC-04)', async () => {
    const raw = await load({
      params: { slug: '__no_such_portfolio_slug__' }
    } as Parameters<typeof load>[0]);
    const data = raw as PageData;
    expect(data.entry).toBeNull();
    expect(data.prevSlug).toBeNull();
    expect(data.nextSlug).toBeNull();
  });

  it('wraps first to last and last to first using real portfolio order (AC-05, AC-12)', async () => {
    const list = await getDesignPortfolio();
    const slugs = list.map((e) => e.slug);
    const first = slugs[0];
    const last = slugs[slugs.length - 1];
    expect(first).toBeDefined();
    expect(last).toBeDefined();
    if (first === undefined || last === undefined) {
      return;
    }
    const firstLoad = await load({ params: { slug: first } } as Parameters<typeof load>[0]);
    const firstData = firstLoad as PageData;
    expect(firstData.prevSlug).toBe(last);
    expect(firstData.nextSlug).toBe(slugs[1] ?? first);

    const lastLoad = await load({ params: { slug: last } } as Parameters<typeof load>[0]);
    const lastData = lastLoad as PageData;
    expect(lastData.nextSlug).toBe(first);
    expect(lastData.prevSlug).toBe(slugs[slugs.length - 2] ?? last);
  });

  it('does not use +page.server.ts for this route (AC-14)', () => {
    const p = join(process.cwd(), 'src/routes/portfolio/[slug]/+page.server.ts');
    expect(existsSync(p)).toBe(false);
  });

  it('entries() yields only portfolio getter slugs; non-portfolio slugs are omitted (AC-07)', async () => {
    const list = await getDesignPortfolio();
    const slugParams = await entries();
    expect(slugParams.map((p) => p.slug)).toEqual(list.map((e) => e.slug));
    expect(slugParams.some((p) => p.slug === 'whats-for-dinner')).toBe(false);
  });
});
