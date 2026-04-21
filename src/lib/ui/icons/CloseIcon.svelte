<script lang="ts">
	import IconRoot from './IconRoot.svelte';
	import type { IconSize } from './IconSize';

	let { size, ariaLabel }: { size?: IconSize | number; ariaLabel?: string } = $props();
</script>

<IconRoot {size} {ariaLabel}>
	{#snippet children(iconSize: number | IconSize, ariaLabel: string)}
	<svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="currentColor" viewBox="0 0 256 256" aria-label={ariaLabel || 'Close icon'}>
		<path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
	</svg>
	{/snippet}
</IconRoot>
