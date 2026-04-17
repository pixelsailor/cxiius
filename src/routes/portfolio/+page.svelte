<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	type PortfolioFilterKey = 'all' | 'branding' | 'illustration' | 'ui';

	const filterOptions: { key: PortfolioFilterKey; label: string }[] = [
		{ key: 'all', label: 'Show all' },
		{ key: 'branding', label: 'Branding & Identity' },
		{ key: 'illustration', label: 'Illustration' },
		{ key: 'ui', label: 'User Interface' }
	];

	function onFilterClick(event: MouseEvent, key: PortfolioFilterKey) {
		if (!browser) return;
		event.preventDefault();
		const dest = key === 'all' ? resolve('/portfolio') : resolve('/portfolio') + '?type=' + key;
		goto(dest, {
			replaceState: true,
			noScroll: true,
			keepFocus: true
		});
	}
</script>

<svelte:head>
	<title>Portfolio | CXII</title>
</svelte:head>

<div class="portfolio-page">
	<div class="rainbow-stripe" aria-hidden="true"></div>

	<section class="hero-panel" aria-labelledby="portfolio-title">
		<h1 id="portfolio-title" class="page-title">Portfolio</h1>

		<div class="hero-glass">
			<div class="hero-grid">
				<div class="hero-copy">
					<h2 class="hero-name">{data.hero.name}</h2>
					<p class="hero-summary">{data.hero.summary}</p>
					<p class="hero-meta">
						<span class="hero-circa">{data.hero.circa}</span>
						<span class="hero-dot" aria-hidden="true"> - </span>
						<span>{data.hero.technologies.join(', ')}</span>
					</p>
					<a class="hero-cta" href={resolve('/portfolio/[slug]', { slug: data.hero.slug })}>View project</a>
				</div>
				<div class="hero-visual">
					<img class="hero-img" src={data.hero.images.hero} alt="" width="1200" height="640" loading="eager" decoding="async" />
				</div>
			</div>
		</div>
	</section>

	<section class="featured-section" aria-labelledby="featured-heading">
		<h2 id="featured-heading" class="section-title">Featured works</h2>

		<nav class="filter-nav" aria-label="Filter by project type">
			<ul class="filter-list">
				{#each filterOptions as item (item.key)}
					<li>
						<a
							class="filter-link"
							href={item.key === 'all' ? resolve('/portfolio') : resolve('/portfolio') + '?type=' + item.key}
							aria-current={data.filterKey === item.key ? 'page' : undefined}
							onclick={(e) => onFilterClick(e, item.key)}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<ul class="card-grid">
			{#each data.filteredEntries as entry (entry.slug)}
				<li class="card">
					<a class="card-link" href={resolve('/portfolio/[slug]', { slug: entry.slug })}>
						<div class="thumb-wrap">
							<img class="thumb-img" src={entry.images.thumbnail} alt="" width="480" height="320" loading="lazy" decoding="async" />
							<div class="thumb-sheen" aria-hidden="true"></div>
						</div>
						<div class="card-body">
							<h3 class="card-title">{entry.name}</h3>
							<p class="card-summary">{entry.summary}</p>
						</div>
					</a>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.portfolio-page {
		--pf-bg: hsl(240 12% 6%);
		--pf-glass: hsla(240 14% 14% / 0.55);
		--pf-glass-border: hsla(0 0% 100% / 0.12);
		--pf-neon: #39ff14;
		--pf-neon-dim: hsl(108 100% 38%);
		--pf-text: hsl(0 0% 96%);
		--pf-muted: hsl(240 6% 72%);

		background: var(--pf-bg);
		color: var(--pf-text);
		margin: 0 -1rem;
		padding: 0 1rem 3rem;
		min-height: 60vh;
	}

	.rainbow-stripe {
		height: 4px;
		width: 100%;
		background: linear-gradient(90deg, #ff006e, #fb5607, #ffbe0b, #8338ec, #3a86ff, #06d6a0);
		border-radius: 2px;
		margin-bottom: 1.25rem;
	}

	.page-title {
		font-size: clamp(1.75rem, 4vw, 2.25rem);
		font-weight: 600;
		margin: 0 0 1rem;
		letter-spacing: 0.02em;
	}

	.hero-panel {
		margin-bottom: 2.5rem;
	}

	.hero-glass {
		background: var(--pf-glass);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border: 1px solid var(--pf-glass-border);
		border-radius: 1rem;
		padding: 1.25rem;
		box-shadow: 0 12px 40px hsla(0 0% 0% / 0.35);
	}

	.hero-grid {
		display: grid;
		gap: 1.5rem;
		align-items: center;
	}

	@media (min-width: 768px) {
		.hero-grid {
			grid-template-columns: 1fr 1.1fr;
		}
	}

	.hero-name {
		font-size: clamp(1.35rem, 3vw, 1.75rem);
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	.hero-summary {
		margin: 0 0 0.75rem;
		line-height: 1.5;
		color: var(--pf-muted);
	}

	.hero-meta {
		margin: 0 0 1rem;
		font-size: 0.9rem;
		color: var(--pf-muted);
	}

	.hero-dot {
		opacity: 0.6;
	}

	.hero-cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-height: 44px;
		padding: 0.5rem 1rem;
		border-radius: 0.35rem;
		border: 1px solid var(--pf-neon);
		color: var(--pf-neon);
		text-decoration: none;
		font-weight: 600;
	}

	@media (prefers-reduced-motion: no-preference) {
		.hero-cta {
			transition:
				background 0.2s ease,
				color 0.2s ease,
				box-shadow 0.2s ease;
		}
	}

	.hero-cta:hover {
		background: hsla(108 100% 50% / 0.12);
		box-shadow: 0 0 18px hsla(108 100% 50% / 0.25);
	}

	.hero-visual {
		border-radius: 0.5rem;
		overflow: hidden;
		border: 1px solid var(--pf-glass-border);
	}

	.hero-img {
		display: block;
		width: 100%;
		height: auto;
	}

	.section-title {
		font-size: 1.35rem;
		font-weight: 600;
		margin: 0 0 1rem;
	}

	.filter-nav {
		margin-bottom: 1.5rem;
	}

	.filter-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.filter-link {
		color: var(--pf-neon);
		text-decoration: underline;
		text-underline-offset: 0.2em;
		font-weight: 600;
	}

	.filter-link:hover {
		color: var(--pf-neon-dim);
	}

	.card-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	@media (min-width: 900px) {
		.card-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card {
		margin: 0;
	}

	.card-link {
		display: block;
		height: 100%;
		text-decoration: none;
		color: inherit;
		background: hsla(240 14% 12% / 0.9);
		border: 1px solid hsla(0 0% 100% / 0.08);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	@media (prefers-reduced-motion: no-preference) {
		.card-link {
			transition:
				transform 0.2s ease,
				box-shadow 0.2s ease,
				border-color 0.2s ease;
		}
	}

	.card-link:hover {
		border-color: hsla(108 100% 50% / 0.35);
		box-shadow: 0 10px 28px hsla(0 0% 0% / 0.35);
		transform: translateY(-2px);
	}

	.thumb-wrap {
		position: relative;
		overflow: hidden;
	}

	.thumb-img {
		display: block;
		width: 100%;
		height: auto;
	}

	.thumb-sheen {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, hsla(0 0% 100% / 0.22) 0%, hsla(0 0% 100% / 0) 42%, hsla(0 0% 100% / 0.08) 100%);
		pointer-events: none;
	}

	.card-body {
		padding: 1rem 1rem 1.25rem;
	}

	.card-title {
		font-size: 1.1rem;
		font-weight: 600;
		margin: 0 0 0.35rem;
	}

	.card-summary {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.45;
		color: var(--pf-muted);
	}
</style>
