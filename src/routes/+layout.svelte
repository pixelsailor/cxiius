<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Popover, Slider } from 'bits-ui';

	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { isJavaScriptEnabled, removeNoJsClassFromBody } from '$lib/utils/jsEnabled';
	import type { RouteId } from '$app/types';

	let { children } = $props();

	let isJsEnabled = $state(isJavaScriptEnabled());

	let serifFontFamily = 'Cambria, Cochin, Georgia, Times, Times New Roman, serif';
	let sansFontFamily = 'Segoe UI, Helvetica Neue, Arial, sans-serif';

	let activeFontFamily = $state(serifFontFamily);

	let themeValue = $state(0);

	const navItems: { label: string; path: RouteId }[] = [
		{ label: 'Home', path: '/' },
		{ label: 'Resume', path: '/resume' }
	];

	const toggleFontFamily = () => {
		activeFontFamily = activeFontFamily === serifFontFamily ? sansFontFamily : serifFontFamily;
	};

	const handleThemeChange = (value: number) => {
		console.log(value);
	};

	onMount(() => {
		removeNoJsClassFromBody();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link href="https://fonts.googleapis.com/css?family=Fredericka+the+Great&amp;display=swap" rel="stylesheet" />
	<link href="https://unpkg.com/@csstools/normalize.css" rel="stylesheet" />
	<link rel="stylesheet" href="/styles/tokens.css" />
	<link rel="stylesheet" href="/styles/buttons.css" />
	<link rel="stylesheet" href="/styles/layout.css" />
	<link rel="stylesheet" href="/styles/typography.css" />
	<link rel="stylesheet" href="/styles/app.css" />
</svelte:head>

<div class="layout-container" style:font-family={activeFontFamily}>
	<header>
		<div>
			<!-- <div class="title-card-container">
				<h1 class="headline-medium fredericka title-card">CXII</h1>
			</div> -->
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
		<div class="header-controls">
			{#if isJsEnabled}
				<div class="button-group">
					<Popover.Root>
						<Popover.Trigger class="button text" id="theme-picker-trigger">Theme</Popover.Trigger>
						<Popover.Portal>
							<Popover.Content class="popover-content">
								<Slider.Root class="slider-root" id="theme-picker-slider" type="single" bind:value={themeValue} onValueCommit={handleThemeChange}>
									<Slider.Range />
									<Slider.Thumb index={0} />
									<Slider.Tick index={0} />
								</Slider.Root>
							</Popover.Content>
						</Popover.Portal>
					</Popover.Root>
					<Button.Root class="button text icon" id="font-toggle" onclick={toggleFontFamily}>A</Button.Root>
				</div>
			{/if}
		</div>
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

	/* .title-card {
		letter-spacing: 0.15em;
		line-height: 1;
		margin: 0;
	} */

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

	:global(.popover-content) {
		padding: 0.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-popover);
		background-color: var(--background);
		color: var(--foreground);
		box-shadow: var(--shadow-popover);
		z-index: 30;
		max-width: 328px;
	}
</style>
