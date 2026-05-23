/**
 * @fileoverview Registers Chart.js bar components and builds the resume category proficiency chart.
 * @module lib/utils/skills-chart-config
 */

import type { ChartConfiguration } from 'chart.js';
import { getProficiencyLevel, PROFICIENCY_ORDER, type SkillCategoryMeta, type SkillRecord } from '$lib/content/skills';
import {
	categoryChartColor,
	chartSkillsFromSelection,
	proficiencyBarValue
} from '$lib/utils/skills-chart-data';

let resumeBarChartRegistered = false;

/** Y-axis tick labels indexed by {@link ProficiencyLevel.level} (0 = none through 4 = fluent). */
const PROFICIENCY_AXIS_LABELS = PROFICIENCY_ORDER.map((tier) => getProficiencyLevel(tier).name);

const PROFICIENCY_CHART_MAX = PROFICIENCY_AXIS_LABELS.length - 1;

/** Ensures bar chart controllers and scales were registered exactly once in the browser. */
export async function ensureResumeSkillBarChartRegistered(): Promise<void> {
	if (resumeBarChartRegistered || typeof window === 'undefined') {
		return;
	}
	const { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Tooltip } = await import('chart.js');
	Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);
	resumeBarChartRegistered = true;
}

export type BuildCategoryProficiencyBarChartArgs = {
	datasourceRecords: SkillRecord[];
	categories: readonly SkillCategoryMeta[];
	includedSkillIds: ReadonlySet<string>;
};

/**
 * Maps included skills into a vertical bar chart grouped by domain category on the x-axis.
 * Bar height encodes proficiency tier (0-4); bar color encodes category.
 */
export function buildCategoryProficiencyBarChart(
	args: BuildCategoryProficiencyBarChartArgs
): ChartConfiguration<'bar'> {
	const rows = chartSkillsFromSelection(args.datasourceRecords, args.categories, args.includedSkillIds);

	const yScale = {
		beginAtZero: true,
		min: 0,
		max: PROFICIENCY_CHART_MAX,
		ticks: {
			stepSize: 1,
			callback(tickValue: string | number) {
				const numeric = typeof tickValue === 'number' ? tickValue : Number(tickValue);
				if (!Number.isFinite(numeric) || numeric < 0 || numeric > PROFICIENCY_CHART_MAX) {
					return '';
				}
				return PROFICIENCY_AXIS_LABELS[Math.round(numeric)] ?? '';
			}
		},
		title: {
			display: true,
			text: 'Proficiency'
		}
	} satisfies NonNullable<import('chart.js').ChartOptions<'bar'>['scales']>['y'];

	if (rows.length === 0) {
		return {
			type: 'bar',
			data: {
				labels: ['No skills selected'],
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
				scales: { y: yScale }
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
					callbacks: {
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
			scales: {
				y: yScale,
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
