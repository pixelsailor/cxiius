# Acceptance Criteria — chat-sidebar-escape

## Functional

- [ ] **AC-01:** With JavaScript enabled and a route where the chat sidebar is available (`showNav` true as in the current layout), open the chat sidebar, then press **Escape** on the keyboard: the chat sidebar **closes** (same end state as clicking the **Close chat** control: `showChatWindow` is false and the sidebar is not shown).

- [ ] **AC-02:** With the chat sidebar **closed**, pressing a key that **matches** the project’s `ALPHABET` pattern (`/^[a-zA-Z/]$/`) still opens the chat and focuses/seeds the command input as intended (regression: open path still works; **Escape** is not in the alphabet but must not break open behavior).

- [ ] **AC-03:** The layout’s key handler is structured so that when `showChatWindow` is true, **Escape** is handled without requiring `ALPHABET.test('Escape')` to be true (i.e. close-on-Escape is not behind the same guard as single-letter open keys).

- [ ] **AC-04:** With the chat sidebar open, if focus is in `#chatWindowInput` (the command textarea) and the user presses **Escape**, the sidebar **still closes** (or verifiable follow-up: if the window does not receive the event, a documented handler in `ChatWindow` closes the sidebar — independently testable in both cases).

## Code / regression

- [ ] **AC-05:** The early-return pattern that caused **unreachable** close logic is removed or reordered: with `showChatWindow === true` and `event.key === 'Escape'`, the code path that sets `showChatWindow = false` is **reachable** in source review (not skipped by `if (… || showChatWindow) return` before the close logic).

- [ ] **AC-06:** `ALPHABET.test('Escape')` is **false** (by design in current code); acceptance can be met by an explicit `Escape` branch that does not depend on the alphabet test for the close action.

## Accessibility / consistency (verify manually or with existing a11y tests if any)

- [ ] **AC-07:** After closing with **Escape**, keyboard focus is not left in a state worse than after closing with the **Close chat** button (e.g. focus remains visible, no trap in a hidden input; if close button does not move focus, Escape may match that behavior without adding new requirements beyond AC-01).

- [ ] **AC-08:** If `preventDefault` or `stopPropagation` is used for **Escape** when closing, it does not break unrelated global shortcuts in a way that is worse than the close-button path (Builder documents any intentional prevention in code if needed for verification).

## Architectural (ADR)

- [ ] **AC-09:** No new Svelte 4 store patterns, `on:event` handlers, or other patterns listed as prohibited in ADR-007 are introduced; `showChatWindow` remains layout-local unless an ADR-consistent pattern (e.g. `$props()` callback) is used for a child close signal.

- [ ] **AC-10:** No content or primary navigation is hidden or removed for no-JS users; chat remains a JS enhancement per ADR-003 (e.g. existing `isJsEnabled` gating for the sidebar is preserved unless explicitly extended with matching baseline behavior, which is out of scope for this task’s Escape fix).
