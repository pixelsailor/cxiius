/** Chart.js visualization variants for the resume skills explorer. */
export const RESUME_SKILLS_CHART_TYPES = ['bar', 'polar', 'radar', 'bubble'] as const;

/** Active Chart.js family selected in the resume skills options popover. */
export type ResumeSkillsChartType = (typeof RESUME_SKILLS_CHART_TYPES)[number];

export type ChartOptionsPane = 'skillStacks' | 'domains' | 'chartType';
