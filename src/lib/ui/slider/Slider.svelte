<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any */
	/* eslint-disable svelte/require-each-key */
	import type { ComponentProps } from 'svelte';
	import { Slider, type WithoutChildren } from 'bits-ui';

	type Props = WithoutChildren<ComponentProps<typeof Slider.Root>>;

	let { value = $bindable(), ref = $bindable(null), ...restProps }: Props = $props();
</script>

<!-- 
 Since we have to destructure the `value` to make it `$bindable`, we need to use `as any` here to avoid type errors from the 
 discriminated union of `"single" | "multiple"`. (an unfortunate consequence of having to destructure bindable values) 
 -->
<Slider.Root bind:value bind:ref {...restProps as any}>
	{#snippet children({ thumbs, ticks })}
		<Slider.Range />
		{#each thumbs as index}
			<Slider.Thumb {index} />
		{/each}
		{#each ticks as index}
			<Slider.Tick {index} />
		{/each}
	{/snippet}
</Slider.Root>

<style>
	:global([data-slider-root]) {
		position: relative;
		display: flex;
		width: 100%;
		min-height: 0.5rem;
		align-items: center;
		touch-action: none;
		user-select: none;
		border-radius: var(--radius-input);
		background-color: var(--muted);
		border: 1px solid var(--border-input);
		box-sizing: border-box;
	}

	:global([data-slider-range]) {
		position: absolute;
		border-radius: inherit;
		background-color: var(--foreground-alt);
		height: 100%;
	}

	:global([data-slider-thumb]) {
		display: block;
		box-sizing: border-box;
		min-width: 1.25rem;
		min-height: 1.25rem;
		border-radius: 9999px;
		border: 1px solid var(--border-input);
		background-color: var(--background);
		box-shadow: var(--shadow-btn);
		cursor: pointer;
	}

	:global([data-slider-thumb]:focus-visible) {
		outline: 2px solid var(--foreground);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: no-preference) {
		:global([data-slider-thumb]) {
			transition:
				border-color var(--default-transition-duration) var(--default-transition-timing-function),
				box-shadow var(--default-transition-duration) var(--default-transition-timing-function),
				background-color var(--default-transition-duration) var(--default-transition-timing-function);
		}

		:global([data-slider-thumb][data-active]) {
			transform: scale(0.98);
		}
	}
</style>
