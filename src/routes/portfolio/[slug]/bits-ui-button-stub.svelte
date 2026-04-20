<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Snippet } from 'svelte';

	/**
	 * Test stub for `Button.Root` on the not-found branch only (`href` is always back to portfolio).
	 * `href` is accepted for API parity with bits-ui; navigation target is fixed.
	 */
	let { href: _href, class: className, children }: { href?: string; class?: string; children?: Snippet } = $props();
</script>

<a class={className} href={_href !== undefined ? resolve('/portfolio') : undefined}>{@render children?.()}</a>
