<script lang="ts">
  import { onMount } from 'svelte';
  import { Popover, mergeProps } from 'bits-ui';
  import cn from 'clsx';
  import { SvelteSet } from 'svelte/reactivity';
  import type { SvelteSet as SvelteSetType } from 'svelte/reactivity';
  import { browser } from '$app/environment';
  import {
    type SkillCategoryMeta,
    type SkillRecord,
    type SkillStackId,
    type SkillStackMeta
  } from '$lib/content/skills';
  import { CaretDownIcon } from '$lib/ui/icons';
  import {
    buildSkillCategorySections,
    skillRecordsForStack,
    type SkillCategorySection
  } from '$lib/utils/skills-chart-data';
  import { hydrateIncludedSkillIds, writeIncludedSkillIds } from '$lib/utils/skills-presentation';
  import type { ChartOptionsPane } from './types';

  /** Snappy hover open (Phase 1 used immediate pointerenter); standard close grace. */
  const POPOVER_OPEN_DELAY_MS = 100;
  const POPOVER_CLOSE_DELAY_MS = 300;

  type Props = {
    skillRecords: SkillRecord[];
    skillCategories: readonly SkillCategoryMeta[];
    skillStacks: readonly SkillStackMeta[];
    /** Page-supplied anchor for panel positioning over the chart shell. */
    customAnchor?: HTMLElement | null;
    /** Bindable Set instance shared with `ResumeSkillsChart` on the page. */
    includedSkillIds?: SvelteSetType<string>;
    /** Bindable; true after client hydration from localStorage. */
    inclusionHydrated?: boolean;
  };

  let {
    skillRecords,
    skillCategories,
    skillStacks,
    customAnchor = null,
    includedSkillIds = $bindable(new SvelteSet<string>()),
    inclusionHydrated = $bindable(false)
  }: Props = $props();

  let popoverOpen = $state(false);
  let selectedPane = $state<ChartOptionsPane>('domains');

  /** The domain category highlighted in the domains pane; does not affect the chart. */
  let selectedDomain = $state<string>('languages-markup');

  /** The tech stack highlighted in the stacks pane; selecting one replaces chart inclusion. */
  let selectedStackId = $state<SkillStackId | null>(null);

  const categorySections = $derived(buildSkillCategorySections(skillRecords, skillCategories));
  const stacksWithSkills = $derived(
    skillStacks.filter((stack) => skillRecordsForStack(skillRecords, stack.id).length > 0)
  );

  onMount(() => {
    if (!browser) {
      return undefined;
    }
    const hydrated = hydrateIncludedSkillIds(skillRecords);
    includedSkillIds.clear();
    for (const skillId of hydrated) {
      includedSkillIds.add(skillId);
    }
    inclusionHydrated = true;
    return undefined;
  });

  $effect(() => {
    if (!browser || !inclusionHydrated) {
      return;
    }
    void includedSkillIds.size;
    writeIncludedSkillIds(skillRecords, includedSkillIds);
  });

  function clearSelectedStack(): void {
    selectedStackId = null;
  };

  function toggleSkillInclusion(skillId: string, checked: boolean): void {
    clearSelectedStack();
    if (checked) {
      includedSkillIds.add(skillId);
    } else {
      includedSkillIds.delete(skillId);
    }
  };

  function countIncludedInSection(section: SkillCategorySection): number {
    return section.skills.filter((skill) => includedSkillIds.has(skill.id)).length;
  }

  function isSectionFullyIncluded(section: SkillCategorySection): boolean {
    return section.skills.length > 0 && countIncludedInSection(section) === section.skills.length;
  }

  function isSectionPartiallyIncluded(section: SkillCategorySection): boolean {
    const count = countIncludedInSection(section);
    return count > 0 && count < section.skills.length;
  }

  function toggleCategoryInclusion(section: SkillCategorySection, checked: boolean): void {
    clearSelectedStack();
    for (const skill of section.skills) {
      if (checked) {
        includedSkillIds.add(skill.id);
      } else {
        includedSkillIds.delete(skill.id);
      }
    }
  }

  /** Sets native `indeterminate` on category header checkboxes for partial selection. */
  function categoryCheckboxState(node: HTMLInputElement, partial: boolean) {
    node.indeterminate = partial;
    return {
      update(nextPartial: boolean) {
        node.indeterminate = nextPartial;
      }
    };
  }

  function activateSkillStack(stack: SkillStackMeta): void {
    selectedStackId = stack.id;
    includedSkillIds.clear();
    for (const skill of skillRecordsForStack(skillRecords, stack.id)) {
      includedSkillIds.add(skill.id);
    }
  }
</script>

<!--
@component
bits-ui popover for resume skills chart options (domains + tech stacks panes).

Owns header trigger buttons (`Popover.Trigger` child snippet with `openOnHover`), `selectedPane`, `includedSkillIds`, and localStorage persistence. The resume page supplies `customAnchor` for panel positioning and binds `includedSkillIds` / `inclusionHydrated` to `ResumeSkillsChart`.

Example:
```svelte
<ResumeSkillsChartOptionsPopover
  {skillRecords}
  {skillCategories}
  {skillStacks}
  customAnchor={anchorEl}
  bind:includedSkillIds
  bind:inclusionHydrated
/>
```
-->

