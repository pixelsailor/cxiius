<script lang="ts">
  import type { ChartConfiguration } from 'chart.js';
  import { browser } from '$app/environment';
  import {
    buildResumeSkillsChartTypePreview,
    ensureResumeSkillsChartTypePreviewRegistered
  } from '$lib/utils/skills-chart-type-preview';
  import type { ResumeSkillsChartType } from './types';

  type ChartCtor = (typeof import('chart.js'))['Chart'];

  type Props = {
    /** Chart.js family rendered as a static thumbnail. */
    chartType: ResumeSkillsChartType;
  };

  let { chartType }: Props = $props();

  let canvasEl: HTMLCanvasElement | undefined = undefined;
  let chartInstance: InstanceType<ChartCtor> | null = null;

  $effect(() => {
    if (!browser || canvasEl === undefined) {
      return;
    }

    const canvas = canvasEl;
    let cancelled = false;

    void (async () => {
      await ensureResumeSkillsChartTypePreviewRegistered(chartType);
      if (cancelled || canvasEl !== canvas || !canvas.isConnected) {
        return;
      }

      const { Chart } = await import('chart.js');
      if (cancelled || canvasEl !== canvas || !canvas.isConnected) {
        return;
      }

      const chartCtor = Chart as ChartCtor;
      const blueprint = buildResumeSkillsChartTypePreview(chartType);
      const context = canvas.getContext('2d');
      if (context === null || cancelled) {
        return;
      }

      chartInstance?.destroy();
      chartInstance = new chartCtor(context, blueprint as ChartConfiguration);
    })();

    return () => {
      cancelled = true;
      chartInstance?.destroy();
      chartInstance = null;
    };
  });
</script>

<!--
@component
Static Chart.js thumbnail for one resume skills chart type in the options popover.

Example:
```svelte
<ResumeSkillsChartTypePreview chartType="bar" />
```
-->

<div class="chart-type-preview">
  <canvas bind:this={canvasEl} aria-hidden="true"></canvas>
</div>

<style>
  .chart-type-preview {
    display: block;
    inline-size: 100%;
    block-size: 5.5rem;
    min-block-size: 5.5rem;
    pointer-events: none;
  }

  canvas {
    display: block;
    inline-size: 100% !important;
    block-size: 100% !important;
    background-color: transparent;
  }
</style>
