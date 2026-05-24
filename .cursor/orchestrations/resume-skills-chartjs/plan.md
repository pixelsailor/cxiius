# Plan: Resume skills Chart.js explorer

## Objective restatement

The resume Skills section exposes a Chart.js-powered client-only explorer with multi-type charts, aggregation controls, filtered slices of the datasource, persisted UI preferences in `localStorage`, and typed `yearsOfExperience` on every skill, while preserving a full prerendered HTML skills baseline for users without JavaScript.

## Scope boundary

**In scope**

- Add **`yearsOfExperience: number`** to `SkillRecord` in `skills.ts`; assign a plausible non-negative numeric value per row (currently **74** records in `skillRecords`; populate every row consistently with career context in `experience.ts` and existing `notes` where helpful).
- Replace the CSS bar-meter visualization in **`resume/+page.svelte`** with a composition built from **`$lib/ui/`** primitives that initializes Chart.js only in the browser, using **`chart.js@^4.5.1`** with **explicit `.register(...)`** of required controllers / elements / scales / plugins only (tree-shakable path).
- **Chart types:** vertical bar, horizontal bar, pie, doughnut, polar area, bubble, radar, plus **scatter** as the additional distribution-focused chart type (scatter uses point-per-skill semantics; bubble uses three numeric encodings plus optional radii — see aggregation mapping below).
- **Filtering:** proficiency (multi-select or single-select aligned with UX — see open questions), category (typically single grouping axis; overlapping multi-category is not applicable per record), tech stack (**multi-select** with clear semantic: skill matches if **`stackIds`** intersects selected set AND when none selected behave as **no stack filter / all stacks** OR **explicit “any” toggle** — finalize in Builder only after resolving open question), years of experience **range** (slider or dual-handle range defining `[minYears, maxYears]` inclusive filtering on `yearsOfExperience`).
- **Grouping / aggregation dimension:** retain **category**, **proficiency**, **stack**, and extend the UI beyond a **three-option radio only** — e.g. **select or segmented control**, plus at least **one extra aggregation mode** usable by cartesian layouts, such as **`years-band`** fixed buckets (`0-<3`, `3-<8`, `8-<15`, `15+` years — exact edges are implementation constants documented in utils) mapping each skill into one bucket for label axis.
- **Progressive enhancement:** prerender unchanged `load()` data; skills section **`main`** content includes a **non-canvas semantic baseline** (see No-JS strategy) rendered from `data` without waiting on client-only bundles.
- Extend **`skills-presentation.ts`** and/or collocate **`skills-chart-*.ts`** helpers under **`$lib/utils/`** that build `{ labels, datasets }` (Chart.js-compatible plain objects — no framework types in content).
- Persist **chart type + filters + grouping dimension (+ optional metric)** keyed in `localStorage`; **migrate** prior `cxii-resume-skills-view-mode` when present into the new persisted shape **without destructive loss** where possible.

**Out of scope**

- New CMS, API routes, or server-side persistence of filters.
- New npm chart libraries beyond existing `chart.js`.
- Automated visual regression snapshots (optional manual check only).
- i18n of filter labels beyond existing English constants.

## Component/file map

