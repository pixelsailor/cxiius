<script lang="ts">
  import { Popover } from 'bits-ui';
  import cn from 'clsx';
  import type { ChartConfiguration } from 'chart.js';
  import { onDestroy, onMount } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import { browser } from '$app/environment';
  import {
    type SkillCategoryMeta,
    type SkillRecord,
    type SkillStackId,
    type SkillStackMeta
  } from '$lib/content/skills';
  import {
    buildSkillCategorySections,
    skillRecordsForStack,
    type SkillCategorySection
  } from '$lib/utils/skills-chart-data';
  import {
    buildCategoryProficiencyBarChart,
    ensureResumeSkillBarChartRegistered
  } from '$lib/utils/skills-chart-config';
  import { hydrateIncludedSkillIds, writeIncludedSkillIds } from '$lib/utils/skills-presentation';
  import type { ChartOptionsPane } from './types';

  type Props = {
    skillRecords: SkillRecord[];
    skillCategories: readonly SkillCategoryMeta[];
    skillStacks: readonly SkillStackMeta[];
    /** Notifies the parent when the chart has rendered at least once. */
    onChartReady?: (ready: boolean) => void;
    /** Two-way bound open state for the chart options popover (`Popover.Root bind:open`). */
    open?: boolean;
    /** The pane to display in the popover. */
    selectedPane?: ChartOptionsPane;
    /** External trigger element that anchors the popover panel (`Popover.Content customAnchor`). */
    customAnchor?: HTMLElement | null;
  };

  type ChartCtor = (typeof import('chart.js'))['Chart'];

  let {
    skillRecords,
    skillCategories,
    skillStacks,
    onChartReady,
    open = $bindable(false),
    selectedPane = 'domains',
    customAnchor = null
  }: Props = $props();

  let canvasEl: HTMLCanvasElement | undefined = undefined;
  let chartInstance: InstanceType<ChartCtor> | null = null;
  let clientHydrated = $state(false);
  let chartHasRendered = false;

  /** The skill ids that are currently included in the chart. */
  let includedSkillIds = new SvelteSet<string>();

  /** The domain category that is currently selected/displayed in the options popover. This does not affect the chart itself. */
  let selectedDomain = $state<string>('languages-markup');

  /** The tech stack highlighted in the stacks pane; selecting one replaces chart inclusion with that stack's skills. */
  let selectedStackId = $state<SkillStackId | null>(null);

  const categorySections = $derived(buildSkillCategorySections(skillRecords, skillCategories));
  const stacksWithSkills = $derived(
    skillStacks.filter((stack) => skillRecordsForStack(skillRecords, stack.id).length > 0)
  );
  const includedCount = $derived(skillRecords.filter((record) => includedSkillIds.has(record.id)).length);

  const describeCanvasAria = (): string =>
    `Vertical bar chart of ${includedCount} skills grouped by domain category; bar height shows proficiency tier`;

  const clearSelectedStack = (): void => {
    selectedStackId = null;
  };

  const toggleSkillInclusion = (skillId: string, checked: boolean): void => {
    clearSelectedStack();
    if (checked) {
      includedSkillIds.add(skillId);
    } else {
      includedSkillIds.delete(skillId);
    }
  };

  const countIncludedInSection = (section: SkillCategorySection): number =>
    section.skills.filter((skill) => includedSkillIds.has(skill.id)).length;

  const isSectionFullyIncluded = (section: SkillCategorySection): boolean =>
    section.skills.length > 0 && countIncludedInSection(section) === section.skills.length;

  const isSectionPartiallyIncluded = (section: SkillCategorySection): boolean => {
    const count = countIncludedInSection(section);
    return count > 0 && count < section.skills.length;
  };

  const toggleCategoryInclusion = (section: SkillCategorySection, checked: boolean): void => {
    clearSelectedStack();
    for (const skill of section.skills) {
      if (checked) {
        includedSkillIds.add(skill.id);
      } else {
        includedSkillIds.delete(skill.id);
      }
    }
  };

  /** Sets native `indeterminate` on category header checkboxes for partial selection. */
  const categoryCheckboxState = (node: HTMLInputElement, partial: boolean) => {
    node.indeterminate = partial;
    return {
      update(nextPartial: boolean) {
        node.indeterminate = nextPartial;
      }
    };
  };

  async function repaintChart(): Promise<void> {
    if (!browser || canvasEl === undefined) {
      return;
    }
    await ensureResumeSkillBarChartRegistered();
    const { Chart } = await import('chart.js');
    const chartCtor = Chart as ChartCtor;
    const blueprint = buildCategoryProficiencyBarChart({
      datasourceRecords: skillRecords,
      categories: skillCategories,
      includedSkillIds
    });
    const context = canvasEl.getContext('2d');
    if (context === null) {
      return;
    }

    if (chartInstance !== null) {
      chartInstance.data = blueprint.data;
      Object.assign(chartInstance.options, blueprint.options);
      chartInstance.update('none');
    } else {
      chartInstance = new chartCtor(context, blueprint as ChartConfiguration<'bar'>);
    }
    if (!chartHasRendered) {
      chartHasRendered = true;
      onChartReady?.(true);
    }
  }

  onMount(() => {
    if (!browser) {
      return undefined;
    }
    const hydrated = hydrateIncludedSkillIds(skillRecords);
    includedSkillIds.clear();
    for (const skillId of hydrated) {
      includedSkillIds.add(skillId);
    }
    clientHydrated = true;
    return () => {
      chartInstance?.destroy();
      chartInstance = null;
    };
  });

  onDestroy(() => {
    chartInstance?.destroy();
    chartInstance = null;
  });

  $effect(() => {
    if (!browser || !clientHydrated) {
      return;
    }
    writeIncludedSkillIds(skillRecords, includedSkillIds);
    void repaintChart();
  });

  const activateSkillStack = (stack: SkillStackMeta): void => {
    selectedStackId = stack.id;
    includedSkillIds.clear();
    for (const skill of skillRecordsForStack(skillRecords, stack.id)) {
      includedSkillIds.add(skill.id);
    }
  };
