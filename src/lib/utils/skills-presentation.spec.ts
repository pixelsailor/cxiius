import { describe, expect, it, vi } from 'vitest';
import type { SkillRecord } from '$lib/content/skills';
import {
	groupSkillsForDisplay,
	parsePersistedSkillsChartSelectionJson,
	readPersistedSkillsViewMode,
	RESUME_SKILLS_CHART_SELECTION_KEY,
	RESUME_SKILLS_VIEW_STORAGE_KEY,
	skillRecordToSkill,
	writeIncludedSkillIds,
	writePersistedSkillsViewMode,
	defaultIncludedSkillIds,
	hydrateIncludedSkillIds
} from '$lib/utils/skills-presentation';

const categories = [
  { id: 'languages-markup' as const, name: 'Languages & Markup' },
  { id: 'frameworks-libraries' as const, name: 'Frameworks & Libraries' }
] as const;

const stacks = [
  { id: 'angular' as const, name: 'Angular' },
  { id: 'react' as const, name: 'React' }
] as const;

const sampleRecords: SkillRecord[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    proficiency: 'fluent',
    yearsOfExperience: 10,
    categoryId: 'languages-markup',
    stackIds: ['angular', 'react']
  },
  {
    id: 'angular',
    name: 'Angular',
    proficiency: 'fluent',
    yearsOfExperience: 12,
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  },
  {
    id: 'react',
    name: 'React',
    proficiency: 'proficient',
    yearsOfExperience: 9,
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  }
];

describe('skillRecordToSkill', () => {
  it('maps record fields to chart rows', () => {
    expect(skillRecordToSkill(sampleRecords[0])).toEqual({
      name: 'TypeScript',
      proficiency: 'fluent'
    });
  });
});

describe('groupSkillsForDisplay', () => {
  it('groups by category in metadata order', () => {
    const groups = groupSkillsForDisplay(sampleRecords, 'category', categories, stacks);
    expect(groups.map((g) => g.name)).toEqual(['Languages & Markup', 'Frameworks & Libraries']);
    expect(groups[0]?.skills.map((s) => s.name)).toEqual(['TypeScript']);
    expect(groups[1]?.skills.map((s) => s.name)).toEqual(['Angular', 'React']);
  });

  it('groups by proficiency highest tier first', () => {
    const groups = groupSkillsForDisplay(sampleRecords, 'proficiency', categories, stacks);
    expect(groups[0]?.name).toBe('Fluent');
    expect(groups[0]?.skills.map((s) => s.name).sort()).toEqual(['Angular', 'TypeScript']);
  });

  it('groups by stack and includes multi-tagged skills in each stack', () => {
    const groups = groupSkillsForDisplay(sampleRecords, 'stack', categories, stacks);
    const angular = groups.find((g) => g.name === 'Angular');
    const react = groups.find((g) => g.name === 'React');
    expect(angular?.skills.map((s) => s.name).sort()).toEqual(['Angular', 'TypeScript']);
    expect(react?.skills.map((s) => s.name).sort()).toEqual(['React', 'TypeScript']);
  });
});

describe('skills view mode persistence', () => {
  it('uses the documented localStorage key', () => {
    expect(RESUME_SKILLS_VIEW_STORAGE_KEY).toBe('cxii-resume-skills-view-mode');
  });

  it('round-trips a valid mode', () => {
    const ls = {
      store: new Map<string, string>(),
      getItem(key: string) {
        return this.store.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        this.store.set(key, value);
      },
      removeItem(key: string) {
        this.store.delete(key);
      }
    };
    vi.stubGlobal('localStorage', ls);

    writePersistedSkillsViewMode('stack');
    expect(readPersistedSkillsViewMode()).toBe('stack');

    vi.unstubAllGlobals();
  });
});

describe('skills chart selection persistence', () => {
  it('uses the documented localStorage key', () => {
    expect(RESUME_SKILLS_CHART_SELECTION_KEY).toBe('cxii-resume-skills-chart-selection');
  });

  it('rejects malformed JSON payloads', () => {
    expect(parsePersistedSkillsChartSelectionJson('{broken')).toBeNull();
  });

  it('requires version === 2 to deserialize', () => {
    expect(parsePersistedSkillsChartSelectionJson(JSON.stringify({ version: 1, excludedSkillIds: [] }))).toBeNull();
  });

  it('round-trips excluded skill ids', () => {
    const ls = {
      store: new Map<string, string>(),
      getItem(key: string) {
        return this.store.get(key) ?? null;
      },
      setItem(key: string, value: string) {
        this.store.set(key, value);
      },
      removeItem(key: string) {
        this.store.delete(key);
      }
    };
    vi.stubGlobal('localStorage', ls);

    const included = defaultIncludedSkillIds(sampleRecords);
    included.delete('react');
    writeIncludedSkillIds(sampleRecords, included);

    const hydrated = hydrateIncludedSkillIds(sampleRecords);
    expect(hydrated.has('typescript')).toBe(true);
    expect(hydrated.has('react')).toBe(false);

    vi.unstubAllGlobals();
  });
});