/**
 * @fileoverview Sorts skill records for the resume category bar chart and maps domain colors.
 * @module lib/utils/skills-chart-data
 */

import {
	getProficiencyLevel,
	SKILL_CATEGORIES,
	type SkillCategoryId,
	type SkillCategoryMeta,
	type SkillRecord
} from '$lib/content/skills';

/** Canvas-safe hex fills keyed by category (Chart.js cannot rely on CSS variables). */
export const SKILL_CATEGORY_CHART_COLORS: Record<SkillCategoryId, string> = {
	'languages-markup': '#2563eb',
	'frameworks-libraries': '#7c3aed',
	'ui-and-design': '#db2777',
	'testing-and-qa': '#0891b2',
	'backend-apis-data': '#059669',
	'tooling-cloud-delivery': '#ea580c',
	'ai-assisted-development': '#9333ea',
	'collaboration-process': '#0369a1'
};

/** One domain category block used by the chart and skill toggle panel. */
export type SkillCategorySection = {
	categoryId: SkillCategoryId;
	categoryName: string;
	color: string;
	skills: SkillRecord[];
};

/**
 * Returns the proficiency ordinal (0-4) used as bar height on the resume chart.
 * @param record - Flat skill row from content
 */
export const proficiencyBarValue = (record: SkillRecord): number =>
	getProficiencyLevel(record.proficiency).level;

/**
 * Returns the canvas fill color for a skill's domain category.
 * @param categoryId - Category id from the skill record
 */
export const categoryChartColor = (categoryId: SkillCategoryId): string =>
	SKILL_CATEGORY_CHART_COLORS[categoryId] ?? '#64748b';

/**
 * Sorts skills by category order (datasource metadata), then alphabetically within each category.
 * @param records - Full skill datasource
 * @param categories - Category metadata defining display order
 */
export const sortSkillsByCategoryThenName = (
	records: SkillRecord[],
	categories: readonly SkillCategoryMeta[]
): SkillRecord[] => {
	const order = new Map(categories.map((category, index) => [category.id, index]));
	return [...records].sort((left, right) => {
		const categoryDiff = (order.get(left.categoryId) ?? 99) - (order.get(right.categoryId) ?? 99);
		if (categoryDiff !== 0) {
		 return categoryDiff;
		}
		return left.name.localeCompare(right.name, 'en', { sensitivity: 'base' });
	});
};

/**
 * Filters to included skill ids, then sorts by category and name.
 * @param records - Full skill datasource
 * @param categories - Category metadata defining display order
 * @param includedIds - Skill ids currently shown on the chart
 */
export const chartSkillsFromSelection = (
	records: SkillRecord[],
	categories: readonly SkillCategoryMeta[],
	includedIds: ReadonlySet<string>
): SkillRecord[] =>
	sortSkillsByCategoryThenName(
		records.filter((record) => includedIds.has(record.id)),
		categories
	);

/**
 * Builds category sections for the toggle panel (always lists every skill in the datasource).
 * @param records - Full skill datasource
 * @param categories - Category metadata defining section order
 */
export const buildSkillCategorySections = (
	records: SkillRecord[],
	categories: readonly SkillCategoryMeta[] = SKILL_CATEGORIES
): SkillCategorySection[] =>
	categories
		.map((category) => ({
			categoryId: category.id,
			categoryName: category.name,
			color: categoryChartColor(category.id),
			skills: sortSkillsByCategoryThenName(
				records.filter((record) => record.categoryId === category.id),
				categories
			)
		}))
		.filter((section) => section.skills.length > 0);