</script>

<!--
@component
Full-width resume skills bar chart with per-skill inclusion toggles grouped by domain category.

Example:
```svelte
<ResumeSkillsExplorer skillRecords={data.skillRecords} skillCategories={data.skillCategories} />
```
-->

<div class="resume-skills-chart">
  <Popover.Root bind:open>
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
                      class={['skill-domain__toggle', { 'skill-domain__toggle--selected': selectedDomain === section.categoryId }]}
                      onfocus={() => selectedDomain = section.categoryId}
                      onmouseenter={() => selectedDomain = section.categoryId}
                    >
                      <input
                        type="checkbox"
                        class={['skill-domain__checkbox', `skill-domain--${section.categoryId}`]}
                        style:accent-color={section.color}
                        checked={isSectionFullyIncluded(section)}
                        use:categoryCheckboxState={isSectionPartiallyIncluded(section)}
                        onchange={(event) => toggleCategoryInclusion(section, event.currentTarget.checked)}
                        onfocus={() => selectedDomain = section.categoryId}
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

  <div class="resume-skills-chart__canvas-wrap">
    <div class="resume-skills-chart__frame" role="img" aria-label={describeCanvasAria()}>
      <canvas bind:this={canvasEl}></canvas>
    </div>
  </div>
</div>

<style>
  label:hover {
    cursor: pointer;
  }

  .popover__content.skills-explorer-popover {
    width: 960px;
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

  .resume-skills-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    inline-size: 100%;
  }

  .resume-skills-chart__intro {
    max-inline-size: 70ch;
    margin: 0;
    color: color-mix(in srgb, var(--foreground) 88%, transparent);
  }

  .resume-skills-chart__legend {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .resume-skills-chart__legend-item {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
  }

  .resume-skills-chart__swatch {
    inline-size: 0.85rem;
    block-size: 0.85rem;
    border-radius: 0.15rem;
    flex-shrink: 0;
  }

  .resume-skills-chart__canvas-wrap {
    position: relative;
    inline-size: 100%;
    block-size: clamp(280px, 42vh, 440px);
    max-block-size: 440px;
    overflow: hidden;
    border: 1px solid color-mix(in srgb, var(--foreground-alt) 18%, transparent);
    border-radius: var(--radius-input);
    background-color: color-mix(in srgb, var(--background-alt) 65%, transparent);
    padding: 0.75rem;
    box-sizing: border-box;
  }

  .resume-skills-chart__frame {
    position: absolute;
    inset: 0.75rem;
  }

  canvas {
    display: block;
    max-inline-size: 100%;
  }

  .resume-skills-chart__toggles {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .resume-skills-chart__toggle-group {
    border: 1px solid color-mix(in srgb, var(--foreground-alt) 16%, transparent);
    border-radius: var(--radius-input);
    padding: 0.75rem;
  }

  .resume-skills-chart__toggle-group-title {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    margin: 0 0 0.65rem;
    font-size: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .resume-skills-chart__toggle-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
    gap: 0.35rem 0.75rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .resume-skills-chart__toggle {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.45rem;
    border-radius: 0.35rem;
    cursor: pointer;
    font-size: 0.92rem;
    transition: opacity 0.15s ease;
  }

  .resume-skills-chart__toggle--off {
    opacity: 0.55;
  }

  .resume-skills-chart__toggle-name {
    font-weight: 500;
  }
</style>
