import { describe, expect, it } from 'vitest';
import type { SkillRecord } from '$lib/content/skills';
import {
  buildSkillCategorySections,
  categoryChartColor,
  chartSkillsFromSelection,
  sortSkillsByCategoryThenName
} from '$lib/utils/skills-chart-data';
import { buildCategoryProficiencyBarChart } from '$lib/utils/skills-chart-config';

const sampleSkills = (): SkillRecord[] => [
  {
    id: 'css',
    name: 'CSS',
    proficiency: 'fluent',
    yearsOfExperience: 18,
    categoryId: 'languages-markup',
    stackIds: ['angular', 'design-accessibility']
  },
  {
    id: 'angular',
    name: 'Angular',
    proficiency: 'proficient',
    yearsOfExperience: 8,
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  },
  {
    id: 'react',
    name: 'React',
    proficiency: 'emerging',
    yearsOfExperience: 4,
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  }
];

const categories = [
  { id: 'languages-markup' as const, name: 'Languages & Markup' },
  { id: 'frameworks-libraries' as const, name: 'Frameworks & Libraries' }
];

describe('sortSkillsByCategoryThenName', () => {
  it('orders by category metadata then alphabetically within category', () => {
    const ordered = sortSkillsByCategoryThenName(sampleSkills(), categories);
    expect(ordered.map((row) => row.id)).toEqual(['css', 'angular', 'react']);
  });
});

describe('chartSkillsFromSelection', () => {
  it('returns only included skills in category order', () => {
    const included = new Set(['react', 'css']);
    const rows = chartSkillsFromSelection(sampleSkills(), categories, included);
    expect(rows.map((row) => row.id)).toEqual(['css', 'react']);
  });
});

describe('buildSkillCategorySections', () => {
  it('assigns a distinct hex color per category', () => {
    const sections = buildSkillCategorySections(sampleSkills(), categories);
    expect(sections).toHaveLength(2);
    expect(sections[0]?.color).toBe(categoryChartColor('languages-markup'));
    expect(sections[1]?.color).toBe(categoryChartColor('frameworks-libraries'));
  });
});

describe('buildCategoryProficiencyBarChart', () => {
  it('maps proficiency levels to bar heights with category colors', () => {
    const included = new Set(sampleSkills().map((row) => row.id));
    const config = buildCategoryProficiencyBarChart({
      datasourceRecords: sampleSkills(),
      categories,
      includedSkillIds: included
    });
    expect(config.type).toBe('bar');
    expect(config.data.labels).toEqual(['CSS', 'Angular', 'React']);
    expect(config.data.datasets[0]?.data).toEqual([4, 3, 1]);
    expect(config.data.datasets[0]?.backgroundColor).toEqual([
      categoryChartColor('languages-markup'),
      categoryChartColor('frameworks-libraries'),
      categoryChartColor('frameworks-libraries')
    ]);
  });
});
