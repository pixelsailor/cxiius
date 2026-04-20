import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { getDesignPortfolio } from '$lib/content/design-portfolio';
import { getNeighborSlugs } from '$lib/utils/portfolio-neighbors';
import PortfolioSlugPage from './+page.svelte';
import type { PageData } from './$types';

const gotoMock = vi.hoisted(() => vi.fn(() => Promise.resolve()));

vi.mock('$app/navigation', () => ({
	goto: gotoMock
}));

vi.mock('$app/paths', () => ({
	resolve: (path: string) => path
}));

vi.mock('bits-ui', async (importOriginal) => {
	const actual = await importOriginal<typeof import('bits-ui')>();
	const { default: StubButtonRoot } = await import('./bits-ui-button-stub.svelte');
	return {
		...actual,
		Button: {
			...actual.Button,
			Root: StubButtonRoot
		}
	};
});

async function buildNonEmptyPageData(): Promise<{
	data: PageData;
	expectedPrev: string;
	expectedNext: string;
}> {
	const list = await getDesignPortfolio();
	const entry = list[Math.floor(list.length / 2)] ?? list[0];
	if (entry === undefined) {
		throw new Error('no portfolio entries');
	}
	const slugs = list.map((e) => e.slug);
	const n = getNeighborSlugs(slugs, entry.slug);
	if (n === null) {
		throw new Error('neighbor resolution failed');
	}
	const data: PageData = {
		title: entry.name,
		slug: entry.slug,
		entry,
		prevSlug: n.prevSlug,
		nextSlug: n.nextSlug
	};
	return { data, expectedPrev: n.prevSlug, expectedNext: n.nextSlug };
}

describe('portfolio [slug] +page.svelte keyboard navigation', () => {
	it('ArrowLeft calls goto with resolved prev portfolio path (AC-08)', async () => {
		gotoMock.mockClear();
		const { data, expectedPrev } = await buildNonEmptyPageData();
		await render(PortfolioSlugPage, { data });
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		expect(gotoMock).toHaveBeenCalledOnce();
		expect(gotoMock).toHaveBeenCalledWith(`/portfolio/${expectedPrev}`);
	});

	it('ArrowRight calls goto with resolved next portfolio path (AC-09)', async () => {
		gotoMock.mockClear();
		const { data, expectedNext } = await buildNonEmptyPageData();
		await render(PortfolioSlugPage, { data });
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		expect(gotoMock).toHaveBeenCalledOnce();
		expect(gotoMock).toHaveBeenCalledWith(`/portfolio/${expectedNext}`);
	});

	it('does not call goto for ArrowLeft/ArrowRight when entry is null (AC-07)', async () => {
		gotoMock.mockClear();
		const data: PageData = {
			title: 'Portfolio project',
			slug: '__missing__',
			entry: null,
			prevSlug: null,
			nextSlug: null
		};
		await render(PortfolioSlugPage, { data });
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		expect(gotoMock).not.toHaveBeenCalled();
	});

	it('does not navigate from input focus (AC-10)', async () => {
		gotoMock.mockClear();
		const { data } = await buildNonEmptyPageData();
		const { container } = await render(PortfolioSlugPage, { data });
		const input = document.createElement('input');
		container.appendChild(input);
		input.focus();
		expect(document.activeElement).toBe(input);
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		expect(gotoMock).not.toHaveBeenCalled();
	});

	it('does not navigate from textarea or select focus (AC-10)', async () => {
		gotoMock.mockClear();
		const { data } = await buildNonEmptyPageData();
		const { container } = await render(PortfolioSlugPage, { data });
		const textarea = document.createElement('textarea');
		container.appendChild(textarea);
		textarea.focus();
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
		expect(gotoMock).not.toHaveBeenCalled();

		gotoMock.mockClear();
		const select = document.createElement('select');
		container.appendChild(select);
		select.focus();
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		expect(gotoMock).not.toHaveBeenCalled();
	});

	it('does not navigate when contenteditable is focused (AC-11)', async () => {
		gotoMock.mockClear();
		const { data } = await buildNonEmptyPageData();
		const { container } = await render(PortfolioSlugPage, { data });
		const editable = document.createElement('div');
		editable.setAttribute('contenteditable', 'true');
		container.appendChild(editable);
		editable.focus();
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
		expect(gotoMock).not.toHaveBeenCalled();
	});
});
