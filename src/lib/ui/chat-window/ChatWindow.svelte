<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { Button, Command } from 'bits-ui';
	import SvelteMarkdown from '@humanspeak/svelte-markdown';

	import { getChatContext } from '$lib/stores/chat.context';

	const chat = getChatContext();

	let { hideToolbar = false }: { hideToolbar?: boolean } = $props();

	let commandInputValue = $state('');

	/** Mirrors Command.Root state for Enter handling (see onStateChange). */
	let commandFilteredCount = $state(0);
	let commandSearch = $state('');

	let showRoutes = $derived(commandInputValue.startsWith('/'));

	/** Use afterNavigate to restore the chat input focus when a route is selected. */
	afterNavigate(() => {
		const toFocus = document.getElementById('chatWindowInput');
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
		const queryStart = commandSearch.trimStart();
		if (queryStart.startsWith('/')) {
			commandInputValue = '';
			return;
		}
		event.stopPropagation();
		event.preventDefault();

		void chat.submitUserText(commandSearch.trim());
		commandInputValue = '';
	}
</script>

<!--
@component
Chat Window
Features a chat window with a command input and a chat messages container.
-->
<div class="chat-window-container">
	{#if !hideToolbar}
		<div class="chat-window-toolbar">
			<Button.Root type="button" class="button text label-small" onclick={() => chat.clear()}>Clear transcript</Button.Root>
		</div>
	{/if}
	<div class="chat-window-messages" role="log" aria-relevant="additions" aria-label="Chat messages">
		{#each chat.messages as message (message.id)}
			<div class="chat-window-message body-medium markdown" class:chat-window-message--user={message.role === 'user'} class:chat-window-message--assistant={message.role === 'assistant'}>
				<SvelteMarkdown source={message.body} />
			</div>
		{/each}
		{#if chat.lastError}
			<div class="chat-window-error body-small" role="alert">{chat.lastError}</div>
		{/if}
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
						maxlength="500"
						aria-busy={chat.status === 'loading'}
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
		grid-template-rows: 1fr auto;
		height: 100%;
		width: 100%;
		min-height: 0;
		gap: 0.5rem;
		overflow: hidden;
	}

	.chat-window-toolbar {
		display: flex;
		justify-content: flex-end;
	}

	.chat-window-messages {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		overflow-y: auto;
		overscroll-behavior: contain;
		min-height: 0;
	}

	.chat-window-message {
		padding-inline: 0.5rem;
		border-radius: var(--radius-card);
		border: 1px solid var(--border-card);
	}

	.chat-window-message--user {
		align-self: flex-end;
		max-width: 95%;
		font-style: italic;
	}

	.chat-window-message--assistant {
		align-self: flex-start;
		max-width: 95%;
		background-color: var(--dark-04);
	}

	.chat-window-error {
		color: var(--destructive-text);
		padding: 0.25rem 0;
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
