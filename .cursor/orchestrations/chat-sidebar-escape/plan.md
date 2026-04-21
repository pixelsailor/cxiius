# Plan — chat-sidebar-escape

## Objective restatement

With JavaScript enabled and the chat sidebar open, pressing **Escape** closes the chat (`showChatWindow` becomes `false`) and the behavior aligns with the layout’s global key handler and alphabet-gated “open chat” logic.

## Scope boundary

**In scope**

- Fixing the global `handleKeyDown` path on `svelte:window` in `src/routes/+layout.svelte` so **Escape** can close the chat while `showChatWindow` is true: remove the control-flow bug where an early return skips all body logic (including the intended close branch) whenever the chat is open.
- Ensuring the **open-chat** path that keys off `ALPHABET` does not block the **Escape** path: `ALPHABET` is `/^[a-zA-Z/]$/` so `'Escape'` never passes `ALPHABET.test('Escape')`; the **Escape** branch must be evaluated **before** or **outside** the alphabet guard (explicit `event.key === 'Escape'` handling).
- Optionally blurring `#chatWindowInput` when closing for consistency, and using `preventDefault` / `stopPropagation` as needed so behavior matches the close button and does not double-fire unrelated handlers.
- Verifying in manual or automated test whether **Command** (bits-ui) or the textarea’s `onkeydown` consumes **Escape**; if the window never receives the event, a targeted handler in `ChatWindow.svelte` may be required in addition to the layout fix (see **Open questions**).

**Out of scope**

- Changing chat business logic, `ChatState`, or API behavior.
- New ADRs, new dependencies, or refactors outside the key-handling and any minimal `ChatWindow` follow-up if proven necessary.
- Resolving `console.log` in `handleKeyDown` unless explicitly requested in the same task.
- `task-manifest.json` for this orchestration (read-only; not edited by this plan).

## Component/file map

| File | Action | Purpose |
| ---- | ------ | ------- |
| `src/routes/+layout.svelte` | Modify | Restructure `handleKeyDown` so: (1) when `showChatWindow && event.key === 'Escape'`, set `showChatWindow = false`, optional blur of `#chatWindowInput`, optional `preventDefault`/`stopPropagation` per a11y consistency; (2) alphabet-gated “open and seed input” logic runs only for keys that are **not** the Escape close path and still satisfies `!showChatWindow` (or equivalent) so open logic does not run when closing. Remove or replace dead code: today’s `if (event.key === 'Escape' && showChatWindow)` after the early return is **unreachable** when the sidebar is open (see **Interface contracts**). |
| `src/lib/ui/chat-window/ChatWindow.svelte` | Modify only if verification shows layout alone insufficient | Today `handleCommandInputKeydown` has **commented-out** Escape blur; if bits-ui `Command` swallows `Escape` at the textarea, implement an explicit `Escape` branch here (e.g. call a callback, dispatch, or mirror layout close) per Builder verification. |

## Interface contracts

**Current verified behavior (root cause)**

- `ALPHABET` is `new RegExp(/^[a-zA-Z/]$/);` — matches single letters and `/` only, **not** `'Escape'`.
- `handleKeyDown` begins with:

  `if (!showNav || !ALPHABET.test(event.key) || showChatWindow) return;`

  When `showChatWindow` is `true`, this **returns immediately** for **every** key, including `Escape`, so **no** subsequent code runs — the block that sets `showChatWindow = false` on Escape **never executes** while the chat is open. The following lines are therefore unreachable in that state:

  ```ts
  if (event.key === 'Escape' && showChatWindow) {
  	showChatWindow = false;
  	return;
  }
  ```

**Target contract (layout)**

- **Signature:** `function handleKeyDown(event: KeyboardEvent): void` (unchanged).
- **Escape when chat open:** If `isJsEnabled && showNav` context matches current gating, and `showChatWindow === true`, and `event.key === 'Escape'`, then set `showChatWindow = false`; optionally `document.getElementById('chatWindowInput')` blur; call `event.preventDefault()` and/or `event.stopPropagation()` if needed to match close-button behavior and avoid duplicate handling (Builder to validate).
- **Open chat:** For keys that should open the chat (current design: `ALPHABET.test(event.key)`), only run the open/seed/focus path when not handling Escape close and when appropriate for `showNav` / `!showChatWindow` (exact ordering documented in code comments if non-obvious).

**Target contract (ChatWindow, conditional)**

- `handleCommandInputKeydown(event: KeyboardEvent): void` — if layout-level listener never receives `Escape` while focus is in the textarea, add an `Escape` branch that closes the sidebar **without** duplicating state: prefer a prop callback (e.g. `onRequestClose?: () => void`) from parent **or** a documented pattern the Builder chooses that stays within ADR-007 (local vs prop vs store — `showChatWindow` is layout-local today, so a callback or event from layout is the natural contract for child-triggered close).

## ADR references

- **ADR-001 (Project file and folder structure):** Implication — changes stay in the canonical locations (`+layout.svelte` under `src/routes/`, optional `ChatWindow` under `src/lib/ui/ChatWindow/`); no new server modules or `lib/types/` for this keyboard fix unless a new cross-cutting contract is required (avoid unless necessary).

- **ADR-003 (Progressive enhancement, no-JS baseline):** Implication — chat remains JS-only; Escape handling must not affect no-JS navigation or content. Gating on `isJsEnabled` / `showNav` for the existing sidebar should remain consistent so no-JS users are unchanged.

- **ADR-004 (Semantic HTML and accessibility):** Implication — keyboard: **Escape** closes overlay-like UI (Rule 6); focus on close may need to return to a sensible target (e.g. chat trigger) per “overlay closes and returns focus to the triggering element” — if the current close button does not move focus, matching that behavior for Escape is acceptable; upgrading focus management is a **follow-up** unless explicitly in scope. Verify no regression for screen reader / command surface.

- **ADR-007 (State management, Svelte 5 runes):** Implication — keep `showChatWindow` as local `$state` in `+layout.svelte` unless a justified shared mechanism is introduced; do not reintroduce Svelte 4 patterns; any new child API uses `$props()` for callbacks if needed.

- **ADR-011 (bits-ui):** Implication — `Command` in `ChatWindow` is the right primitive; if its keyboard handling intercepts `Escape`, consult bits-ui **Command** docs (`https://bits-ui.com/llms.txt` index) for expected behavior; fix may be **layout-only** or **layout +** explicit handling on the `Command.Input` **textarea** without replacing bits-ui for this task.

## Open questions

1. **`.cursor/orchestrations/chat-sidebar-escape/task-manifest.json`** was not present in the repo at plan time; confirm `objective`, `flags`, and `locked_artifacts` with the Orchestrator if they differ from this document.

2. **Event path:** Does a keydown on `Escape` bubble to `window` when focus is inside `Command.Input` (textarea), or does bits-ui or the browser handle it first? If **Escape** does not reach `handleKeyDown`, the Builder must add an explicit path in `ChatWindow.svelte` (or pass a close callback) — **not assumed** in scope until verified.

3. **Focus on close:** Should Escape mirror ADR-004’s ideal (“return focus to the element that triggered” the chat) in one task, or match only the current close **button** behavior? If ambiguous, default to “no worse than the close button.”
