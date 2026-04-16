# Plan — cxii-home-theme-slider

## Objective restatement

The home route (`src/routes/+page.svelte`) exposes a bits-ui single-value Slider inside `.slider-container` with discrete values 0–3 mapped to the theme names `light`, `stone`, `twilight`, `dark`; the slider uses `Slider.Range` and `Slider.Thumb` only (no ticks), wires `onValueCommit` to a `console.log` placeholder, and is styled using existing CSS design tokens under `static/styles/`.

## Scope boundary

**In scope**

- Implement the Slider markup and behavior in **`src/routes/+page.svelte`** inside the existing **`.slider-container`** wrapper (do not remove or relocate that class without product direction).
- Import **Slider** from **`bits-ui`** (already a dependency in root `package.json`).
- **`Slider.Root`** with **`type="single"`**, **`min={0}`**, **`max={3}`**, **`step={1}`**, **`bind:value`**, and **`onValueCommit`** per `SliderSingleRootPropsWithoutHTML`-style API.
- Children: **`Slider.Range`**, **`Slider.Thumb`** with **`index={0}`** only; **do not** render **`Slider.Tick`**.
- A stable ordered mapping from integer index → theme name: **`['light', 'stone', 'twilight', 'dark']`** (index `0` = `light`, …, `3` = `dark`).
- Local reactive state with **Svelte 5 runes** (`$state` for the bound value; no new global store unless explicitly unlocked by a follow-up decision).
- Styling that consumes **`static/styles/tokens.css`** variables (e.g. `--border`, `--muted`, `--radius-*`, `--default-transition-*`, spacing) via scoped `<style>` in `+page.svelte` and/or `:global(...)` targeting bits-ui slot classes as needed.
- **`onValueCommit`:** placeholder behavior **`console.log(...)`** as stated in the task objective (intended as a temporary stub until real theme application exists).

**Out of scope**

- Editing **`.cursor/orchestrations/cxii-home-theme-slider/task-manifest.json`** (orchestrator-only).
- **Required** changes to **`src/routes/+layout.svelte`** — reference only: layout already embeds a theme `Slider` in a popover with `Slider.Tick`; this task does not require aligning layout unless an open question is resolved (see below).
- New **global** reactive classes in **`$lib/stores/`** for theme unless the human decides theme must be shared app-wide (not assumed here).
- New ADRs (none required if this stays route-local bits-ui usage consistent with existing dependencies).
- Replacing the layout popover slider or removing **`Slider.Tick`** from layout (separate change).

## Component/file map

