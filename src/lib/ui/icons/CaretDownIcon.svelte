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
      aria-label={ariaLabel || 'Caret down'}
    >
      <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
    </svg
    >
  {/snippet}
</IconRoot>
