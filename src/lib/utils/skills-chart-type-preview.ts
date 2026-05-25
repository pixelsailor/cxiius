/**
 * @fileoverview Static Chart.js configurations for chart-type picker previews in the skills explorer.
 * @module lib/utils/skills-chart-type-preview
 */

import type { ChartConfiguration, ChartOptions } from 'chart.js';
import type { ResumeSkillsChartType } from '$lib/ui/skills-explorer/types';
import { ensureResumeSkillChartRegistered } from '$lib/utils/skills-chart-config';

const PREVIEW_BLUE = 'hsl(217, 91%, 60%)';
const PREVIEW_GREEN = 'hsl(160, 78%, 31%)';
const PREVIEW_SEGMENT_COLORS = [
  'hsl(348, 83%, 47%)',
  'hsl(34, 91%, 52%)',
  'hsl(160, 78%, 31%)',
  'hsl(217, 91%, 60%)',
  'hsl(282, 86%, 52%)',
  'hsl(171, 100%, 41%)'
];

/** Disables pointer/tooltip interaction and animation for decorative thumbnails. */
const previewInteractionOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  events: [],
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  }
} satisfies Pick<ChartOptions, 'responsive' | 'maintainAspectRatio' | 'animation' | 'events' | 'plugins'>;

/**
 * Returns a non-interactive Chart.js config illustrating the given resume skills chart family.
 * @param chartType - Visualization variant shown in the picker
 */
export function buildResumeSkillsChartTypePreview(chartType: ResumeSkillsChartType): ChartConfiguration {
  switch (chartType) {
    case 'bar':
      return buildBarPreview();
    case 'polar':
      return buildPolarPreview();
    case 'radar':
      return buildRadarPreview();
    case 'bubble':
      return buildBubblePreview();
    default:
      return buildBarPreview();
  }
}

/**
 * Registers Chart.js controllers required for a chart-type preview thumbnail.
 * @param chartType - Visualization variant to prepare
 */
export async function ensureResumeSkillsChartTypePreviewRegistered(chartType: ResumeSkillsChartType): Promise<void> {
  await ensureResumeSkillChartRegistered(chartType);
}

function buildBarPreview(): ChartConfiguration<'bar'> {
  const labels = Array.from({ length: 15 }, () => '');
  const baseHeights = [2, 3, 1, 4, 2, 3, 2, 4, 1, 3, 2, 4, 3, 2, 3];
  const topHeights = [1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1];

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Base',
          data: baseHeights,
          backgroundColor: PREVIEW_BLUE,
          borderWidth: 0,
          borderRadius: 2,
          stack: 'stack'
        },
        {
          label: 'Top',
          data: topHeights,
          backgroundColor: PREVIEW_GREEN,
          borderWidth: 0,
          borderRadius: 2,
          stack: 'stack'
        }
      ]
    },
    options: {
      ...previewInteractionOptions,
      scales: {
        x: {
          display: false,
          stacked: true,
          grid: { display: false }
        },
        y: {
          display: false,
          stacked: true,
          grid: { display: false },
          beginAtZero: true
        }
      }
    }
  };
}

function buildPolarPreview(): ChartConfiguration<'polarArea'> {
  const labels = ['a', 'b', 'c', 'd', 'e', 'f'];
  const values = [3, 4, 2.5, 3.5, 2, 4.5];

  return {
    type: 'polarArea',
    data: {
      labels,
      datasets: [
        {
          label: 'Proficiency',
          data: values,
          backgroundColor: PREVIEW_SEGMENT_COLORS,
          borderColor: PREVIEW_SEGMENT_COLORS,
          borderWidth: 1
        }
      ]
    },
    options: {
      ...previewInteractionOptions,
      scales: {
        r: {
          display: false,
          grid: { display: false },
          ticks: { display: false }
        }
      }
    }
  };
}

function buildRadarPreview(): ChartConfiguration<'radar'> {
  const labels = ['a', 'b', 'c', 'd', 'e', 'f'];
  const seriesA = [3, 4, 2.5, 3.5, 2, 4];
  const seriesB = [2, 3, 3.5, 2.5, 3.5, 2.5];

  return {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: 'Series A',
          data: seriesA,
          backgroundColor: 'color-mix(in srgb, hsl(217, 91%, 60%) 20%, transparent)',
          borderColor: PREVIEW_BLUE,
          borderWidth: 2,
          pointRadius: 0,
          fill: true
        },
        {
          label: 'Series B',
          data: seriesB,
          backgroundColor: 'color-mix(in srgb, hsl(160, 78%, 31%) 20%, transparent)',
          borderColor: PREVIEW_GREEN,
          borderWidth: 2,
          pointRadius: 0,
          fill: true
        }
      ]
    },
    options: {
      ...previewInteractionOptions,
      scales: {
        r: {
          display: false,
          grid: { display: false },
          ticks: { display: false },
          angleLines: { display: true, color: 'rgba(100, 116, 139, 0.2)' }
        }
      }
    }
  };
}

function buildBubblePreview(): ChartConfiguration<'bubble'> {
  const bubblePoints: { x: number; y: number; r: number }[] = [
    { x: 0, y: 2, r: 10 },
    { x: 1, y: 3, r: 16 },
    { x: 2, y: 1.5, r: 8 },
    { x: 3, y: 3.5, r: 20 },
    { x: 4, y: 2.5, r: 12 },
    { x: 5, y: 1, r: 7 },
    { x: 6, y: 3, r: 14 },
    { x: 7, y: 2, r: 11 },
    { x: 8, y: 4, r: 18 },
    { x: 9, y: 2.5, r: 9 }
  ];
  const colors = [
    PREVIEW_SEGMENT_COLORS[0],
    PREVIEW_SEGMENT_COLORS[1],
    PREVIEW_SEGMENT_COLORS[2],
    PREVIEW_SEGMENT_COLORS[3],
    PREVIEW_SEGMENT_COLORS[4],
    PREVIEW_SEGMENT_COLORS[0],
    PREVIEW_SEGMENT_COLORS[2],
    PREVIEW_SEGMENT_COLORS[3],
    PREVIEW_SEGMENT_COLORS[1],
    PREVIEW_SEGMENT_COLORS[4]
  ];

  return {
    type: 'bubble',
    data: {
      datasets: [
        {
          label: 'Skills',
          data: bubblePoints,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }
      ]
    },
    options: {
      ...previewInteractionOptions,
      layout: {
        padding: { top: 4, right: 4, bottom: 4, left: 4 }
      },
      scales: {
        x: { display: false, grid: { display: false } },
        y: { display: false, grid: { display: false }, beginAtZero: true }
      }
    }
  };
}
