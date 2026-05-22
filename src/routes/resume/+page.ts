import { getExperience } from '$lib/content/experience';
import { getIdentity } from '$lib/content/identity';
import { getProficiencyLevels, getSkillCategories, getSkillRecords, getSkillStacks } from '$lib/content/skills';
import { getEducation } from '$lib/content/education';

export const prerender = true;

// TODO: Design the error handling for this route. This can be tested by removing the getEducation() import.
export const load = async () => {
  const [identity, experience, skillRecords, skillCategories, skillStacks, education, proficiencyLevels] = await Promise.all([
    getIdentity(),
    getExperience(),
    getSkillRecords(),
    getSkillCategories(),
    getSkillStacks(),
    getEducation(),
    getProficiencyLevels()
  ]);
  return { education, experience, identity, proficiencyLevels, skillCategories, skillRecords, skillStacks };
};
