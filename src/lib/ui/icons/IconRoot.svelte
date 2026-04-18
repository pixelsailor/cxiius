<script lang="ts">
  import { iconSizes, type IconSize} from './IconSize';

  let { children, ...props } = $props();

  let iconSize = $derived.by(() => {
    const { size } = props;
    if (!size) return '100%';

    if (typeof size === 'string') {
      return iconSizes[size as IconSize];
    }
    return size;
  });
</script>

{@render children(iconSize)}
