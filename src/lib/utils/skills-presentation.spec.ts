import { describe, expect, it, vi } from 'vitest';
import type { SkillRecord } from '$lib/content/skills';
import {
  groupSkillsForDisplay,
  readPersistedSkillsViewMode,
  RESUME_SKILLS_VIEW_STORAGE_KEY,
  skillRecordToSkill,
  writePersistedSkillsViewMode
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
    categoryId: 'languages-markup',
    stackIds: ['angular', 'react']
  },
  {
    id: 'angular',
    name: 'Angular',
    proficiency: 'fluent',
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  },
  {
    id: 'react',
    name: 'React',
    proficiency: 'proficient',
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
