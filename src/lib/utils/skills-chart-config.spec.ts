import { describe, expect, it } from 'vitest';
import type { SkillRecord } from '$lib/content/skills';
import {
  buildCategoryProficiencyBarChart,
  buildCategoryProficiencyPolarChart,
  buildCategoryProficiencyRadarChart,
  buildCategoryProficiencyBubbleChart,
  buildResumeSkillsChart
} from '$lib/utils/skills-chart-config';
import { categoryChartColor } from '$lib/utils/skills-chart-data';

const sampleSkills = (): SkillRecord[] => [
  {
    id: 'css',
    name: 'CSS',
    proficiency: 'fluent',
    yearsOfExperience: 18,
    categoryId: 'languages-markup',
    stackIds: ['angular']
  },
  {
    id: 'angular',
    name: 'Angular',
    proficiency: 'proficient',
    yearsOfExperience: 8,
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  }
];

const categories = [
  { id: 'languages-markup' as const, name: 'Languages & Markup' },
  { id: 'frameworks-libraries' as const, name: 'Frameworks & Libraries' }
];

const emptyArgs = {
  datasourceRecords: sampleSkills(),
  categories,
  includedSkillIds: new Set<string>()
};

const allIncludedArgs = {
  datasourceRecords: sampleSkills(),
  categories,
  includedSkillIds: new Set(sampleSkills().map((row) => row.id))
};

describe('buildResumeSkillsChart', () => {
  it('AC-22: dispatcher returns bar configuration for bar type', () => {
    const config = buildResumeSkillsChart('bar', allIncludedArgs);
    expect(config.type).toBe('bar');
  });

  it('AC-22: dispatcher returns polarArea configuration for polar type', () => {
    const config = buildResumeSkillsChart('polar', allIncludedArgs);
    expect(config.type).toBe('polarArea');
  });

  it('AC-22: dispatcher returns radar configuration for radar type', () => {
    const config = buildResumeSkillsChart('radar', allIncludedArgs);
    expect(config.type).toBe('radar');
  });

  it('AC-22: dispatcher returns bubble configuration for bubble type', () => {
    const config = buildResumeSkillsChart('bubble', allIncludedArgs);
    expect(config.type).toBe('bubble');
  });
});

describe('buildCategoryProficiencyBarChart', () => {
  it('AC-22: returns Chart.js type bar with skill labels when included', () => {
    const config = buildCategoryProficiencyBarChart(allIncludedArgs);
    expect(config.type).toBe('bar');
    expect(config.data.labels).toEqual(['CSS', 'Angular']);
    expect(config.data.datasets[0]?.data).toEqual([4, 3]);
  });

  it('AC-22: empty selection uses placeholder label and single zero dataset', () => {
    const config = buildCategoryProficiencyBarChart(emptyArgs);
    expect(config.type).toBe('bar');
    expect(config.data.labels).toEqual(['No skills selected']);
    expect(config.data.datasets).toHaveLength(1);
    expect(config.data.datasets[0]?.data).toEqual([0]);
    expect(config.options?.plugins?.legend?.display).toBe(false);
  });
});

describe('buildCategoryProficiencyPolarChart', () => {
  it('AC-22: returns Chart.js type polarArea when skills are included', () => {
    const config = buildCategoryProficiencyPolarChart(allIncludedArgs);
    expect(config.type).toBe('polarArea');
    expect(config.data.labels).toEqual(['CSS', 'Angular']);
  });

  it('AC-22: empty selection uses placeholder label and single zero segment', () => {
    const config = buildCategoryProficiencyPolarChart(emptyArgs);
    expect(config.type).toBe('polarArea');
    expect(config.data.labels).toEqual(['No skills selected']);
    expect(config.data.datasets[0]?.data).toEqual([0]);
    expect(config.options?.plugins?.legend?.display).toBe(false);
  });

  it('draws radial proficiency tick labels above polar segments', () => {
    const config = buildCategoryProficiencyPolarChart(allIncludedArgs);
    const radialScale = config.options?.scales?.r;
    expect(radialScale && 'ticks' in radialScale && radialScale.ticks?.z).toBe(1);
  });
});

describe('buildCategoryProficiencyRadarChart', () => {
  it('AC-22: returns Chart.js type radar when skills are included', () => {
    const config = buildCategoryProficiencyRadarChart(allIncludedArgs);
    expect(config.type).toBe('radar');
    expect(config.data.labels).toEqual(['CSS', 'Angular']);
    expect(config.data.datasets[0]?.fill).toBe(true);
  });

  it('AC-22: empty selection uses placeholder label and single zero spoke', () => {
    const config = buildCategoryProficiencyRadarChart(emptyArgs);
    expect(config.type).toBe('radar');
    expect(config.data.labels).toEqual(['No skills selected']);
    expect(config.data.datasets[0]?.data).toEqual([0]);
    expect(config.options?.plugins?.legend?.display).toBe(false);
  });
});

describe('buildCategoryProficiencyBubbleChart', () => {
  it('AC-22: returns Chart.js type bubble with years on x, proficiency on y, and radius from years', () => {
    const config = buildCategoryProficiencyBubbleChart(allIncludedArgs);
    expect(config.type).toBe('bubble');
    expect(config.data.datasets[0]?.data).toEqual([
      { x: 18, y: 4, r: 36 },
      { x: 8, y: 3, r: 16 }
    ]);
    expect(config.data.datasets[0]?.backgroundColor).toEqual([
      categoryChartColor('languages-markup'),
      categoryChartColor('frameworks-libraries')
    ]);
  });

  it('AC-22: empty selection uses single placeholder bubble at origin', () => {
    const config = buildCategoryProficiencyBubbleChart(emptyArgs);
    expect(config.type).toBe('bubble');
    expect(config.data.datasets).toHaveLength(1);
    expect(config.data.datasets[0]?.data).toEqual([{ x: 0, y: 0, r: 8 }]);
    expect(config.options?.plugins?.legend?.display).toBe(false);
  });
});