| File                       | Action               | Purpose                                                                                                                                                                                                                                                                                                                                               |
| -------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/routes/+page.svelte`  | Modify               | Import `Slider` from `bits-ui`; add `$state` for slider value; render `Slider.Root` (single, 0–3, step 1) with `Slider.Range` + `Slider.Thumb` inside `.slider-container`; implement index→theme-name mapping; `onValueCommit` calls `console.log` placeholder; add scoped (and if needed `:global`) CSS using token variables for track/thumb/range. |
| `static/styles/tokens.css` | Read-only dependency | Source of `--background`, `--foreground`, `--border*`, `--radius-*`, transitions, etc., for slider styling.                                                                                                                                                                                                                                           |
| `static/styles/app.css`    | Read-only dependency | Global base utilities (e.g. `.sr-only` if a visually hidden label is used).                                                                                                                                                                                                                                                                           |
| `package.json`             | Read-only            | Confirms `bits-ui` dependency version.                                                                                                                                                                                                                                                                                                                |

**Not required for MVP:** new files under `src/lib/ui/` (ADR-011 prefers bits-ui in shared components when extracted; the objective places the control on the home page).

## Interface contracts

**Theme index and names**

- Use a **const tuple** or readonly array in the page script, e.g.  
  `const THEME_NAMES = ['light', 'stone', 'twilight', 'dark'] as const`  
  and type `ThemeName = (typeof THEME_NAMES)[number]`.
- For any integer `value` in **`0 | 1 | 2 | 3`**, resolved theme name is **`THEME_NAMES[value]`** (narrow with a guard or assert if integrating with loosely typed callbacks).

**Slider props (explicit)**

- `type="single"`
- `min={0}` `max={3}` `step={1}`
- `bind:value` to a **`number`** held in **`$state`** (initial value **must be specified by the Builder** in `0..3`, typically `0` for `light` unless product says otherwise).
- `onValueCommit`: signature must match bits-ui’s single-slider commit handler; body is **`console.log`** with the committed value and/or resolved **`ThemeName`** per Builder choice (still a stub).

**Forbidden in markup for this task**

- `<Slider.Tick ... />` (any index).

**CSS**

- Prefer **`var(--...)`** from `static/styles/tokens.css` for colors, radii, borders, and transitions.
- Any motion on the slider chrome: gate with **`@media (prefers-reduced-motion: no-preference)`** per ADR-004 (or omit motion-only styling).

## ADR references

**ADR-003 — Progressive Enhancement and No-JS Baseline**

- _Implication:_ The home page must remain a complete static document for prerendered content (existing `<h1>` and structure). The theme slider is an **interactive enhancement**; it does not replace navigation or primary content. No requirement to load theme **content** in `onMount`; slider state is client interaction, not deferred primary body content. If the slider is not operable without JS, the baseline page (heading, layout shell from `+layout.svelte`) must still be usable as today.

**ADR-004 — Semantic HTML and Accessibility Standards**

- _Implication:_ Prefer a **visible and/or programmatic name** for the control (e.g. associate a `<label>` with the slider’s labelled-by/id pattern if bits-ui exposes it, or `aria-label` on the root if that is the documented pattern). **Keyboard** operation is delegated to bits-ui; **do not** apply `outline: none` on the thumb without a visible focus replacement. **Touch:** style the thumb/track so the thumb’s interactive target meets **≥ 44×44px** effective hit area where feasible. **Motion:** any non-essential transitions respect **`prefers-reduced-motion`**.

**ADR-007 — State Management Conventions**

- _Implication:_ Use **Svelte 5 runes only** in `+page.svelte`: **`$state`** for the bound value, **`$derived`** if a derived `ThemeName` is useful. **No** new `writable()` / `readable()` stores, **no** Svelte 4 `export let` or `$:` for this feature. **Do not** use `$effect` to sync slider value to theme names; use `$derived` from the numeric state.

**ADR-011 — UI Component Library — bits-ui**

- _Implication:_ Using **bits-ui `Slider`** is consistent with the project’s headless stack. ADR-011’s **primary** placement story is **`src/lib/ui/`** for shared primitives; this task is explicitly **route-local** per the objective, which is acceptable without violating the ADR—**optional** follow-up is extracting a `ThemeSlider` under `$lib/ui/` if reuse appears. Agents may use **https://bits-ui.com/llms.txt** for Slider API details during implementation.

**ADR-001 — Project File and Folder Structure**

- _Implication:_ No new **`src/lib/ui/`** folder is **required** for delivery; if the Builder adds a component file, follow **PascalCase** folder/file naming and direct imports (no barrel files).

**Note (lint vs objective):** Project lint guidance discourages **`console.log`** in UI; the **task objective explicitly requires a `console.log` placeholder** for `onValueCommit`. The Builder should implement as specified; Validator can treat this as an **approved exception** for this task or note a follow-up to replace with real theme application.

## Open questions

1. **Relationship to `+layout.svelte` theme slider:** Layout already has **`themeValue`**, **`handleThemeChange`**, and a popover `Slider` (with ticks). Should the home page slider **share** that state (e.g. prop/context/store) or remain **independent**? The objective does not require syncing; **the Builder must not assume** without human confirmation.
2. **How `light` / `stone` / `twilight` / `dark` apply to CSS:** The codebase currently has **no** documented `data-theme` / class strategy on `<html>` or `:root` for those four names—layout only logs the numeric value. Should **`onValueCommit`** (beyond `console.log`) set **`document.documentElement.dataset.theme`**, a class, or **CSS variables**, and where should per-theme tokens live? **Do not invent** a full theme system in this task unless the human confirms scope.
3. **Initial slider value vs system preference:** Should the default index match **`prefers-color-scheme`** or **always start at `0` (`light`)?** Not specified in the objective.
4. **Visible theme label on the home page:** Should users see the current theme **name** (text) next to the slider, or **control only**? Not specified; Builder may use minimal UI consistent with tokens.
