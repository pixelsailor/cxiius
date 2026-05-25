/**
 * @fileoverview Registers Chart.js controllers per resume skills chart type and builds chart configurations.
 * @module lib/utils/skills-chart-config
 */

import type { ChartConfiguration, ChartOptions, TooltipItem } from 'chart.js';
import { getProficiencyLevel, PROFICIENCY_ORDER, type SkillCategoryMeta, type SkillRecord } from '$lib/content/skills';
import type { ResumeSkillsChartType } from '$lib/ui/skills-explorer/types';
import { categoryChartColor, chartSkillsFromSelection, proficiencyBarValue } from '$lib/utils/skills-chart-data';

let resumeBarChartRegistered = false;
let resumePolarChartRegistered = false;
let resumeRadarChartRegistered = false;
let resumeBubbleChartRegistered = false;

/** Bubble radius (px) from years of experience for readable point sizing. */
const bubbleRadiusFromYears = (years: number): number => Math.max(8, Math.min(36, years * 2));

/** Max bubble `r` (px); layout padding must exceed this so edges are not clipped. */
const BUBBLE_MAX_RADIUS_PX = 36;

/** Y-axis tick labels indexed by {@link ProficiencyLevel.level} (0 = none through 4 = fluent). */
const PROFICIENCY_AXIS_LABELS = PROFICIENCY_ORDER.map((tier) => getProficiencyLevel(tier).name);

const PROFICIENCY_CHART_MAX = PROFICIENCY_AXIS_LABELS.length - 1;

const EMPTY_PLACEHOLDER_LABEL = 'No skills selected';

const proficiencyTickCallback = (tickValue: string | number): string => {
  const numeric = typeof tickValue === 'number' ? tickValue : Number(tickValue);
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > PROFICIENCY_CHART_MAX) {
    return '';
  }
  return PROFICIENCY_AXIS_LABELS[Math.round(numeric)] ?? '';
};

const bubbleChartLayout = {
  padding: {
    top: BUBBLE_MAX_RADIUS_PX + 4,
    right: BUBBLE_MAX_RADIUS_PX + 4,
    bottom: 16,
    left: 12
  }
} satisfies NonNullable<ChartOptions<'bubble'>['layout']>;

/** Scales with grace so bubble centers at max y keep full pixel radius inside the chart area. */
const bubbleChartScales = {
  x: {
    type: 'category',
    ticks: {
      autoSkip: false,
      maxRotation: 90,
      minRotation: 45
    },
    title: {
      display: true,
      text: 'Skills grouped by domain category (A-Z within each group)'
    }
  },
  y: {
    beginAtZero: true,
    min: 0,
    max: PROFICIENCY_CHART_MAX,
    grace: 1,
    ticks: {
      stepSize: 1,
      callback: proficiencyTickCallback
    },
    title: {
      display: true,
      text: 'Proficiency'
    }
  }
} satisfies NonNullable<ChartOptions<'bubble'>['scales']>;

const barYScale = {
  beginAtZero: true,
  min: 0,
  max: PROFICIENCY_CHART_MAX,
  ticks: {
    stepSize: 1,
    callback: proficiencyTickCallback
  },
  title: {
    display: true,
    text: 'Proficiency'
  }
} satisfies NonNullable<ChartOptions<'bar'>['scales']>['y'];

const radialProficiencyScale = {
  min: 0,
  max: PROFICIENCY_CHART_MAX,
  ticks: {
    stepSize: 1,
    callback: proficiencyTickCallback,
    /** Draw proficiency ring labels above polar/radar segments (Chart.js default z is 0). */
    z: 1
  },
  pointLabels: {
    display: true,
    centerPointLabels: true
  }
} satisfies NonNullable<ChartOptions<'polarArea'>['scales']>['r'];

/**
 * Builds a tooltip label showing proficiency tier and years for a skill row.
 * @param rows - Chart datasource rows aligned with dataset indices
 */
const proficiencyTooltipLabel = (rows: SkillRecord[]) => ({
  label(context: TooltipItem<'bar' | 'polarArea' | 'radar'>) {
    const index = context.dataIndex;
    const skill = rows[index];
    if (skill === undefined) {
      return '';
    }
    const tier = getProficiencyLevel(skill.proficiency);
    return `${tier.name} (${skill.yearsOfExperience} yrs)`;
  }
});