| File | Action | Purpose |
|------|--------|---------|
| `src/lib/content/skills.ts` | Modify | Extend `SkillRecord`; add **numeric** field to **every** record; update **`formatSkillsForPrompt`** rows to include **`years`** in the prompt line unless product decision defers (**open question**); keep **`Promise`** getters and client-safety (**ADR-008**). |
| `src/lib/utils/skills-presentation.ts` | Modify | Keep `groupSkillsForDisplay`, **`SkillDisplayGroup`**, and existing view-mode persistence key for **backward-compatible read** OR replace with consolidated JSON prefs while retaining **migration** shim to read old key (**interface contracts** section). Extend with **pure** filter helpers and/or delegates to sibling module. |
| `src/lib/utils/skills-chart-data.ts` (**new**) | Create | **`filterSkillRecords`** and **`aggregateSkillRecords`**; deterministic ordering; explicit exported return types; avoid Chart.js in this layer; **`years-band`** binning helpers co-located. |
| `src/lib/utils/skills-chart-data.spec.ts` (**new**) | Create | Vitest coverage for filtering edge cases (empty stacks selected, proficiency `none`, year boundaries, overlapping stack tags). |
| `src/lib/utils/skills-chart-config.ts` (**new**) | Create | Map **aggregation dimension + metric** to Chart.js **`ChartData`** (and **`ChartOptions`** defaults: responsive, fonts, **`maintainAspectRatio`** policy). Imports only `chart.js` types + tree-shakable registration helpers if needed alongside a **`createRegisteredChart`** or module-level **`registerCharts()`** callable from chart component **`onMount`**. |
| `src/lib/ui/skills-explorer/ResumeSkillsExplorer.svelte` (**new**) | Create | Shell: consumes serialisable **`data`** props (**SkillRecord**, category/stack lists, **`ProficiencyLevel[]`** for palette copy only). Owns **`$state`** for chart type, filters, grouping (**ADR-007**). Calls persistence helpers; mounts canvas in **`onMount`** or conditional client branch; destroys chart instance **`onDestroy`**. Prefer **bits-ui** for select / slider primitives where suitable (**ADR-011**). |
| `src/lib/ui/skills-explorer/ResumeSkillsBaseline.svelte` (**new**) | Create | SSR-safe markup: headings + **`<table>`** or nested lists with **columns** skill name | proficiency label | **yearsOfExperience** | category | stacks (readable string). Wired from **same filtered default** server intent: **full unfiltered datasource** grouped by **`category`** (stable default baseline). **`@component`** block per project docs. |
| `src/lib/ui/skills-explorer/index.ts` (**new**) | Create | Barrel re-exports per adjacent feature folders in project. |
| `src/lib/ui/index.ts` | Modify | Export public facade for **`ResumeSkillsExplorer`** (optional if page imports `@ui/skills-explorer` path directly — follow predominant pattern after reading `src/lib/ui/index.ts`). |
| `src/routes/resume/+page.svelte` | Modify | Swap skills markup for **`<ResumeSkillsBaseline … />`** (always SSR) sibling to **`<ResumeSkillsExplorer … />`** (client-only enhancement). Strip obsolete bar CSS; keep legend panel pattern **aside** beside chart pane when viewport allows; tighten **semantic structure** (**ADR-004**) — headings under **`skills-heading`**. Move heavy chart CSS into component-scoped **`style`** or retained global tokens only where necessary. Remove **`onMount`** used **only** for legacy view persistence if superseded by explorer’s persistence (otherwise leave minimal glue). |
| `src/lib/server/system-prompt.service.ts` | Modify | Include **yearsOfExperience** in assembled skills text when **`formatSkillsForPrompt`** changes (**ADR-008** consumer). |

If barrel or prompt wording does not actually change once implemented, omit the corresponding edit and record that in **`build-log.md`** under **Deviations from plan**.

## Interface contracts

### Content

```ts
// skills.ts — extend existing
export type SkillRecord = {
  id: string;
  name: string;
  proficiency: Proficiency;
  yearsOfExperience: number; // non-negative finite; authoring guidance ~ “years substantive use” aligned with narrative
  notes?: string;
  categoryId: SkillCategoryId;
  stackIds: SkillStackId[];
};
```

**Authoring rule:** `yearsOfExperience` is a **portfolio estimate** grounded in **`experience.ts` dates/tags** — not audited precision; fractional years allowed only if builders choose **`number` integer rounding** uniformly (preferred: **whole years** `.0` suppressed in UI formatting).

### Aggregation and filters (utils)

```ts
/** Stacks filter: ids user selected; semantics fixed in builders (Open question). */
export type SkillsChartStackFilter =
  | { mode: 'all' }
  | { mode: 'any-of'; stackIds: SkillStackId[] };

/** Inclusive proficiency filter; omit tier == no constraint if empty-all interpretation chosen. */
export type SkillsChartProficiencyFilter =
  | { mode: 'all' }
  | { mode: 'include'; tiers: readonly Proficiency[] };

export type SkillsChartCategoryFilter =
  | { mode: 'all' }
  | { mode: 'include'; categoryIds: readonly SkillCategoryId[] };

/** Inclusive year range on SkillRecord.yearsOfExperience */
export type SkillsChartYearRangeFilter = {
  minYears: number;
  maxYears: number;
};

/** category | proficiency | stack | years-band (bucket index or label lane) — extends beyond radio-three */
export type SkillsChartGrouping =
  | 'category'
  | 'proficiency'
  | 'stack'
  | 'years-band';

/** Aggregate value per grouping label slot */
export type SkillsChartMetric = 'count' | 'avg-years' | 'sum-years';

export type SkillsExplorerFilters = {
  stacks: SkillsChartStackFilter;
  category: SkillsChartCategoryFilter;
  proficiency: SkillsChartProficiencyFilter;
  years: SkillsChartYearRangeFilter;
};
```

Pure functions (**explicit exports**):

