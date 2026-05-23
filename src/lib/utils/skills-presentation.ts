/**
 * @fileoverview Groups skill records for resume displays and persists chart skill toggles.
 * @module lib/utils/skills-presentation
 */

import {
	getProficiencyLevel,
	PROFICIENCY_ORDER,
	type Skill,
	type SkillCategoryMeta,
	type SkillRecord,
	type SkillStackMeta,
	SKILL_VIEW_MODES,
	type SkillViewMode
} from '$lib/content/skills';

/** @deprecated Historic radio grouping persisted as a lone string token. */
export const RESUME_SKILLS_VIEW_STORAGE_KEY = 'cxii-resume-skills-view-mode';

/** Versioned JSON for per-skill chart inclusion toggles. */
export const RESUME_SKILLS_CHART_SELECTION_KEY = 'cxii-resume-skills-chart-selection';

/** One section heading and skill rows for legacy grouping helpers. */
export type SkillDisplayGroup = {
	name: string;
	skills: Skill[];
};

/** Persisted excluded skill ids for the resume category bar chart. */
export type PersistedSkillsChartSelectionV2 = {
	version: 2;
	excludedSkillIds: string[];
};

const sortByName = (skills: Skill[]): Skill[] =>
	[...skills].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

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
 * Returns every skill id from the datasource as an included set.
 * @param records - Flat skill records from content
 */
export const defaultIncludedSkillIds = (records: SkillRecord[]): Set<string> =>
	new Set(records.map((record) => record.id));

/**
 * Parses serialized chart selection JSON; returns null for corrupt or unknown versions.
 * @param raw - JSON string from localStorage
 */
export const parsePersistedSkillsChartSelectionJson = (raw: string): PersistedSkillsChartSelectionV2 | null => {
	try {
		const candidate = JSON.parse(raw) as unknown;
		if (typeof candidate !== 'object' || candidate === null) {
			return null;
		}
		const record = candidate as Partial<PersistedSkillsChartSelectionV2>;
		if (record.version !== 2 || !Array.isArray(record.excludedSkillIds)) {
			return null;
		}
		const excludedSkillIds = record.excludedSkillIds.filter((id): id is string => typeof id === 'string');
		return { version: 2, excludedSkillIds };
	} catch {
		return null;
	}
};

/**
 * Applies persisted exclusions to the default all-included set.
 * @param records - Flat skill records from content
 */
export const hydrateIncludedSkillIds = (records: SkillRecord[]): Set<string> => {
	const included = defaultIncludedSkillIds(records);
	if (!canPersistSkillsViewMode()) {
	 return included;
	}
	const raw = localStorage.getItem(RESUME_SKILLS_CHART_SELECTION_KEY);
	if (raw === null) {
		return included;
	}
	const parsed = parsePersistedSkillsChartSelectionJson(raw.trim());
	if (parsed === null) {
		return included;
	}
	for (const id of parsed.excludedSkillIds) {
		included.delete(id);
	}
	return included;
};

/**
 * Persists excluded skill ids derived from the current included set.
 * @param records - Full datasource used to compute exclusions
 * @param includedIds - Skill ids currently shown on the chart
 */
export const writeIncludedSkillIds = (records: SkillRecord[], includedIds: ReadonlySet<string>): void => {
	if (!canPersistSkillsViewMode()) {
		return;
	}
	const excludedSkillIds = records.filter((record) => !includedIds.has(record.id)).map((record) => record.id);
	const payload: PersistedSkillsChartSelectionV2 = { version: 2, excludedSkillIds };
	try {
		localStorage.setItem(RESUME_SKILLS_CHART_SELECTION_KEY, JSON.stringify(payload));
	} catch {
		/** ignore quota / unavailable storage failures */
	}
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
