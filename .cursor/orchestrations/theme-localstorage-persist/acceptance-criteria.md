# Acceptance Criteria — theme-localstorage-persist

## Functional

- [ ] AC-01: Selecting any theme index `0`–`4` with the theme slider persists that index to `localStorage` under the key `cxii.themeIndex` as a string in the range `"0"`–`"4"`.
- [ ] AC-02: On a subsequent full page load with JavaScript enabled, the layout reads the saved index and sets `activeThemeIndex` so the slider reflects the saved value.
- [ ] AC-03: After reload, `document.documentElement` matches the saved theme: for index `0`, `data-theme` is absent (system); for indices `1`–`4`, `data-theme` is `light`, `stone`, `twilight`, or `dark` respectively, consistent with existing `applyTheme`.
- [ ] AC-04: If `localStorage` has no value for the key, the theme behaves as today (default index `0` / system) after client init.
- [ ] AC-05: If the stored value is missing, non-numeric, or otherwise invalid, the app does not throw; behavior is deterministic (e.g. fall back to `0` or ignore and optionally clear) and covered by a unit test.

## Architectural

- [ ] AC-06: `THEME_STORAGE_KEY` is a single exported constant (`cxii.themeIndex`) used for all reads and writes.
- [ ] AC-07: `localStorage` is read and written only in browser contexts (no direct `localStorage` access during SSR / server render paths).
- [ ] AC-08: Theme preference state remains local `$state` in `+layout.svelte`; no new Svelte 4 stores and no new global `$lib/stores/*.svelte.ts` class solely for theme.

## Quality / verification

- [ ] AC-09: `src/lib/utils/theme.spec.ts` (or colocated tests) cover `readStoredThemeIndex` / `persistThemeIndex` behavior including valid, missing, and invalid stored values (with `localStorage` mocked).
- [ ] AC-10: `npm run check` and `npm run test` pass with the changes.
