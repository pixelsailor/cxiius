# Acceptance Criteria — cxii-home-theme-slider

## Functional

- [ ] **AC-01:** `src/routes/+page.svelte` contains a **`.slider-container`** element that wraps a **bits-ui** **`Slider`** tree (`Slider.Root` with **`Slider.Range`** and **`Slider.Thumb`** with **`index={0}`**).
- [ ] **AC-02:** **`Slider.Root`** uses **`type="single"`**, **`min={0}`**, **`max={3}`**, **`step={1}`**, and a **two-way bound** numeric value (`bind:value`) backed by **Svelte 5** **`$state`**.
- [ ] **AC-03:** The markup does **not** include **`Slider.Tick`** (any instance).
- [ ] **AC-04:** Theme names are defined in order **`light`**, **`stone`**, **`twilight`**, **`dark`** at indices **0**, **1**, **2**, **3** respectively; code resolves the current index to the corresponding name (e.g. constant array/tuple lookup).
- [ ] **AC-05:** **`onValueCommit`** is wired and its handler body includes a **`console.log`** call (placeholder per objective).

## Styling and tokens

- [ ] **AC-06:** Slider-related styles use **CSS custom properties** from **`static/styles/tokens.css`** (e.g. colors, borders, radii) for the implemented appearance; no hard requirement to use every token, but styling should visibly rely on the token file where practical.
- [ ] **AC-07:** If the slider uses **transitions** or **animations** on its chrome, those effects are **limited** to **`@media (prefers-reduced-motion: no-preference)`** or the implementation omits nonessential motion.

## Architecture and ADR alignment

- [ ] **AC-08:** **`+page.svelte`** uses **runes** for this feature (**`$state`** / **`$derived`** as needed) and does **not** introduce new Svelte 4 patterns from ADR-007’s prohibited list (`writable`/`readable`, `$:`, `export let` for props, etc.) for this work.
- [ ] **AC-09:** **bits-ui** is imported from the **`bits-ui`** package (consistent with **ADR-011** usage on the route).

## Accessibility

- [ ] **AC-10:** The slider control has an **accessible name** (e.g. associated label, **`aria-label`**, or bits-ui’s documented labelling pattern) so its purpose is not icon-only with no name.
- [ ] **AC-11:** The **thumb** (or its interactive hit target) is **at least 44×44 CSS pixels** in effective size **or** the implementation documents an explicit bits-ui/layout exception in **`build-log.md`** with rationale (Validator checks for one of these).

## Quality gates

- [ ] **AC-12:** **`npm run check`** completes with **no errors** attributed to the new/changed `+page.svelte` code.
- [ ] **AC-13:** **`npm run lint`** completes successfully (if **`console.log`** triggers lint, **`build-log.md`** records the **objective-mandated** exception or an eslint-disable at the narrowest scope—Validator records outcome).
