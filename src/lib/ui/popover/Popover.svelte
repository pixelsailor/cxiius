<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { Snippet } from 'svelte';
  import { Popover as BitsPopover, mergeProps, type WithoutChildren } from 'bits-ui';

  type RootProps = WithoutChildren<ComponentProps<typeof BitsPopover.Root>>;
  type ContentRest = Omit<ComponentProps<typeof BitsPopover.Content>, 'children' | 'child'>;
  type OverlayRest = Omit<ComponentProps<typeof BitsPopover.Overlay>, 'children' | 'child'>;
  type TriggerForward = Omit<ComponentProps<typeof BitsPopover.Trigger>, 'child' | 'children'>;

  type Props = RootProps & {
    /**
     * Renders the trigger element; spread `props` onto your interactive element (button, link, etc.).
     */
    trigger: Snippet<[{ props: Record<string, unknown> }]>;
    /** Popover panel body (rendered inside `Popover.Content`). */
    children: Snippet;
    /**
     * When true, renders `Popover.Overlay` behind the panel (see bits-ui overlay docs).
     * @default false
     */
    overlay?: boolean;
    /** Props forwarded to `Popover.Content` (merged with CXII defaults). */
    contentProps?: ContentRest;
    /** Props forwarded to `Popover.Overlay` when `overlay` is true. */
    overlayProps?: OverlayRest;
    /** Props forwarded to `Popover.Trigger` except `child` / `children` (hover timing, disabled, etc.). */
    triggerProps?: TriggerForward;
    /** Bind to the trigger DOM node (forwarded to `Popover.Trigger`). */
    triggerRef?: HTMLElement | null;
  };

  let {
    open = $bindable(false),
    onOpenChange,
    onOpenChangeComplete,
    trigger,
    children,
    overlay = false,
    contentProps,
    overlayProps,
    triggerProps,
    triggerRef = $bindable(null)
  }: Props = $props();

  const mergedContentProps = $derived(
    mergeProps(
      {
        class: 'popover-content cxii-popover__panel',
        sideOffset: 8
      },
      contentProps ?? {}
    )
  );

  const mergedOverlayProps = $derived(
    mergeProps(
      {
        class: 'cxii-popover__overlay'
      },
      overlayProps ?? {}
    )
  );
</script>

<!--
@component
CXII-styled wrapper around bits-ui `Popover` with a `trigger` snippet for custom triggers (`Popover.Trigger` `child` pattern).
-->
<BitsPopover.Root bind:open {onOpenChange} {onOpenChangeComplete}>
  <BitsPopover.Trigger {...triggerProps ?? {}} bind:ref={triggerRef}>
    {#snippet child({ props })}
      {@render trigger({ props })}
    {/snippet}
  </BitsPopover.Trigger>
  <BitsPopover.Portal>
    {#if overlay}
      <BitsPopover.Overlay {...mergedOverlayProps} />
    {/if}
    <BitsPopover.Content {...mergedContentProps}>
      {@render children?.()}
    </BitsPopover.Content>
  </BitsPopover.Portal>
</BitsPopover.Root>

<style>
  :global(.popover-content.cxii-popover__panel) {
    box-sizing: border-box;
    z-index: 40;
    max-width: min(328px, calc(100vw - 2rem));
    padding: 0.75rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius-popover);
    background-color: var(--background);
    color: var(--foreground);
    box-shadow: var(--shadow-popover);
    font: inherit;
    line-height: 1.45;
    outline: none;
  }

  :global(.popover-content.cxii-popover__panel:focus-visible) {
    outline: 2px solid var(--foreground);
    outline-offset: 2px;
  }

  :global(.cxii-popover__overlay) {
    position: fixed;
    inset: 0;
    z-index: 30;
    background: hsla(0 0% 0% / 0.38);
  }

  @media (prefers-reduced-motion: no-preference) {
    :global(.popover-content.cxii-popover__panel[data-state='open']) {
      animation: cxii-popover-in 140ms var(--default-transition-timing-function);
    }

    :global(.popover-content.cxii-popover__panel[data-state='closed']) {
      animation: cxii-popover-out 100ms var(--default-transition-timing-function);
    }
  }

  @keyframes cxii-popover-in {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes cxii-popover-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.98);
    }
  }
</style>
