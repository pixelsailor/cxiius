<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { Command } from 'bits-ui';

	let commandInputValue = $state('');

	let commandResponse = $state('');

	/** Mirrors Command.Root state for Enter handling (see onStateChange). */
	let commandFilteredCount = $state(0);
	let commandSearch = $state('');

	let showRoutes = $derived(commandInputValue.startsWith('/'));

  /** Use afterNavigate to restore the chat input focus when a route is selected. */
  afterNavigate(() => {
    console.log('afterNavigate');
    const toFocus = document.getElementById('chatWindowInput');
    console.log('toFocus', toFocus);
    toFocus?.focus();
  });

	function handleCommandStateChange(state: { search: string; filtered: { count: number } }) {
		commandSearch = state.search;
		commandFilteredCount = state.filtered.count;
	}

  /** Clear the command input value when a route is selected. */
	function handleCommandRouteSelect() {
		commandInputValue = '';
	}

	function handleCommandInputKeydown(event: KeyboardEvent) {
    /** Remove focus from the command input when Escape is pressed. */
    if (event.key === 'Escape') {
      const toBlur = document.getElementById('chatWindowInput');
      toBlur?.blur();
      return;
    }

		if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229 || commandFilteredCount > 0) {
			return;
		}
		const query = commandSearch.trimStart();
		if (query.startsWith('/')) {
			commandInputValue = '';
			return;
		}
		event.stopPropagation();
    event.preventDefault();

		// Temporary: wire to chat POST later (ADR-009).
		commandResponse = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    console.log('command palette → chat (no nav matches, non-slash query):', commandSearch);

		commandInputValue = ''.trim();
	}
</script>

<!--
@component
Chat Window
Features a chat window with a command input and a chat messages container.
-->
<div class="chat-window-container">
	<div class="chat-window-messages">
		<div class="chat-window-message">
			<p class="body-medium">{commandResponse}</p>
		</div>
	</div>
	<div class="chat-window-input-container">
		<Command.Root class="command-root" onStateChange={handleCommandStateChange}>
			<Command.Input bind:value={commandInputValue}>
				{#snippet child({ props })}
					<textarea
						{...props}
						class="input borderless body-medium command-input"
						name="chat-window-input"
						id="chatWindowInput"
						placeholder="Ask a question or press slash to navigate"
						bind:value={commandInputValue}
						onkeydown={handleCommandInputKeydown}
					></textarea>
				{/snippet}
			</Command.Input>
			{#if showRoutes}
				<Command.List class="command-list">
					<Command.Viewport class="command-viewport">
						<Command.LinkItem href="/about" class="command-link-item" onSelect={handleCommandRouteSelect}>/About</Command.LinkItem>
						<Command.LinkItem href="/resume" class="command-link-item" onSelect={handleCommandRouteSelect}>/Resume</Command.LinkItem>
						<Command.LinkItem href="/portfolio" class="command-link-item" onSelect={handleCommandRouteSelect}>/Portfolio</Command.LinkItem>
					</Command.Viewport>
				</Command.List>
			{/if}
		</Command.Root>
	</div>
</div>

<style>
	.chat-window-container {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		height: 100%;
		width: 100%;
	}

	.chat-window-input-container {
		border: 1px solid var(--border-card);
		border-radius: var(--radius-card);
		padding: 0.25rem;
	}

	textarea {
		resize: none;
		width: 100%;
		min-height: 1.5rem;
		max-height: 8rem;
		height: stretch;
		height: -webkit-fill-available;
	}
</style>
