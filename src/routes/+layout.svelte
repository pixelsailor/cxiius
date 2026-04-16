<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { removeNoJsClassFromBody } from '$lib/utils/jsEnabled';
	import type { RouteId } from '$app/types';

	let { children } = $props();

	onMount(() => {
		removeNoJsClassFromBody();
	});

	const navItems: { label: string; path: RouteId }[] = [
		{ label: 'Home', path: '/' },
		{ label: 'Resume', path: '/resume' }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link href="https://fonts.googleapis.com/css?family=Fredericka+the+Great&amp;display=swap" rel="stylesheet" />
	<link href="https://unpkg.com/@csstools/normalize.css" rel="stylesheet" />
	<link rel="stylesheet" href="/styles/tokens.css" />
	<link rel="stylesheet" href="/styles/typography.css" />
	<link rel="stylesheet" href="/styles/layout.css" />
	<link rel="stylesheet" href="/styles/app.css" />
</svelte:head>

<div class="layout-container">
	<header>
		<div>
			<div class="title-card-container">
				<h1 class="display-large fredericka title-card">CXII</h1>
			</div>
			<nav class="main-nav">
				<ul class="main-nav-list">
					{#each navItems as item (item.path)}
						<li class="main-nav-item">
							<a href={resolve(item.path)} class="main-nav-link">{item.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
		<div class="header-controls"></div>
	</header>
	<main>
		{@render children()}
	</main>
	<footer>
		<span class="label-small"> &copy; 2026 Benjamin Thompson. All rights reserved. </span>
	</footer>
</div>

<style>
	.layout-container {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}

	header {
		display: var(--header-display);
		justify-content: var(--header-justify-content);
		align-items: var(--header-align-items);
		padding: var(--header-padding);
	}

	/* .title-card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  } */

	.title-card {
		/* font-size: 5rem; */
		letter-spacing: 0.15em;
		line-height: 1;
		margin: 0;
	}

	.main-nav-list {
		display: flex;
		gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	main {
		padding: 0 1rem;
	}

	footer {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.25rem;
		color: var(--foreground-alt);
	}
</style>
