/**
 * @fileoverview Groups flat skill records for resume bar charts by category, proficiency, or tech stack.
 * @module lib/utils/skills-presentation
 */

import {
  getProficiencyLevel,
  PROFICIENCY_ORDER,
  type Skill,
  type SkillCategoryMeta,
  type SkillRecord,
  type SkillStackMeta,
  type SkillStackId,
  SKILL_VIEW_MODES,
  type SkillViewMode
} from '$lib/content/skills';

/** localStorage key for persisted resume skills chart grouping. */
export const RESUME_SKILLS_VIEW_STORAGE_KEY = 'cxii-resume-skills-view-mode';

/** One section heading and skill rows for the resume chart. */
export type SkillDisplayGroup = {
  name: string;
  skills: Skill[];
};

const sortByName = (skills: Skill[]): Skill[] => [...skills].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

/**
 * Maps a content record to the chart row shape.
 * @param record - Flat skill from content domain
 */
export const skillRecordToSkill = (record: SkillRecord): Skill => ({
  name: record.name,
  proficiency: record.proficiency,
  notes: record.notes
});

/**
 * Returns true when `localStorage` is available (browser).
 */
export const canPersistSkillsViewMode = (): boolean => {
  try {
    return typeof localStorage !== 'undefined' && localStorage !== null;
  } catch {
    return false;
  }
};

/**
 * Reads a persisted skills view mode, or null when missing or invalid.
 */
export const readPersistedSkillsViewMode = (): SkillViewMode | null => {
  if (!canPersistSkillsViewMode()) {
    return null;
  }
  const raw = localStorage.getItem(RESUME_SKILLS_VIEW_STORAGE_KEY);
  if (raw === null) {
    return null;
  }
  const trimmed = raw.trim();
  if ((SKILL_VIEW_MODES as readonly string[]).includes(trimmed)) {
    return trimmed as SkillViewMode;
  }
  localStorage.removeItem(RESUME_SKILLS_VIEW_STORAGE_KEY);
  return null;
};

/**
 * Persists the resume skills grouping preference (browser only).
 * @param mode - Active view mode
 */
export const writePersistedSkillsViewMode = (mode: SkillViewMode): void => {
  if (!canPersistSkillsViewMode()) {
    return;
  }
  localStorage.setItem(RESUME_SKILLS_VIEW_STORAGE_KEY, mode);
};

/**
 * Builds chart sections for the selected grouping mode.
 * @param records - Flat skill records from content
 * @param mode - Category, proficiency, or tech stack
 * @param categories - Category metadata (order preserved)
 * @param stacks - Stack metadata (order preserved)
 */
export const groupSkillsForDisplay = (
  records: SkillRecord[],
  mode: SkillViewMode,
  categories: readonly SkillCategoryMeta[],
  stacks: readonly SkillStackMeta[]
): SkillDisplayGroup[] => {
  if (mode === 'category') {
    return categories
      .map((category) => ({
        name: category.name,
        skills: sortByName(records.filter((record) => record.categoryId === category.id).map(skillRecordToSkill))
      }))
      .filter((group) => group.skills.length > 0);
  }

  if (mode === 'proficiency') {
    const tiers = [...PROFICIENCY_ORDER].reverse().filter((tier) => tier !== 'none');
    return tiers
      .map((tier) => ({
        name: getProficiencyLevel(tier).name,
        skills: sortByName(records.filter((record) => record.proficiency === tier).map(skillRecordToSkill))
      }))
      .filter((group) => group.skills.length > 0);
  }

  return stacks
    .map((stack) => ({
      name: stack.name,
      skills: sortByName(records.filter((record) => record.stackIds.includes(stack.id)).map(skillRecordToSkill))
    }))
    .filter((group) => group.skills.length > 0);
};
