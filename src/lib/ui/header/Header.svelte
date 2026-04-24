<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, Popover } from 'bits-ui';
  import { isJavaScriptEnabled } from '$lib/utils/jsEnabled';
  import { applyTheme, clampThemeIndex, persistThemeIndex, readStoredThemeIndex } from '$lib/utils/theme';
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import type { RouteId } from '$app/types';
  import { Slider } from '$lib/ui';
  import { PaletteIcon, DesktopIcon, SunIcon, SunHorizonIcon, MoonStarsIcon, MoonIcon, ListSearchIcon } from '$lib/ui/icons';
  import { serifFontFamily, sansFontFamily } from '$lib/utils/fonts';
  import { MediaQuery } from 'svelte/reactivity';

  const navItems: { label: string; path: RouteId }[] = [
    { label: 'Home', path: '/' },
    { label: 'Resume', path: '/resume' },
    { label: 'Portfolio', path: '/portfolio' }
  ];

  const hasCoarsePointer = new MediaQuery('(pointer: coarse)');
  const canHover = new MediaQuery('(hover: hover)');
  const isLargeScreen = new MediaQuery('min-width: 600px');

  let { fontFamily = $bindable(serifFontFamily) }: { fontFamily: string } = $props();

  let isJsEnabled = $state(isJavaScriptEnabled());

  let hasKeyboard = $derived(!hasCoarsePointer.current || canHover.current);

  let activeThemeIndex = $state(0);

  let currentRoute = $derived(page.url.pathname);

  let isHomePage = $derived(currentRoute === '/');

  let showDropdownNav = $derived.by(() => {
    if (!hasKeyboard || !isLargeScreen.current) return true;
    return false;
  });

  const handleThemeChange = (v: number) => {
    const i = clampThemeIndex(v);
    activeThemeIndex = i;
    applyTheme(i);
    persistThemeIndex(i);
  };

  function toggleFontFamily() {
    console.log('toggleFontFamily');
    fontFamily = fontFamily === serifFontFamily ? sansFontFamily : serifFontFamily;
  }

  onMount(() => {
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

{#snippet mainNav()}
  <nav class="main-nav">
    <ul class="main-nav-list">
      {#each navItems as item (item.path)}
        <li class="main-nav-item link">
          <a href={item.path === '/' ? resolve('/') : item.path === '/resume' ? resolve('/resume') : resolve('/portfolio')} class="main-nav-link">{item.label}</a>
        </li>
      {/each}
    </ul>
  </nav>
{/snippet}

<!--
@component
Header component: Contains the main navigation and global theme and font controls.
@props
- fontFamily: string
@events
- fontFamilyChange: (fontFamily: string) => void
-->
<header>
  <div>
    <noscript>
      {@render mainNav()}
    </noscript>

    {#if showDropdownNav}
      <Popover.Root>
        <Popover.Trigger class="button text icon popover__trigger main-nav-trigger" aria-label="Main navigation">
          <ListSearchIcon size="sm" ariaLabel="Main navigation" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content class="popover__content main-nav-popover__content">
            {@render mainNav()}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    {:else if isLargeScreen.current && !isHomePage}
      {@render mainNav()}
    {/if}
  </div>

  <div class="header-controls">
    {#if isJsEnabled}
      <Popover.Root>
        <Popover.Trigger class="button text icon popover__trigger" aria-label="Theme switcher">
          {#if activeThemeIndex === 1}
            <SunIcon size="sm" ariaLabel="Light theme" />
          {:else if activeThemeIndex === 2}
            <SunHorizonIcon size="sm" ariaLabel="Stone theme" />
          {:else if activeThemeIndex === 3}
            <MoonStarsIcon size="sm" ariaLabel="Twilight theme" />
          {:else if activeThemeIndex === 4}
            <MoonIcon size="sm" ariaLabel="Dark theme" />
          {:else}
            <PaletteIcon size="sm" ariaLabel="Theme switcher" />
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

<style>
  header {
    display: var(--header-display);
    justify-content: var(--header-justify-content);
    align-items: var(--header-align-items);
    padding: var(--header-padding) 0;
    height: 3rem;
    background-color: hsl(from var(--background) h s l / 0.8);
    border-bottom: 1px solid var(--background);
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(8px);
  }

  .main-nav-list {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  :global(.popover__content .main-nav-list) {
    flex-direction: column;
    gap: 0.25rem;

    .main-nav-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 2rem;
    }
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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

    &.main-nav-popover__content {
      margin-left: 0.25rem;
      padding: 0 0.5rem;
      min-width: 8rem;
      width: fit-content;
    }
  }

  :global(.theme-slider[data-slider-root]) {
    width: min(100%, 280px);
    margin-top: 1.25rem;
  }

  :global(.theme-slider [data-slider-tick-label]) {
    margin-bottom: 0.625rem;
  }
</style>
