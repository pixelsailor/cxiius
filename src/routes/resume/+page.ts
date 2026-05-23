import { getExperience } from '$lib/content/experience';
import { getIdentity } from '$lib/content/identity';
import {
  getProficiencyLevels,
  getSkillCategories,
  getSkillRecords,
  getSkills,
  getSkillStacks
} from '$lib/content/skills';
import { getEducation } from '$lib/content/education';

export const prerender = true;

// TODO: Design the error handling for this route. This can be tested by removing the getEducation() import.
export const load = async () => {
  /** `skills` is the classic grouping of skills by category suitable for no-JS fallback. */
  const [identity, experience, skills, skillRecords, skillCategories, skillStacks, education, proficiencyLevels] =
    await Promise.all([
      getIdentity(),
      getExperience(),
      getSkills(),
      getSkillRecords(),
      getSkillCategories(),
      getSkillStacks(),
      getEducation(),
      getProficiencyLevels()
    ]);
  return { education, experience, identity, proficiencyLevels, skills, skillCategories, skillRecords, skillStacks };
};
