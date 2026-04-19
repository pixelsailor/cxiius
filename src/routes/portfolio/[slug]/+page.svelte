<script lang="ts">
	import { Button } from 'bits-ui';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const entry = $derived(data.entry);
	// const leadImage = $derived(entry !== null ? (entry.images.hero ?? entry.images.full) : null);
	// const leadAlt = $derived(entry !== null && leadImage !== null ? (leadImage.alt.trim() !== '' ? leadImage.alt : entry.name) : '');
	// const showFullImage = $derived(entry !== null && leadImage !== null && entry.images.full.src !== leadImage.src);
	const leadImage = $derived(entry !== null ? entry.images.full : null);
	const leadAlt = $derived(entry !== null ? entry.images.full.alt : '');
</script>

<svelte:head>
	<title>{data.title} | CXII</title>
	{#if entry !== null}
		<meta name="description" content={entry.summary} />
	{/if}
</svelte:head>

<div class="container portfolio-entry-page" id="page-top">
	{#if entry === null}
		<article class="portfolio-stub">
			<h1 class="headline-large">This project was not found.</h1>
			<Button.Root class="button" href={resolve('/portfolio')}>Back to portfolio</Button.Root>
		</article>
	{:else}
		<article class="portfolio-entry">
			<header class="entry-header">
				<h1 class="headline-large">{entry.name}</h1>
				<p class="entry-meta label-large">
					<span class="entry-type">{entry.projectType}</span>
					<span class="entry-sep" aria-hidden="true">-</span>
					<span class="entry-circa">{entry.circa}</span>
				</p>
			</header>

			{#if leadImage !== null}
				<picture class="lead-img-wrap">
					<img class="lead-img" src={leadImage.src} alt={leadAlt} loading="eager" decoding="async" />
				</picture>
			{/if}

			{#if entry.images.showcase !== undefined && entry.images.showcase.length > 0}
				{#each entry.images.showcase as shot, i (`${entry.slug}-showcase-${i}`)}
					<picture class="showcase-img-wrap">
						<img class="showcase-img" src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
					</picture>
				{/each}
			{/if}

			<p class="description body-large">
				{entry.description}
			</p>

			{#if entry.liveUrl !== undefined && entry.liveUrl.trim() !== ''}
				<p class="live-link-wrap">
					<!-- `liveUrl` is an external project URL from content; not an in-app path. -->
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
					<a class="live-link" href={entry.liveUrl} rel="noopener noreferrer">View live</a>
				</p>
			{/if}

			<section class="tech-section" aria-labelledby="tech-heading">
				<h2 id="tech-heading" class="title-large">Technologies Used</h2>
				<ul class="tech-list">
					{#each entry.technologies as tech (tech)}
						<li class="label-small tech-item">{tech}</li>
					{/each}
				</ul>
			</section>

			<!-- {#if entry.images.showcase !== undefined && entry.images.showcase.length > 0}
				<section class="showcase-section" aria-labelledby="showcase-heading">
					<h2 id="showcase-heading" class="headline-small">Showcase</h2>
					<ul class="showcase-grid">
						{#each entry.images.showcase as shot, i (`${entry.slug}-showcase-${i}`)}
							<li class="showcase-item">
								<img class="showcase-img" src={shot.src} alt={shot.alt.trim() !== '' ? shot.alt : `${entry.name} showcase ${i + 1}`} loading="lazy" decoding="async" />
							</li>
						{/each}
					</ul>
				</section>
			{/if} -->
		</article>
	{/if}
</div>

<style>
	article {
		margin-block: 1.25rem;
	}

	.portfolio-stub {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
	}

	.portfolio-entry {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.entry-meta {
		color: var(--foreground-alt);
		font-style: italic;
	}

	.entry-sep {
		margin: 0 0.35rem;
	}

	picture {
		width: 100%;
		border-radius: 0.375rem;
		overflow: hidden;
		box-shadow: 0 1px 4px hsla(0 0% 0% / 0.15);

		& + picture {
			margin-top: 2rem;
		}
	}

	.lead-img,
	.showcase-img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.description {
		white-space: pre-wrap;
	}

	.live-link-wrap {
		margin-bottom: 1.5rem;
	}

	.tech-section {
		margin-bottom: 2rem;
	}

	.tech-list {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem 0.75rem;
	}

	.tech-list li {
		padding: 0.2rem 0.5rem;
		background-color: var(--dark-04);
		border: 1px solid var(--border-card);
		border-radius: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		line-height: 1;
		font-weight: 200;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.showcase-section {
		margin-top: 2rem;
	}

	.showcase-grid {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	@media (min-width: 600px) {
		.showcase-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.showcase-item {
		margin: 0;
		padding: 0.35rem;
		border-radius: 0.25rem;
		box-shadow: 0 1px 4px hsla(0 0% 0% / 0.12);
	}

	.showcase-img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 0.2rem;
	}
</style>