<Popover.Root bind:open={popoverOpen}>
  <Popover.Trigger openOnHover openDelay={POPOVER_OPEN_DELAY_MS} closeDelay={POPOVER_CLOSE_DELAY_MS}>
    {#snippet child({ props })}
      <div {...mergeProps(props, { class: 'button-group' })}>
        <button
          type="button"
          class="button"
          aria-controls="skills-chart-options"
          aria-expanded={popoverOpen}
          onpointerenter={() => {
            selectedPane = 'skillStacks';
          }}
        >
          Tech stacks
          <CaretDownIcon size="sm" ariaLabel="Caret down" />
        </button>
        <button
          type="button"
          class="button"
          aria-controls="skills-chart-options"
          aria-expanded={popoverOpen}
          onpointerenter={() => {
            selectedPane = 'domains';
          }}
        >
          Skills by domain
          <CaretDownIcon size="sm" ariaLabel="Caret down" />
        </button>
      </div>
    {/snippet}
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      id="skills-chart-options"
      class="popover__content skills-explorer-popover"
      customAnchor={customAnchor ?? undefined}
    >
      {#if selectedPane === 'domains'}
        <div class="skills-explorer-pane skills-explorer-pane--domains">
          <h4 class="title-medium">Skill Domains</h4>
          <div class="skills-container">
            <ul class="skill-domains skillset-controls">
              {#each categorySections as section (section.categoryId)}
                <li class="skill-domain__item">
                  <label
                    class={[
                      'skill-domain__toggle',
                      { 'skill-domain__toggle--selected': selectedDomain === section.categoryId }
                    ]}
                    onfocus={() => (selectedDomain = section.categoryId)}
                    onmouseenter={() => (selectedDomain = section.categoryId)}
                  >
                    <input
                      type="checkbox"
                      class={['skill-domain__checkbox', `skill-domain--${section.categoryId}`]}
                      style:accent-color={section.color}
                      checked={isSectionFullyIncluded(section)}
                      use:categoryCheckboxState={isSectionPartiallyIncluded(section)}
                      onchange={(event) => toggleCategoryInclusion(section, event.currentTarget.checked)}
                      onfocus={() => (selectedDomain = section.categoryId)}
                    />
                    <span class="skill-domain__label label-large">{section.categoryName}</span>
                  </label>
                </li>
              {/each}
            </ul>

            <div class="skill-domain__skills-container">
              {#each categorySections as section (section.categoryId)}
                <ul
                  class={cn(
                    'skill-domain__skills',
                    { 'skill-domain__skills--selected': selectedDomain === section.categoryId },
                    { 'cols-2': section.skills.length > 7 }
                  )}
                  style:background-color={`hsl(from ${section.color} h s l / 0.1)`}
                >
                  {#each section.skills as skill (skill.id)}
                    <li class="skill-domain__skill-item">
                      <label class="skill-domain__skill-toggle">
                        <input
                          type="checkbox"
                          class={['skill-domain__checkbox', `skill-domain--${skill.id}`]}
                          style:accent-color={section.color}
                          checked={includedSkillIds.has(skill.id)}
                          onchange={(event) => toggleSkillInclusion(skill.id, event.currentTarget.checked)}
                        />
                        <span class="skill-domain__skill-label label-large">{skill.name}</span>
                      </label>
                    </li>
                  {/each}
                </ul>
              {/each}
            </div>
          </div>
        </div>
      {/if}
      {#if selectedPane === 'skillStacks'}
        <div class="skills-explorer-pane skills-explorer-pane--stacks">
          <h4 class="title-medium" id="skills-chart-stacks-heading">Tech Stacks</h4>
          <fieldset class="fieldset__tech-stacks" aria-labelledby="skills-chart-stacks-heading">
            <legend class="tech-stacks__legend sr-only">Select one tech stack to show on the chart</legend>
            <ul class="tech-stacks skillset-controls">
              {#each stacksWithSkills as stack (stack.id)}
                <li class="tech-stack__item">
                  <label class="tech-stack__toggle">
                    <input
                      type="radio"
                      name="resume-skills-stack"
                      class="tech-stack__radio"
                      value={stack.id}
                      checked={selectedStackId === stack.id}
                      onchange={() => activateSkillStack(stack)}
                    />
                    <span class="tech-stack__label label-large">{stack.name}</span>
                  </label>
                </li>
              {/each}
            </ul>
          </fieldset>
        </div>
      {/if}
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style>
  label:hover {
    cursor: pointer;
  }

  :global(.popover__content.skills-explorer-popover) {
    width: var(--bits-floating-anchor-width);
  }

  .skills-container {
    display: flex;
    flex-wrap: nowrap;
    gap: 1rem;
  }

  .skill-domain__skills-container {
    flex: 1;
  }

  .skill-domains,
  .skill-domain__skills,
  .tech-stacks {
    list-style: none;
    margin: 0;
    padding: 0;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .skill-domain__skills {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0.5rem;
    opacity: 0;
    height: 0;
    padding: 0 0.5rem;
    border-radius: var(--radius-input);
    pointer-events: none;

    &.cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    &.skill-domain__skills--selected {
      opacity: 1;
      height: auto;
      padding: 0.5rem;
      pointer-events: auto;
    }
  }

  .skill-domain__item,
  .tech-stack__item {
    border-radius: var(--radius-input);
    transition: background-color 0.15s ease;

    &:hover,
    &:has(.skill-domain__toggle--selected) {
      background-color: var(--muted);
    }
  }

  .skill-domain__toggle,
  .tech-stack__toggle {
    padding: 0.25rem 0.5rem;
  }

  .fieldset__tech-stacks {
    margin: 0;
    padding: 0;
    border: none;
    min-inline-size: 0;
  }

  .tech-stacks__legend {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .tech-stacks {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 0 1rem;
  }

  @media (min-width: 540px) {
    .tech-stacks {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 800px) {
    .tech-stacks {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
</style>