export type BuildResumeSkillsChartArgs = {
  datasourceRecords: SkillRecord[];
  categories: readonly SkillCategoryMeta[];
  includedSkillIds: ReadonlySet<string>;
};

/** @deprecated Use {@link BuildResumeSkillsChartArgs} */
export type BuildCategoryProficiencyBarChartArgs = BuildResumeSkillsChartArgs;

/**
 * Registers Chart.js components for the given resume skills chart family exactly once.
 * @param chartType - Visualization variant to prepare
 */
export async function ensureResumeSkillChartRegistered(chartType: ResumeSkillsChartType): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }
  const { Chart } = await import('chart.js');

  if (chartType === 'bar' && !resumeBarChartRegistered) {
    const { BarController, BarElement, CategoryScale, Legend, LinearScale, Tooltip } = await import('chart.js');
    Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);
    resumeBarChartRegistered = true;
    return;
  }

  if (chartType === 'polar' && !resumePolarChartRegistered) {
    const { ArcElement, Legend, PolarAreaController, RadialLinearScale, Tooltip } = await import('chart.js');
    Chart.register(PolarAreaController, ArcElement, RadialLinearScale, Legend, Tooltip);
    resumePolarChartRegistered = true;
    return;
  }

  if (chartType === 'radar' && !resumeRadarChartRegistered) {
    const { Filler, Legend, LineElement, PointElement, RadarController, RadialLinearScale, Tooltip } =
      await import('chart.js');
    Chart.register(RadarController, PointElement, LineElement, Filler, RadialLinearScale, Legend, Tooltip);
    resumeRadarChartRegistered = true;
    return;
  }

  if (chartType === 'bubble' && !resumeBubbleChartRegistered) {
    const { BubbleController, CategoryScale, Legend, LinearScale, PointElement, Tooltip } =
      await import('chart.js');
    Chart.register(BubbleController, PointElement, CategoryScale, LinearScale, Legend, Tooltip);
    resumeBubbleChartRegistered = true;
  }
}

/** Ensures bar chart controllers and scales were registered exactly once in the browser. */
export async function ensureResumeSkillBarChartRegistered(): Promise<void> {
  await ensureResumeSkillChartRegistered('bar');
}

/**
 * Returns the Chart.js configuration for the active resume skills visualization type.
 * @param chartType - Selected chart family
 * @param args - Datasource, categories, and inclusion set
 */
export function buildResumeSkillsChart(
  chartType: ResumeSkillsChartType,
  args: BuildResumeSkillsChartArgs
): ChartConfiguration {
  switch (chartType) {
    case 'bar':
      return buildCategoryProficiencyBarChart(args);
    case 'polar':
      return buildCategoryProficiencyPolarChart(args);
    case 'radar':
      return buildCategoryProficiencyRadarChart(args);
    case 'bubble':
      return buildCategoryProficiencyBubbleChart(args);
    default:
      return buildCategoryProficiencyBarChart(args);
  }
}

/**
 * Maps included skills into a vertical bar chart grouped by domain category on the x-axis.
 * Bar height encodes proficiency tier (0-4); bar color encodes category.
 */
export function buildCategoryProficiencyBarChart(args: BuildResumeSkillsChartArgs): ChartConfiguration<'bar'> {
  const rows = chartSkillsFromSelection(args.datasourceRecords, args.categories, args.includedSkillIds);

  if (rows.length === 0) {
    return {
      type: 'bar',
      data: {
        labels: [EMPTY_PLACEHOLDER_LABEL],
        datasets: [
          {
            label: 'Proficiency',
            data: [0],
            backgroundColor: '#94a3b8',
            borderColor: '#64748b',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: barYScale }
      }
    };
  }

  return {
    type: 'bar',
    data: {
      labels: rows.map((row) => row.name),
      datasets: [
        {
          label: 'Proficiency level',
          data: rows.map((row) => proficiencyBarValue(row)),
          backgroundColor: rows.map((row) => categoryChartColor(row.categoryId)),
          borderColor: rows.map((row) => categoryChartColor(row.categoryId)),
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: proficiencyTooltipLabel(rows)
        }
      },
      scales: {
        y: barYScale,
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 45
          },
          title: {
            display: true,
            text: 'Skills grouped by domain category (A-Z within each group)'
          }
        }
      }
    }
  };
}

/**
 * Maps included skills into a polar area chart; segment radius encodes proficiency tier.
 */
