# Acceptance Criteria — cxii-theme-five-options

## Functional

- [ ] AC-01: With JavaScript enabled, moving the theme **Slider** and releasing (value commit) at each integer step **0–4** updates the document so **index 0** clears **`data-theme`** on `<html>`, and indices **1–4** set **`data-theme`** to **`light`**, **`stone`**, **`twilight`**, and **`dark`** respectively (string match exactly).
- [ ] AC-02: **`clampThemeIndex`** accepts any real number, rounds and clamps to **0–4**, and is used so the Slider never maps to an out-of-range theme index.
- [ ] AC-03: With **no** `data-theme` on `<html>`, visual tokens match **current** behavior: default **light** values from **`:root`** and **dark** values from **`prefers-color-scheme: dark`** the same as **before** this change (pixel-identical token values for those two modes).
- [ ] AC-04: With **`data-theme="light"`** set, the page uses the **exact** same color (and other theme-scoped) variable **values** as the **pre-change** default `:root` light palette, regardless of OS light/dark preference.
- [ ] AC-05: With **`data-theme="dark"`** set, the page uses the **exact** same color (and other theme-scoped) variable **values** as the **pre-change** `@media (prefers-color-scheme: dark) :root { ... }` block, regardless of OS preference.
- [ ] AC-06: **`data-theme="stone"`** and **`data-theme="twilight"`** each apply a **full** set of theme variables (coverage comparable to light/dark), are visually distinct from each other, and follow the planned warm-neutral vs blue-purple **direction** (qualitative check).
- [ ] AC-07: **Explicit** `data-theme` overrides **system** appearance: e.g. **`data-theme="light"`** with OS dark preference still shows the light palette; **`data-theme="dark"`** with OS light preference still shows the dark palette.
- [ ] AC-08: **`onValueCommit`** triggers theme application (not merely **`onValueChange`**), and placeholder **`console.log`** / stub logging for theme selection is removed from production layout code.

## Architectural

- [ ] AC-09: Theme application uses **`document.documentElement.dataset`** (or equivalent) from the layout (or **`src/lib/utils`** helper); **no** new global **`$lib/stores/*.svelte.ts`** class is added **only** for theme unless justified in **`build-log.md`**.
- [ ] AC-10: Layout script uses **Svelte 5 runes** (`$state`, `$derived`, `$props`) consistent with ADR-007; no new Svelte 4 patterns from ADR-007 Rule 8 are introduced for this feature.

## Accessibility / ADR alignment

- [ ] AC-11: **Header**, **main**, **footer**, and **nav** links remain present and unconstrained per ADR-004; the theme Slider remains **labeled** for assistive tech (e.g. **`aria-label`** or equivalent preserved).
- [ ] AC-12: No-JS users still get a usable page with **real** navigation links; theme control absence does not break navigation or content (ADR-003).

## Verification

- [ ] AC-13: **`npm run check`** and **`npm run lint`** pass after changes (or any failures are recorded with cause in **`test-report.md`** / **`validation-report.md`** per pipeline).
