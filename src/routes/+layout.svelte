<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Popover } from 'bits-ui';

	import { resolve } from '$app/paths';
	import favicon from '$lib/assets/favicon.svg';
	import { isJavaScriptEnabled, removeNoJsClassFromBody } from '$lib/utils/jsEnabled';
	import {
		applyTheme,
		clampThemeIndex,
		persistThemeIndex,
		readStoredThemeIndex
	} from '$lib/utils/theme';
	import type { RouteId } from '$app/types';
	import { Slider } from '$lib/ui';
	import {
		PaletteIcon,
		DesktopIcon,
		SunIcon,
		SunHorizonIcon,
		MoonStarsIcon,
		MoonIcon
	} from '$lib/ui/icons';

	const navItems: { label: string; path: RouteId }[] = [
		{ label: 'Home', path: '/' },
		{ label: 'Resume', path: '/resume' },
		{ label: 'Portfolio', path: '/portfolio' }
	];

	let { children } = $props();

	let isJsEnabled = $state(isJavaScriptEnabled());

	let serifFontFamily = 'Cambria, Cochin, Georgia, Times, Times New Roman, serif';
	let sansFontFamily = 'Segoe UI, Helvetica Neue, Arial, sans-serif';

	let activeFontFamily = $state(serifFontFamily);

	let activeThemeIndex = $state(0);

	const handleThemeChange = (v: number) => {
		const i = clampThemeIndex(v);
		activeThemeIndex = i;
		applyTheme(i);
		persistThemeIndex(i);
	};

	const toggleFontFamily = () => {
		activeFontFamily = activeFontFamily === serifFontFamily ? sansFontFamily : serifFontFamily;
	};

	onMount(() => {
		removeNoJsClassFromBody();
		const stored = readStoredThemeIndex();
		if (stored !== null) {
			activeThemeIndex = stored;
			applyTheme(stored);
		} else {
			applyTheme(0);
		}
	});
</script>

{#snippet themeTickLabel({ value }: { value: number; index: number })}
	{#if value === 0}
		<DesktopIcon size="xs" />
	{:else if value === 1}
		<SunIcon size="xs" />
	{:else if value === 2}
		<SunHorizonIcon size="xs" />
	{:else if value === 3}
		<MoonStarsIcon size="xs" />
	{:else if value === 4}
		<MoonIcon size="xs" />
	{/if}
{/snippet}

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
							<a href={item.path === '/' ? resolve('/') : item.path === '/resume' ? resolve('/resume') : resolve('/portfolio')} class="main-nav-link">{item.label}</a>
						</li>
					{/each}
				</ul>
			</nav>
		</div>
		<div class="header-controls">
			{#if isJsEnabled}
				<Popover.Root>
					<Popover.Trigger class="button text icon popover__trigger">
						{#if activeThemeIndex === 1}
							<SunIcon size="sm" />
						{:else if activeThemeIndex === 2}
							<SunHorizonIcon size="sm" />
						{:else if activeThemeIndex === 3}
							<MoonStarsIcon size="sm" />
						{:else if activeThemeIndex === 4}
							<MoonIcon size="sm" />
						{:else}
							<PaletteIcon size="sm" />
						{/if}
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content class="popover__content">
							<Slider
								aria-label="Theme switcher"
								class="theme-slider"
								type="single"
								min={0}
								max={4}
								step={1}
								trackPadding={2}
								bind:value={activeThemeIndex}
								onValueChange={handleThemeChange}
								tickLabel={themeTickLabel}
							/>
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
				<Button.Root class="button text icon label-large" id="font-toggle" onclick={toggleFontFamily}>
					<strong>Aa</strong>
				</Button.Root>
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

	.header-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		/* min-width: 300px; */
	}

	:global(.popover__content) {
		padding: 0.75rem 0.5rem 1rem;
		border: 1px solid var(--muted);
		border-radius: var(--radius-popover);
		background-color: var(--background);
		color: var(--foreground);
		box-shadow: var(--shadow-popover);
		z-index: 40;
		width: 16rem;
		min-height: auto;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* :global([data-state='open']) {
		animation: cxii-popover-in 140ms var(--default-transition-timing-function);
	} */

	:global(.theme-slider[data-slider-root]) {
		width: min(100%, 280px);
		margin-top: 1.25rem;
	}

	:global(.theme-slider [data-slider-tick-label]) {
		margin-bottom: 0.625rem;
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
