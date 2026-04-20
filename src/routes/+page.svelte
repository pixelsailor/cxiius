<script lang="ts">
	import { isJavaScriptEnabled } from '$lib/utils/jsEnabled';
	import { Command, Dialog } from 'bits-ui';

	const ALPHABET = new RegExp(/^[a-zA-Z/]$/);

	let isJsEnabled = $state(isJavaScriptEnabled());

	let commandDialogOpen = $state(false);

	// let commandValue = $state('');

	// let commandInput: HTMLInputElement | undefined = $state(undefined);

	let commandInputValue = $state('');

	/** Mirrors Command.Root state for Enter handling (see onStateChange). */
	let commandFilteredCount = $state(0);
	let commandSearch = $state('');

	function handleKeyDown(event: KeyboardEvent) {
		if (!ALPHABET.test(event.key)) {
			return;
		}
		const dialogWasAlreadyOpen = commandDialogOpen;
		commandDialogOpen = true;
		if (event.key === '/') {
			event.preventDefault();
		}
		// When the dialog was closed, the first key may not reach the input yet — seed it.
		// When the dialog is already open, the focused input applies the key normally; seeding would duplicate.
		if (!dialogWasAlreadyOpen && commandInputValue.length === 0) {
			commandInputValue = event.key;
		}
	}

	function handleValueChange(value: string) {
		console.log('root value changed to:', value);
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
		const query = commandSearch.trimStart();
		if (query.startsWith('/')) {
			return;
		}
		event.stopPropagation();
		// Temporary: wire to chat POST later (ADR-009).
		console.log('command palette → chat (no nav matches, non-slash query):', commandSearch);
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
		<div class="command-menu-container" id="commandMenuContainer">
			<Dialog.Root bind:open={commandDialogOpen}>
				<Dialog.Trigger class="button text dialog-trigger">
					Try typing something
				</Dialog.Trigger>
				<Dialog.Portal to="#commandMenuContainer">
					<Dialog.Content class="command-dialog">
						<Dialog.Title class="sr-only">Command Menu</Dialog.Title>
						<Dialog.Description class="sr-only">This is the command menu. Use the arrow keys to navigate or start typing to ask questions.</Dialog.Description>
						<Command.Root class="command-root" onValueChange={handleValueChange} onStateChange={handleCommandStateChange}>
							<Command.Input bind:value={commandInputValue} class="command-input body-medium" onkeydown={handleCommandInputKeydown} />
							<Command.List class="command-list">
								<Command.Viewport class="command-viewport">
									<Command.LinkItem href="/about" class="command-link-item">/About</Command.LinkItem>
									<Command.LinkItem href="/resume" class="command-link-item">/Resume</Command.LinkItem>
									<Command.LinkItem href="/portfolio" class="command-link-item">/Portfolio</Command.LinkItem>
								</Command.Viewport>
							</Command.List>
						</Command.Root>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		</div>
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
	}

	.command-menu-container {
		position: relative;
	}

	:global(.dialog-trigger.button) {
		font-style: italic;
		color: var(--foreground-alt);
	}
</style>
