<script lang="ts">
	import { iconSizes, type IconSize } from './IconSize';

	let { children, ...props } = $props();

	let iconSize = $derived.by(() => {
		const { size } = props;
		if (!size) return '100%';

		if (typeof size === 'string') {
			return iconSizes[size as IconSize];
		}
		return size;
	});

	let ariaLabel = $derived.by(() => {
		const { ariaLabel } = props;
		if (!ariaLabel) return '';
		return ariaLabel;
	});
</script>

{@render children(iconSize, ariaLabel)}
