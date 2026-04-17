<script lang="ts">
	import { Button } from 'bits-ui';

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
	<title>Benjamin Thompson - Portfolio</title>
	<meta name="description" content="Benjamin Thompson - Portfolio" />
</svelte:head>

<div class="container portfolio-page" id="page-top">
	<section class="hero-panel" aria-labelledby="portfolio-title">
		<h1 id="portfolio-title" class="headline-large sr-only">Portfolio</h1>

		<div class="hero">
			<picture>
				<img class="hero-img" src={data.hero.images.hero} alt={data.hero.name} width="933" height="347" loading="eager" decoding="async" />
			</picture>
			<div class="hero-glass"></div>
		</div>	
	</section>

	<section class="featured-section" aria-labelledby="featured-heading">
		<h2 id="featured-heading" class="headline-small fredericka section-title">Featured works</h2>

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
							<img class="thumb-img" src={entry.images.thumbnail} alt={entry.name} loading="lazy" decoding="async" />
							<div class="glass" aria-hidden="true"></div>
						</div>
						<div class="card-body sr-only">
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
	.hero {
		position: relative;
		/* aspect ratio 16:9 of 933x525 */
		max-width: 933px;
		/* height: 525px; */
		max-height: 347px;
		padding: 0.5rem;
		overflow: hidden;
		box-shadow: 0 1px 4px hsla(0 0% 0% / 0.15);
		border-radius: 0.25rem;
	}

	/* .hero-glass {
		background: var(--pf-glass);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border: 1px solid var(--pf-glass-border);
		border-radius: 1rem;
		padding: 1.25rem;
		box-shadow: 0 12px 40px hsla(0 0% 0% / 0.35);
	} */

	/* .hero-visual {
		overflow: hidden;
	} */

	.hero-img {
		max-width: 100%;
		object-fit: cover;
	}

	.hero-panel,
	.featured-section {
		margin-block: 3rem;
	}

	.section-title {
		text-transform: uppercase;
		letter-spacing: 0.05em;
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

	.card-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
		align-items: stretch;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	@media (min-width: 600px) {
		.card-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 900px) {
		.card-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card {
		position: relative;
		padding: 0.5rem;
		transform-origin: center;
		box-shadow: 0 1px 4px hsla(0 0% 0% / 0.15);
		border-radius: 0.25rem;
	}

	@media (prefers-reduced-motion: no-preference) {
		.card {
			transition: transform 0.22s ease-out;
		}

		.card:hover {
			transform: scale(1.02) rotate(1deg);
		}
	}

	.thumb-wrap {
		max-height: 105px;
		overflow: hidden;
	}

	.thumb-img {
		max-width: 100%;
		object-fit: cover;
	}

	.thumb-sheen,
	.hero-glass,
	.glass {
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, hsla(0 0% 100% / 0.22) 0%, hsla(0 0% 100% / 0) 42%, hsla(0 0% 100% / 0.08) 100%);
		pointer-events: none;
		border-radius: 0.25rem;
		border: 1px solid var(--border-card);
	}
</style>
