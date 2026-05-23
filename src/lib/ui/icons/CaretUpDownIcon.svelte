<script lang="ts">
  import IconRoot from './IconRoot.svelte';
  import type { IconSize } from './IconSize';

  let { size, ariaLabel }: { size?: IconSize | number; ariaLabel?: string } = $props();
</script>

<IconRoot {size} {ariaLabel}>
  {#snippet children(iconSize: number | IconSize, ariaLabel: string)}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      fill="currentColor"
      viewBox="0 0 256 256"
      aria-label={ariaLabel || 'Caret up down icon'}
    >
      <rect width="256" height="256" fill="none" />
      <polyline
        points="80 176 128 224 176 176"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /><polyline
        points="80 80 128 32 176 80"
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="16"
      /></svg
    >
  {/snippet}
</IconRoot>
