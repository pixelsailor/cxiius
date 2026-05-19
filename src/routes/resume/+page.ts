import { getExperience } from '$lib/content/experience';
import { getIdentity } from '$lib/content/identity';
import { getProficiencyLevels, getSkills } from '$lib/content/skills';
import { getEducation } from '$lib/content/education';

export const prerender = true;

// TODO: Design the error handling for this route. This can be tested by removing the getEducation() import.
export const load = async () => {
  const [identity, experience, skills, education, proficiencyLevels] = await Promise.all([
    getIdentity(),
    getExperience(),
    getSkills(),
    getEducation(),
    getProficiencyLevels(),
  ]);
  return { education, experience, identity, proficiencyLevels, skills };
};
