# Plan: Resume skills datasource and view modes

## Problem

Skills content was reorganized for resume narrative (many categories, presentation-first). The domain should stay an AI-friendly flat datasource; resume visitors should choose grouping (category, proficiency, tech stack).

## Approach

1. **`skills.ts`** -- Flat `SkillRecord[]` with stable `id`, `categoryId`, `stackIds`, proficiency, notes. Metadata arrays for categories and stacks. `getSkillRecords()` for AI and UI; `getSkills()` groups by category for backward compatibility; update system prompt to flatten records with category/stack context.
2. **`$lib/utils/skills-presentation.ts`** -- `SKILL_VIEW_MODES`, `groupSkillsForDisplay()`, localStorage helpers for persisted mode (browser only).
3. **`resume/+page.ts`** -- Load `skillRecords`, category/stack metadata, proficiency levels.
4. **`resume/+page.svelte`** -- Radio control for view mode; derive chart groups client-side; prerender defaults to category.

## Files

- `src/lib/content/skills.ts`
- `src/lib/utils/skills-presentation.ts`
- `src/lib/utils/skills-presentation.spec.ts`
- `src/lib/server/system-prompt.service.ts`
- `src/routes/resume/+page.ts`
- `src/routes/resume/+page.svelte`
- `src/lib/content/INDEX.md`

## Out of scope

- Sub-category UI nesting
- npm/pnpm/yarn skills
