<script lang="ts">
  import { browser } from '$app/environment';
  import { onDestroy, onMount } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';
  import type { SkillCategoryMeta, SkillRecord } from '$lib/content/skills';
  import { buildSkillCategorySections, type SkillCategorySection } from '$lib/utils/skills-chart-data';
  import {
    buildCategoryProficiencyBarChart,
    ensureResumeSkillBarChartRegistered
  } from '$lib/utils/skills-chart-config';
  import { hydrateIncludedSkillIds, writeIncludedSkillIds } from '$lib/utils/skills-presentation';
  import type { ChartConfiguration } from 'chart.js';

  type Props = {
    skillRecords: SkillRecord[];
    skillCategories: readonly SkillCategoryMeta[];
    /** Notifies the parent when the chart has rendered at least once. */
    onChartReady?: (ready: boolean) => void;
  };

  type ChartCtor = (typeof import('chart.js'))['Chart'];

  let { skillRecords, skillCategories, onChartReady }: Props = $props();

  let canvasEl: HTMLCanvasElement | undefined = undefined;
  let chartInstance: InstanceType<ChartCtor> | null = null;
  let clientHydrated = $state(false);
  let chartHasRendered = false;
  let includedSkillIds = new SvelteSet<string>();

  const categorySections = $derived(buildSkillCategorySections(skillRecords, skillCategories));
  const includedCount = $derived(skillRecords.filter((record) => includedSkillIds.has(record.id)).length);

  const describeCanvasAria = (): string =>
    `Vertical bar chart of ${includedCount} skills grouped by domain category; bar height shows proficiency tier`;

  const toggleSkillInclusion = (skillId: string, checked: boolean): void => {
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
  <p class="resume-skills-chart__intro body-medium">
    Each bar is one skill, colored by domain category. Bar height reflects proficiency tier. Toggle a whole category or
    individual skills below to change what appears on the chart.
  </p>

  <ul class="resume-skills-chart__legend" aria-label="Domain category colors">
    {#each categorySections as section (section.categoryId)}
      <li class="resume-skills-chart__legend-item">
        <span class="resume-skills-chart__swatch" style:background-color={section.color} aria-hidden="true"></span>
        <span>{section.categoryName}</span>
      </li>
    {/each}
  </ul>

  <div class="resume-skills-chart__canvas-wrap">
    <div class="resume-skills-chart__frame" role="img" aria-label={describeCanvasAria()}>
      <canvas bind:this={canvasEl}></canvas>
    </div>
  </div>

  <div class="resume-skills-chart__toggles" aria-labelledby="skills-toggle-heading">
    <h4 class="title-medium" id="skills-toggle-heading">Include skills on chart</h4>
    {#each categorySections as section (section.categoryId)}
      <section class="resume-skills-chart__toggle-group" aria-labelledby="toggle-{section.categoryId}">
        <label class="resume-skills-chart__toggle-group-title" id="toggle-{section.categoryId}">
          <input
            type="checkbox"
            checked={isSectionFullyIncluded(section)}
            use:categoryCheckboxState={isSectionPartiallyIncluded(section)}
            onchange={(event) => toggleCategoryInclusion(section, event.currentTarget.checked)}
          />
          <span class="resume-skills-chart__swatch" style:background-color={section.color} aria-hidden="true"></span>
          <span>{section.categoryName}</span>
        </label>
        <ul class="resume-skills-chart__toggle-list">
          {#each section.skills as skill (skill.id)}
            <li>
              <label
                class="resume-skills-chart__toggle"
                class:resume-skills-chart__toggle--off={!includedSkillIds.has(skill.id)}
              >
                <input
                  type="checkbox"
                  checked={includedSkillIds.has(skill.id)}
                  onchange={(event) => toggleSkillInclusion(skill.id, event.currentTarget.checked)}
                />
                <span class="resume-skills-chart__toggle-name">{skill.name}</span>
              </label>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</div>

<style>
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

  input[type='checkbox'] {
    margin: 0;
    accent-color: var(--blue-800, #2563eb);
  }
</style>
