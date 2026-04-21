# Test report — chat-sidebar-escape

## Coverage map

| AC ID | Automated coverage |
| ----- | ------------------ |
| **AC-01** | `src/tests/chat-sidebar-layout.svelte.spec.ts` — `AC-01 / AC-03: Escape closes the chat while chat is open (not gated on ALPHABET)` |
| **AC-02** | `src/tests/chat-sidebar-layout.svelte.spec.ts` — `AC-02: alphabet key opens chat and seeds input when chat is closed`; `AC-02: Escape is not an alphabet key and does not open chat when closed` |
| **AC-03** | Same file — `AC-01 / AC-03: …` (behavior); `src/tests/layout-chat-keyboard.source.spec.ts` — `AC-03 AC-05: Escape close runs before …` (ordering / structure) |
| **AC-04** | `src/tests/chat-sidebar-layout.svelte.spec.ts` — `AC-04: Escape closes chat when keydown originates on #chatWindowInput` (focus in textarea, Playwright `userEvent.keyboard`) |
| **AC-05** | `src/tests/layout-chat-keyboard.source.spec.ts` — `AC-03 AC-05: Escape close runs before … early return` |
| **AC-06** | `src/tests/chat-sidebar-layout.svelte.spec.ts` — `AC-06: Escape key string does not match the layout ALPHABET pattern`; `src/tests/layout-chat-keyboard.source.spec.ts` — `AC-06: alphabet pattern does not match the string Escape` |
| **AC-07** | `src/tests/chat-sidebar-layout.svelte.spec.ts` — `AC-07: active element after Escape matches close-button path when input had focus` |
| **AC-08** | `src/tests/layout-chat-keyboard.source.spec.ts` — `AC-08: Escape-close branch invokes preventDefault`; `src/tests/chat-sidebar-layout.svelte.spec.ts` — `AC-08: Escape closes sidebar (driver keyboard; see source spec for preventDefault)` |
| **AC-09** | `src/tests/layout-chat-keyboard.source.spec.ts` — `AC-09: layout avoids legacy on: event directives (ADR-007)`; `AC-09: layout does not use SvelteKit legacy page store import` |
| **AC-10** | `src/tests/chat-sidebar-layout.svelte.spec.ts` — `AC-10: when JS is disabled, chat sidebar and trigger are not shown`; `AC-10: on / (showNav false), chat sidebar is absent and alphabet does not open chat`; `src/tests/layout-chat-keyboard.source.spec.ts` — `AC-10: sidebar is inside … gate`; `AC-10: primary nav is shown for no-JS or when showNav (baseline content)` |

## Uncovered criteria

None. Residual risk: **AC-04** depends on Playwright delivering keyboard events to the same pipeline as real browsers; **AC-07** compares `document.activeElement` after Escape vs after **Close chat** in the harness only (not a full screen-reader audit).

## Test stability notes

- **Fixed delays:** Alphabet open/seed uses `setTimeout(..., 150)` in `openChatViaAlphabetKey` and AC-02; slow CI could theoretically flake—consider `expect.poll` if this becomes noisy.
- **Browser mode:** Escape and close-button paths use `userEvent` from `vitest/browser` (Playwright) so `svelte:window` key handling is exercised realistically; synthetic `window.dispatchEvent` alone was insufficient in this project’s Vitest browser setup (see comment in `chat-sidebar-layout.svelte.spec.ts`).
- **Shared URL object:** `$app/state` is mocked with a hoisted `URL` instance whose `pathname` is mutated per test so `showNav` tracks the intended route.

## Commands to run

From the repo root (`c:\Users\kenpo\projects\cxiius`):

```bash
npm run test
```

(`package.json` maps this to `npm run test:unit -- --run`, i.e. `vitest --run`.)

**Last run (this agent):** Vitest v4.1.3 — **14** test files passed, **1** skipped; **85** tests passed, **1** skipped; duration ~**3.7s** (client chromium + server projects). Exit code **0**.