export function buildCategoryProficiencyPolarChart(args: BuildResumeSkillsChartArgs): ChartConfiguration<'polarArea'> {
  const rows = chartSkillsFromSelection(args.datasourceRecords, args.categories, args.includedSkillIds);

  if (rows.length === 0) {
    return {
      type: 'polarArea',
      data: {
        labels: [EMPTY_PLACEHOLDER_LABEL],
        datasets: [
          {
            label: 'Proficiency level',
            data: [0],
            backgroundColor: ['#94a3b8'],
            borderColor: ['#64748b'],
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: radialProficiencyScale }
      }
    };
  }

  return {
    type: 'polarArea',
    data: {
      labels: rows.map((row) => row.name),
      datasets: [
        {
          label: 'Proficiency level',
          data: rows.map((row) => proficiencyBarValue(row)),
          backgroundColor: rows.map((row) => categoryChartColor(row.categoryId)),
          borderColor: rows.map((row) => categoryChartColor(row.categoryId)),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: proficiencyTooltipLabel(rows)
        }
      },
      scales: { r: radialProficiencyScale }
    }
  };
}

/**
 * Maps included skills into a filled radar chart; spoke length encodes proficiency tier.
 */
export function buildCategoryProficiencyRadarChart(args: BuildResumeSkillsChartArgs): ChartConfiguration<'radar'> {
  const rows = chartSkillsFromSelection(args.datasourceRecords, args.categories, args.includedSkillIds);

  if (rows.length === 0) {
    return {
      type: 'radar',
      data: {
        labels: [EMPTY_PLACEHOLDER_LABEL],
        datasets: [
          {
            label: 'Proficiency level',
            data: [0],
            backgroundColor: 'color-mix(in srgb, #94a3b8 25%, transparent)',
            borderColor: '#64748b',
            borderWidth: 1,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { r: radialProficiencyScale }
      }
    };
  }

  return {
    type: 'radar',
    data: {
      labels: rows.map((row) => row.name),
      datasets: [
        {
          label: 'Proficiency level',
          data: rows.map((row) => proficiencyBarValue(row)),
          backgroundColor: rows.map(
            (row) => `color-mix(in srgb, ${categoryChartColor(row.categoryId)} 25%, transparent)`
          ),
          borderColor: rows.map((row) => categoryChartColor(row.categoryId)),
          borderWidth: 1,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: proficiencyTooltipLabel(rows)
        }
      },
      scales: { r: radialProficiencyScale }
    }
  };
}

/**
 * Maps included skills into a bubble chart: x = skill (category), y = proficiency, r = years-scaled radius.
 */
export function buildCategoryProficiencyBubbleChart(args: BuildResumeSkillsChartArgs): ChartConfiguration<'bubble'> {
  const rows = chartSkillsFromSelection(args.datasourceRecords, args.categories, args.includedSkillIds);

  if (rows.length === 0) {
    return {
      type: 'bubble',
      data: {
        labels: [EMPTY_PLACEHOLDER_LABEL],
        datasets: [
          {
            label: 'Proficiency level',
            clip: false,
            data: [{ x: 0, y: 0, r: 8 }],
            backgroundColor: '#94a3b8',
            borderColor: '#64748b',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: bubbleChartLayout,
        plugins: { legend: { display: false } },
        scales: bubbleChartScales
      }
    };
  }

  return {
    type: 'bubble',
    data: {
      labels: rows.map((row) => row.name),
      datasets: [
        {
          label: 'Proficiency level',
          clip: false,
          data: rows.map((row, index) => ({
            x: index,
            y: proficiencyBarValue(row),
            r: bubbleRadiusFromYears(row.yearsOfExperience)
          })),
          backgroundColor: rows.map((row) => categoryChartColor(row.categoryId)),
          borderColor: rows.map((row) => categoryChartColor(row.categoryId)),
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: bubbleChartLayout,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title(tooltipItems) {
              const index = tooltipItems[0]?.dataIndex;
              if (index === undefined) {
                return '';
              }
              return rows[index]?.name ?? '';
            },
            label(context) {
              const index = context.dataIndex;
              const skill = rows[index];
              if (skill === undefined) {
                return '';
              }
              const tier = getProficiencyLevel(skill.proficiency);
              return `${tier.name} (${skill.yearsOfExperience} yrs)`;
            }
          }
        }
      },
      scales: bubbleChartScales
    }
  };
}
