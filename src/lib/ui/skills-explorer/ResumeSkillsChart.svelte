<script lang="ts">
  import type { ChartConfiguration } from 'chart.js';
  import { onDestroy, onMount } from 'svelte';
  import type { SvelteSet } from 'svelte/reactivity';
  import { browser } from '$app/environment';
  import { type SkillCategoryMeta, type SkillRecord, type SkillStackMeta } from '$lib/content/skills';
  import { buildResumeSkillsChart, ensureResumeSkillChartRegistered } from '$lib/utils/skills-chart-config';
  import type { ResumeSkillsChartType } from './types';

  type Props = {
    skillRecords: SkillRecord[];
    skillCategories: readonly SkillCategoryMeta[];
    skillStacks: readonly SkillStackMeta[];
    /** Same Set reference as popover; chart reads membership, does not replace the Set. */
    includedSkillIds: SvelteSet<string>;
    /** When false, defers Chart.js paint until popover has hydrated inclusion from storage. */
    inclusionHydrated?: boolean;
    /** When false, defers Chart.js paint until popover has hydrated chart type from storage. */
    chartTypeHydrated?: boolean;
    /** Chart.js visualization family to render. */
    chartType?: ResumeSkillsChartType;
    /** Notifies the parent when the chart has rendered at least once. */
    onChartReady?: (ready: boolean) => void;
  };

  type ChartCtor = (typeof import('chart.js'))['Chart'];

  let {
    skillRecords,
    skillCategories,
    skillStacks,
    includedSkillIds,
    inclusionHydrated = false,
    chartTypeHydrated = false,
    chartType = 'bar',
    onChartReady
  }: Props = $props();

  let canvasEl: HTMLCanvasElement | undefined = undefined;
  let chartInstance: InstanceType<ChartCtor> | null = null;
  let chartHasRendered = false;
  let lastChartType: ResumeSkillsChartType | null = null;

  const includedCount = $derived(skillRecords.filter((record) => includedSkillIds.has(record.id)).length);

  const chartTypeAriaLabels: Record<ResumeSkillsChartType, string> = {
    bar: 'Vertical bar chart',
    polar: 'Polar area chart',
    radar: 'Radar chart',
    bubble: 'Bubble chart'
  };

  const describeCanvasAria = (): string => {
    const typeLabel = chartTypeAriaLabels[chartType];
    const scaleHint =
      chartType === 'bubble'
        ? 'skills on horizontal axis, proficiency tier on vertical axis, bubble size encodes years of experience'
        : chartType === 'bar'
          ? 'bar height shows proficiency tier'
          : chartType === 'radar'
            ? 'proficiency tier on radial scale, one polygon per tech stack'
            : 'proficiency tier encoded on radial scale';
    return `${typeLabel} of ${includedCount} skills; ${scaleHint}`;
  };

  async function repaintChart(): Promise<void> {
    if (!browser || canvasEl === undefined) {
      return;
    }

    const typeChanged = lastChartType !== null && chartType !== lastChartType;
    if (chartInstance !== null && typeChanged) {
      chartInstance.destroy();
      chartInstance = null;
    }

    await ensureResumeSkillChartRegistered(chartType);
    const { Chart } = await import('chart.js');
    const chartCtor = Chart as ChartCtor;
    const blueprint = buildResumeSkillsChart(chartType, {
      datasourceRecords: skillRecords,
      categories: skillCategories,
      stacks: skillStacks,
      includedSkillIds
    });
    const context = canvasEl.getContext('2d');
    if (context === null) {
      return;
    }

    if (chartInstance === null) {
      chartInstance = new chartCtor(context, blueprint as ChartConfiguration);
      lastChartType = chartType;
    } else {
      chartInstance.data = blueprint.data;
      Object.assign(chartInstance.options, blueprint.options);
      chartInstance.update('none');
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
      lastChartType = null;
    };
  });

  onDestroy(() => {
    chartInstance?.destroy();
    chartInstance = null;
    lastChartType = null;
  });

  $effect(() => {
    if (!browser || !inclusionHydrated || !chartTypeHydrated || canvasEl === undefined) {
      return;
    }
    void chartType;
    void includedSkillIds.size;
    void repaintChart();
  });
</script>

<!--
@component
Resume skills chart canvas (Chart.js). Reads `includedSkillIds` and `chartType` from the page bridge; does not own persistence or popover UI.

Example:
```svelte
<ResumeSkillsChart
  skillRecords={records}
  skillCategories={categories}
  skillStacks={stacks}
  {includedSkillIds}
  chartType="bar"
  {chartTypeHydrated}
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
