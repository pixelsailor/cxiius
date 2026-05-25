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
      aria-label={ariaLabel || 'List checks'}
    >
      <path
        d="M224,128a8,8,0,0,1-8,8H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128ZM128,72h88a8,8,0,0,0,0-16H128a8,8,0,0,0,0,16Zm88,112H128a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16ZM82.34,42.34,56,68.69,45.66,58.34A8,8,0,0,0,34.34,69.66l16,16a8,8,0,0,0,11.32,0l32-32A8,8,0,0,0,82.34,42.34Zm0,64L56,132.69,45.66,122.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Zm0,64L56,196.69,45.66,186.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32,0l32-32a8,8,0,0,0-11.32-11.32Z"
      ></path>
    </svg>
  {/snippet}
</IconRoot>
