<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.title} | CXII</title>
</svelte:head>

<article class="portfolio-stub">
	<h1>{data.title}</h1>
	<p class="lede">Project detail is not available yet. Check back later.</p>
	<p class="meta">Slug: {data.slug}</p>
</article>

<style>
	.portfolio-stub {
		max-width: 40rem;
		margin: 2rem auto;
		padding: 1rem;
	}

	.lede {
		font-size: 1.1rem;
		margin-top: 0.75rem;
	}

	.meta {
		color: var(--foreground-alt);
		font-size: 0.9rem;
		margin-top: 1.5rem;
	}
</style>
