<script lang="ts">
	import { getChatContext } from '$lib/stores/chat.context';
	import { isJavaScriptEnabled } from '$lib/utils/jsEnabled';
	import { Command, Dialog } from 'bits-ui';
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import EllipsisLoader from '$lib/ui/ellipsis-loader/EllipsisLoader.svelte';
	import About from '$lib/ui/about/About.svelte';

	const ALPHABET = new RegExp(/^[a-zA-Z/]$/);

	const chat = getChatContext();

	let isJsEnabled = $state(isJavaScriptEnabled());

	let commandDialogOpen = $state(false);

	let commandInput: HTMLInputElement | undefined = $state(undefined);

	let commandInputValue = $state('');

	/** Mirrors Command.Root state for Enter handling (see onStateChange). */
	let commandFilteredCount = $state(0);
	let commandSearch = $state('');

	let showRoutes = $derived(commandInputValue.startsWith('/'));

	// let commandResponse = $state('');

	function handleKeyDown(event: KeyboardEvent) {
		if (!ALPHABET.test(event.key)) {
			return;
		}
		const dialogWasAlreadyOpen = commandDialogOpen;
		commandDialogOpen = true;
		// When the dialog was closed, the first key may not reach the input yet — seed it.
		// When the dialog is already open, the focused input applies the key normally; seeding would duplicate.
		const shouldSeedFirstKey = !dialogWasAlreadyOpen && commandInputValue.length === 0;
		if (shouldSeedFirstKey) {
			commandInputValue = event.key;
			// `/` is seeded; prevent default so the focused element (not the input) does not also receive it.
			if (event.key === '/') {
				event.preventDefault();
			}
		}
	}

	function handleCommandStateChange(state: { search: string; filtered: { count: number } }) {
		commandSearch = state.search;
		commandFilteredCount = state.filtered.count;
	}

	function handleCommandInputKeydown(event: KeyboardEvent) {
		if (event.key !== 'Enter' || event.isComposing || event.keyCode === 229) {
			return;
		}
		if (commandFilteredCount > 0) {
			return;
		}
		const queryStart = commandSearch.trimStart();
		if (queryStart.startsWith('/')) {
			return;
		}
		event.stopPropagation();

		void chat.submitUserText(commandSearch.trim());

		// Close and clear the command input
		commandInput?.blur();
		commandInputValue = '';
		commandDialogOpen = false;
	}
	function handleCommandCloseAutoFocus(event: Event) {
		event.preventDefault();
		(document.activeElement as HTMLElement | null)?.blur();
	}
</script>

<!--
@component
CXII Homepage
Features a Command prompt for navigation and interacting with the integrated AI chatbot.
-->
<svelte:window onkeydown={handleKeyDown} />

<svelte:head>
	<title>CXII</title>
	<meta name="author" content="Benjamin Thompson" />
</svelte:head>

<div class="title-card-container">
	<h1 class="display-large fredericka title-card">CXII</h1>

	{#if isJsEnabled}
		{#if chat.messages.length > 0}
			<div class="chat-window-messages" role="log" aria-relevant="additions" aria-label="Chat messages">
				{#each chat.messages as message (message.id)}
					<div class="chat-window-message markdown" class:chat-window-message--user={message.role === 'user'} class:chat-window-message--assistant={message.role === 'assistant'}>
						<SvelteMarkdown source={message.body} />
					</div>
				{/each}
				{#if chat.status === 'loading'}
					<div class="chat-window-message chat-window-message--loading body-medium markdown">
						<p>
							<span>Thinking</span>
							<EllipsisLoader />
						</p>
					</div>
				{/if}
				{#if chat.lastError}
					<div class="chat-window-error body-small" role="alert">{chat.lastError}</div>
				{/if}
			</div>
		{/if}

		<div class="command-menu-container" id="commandMenuContainer">
			<Dialog.Root bind:open={commandDialogOpen}>
				<Dialog.Trigger class="button text dialog-trigger fade-in">Try typing something</Dialog.Trigger>
				<Dialog.Portal to="#commandMenuContainer">
					<Dialog.Content class="command-dialog" preventScroll={false} onCloseAutoFocus={handleCommandCloseAutoFocus}>
						<Dialog.Title class="sr-only">Command Menu</Dialog.Title>
						<Dialog.Description class="sr-only">This is the command menu. Use the arrow keys to navigate or start typing to ask questions.</Dialog.Description>
						<Command.Root class="command-root" onStateChange={handleCommandStateChange}>
							<Command.Input
								bind:value={commandInputValue}
								ref={commandInput}
								class="command-input body-medium"
								placeholder="Ask a question or press slash to navigate"
								maxlength={500}
								onkeydown={handleCommandInputKeydown}
							/>
							{#if showRoutes}
								<Command.List class="command-list">
									<Command.Viewport class="command-viewport">
										<Command.LinkItem href="/about" class="command-link-item">/About</Command.LinkItem>
										<Command.LinkItem href="/resume" class="command-link-item">/Resume</Command.LinkItem>
										<Command.LinkItem href="/portfolio" class="command-link-item">/Portfolio</Command.LinkItem>
									</Command.Viewport>
								</Command.List>
							{/if}
						</Command.Root>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
	{:else}
		<About />
	{/if}
</div>

<style>
	.title-card-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.25rem;
		height: 100%;
		max-width: 640px;
		margin: 0 auto;
	}

	.title-card {
		font-size: 5rem;
		letter-spacing: 0.15em;
		line-height: 1.2;
		margin: 0;
	}

	.command-menu-container {
		position: relative;
	}

	:global(.dialog-trigger.button) {
		font-style: italic;
		color: var(--foreground-alt);
		opacity: 0;
		animation: 0.1s ease-in 5s 1 fade-in;
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(.dialog-trigger.button) {
			animation: 1s ease-in 7s 1 forwards fade-in;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
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
		overflow-x: hidden;
		margin-block: 0.375rem;
	}

	.chat-window-message--user {
		display: none;
		align-self: flex-end;
		max-width: 95%;
		font-style: italic;
		box-shadow: var(--shadow-card);
	}

	.chat-window-message--assistant {
		align-self: flex-start;
		background-color: var(--dark-04);
	}

	.chat-window-message--loading {
		align-self: center;
		background-color: transparent;
		box-shadow: none;
		border: none;
	}

	.chat-window-error {
		color: var(--destructive-text);
		padding: 0.25rem 0;
	}
</style>
