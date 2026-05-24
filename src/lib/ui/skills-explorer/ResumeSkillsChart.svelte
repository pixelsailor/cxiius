<script lang="ts">
  import type { ChartConfiguration } from 'chart.js';
  import { onDestroy, onMount } from 'svelte';
  import type { SvelteSet } from 'svelte/reactivity';
  import { browser } from '$app/environment';
  import { type SkillCategoryMeta, type SkillRecord } from '$lib/content/skills';
  import {
    buildCategoryProficiencyBarChart,
    ensureResumeSkillBarChartRegistered
  } from '$lib/utils/skills-chart-config';

  type Props = {
    skillRecords: SkillRecord[];
    skillCategories: readonly SkillCategoryMeta[];
    /** Same Set reference as popover; chart reads membership, does not replace the Set. */
    includedSkillIds: SvelteSet<string>;
    /** When false, defers Chart.js paint until popover has hydrated inclusion from storage. */
    inclusionHydrated?: boolean;
    /** Notifies the parent when the chart has rendered at least once. */
    onChartReady?: (ready: boolean) => void;
  };

  type ChartCtor = (typeof import('chart.js'))['Chart'];

  let { skillRecords, skillCategories, includedSkillIds, inclusionHydrated = false, onChartReady }: Props = $props();

  let canvasEl: HTMLCanvasElement | undefined = undefined;
  let chartInstance: InstanceType<ChartCtor> | null = null;
  let chartHasRendered = false;

  const includedCount = $derived(skillRecords.filter((record) => includedSkillIds.has(record.id)).length);

  const describeCanvasAria = (): string =>
    `Vertical bar chart of ${includedCount} skills grouped by domain category; bar height shows proficiency tier`;

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
    if (!browser || !inclusionHydrated || canvasEl === undefined) {
      return;
    }
    void includedSkillIds.size;
    void repaintChart();
  });
</script>

<!--
@component
Resume skills bar chart canvas (Chart.js). Reads `includedSkillIds` from the page bridge (owned by `ResumeSkillsChartOptionsPopover`); does not own persistence or popover UI.

Example:
```svelte
<ResumeSkillsChart
  skillRecords={records}
  skillCategories={categories}
  {includedSkillIds}
  onChartReady={(ready) => { chartReady = ready; }}
/>
```
-->

<div class="resume-skills-chart__canvas-wrap">
  <div class="resume-skills-chart__frame" role="img" aria-label={describeCanvasAria()}>
    <canvas bind:this={canvasEl}></canvas>
  </div>
</div>

<style>
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
</style>