- **`filterSkillRecords(records: SkillRecord[], filters: SkillsExplorerFilters): SkillRecord[]`**
- **`aggregateSkillRecords(opts: { records: SkillRecord[]; grouping: SkillsChartGrouping; metric: SkillsChartMetric }): AggregatedSkillsChartRow[]`**  
  **`AggregatedSkillsChartRow`** at minimum **`{ label: string; key: string; value: number; segments?: Segment[] }`** where **`segments`** optionally encode **proficiency stack** colouring for stacked bars.

Persisted prefs shape (**versioned JSON** string under a **single new key**, e.g. **`cxii-resume-skills-explorer-state`**):

```ts
export type PersistedSkillsExplorerStateV1 = {
  version: 1;
  chartType:
    | 'bar'
    | 'bar-horizontal'
    | 'pie'
    | 'doughnut'
    | 'polarArea'
    | 'bubble'
    | 'radar'
    | 'scatter';
  grouping: SkillsChartGrouping;
  metric: SkillsChartMetric;
  filters: SkillsExplorerFilters;
};
```

Migration: if **`cxii-resume-skills-explorer-state`** absent and **`cxii-resume-skills-view-mode`** present, initialise **`grouping`** from **`SkillViewMode`** mapping (**stack → `'stack'`**, etc.) with **default chartType `bar-horizontal`** aligning with legacy bar analogy.

### UI props (**ResumeSkillsExplorer**)

```ts
type ResumeSkillsExplorerProps = {
  skillRecords: SkillRecord[];
  skillCategories: readonly SkillCategoryMeta[];
  skillStacks: readonly SkillStackMeta[];
  proficiencyLevels: readonly ProficiencyLevel[]; // legend copy only
};
```

**ResumeSkillsBaseline props:** baseline receives **`SkillRecord[]`** (full list). It groups by **`category`** in **`SKILL_CATEGORIES`** order with name sort within group, parity with **`groupSkillsForDisplay(..., 'category', ...)`**.

### Chart adapters

- **`buildChartConfiguration(args: BuildChartArgs): { type: RegisteredChartType; data: ChartData; options: ChartOptions }`** where **`RegisteredChartType`** matches persisted union.
- **Colour scale:** derive from existing **`ProficiencyLevel.color`** token mapping **`gray|red|yellow|blue|green`** to CSS variables already used (`--blue-800` etc.) or **hex map** centralized in **`skills-chart-config.ts`** documenting **fallback** palette for non-proficiency segmented charts (**category/stack** cyclic palette).

### Chart type → data aggregation semantics

Guiding rule: **`filter`** first, **`aggregate`** second, **`adapt`** chart last.

| Chart type | Primary dimension on category axis | Series / radial encoding | Notes |
|------------|------------------------------------|---------------------------|-------|
| **bar** (vertical) | **Grouping dimension** (`category` / `proficiency` / **`stack`** / **`years-band`**) | **Single metric** bar **or stacked** proficiency segments when **`metric`** is **`count`** | When many labels overlap, tilt or truncate x-axis ticks in `ChartOptions`. |
| **bar-horizontal** | Same grouping | Same | Mirrors legacy readability. |
| **pie**, **doughnut**, **polarArea** | One slice/petal per aggregated **label** | **Single numeric metric** (**value**) | Tooltip lists **underlying skill counts** snippet via **custom formatter** referencing **backing rows** array passed alongside data. |
| **radar** | Radar axes are **fixed ordered proficiency tiers** (`emerging` through `fluent`, excluding `none`); grouping dimension UI is suppressed or visibly ignored | **Single dataset**, **value** = filtered skill **count per tier** | Do not silently reinterpret grouping dimension for radar; see acceptance criterion on control state. |
| **bubble** | X = **`yearsOfExperience`** (linear scale) | Y = proficiency **ordinal** (**1–5**); bubble **r** (**radius**) may use a fixed constant across points or proportional encoding documented in **`build-log.md`** | Default: **one bubble per filtered** `SkillRecord`. |
| **scatter** | X = **`yearsOfExperience`** | Y = **`proficiency` ordinal numeric** (**same mapping**) **point size smallest** (**pointRadius**=`3`) **— no radii semantics** (**distribution clarity**) |

**Radar vs grouping knob:** Radar ignores **`Grouping`** knob in persisted state reconciliation — **persisted grouping** untouched but **controls disabled** visually when **`chartType=== 'radar'`** to reduce confusion (**acceptance criterion**).

**Polar area metric:** radial distance = **positive aggregate value** (**count** strongly recommended UI default).

### No-JS fallback strategy

