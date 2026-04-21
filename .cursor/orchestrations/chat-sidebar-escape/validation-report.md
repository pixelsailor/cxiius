## Verdict
PASS_WITH_NOTES

## AC audit

- **AC-01 ✅**: When chat is open, pressing `Escape` closes the sidebar (`showChatWindow` -> false; input removed). Evidence: `src/tests/chat-sidebar-layout.svelte.spec.ts` — `it('AC-01 / AC-03: Escape closes the chat while chat is open (not gated on ALPHABET)')` (lines `53-60`).
- **AC-02 ✅**: When chat is closed, pressing an `ALPHABET` key opens chat, seeds the textarea value, and `Escape` (not in alphabet) does not open. Evidence: `src/tests/chat-sidebar-layout.svelte.spec.ts` — `it('AC-02: alphabet key opens chat and seeds input when chat is closed')` (lines `66-75`) and `it('AC-02: Escape is not an alphabet key and does not open chat when closed')` (lines `77-83`).
- **AC-03 ✅**: Close-on-`Escape` is reachable when `showChatWindow` is true and is not behind the alphabet guard. Evidence: `src/routes/+layout.svelte` escape branch runs before the `showChatWindow || !ALPHABET.test(event.key)` early return (lines `74-83`); automated structure check in `src/tests/layout-chat-keyboard.source.spec.ts` (`it('AC-03 AC-05: Escape close runs before \`showChatWindow || !ALPHABET\` early return')`, lines `10-16`).
- **AC-04 ✅**: With focus in `#chatWindowInput`, `Escape` closes the sidebar. Evidence: `src/tests/chat-sidebar-layout.svelte.spec.ts` — `it('AC-04: Escape closes chat when keydown originates on #chatWindowInput')` (lines `85-95`).
- **AC-05 ✅**: The previously-unreachable close logic is removed/reordered. Evidence: `src/routes/+layout.svelte` now closes in the explicit `if (showChatWindow && event.key === 'Escape')` branch before the `if (showChatWindow || !ALPHABET.test(event.key)) return;` branch (lines `74-83`); automated ordering check in `src/tests/layout-chat-keyboard.source.spec.ts` (lines `10-16`).
- **AC-06 ✅**: `ALPHABET.test('Escape')` is false, and acceptance is met via the explicit `Escape` branch. Evidence: `src/routes/+layout.svelte` uses `ALPHABET = new RegExp(/^[a-zA-Z/]$/)` and the explicit `Escape` branch closes regardless of alphabet (lines `16`, `74-80`); automated check `src/tests/layout-chat-keyboard.source.spec.ts` (lines `24-26`) and `src/tests/chat-sidebar-layout.svelte.spec.ts` (lines `62-64`).
- **AC-07 ✅**: After closing with `Escape`, focus is not left in a worse state than after clicking the close button; active element matches the close-button path in the test. Evidence: `src/tests/chat-sidebar-layout.svelte.spec.ts` — `it('AC-07: active element after Escape matches close-button path when input had focus')` (lines `105-123`).
- **AC-08 ⚠️ partial**: `preventDefault()` is invoked for the `Escape` close branch, but there is no automated matrix proving it does not harm other unrelated global shortcuts compared to the close-button path. Evidence: `src/routes/+layout.svelte` calls `event.preventDefault()` in the `Escape` close branch (lines `75-79`); automated assertion in `src/tests/layout-chat-keyboard.source.spec.ts` (lines `18-22`) plus `test-report.md` notes a manual QA gap for the full shortcut-regression intent (lines `18-23`).
- **AC-09 ✅**: No prohibited Svelte 4 patterns introduced in the layout (no `on:` directives; no legacy `$app/stores`). Evidence: `src/tests/layout-chat-keyboard.source.spec.ts` — `it('AC-09: layout avoids legacy \`on:\` event directives (ADR-007)')` (lines `28-30`) and `it('AC-09: layout does not use SvelteKit legacy \`page\` store import')` (lines `32-34`).
- **AC-10 ✅**: Progressive enhancement preserved: sidebar and trigger are only present under the `isJsEnabled && showNav` gate; no-JS baseline is unchanged. Evidence: `src/tests/chat-sidebar-layout.svelte.spec.ts` — `it('AC-10: when JS is disabled, chat sidebar and trigger are not shown')` (lines `125-131`) and `it('AC-10: on \`/\` (showNav false), chat sidebar is absent and alphabet does not open chat')` (lines `133-140`); layout source gate checks in `src/tests/layout-chat-keyboard.source.spec.ts` (lines `36-46`).

## ADR compliance

- **ADR-001 ✅**: Change remains within canonical location (`src/routes/+layout.svelte`) and uses the existing layout structure (evidence: `src/routes/+layout.svelte` contains the modified `handleKeyDown` logic and retains the overall layout component structure; `src/routes/+layout.svelte:L71-L97`).
- **ADR-003 ✅**: Progressive enhancement/no-JS baseline is preserved: the Escape/open handler is gated behind JS-enabled navigation state and the sidebar/trigger are conditionally rendered only when `isJsEnabled && showNav`. Evidence: handler guard (lines `72-73`), sidebar/trigger gating (lines `196-224`), plus tests for JS-disabled baseline (see AC-10 tests).
- **ADR-004 ⚠️ partial**: ADR-004 states `Escape` should return focus to the triggering element for overlays. The implementation blurs `#chatWindowInput` and closes, and the automated test only verifies “not worse than the close button path” (it matches whatever focus behavior the close button produces), not explicit return-to-trigger semantics. Evidence: blur + close in `src/routes/+layout.svelte` (lines `75-79`) and focus parity check in `src/tests/chat-sidebar-layout.svelte.spec.ts` (lines `105-123`).
- **ADR-007 ✅**: State remains local (`showChatWindow` is a `$state` rune) and the layout avoids prohibited Svelte 4 patterns. Evidence: `src/routes/+layout.svelte` uses `$state`/`$derived` (lines `26-38`) and test evidence for `on:`/legacy store usage absence (AC-09 tests).
- **ADR-011 ✅**: No bits-ui primitive replacement is introduced; the layout continues to use the existing bits-ui button patterns and `ChatWindow.svelte`’s Escape logic is not actively used (it remains commented out). Evidence: `src/routes/+layout.svelte` continues to render bits-ui controls; `src/lib/ui/chat-window/ChatWindow.svelte` shows Escape blur code is commented (lines `36-43`).

## Regressions

- Potential risk: `event.preventDefault()` on `Escape` could affect other global shortcuts/browser behaviors if a broader keyboard regression suite exists. This is not demonstrated to be harmful in the current automated tests, but full cross-shortcut coverage was not part of the suite.

## Required remediations

N/A (verdict is `PASS_WITH_NOTES`).

## Recommended remediations

1. Add a small manual QA check (or extend tests) to compare `Escape` vs close-button behavior for any other existing global shortcuts (e.g., `/` quick search, browser-find, or any app-level keybindings).
2. If ADR-004’s “return focus to the triggering element” is meant to be strict, implement explicit focus restoration on `Escape` close (not only blur + parity with close button), and update AC-07 accordingly.

