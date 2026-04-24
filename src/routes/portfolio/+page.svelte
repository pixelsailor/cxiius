<script lang="ts">
  import type { PageData } from './$types';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';
  import { flip } from 'svelte/animate';
  import { cubicOut } from 'svelte/easing';
  import { onMount, tick } from 'svelte';
  import { fly } from 'svelte/transition';

  let { data }: { data: PageData } = $props();

  const heroLead = $derived(data.hero.images.hero ?? data.hero.images.full);
  const heroImgAlt = $derived(heroLead.alt.trim() !== '' ? heroLead.alt : data.hero.name);

  type PortfolioFilterKey = 'all' | 'branding' | 'illustration' | 'ui';

  const filterOptions: { key: PortfolioFilterKey; label: string }[] = [
    { key: 'all', label: 'Show all' },
    { key: 'branding', label: 'Branding & Identity' },
    { key: 'illustration', label: 'Illustration' },
    { key: 'ui', label: 'User Interface' }
  ];

  /** After first paint: enables list motion so filter changes animate without a full-grid intro on load. */
  let listMotionReady = $state(false);
  let prefersReducedMotion = $state(false);

  const motionEnabled = $derived(browser && listMotionReady && !prefersReducedMotion);

  const flyIn = $derived(motionEnabled ? { y: 20, duration: 320, easing: cubicOut } : { duration: 0, y: 0 });
  const flyOut = $derived(motionEnabled ? { y: -12, duration: 240, easing: cubicOut } : { duration: 0, y: 0 });
  const flipOpts = $derived(motionEnabled ? { duration: 320, easing: cubicOut } : { duration: 0 });

  onMount(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion = mq.matches;
    const onPrefChange = () => {
      prefersReducedMotion = mq.matches;
    };
    mq.addEventListener('change', onPrefChange);

    void tick().then(() => {
      listMotionReady = true;
    });

    return () => mq.removeEventListener('change', onPrefChange);
  });

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
        <img class="hero-img" src={heroLead.src} alt={heroImgAlt} width="933" height="347" loading="eager" decoding="async" />
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
              class="filter-link link"
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
        <li class="card" in:fly={flyIn} out:fly={flyOut} animate:flip={flipOpts}>
          <a class="card-link" href={resolve('/portfolio/[slug]', { slug: entry.slug })}>
            <div class="thumb-wrap">
              <img
                class="thumb-img"
                src={entry.images.thumbnail.src}
                alt={entry.images.thumbnail.alt.trim() !== '' ? entry.images.thumbnail.alt : entry.name}
                loading="lazy"
                decoding="async"
              />
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
    padding: 0.5rem;
    overflow: hidden;
    box-shadow: 0 1px 4px hsla(0 0% 0% / 0.15);
    border-radius: 0.25rem;
    display: none;
  }

  @media (min-height: 600px) and (min-width: 600px) {
    .hero {
      display: block;
    }
  }

  .hero picture {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

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

  .card-link {
    padding: 0;
  }

  .card-body {
    position: absolute;
    inset: 0;
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
    width: 100%;
    object-fit: cover;
  }

  .hero-glass,
  .glass {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, hsla(0 0% 100% / 0.32) 0%, hsla(0 0% 100% / 0) 52%, hsla(0 0% 100% / 0.08) 100%);
    pointer-events: none;
    border-radius: 0.25rem;
    border: 1px solid var(--border-card);
  }
</style>
