<script lang="ts">
	import IconRoot from './IconRoot.svelte';
	import type { IconSize } from './IconSize';

	let { size, ariaLabel }: { size?: IconSize | number; ariaLabel?: string } = $props();
</script>

<IconRoot {size} {ariaLabel}>
	{#snippet children(iconSize: number | IconSize, ariaLabel: string)}
		<svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="currentColor" viewBox="0 0 256 256" aria-label={ariaLabel || 'Desktop icon'}>
			<path
				d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24h72v16H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V200h72a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40ZM48,56H208a8,8,0,0,1,8,8v80H40V64A8,8,0,0,1,48,56ZM208,184H48a8,8,0,0,1-8-8V160H216v16A8,8,0,0,1,208,184Z"
			></path>
		</svg>
	{/snippet}
</IconRoot>
