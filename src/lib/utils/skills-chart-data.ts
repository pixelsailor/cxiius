/**
 * @fileoverview Sorts skill records for the resume category bar chart and maps domain colors.
 * @module lib/utils/skills-chart-data
 */

import {
  getProficiencyLevel,
  SKILL_CATEGORIES,
  type SkillCategoryId,
  type SkillCategoryMeta,
  type SkillRecord,
  type SkillStackId
} from '$lib/content/skills';

/** Canvas-safe hex fills keyed by category (Chart.js cannot rely on CSS variables). */
export const SKILL_CATEGORY_CHART_COLORS: Record<SkillCategoryId, string> = {
  'languages-markup': 'hsl(217, 91%, 60%)',
  'frameworks-libraries': 'hsl(280, 53%, 40%)',
  'ui-and-design': 'hsl(348, 83%, 47%)',
  'testing-and-qa': 'hsl(171, 100%, 41%)',
  'backend-apis-data': 'hsl(160, 78%, 31%)',
  'tooling-cloud-delivery': 'hsl(34, 91%, 52%)',
  'ai-assisted-development': 'hsl(282, 86%, 52%)',
  'collaboration-process': 'hsl(198, 98%, 31%)'
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
export const proficiencyBarValue = (record: SkillRecord): number => getProficiencyLevel(record.proficiency).level;

/**
 * Returns the canvas fill color for a skill's domain category.
 * @param categoryId - Category id from the skill record
 */
export const categoryChartColor = (categoryId: SkillCategoryId): string =>
  SKILL_CATEGORY_CHART_COLORS[categoryId] ?? '#64748b';

/** Canvas-safe fills keyed by tech stack (Chart.js cannot rely on CSS variables). */
export const SKILL_STACK_CHART_COLORS: Record<SkillStackId, string> = {
  'web-fundamentals': 'hsl(217, 91%, 60%)',
  angular: 'hsl(280, 53%, 40%)',
  react: 'hsl(199, 89%, 48%)',
  svelte: 'hsl(12, 93%, 55%)',
  serverless: 'hsl(160, 78%, 31%)',
  jamstack: 'hsl(34, 91%, 52%)',
  mern: 'hsl(142, 71%, 45%)',
  mean: 'hsl(48, 96%, 53%)',
  pern: 'hsl(262, 83%, 58%)',
  't3-stack': 'hsl(198, 98%, 31%)',
  lamp: 'hsl(25, 95%, 53%)',
  'react-aws': 'hsl(187, 85%, 43%)',
  'angular-enterprise': 'hsl(291, 64%, 42%)',
  'nextjs-supabase': 'hsl(168, 76%, 36%)'
};

/**
 * Returns the canvas fill color for a tech stack dataset.
 * @param stackId - Stack id from the skill record
 */
export const stackChartColor = (stackId: SkillStackId): string => SKILL_STACK_CHART_COLORS[stackId] ?? '#64748b';

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

/**
 * Returns skill records tagged with the given tech stack id.
 * @param records - Full skill datasource
 * @param stackId - Stack id from content metadata
 */
export const skillRecordsForStack = (records: SkillRecord[], stackId: SkillStackId): SkillRecord[] =>
  records.filter((record) => record.stackIds.includes(stackId));