1. **`load()` unchanged** (**ADR-002**): continue returning **`skillRecords`**, **`skillCategories`, `skillStacks`, `proficiencyLevels`** — no promises for body fragments.
2. **Baseline markup** (`ResumeSkillsBaseline`) renders inside `<section aria-labelledby="skills-heading">`:
   - **Always present** full content in **SSR HTML**.
   - **Semantic `<table>`** with **`scope="col"`** headers **or** `dl`/`ol` nests if table rejected — **preference: table** for **tabular years + proficiency**.
3. **Enhanced path:** **`ResumeSkillsExplorer`** runs only client-side (**dynamic import Chart.js helpers** acceptable inside component or sibling module). Upon successful mount (**and** **`typeof window`**), apply **`sr-only`/visually hidden** styling to **`ResumeSkillsBaseline` root via sibling class lifted to wrapper** (**`data-explorer-ready`**) OR keep baseline **outside** **`sr-only`** as **below chart “Table view”** inside **`<details open={false>`** collapsed by default so **sight users** prioritize chart (**open question:** confirm UX — default **baseline visible-first** violates “chart explorer” prominence — recommend **baseline `sr-only` only when explorer mounted AND chart labelled** ).
4. **Minimum acceptable accessibility:** **`canvas` labelled** with **`role="img"`** + **`aria-label`** summarizing **aggregation + filtered count**.

### Test strategy (unit)

Focus **deterministic pure utils** (**ADR-006** boundaries — no Zod):

- **`filterSkillRecords`**: extremes **`min=max`**, **skills with `none` proficiency** (**include/exclude**)**, stacks **union** semantics for multi-tag**, **records array empty**.
- **`aggregateSkillRecords`**: **`years-band`** bucketing thresholds (boundary inclusion documented in test names); **`stack`** grouping assigns each skill **once per stack membership** (**if** `skill.stackIds` contains stack **S**, that skill increments the aggregate for **`S`**).
- **Persistence round-trip:** stringify/parse round-trip restores `PersistedSkillsExplorerStateV1`; invalid **`version`** yields safe defaults (**document** expected behaviour in **`test-report`**).
- Update **`skills-presentation.spec.ts`** when **`skillRecordToSkill`** or **`Skill`** shape changes; baseline table may omit **`Skill`** intermediate if it maps **`SkillRecord`** directly.

Prefer **narrow fixture `SkillRecord[]`** mirroring **`skills.ts`** **types**.

## ADR references (active; implications only)

| ADR | Implication for this task |
|-----|---------------------------|
| **ADR-002** | Numeric skills content ships only via awaited `load()`; baseline and explorer read identical `data` snapshots; Chart code must not substitute `onMount` as the sole path for authoritative skills content (**ADR-002 Rule 6**). |
| **ADR-003** | **SSR baseline** completes reading experience **without Canvas** or **bundle-gated Chart** imports on critical path (**dynamic import Chart code** exclusively client-triggered **after hydration** acceptable). Navigation unaffected. |
| **ADR-004** | Landmark **`section`** + **`skills-heading`**; **baseline table** headings; **aside** legend; **interactive controls labelled** (**fieldset**/`<label>`). |
| **ADR-006** | **`as const` unions** (**no enums**); **no Zod** in **`$lib/utils`**; content types (**e.g.** `SkillRecord`) stay **co-located** in **`skills.ts`**. |
| **ADR-007** | **`$props()`**, **`$state`/`$derived`/`$effect`** — no **`writable()`**/`readable()` stores; **`$effect`** only for syncing to external systems (**Chart.js canvas lifecycle**) where runes alone are insufficient. |
| **ADR-008** | **`Promise` getters unchanged**; **server prompt** updated when **`formatSkillsForPrompt`** gains **years**. |
| **ADR-011** | **bits-ui Slider / Select / Popover / Tabs** (**if Tabs for chart picker**) supersede bespoke keyboard wiring where applicable. |

## Open questions — Builder must NOT invent silently

1. **`SkillsChartStackFilter` semantics**: When **multiple stacks selected**, is the rule **skill must match ANY selected stack**, or **ALL** (**unrealistic**) — planner assumes **`any-of`**; confirm UX copy.
2. **Baseline collapsibility**: When JS runs, **should baseline disappear visually** (**`sr-only`**) **vs always visible table under chart for accessibility** (**visible duplicate** noisy)? Product pick.
3. **`formatSkillsForPrompt` inclusion of years**: Confirm **append** **`years=X`** snippet per bullet for AI accuracy **vs omit** as noise-only.
4. **Radar stacking policy**: Locked to **tier counts dataset** (**Proposal above**) acceptable?
5. **Bucket edges** **`years-band`**: Confirm four buckets **`[0,3)`, `[3,8)`, `[8,15)`, `[15,∞]`** (**inclusive bounds** clarified in tests).
