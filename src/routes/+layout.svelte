<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from 'bits-ui';
  import { page } from '$app/state';
  import favicon from '$lib/assets/favicon.svg';
  import { isJavaScriptEnabled, removeNoJsClassFromBody } from '$lib/utils/jsEnabled';
  import { setChatContext } from '$lib/stores/chat.context';
  import { ChatState } from '$lib/stores/chat.svelte';
  import { ChatWindow, Header } from '$lib/ui';
  import { CloseIcon, SmileyIcon } from '$lib/ui/icons';
  import { serifFontFamily } from '$lib/utils/fonts';
  import { MediaQuery } from 'svelte/reactivity';

  const ALPHABET = new RegExp(/^[a-zA-Z/]$/);

  const hasCoarsePointer = new MediaQuery('(pointer: coarse)');
  const canHover = new MediaQuery('(hover: hover)');
  const isLargeScreen = new MediaQuery('(min-width: 600px) and (min-height: 600px)');

  let { children } = $props();

  let isJsEnabled = $state(isJavaScriptEnabled());

  let hasKeyboard = $derived(!hasCoarsePointer.current || canHover.current);

  let activeFontFamily = $state(serifFontFamily);

  let currentRoute = $derived(page.url.pathname);

  /** Show the navigation bar on non-home routes */
  let showNav = $derived(currentRoute !== '/');

  let showChatWindow = $state(false);

  /**
   * Show the chat window trigger when:
   * - JavaScript is enabled
   * - The chat window is not open
   * - There is no keyboard
   * - There is a keyboard but only if the navigation bar is shown
   */
  let showChatWindowTrigger = $derived.by(() => {
    if (!isJsEnabled) return false;
    if (showChatWindow) return false;
    if (!hasKeyboard) return true;
    if (hasKeyboard && showNav) return true;
    return false;
  });

  const chat = new ChatState();
  setChatContext(chat);

  const openChatWindow = (key?: string) => {
    showChatWindow = true;
    setTimeout(() => {
      const commandInput = document.getElementById('chatWindowInput') as HTMLTextAreaElement | null;
      commandInput?.focus();
      if (key && commandInput) {
        commandInput.value = key;
      }
    }, 100);
  };

  onMount(() => {
    removeNoJsClassFromBody();
  });

  /**
   * Handle keydown events for the layout.
   * Responsible for opening the chat window and focusing the command input as well as closing the chat window when Escape is pressed.
   * @param event - The keyboard event.
   */
  function handleKeyDown(event: KeyboardEvent) {
    if (!isJsEnabled || !showNav) return;

    // Close before any alphabet / open-chat guard: Escape is not in ALPHABET and must not sit behind `showChatWindow` early returns.
    if (showChatWindow && event.key === 'Escape') {
      event.preventDefault();
      document.getElementById('chatWindowInput')?.blur();
      showChatWindow = false;
      return;
    }

    if (showChatWindow || !ALPHABET.test(event.key)) return;

    // Prevent firefox from opening its quick search
    if (event.key === '/') {
      event.preventDefault();
    }

    openChatWindow(event.key);
  }
</script>

<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
  <link rel="icon" href={favicon} />
  <link href="https://fonts.googleapis.com/css?family=Fredericka+the+Great&amp;display=swap" rel="stylesheet" />
  <link href="https://unpkg.com/@csstools/normalize.css" rel="stylesheet" />
  <link rel="stylesheet" href="/styles/tokens.css" />
  <link rel="stylesheet" href="/styles/buttons.css" />
  <link rel="stylesheet" href="/styles/command.css" />
  <link rel="stylesheet" href="/styles/dialogs.css" />
  <link rel="stylesheet" href="/styles/forms.css" />
  <link rel="stylesheet" href="/styles/layout.css" />
  <link rel="stylesheet" href="/styles/markdown.css" />
  <link rel="stylesheet" href="/styles/typography.css" />
  <link rel="stylesheet" href="/styles/app.css" />
</svelte:head>

<div class={['layout-container', isLargeScreen.current ? '' : 'layout-container--small']} style:font-family={activeFontFamily}>
  <main>
    <Header bind:fontFamily={activeFontFamily} />

    <div class="content-container">
      {@render children()}
    </div>

    <footer>
      <span class="label-small">&copy; 2026 Benjamin Thompson. All rights reserved.</span>
    </footer>
  </main>

  {#if isJsEnabled}
    <aside class="sidebar" data-sidebar-state={showChatWindow ? 'open' : 'closed'}>
      {#if showChatWindow}
        <div class="sidebar-resize-container">
          <div class="sidebar-resize-handle"></div>
        </div>
        <div class="sidebar-content chat-container">
          <div class="chat-container-header">
            <Button.Root type="button" class="button text label-small" disabled={chat.messages.length === 0} onclick={() => chat.clear()}>Clear transcript</Button.Root>
            <Button.Root class="button text icon shadow-mini" aria-label="Close chat" onclick={() => (showChatWindow = false)}>
              <CloseIcon size="xs" ariaLabel="Close chat" />
            </Button.Root>
          </div>
          <div class="chat-container-content">
            <ChatWindow hideToolbar={true} />
          </div>
        </div>
      {/if}
    </aside>
  {/if}
</div>

{#if showChatWindowTrigger}
  <div class="chat-window-trigger">
    <Button.Root class="button icon" aria-label="Open chat" onclick={() => openChatWindow()}>
      <SmileyIcon size="sm" ariaLabel="Chat icon" />
    </Button.Root>
  </div>
{/if}

<style>
  .layout-container {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  main {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    padding: 0 1rem;
  }

  .sidebar {
    position: sticky;
    top: 0;
    display: grid;
    grid-template-columns: 3px auto;
    align-content: stretch;
    overflow: hidden;

    &[data-sidebar-state='open'] {
      animation: cxii-sidebar-in 140ms var(--default-transition-timing-function);
      width: 360px;
      height: 100dvh;
      background-color: var(--background-alt);
      box-shadow: var(--shadow-popover);
      border-left: 1px solid var(--border-card);
    }

    &[data-sidebar-state='closed'] {
      width: 0;
      animation: cxii-sidebar-out 140ms var(--default-transition-timing-function);
    }
  }

  .sidebar-resize-container {
    cursor: col-resize;
  }

  .layout-container--small {
    .sidebar {
      position: absolute;
      inset: 0;
      left: auto;
      display: none;
      width: 0;
      z-index: 50;

      & .sidebar-resize-container {
        display: none;
      }

      &[data-sidebar-state='open'] {
        display: block;
        width: 100%;
      }
    }
  }

  .sidebar-content {
    display: grid;
    grid-template-rows: 3rem auto;
    grid-template-columns: 1fr;
    height: 100%;
    overflow: hidden;
  }

  .chat-container-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    padding: 0.5rem;
  }

  .chat-container-content {
    overflow: hidden;
    padding: 0 0.5rem 0.5rem 0.25rem;
  }

  .chat-window-trigger {
    position: fixed;
    bottom: 1.5rem;
    right: 1rem;
    z-index: 50;
  }

  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.25rem;
    color: var(--foreground-alt);
  }
</style>
