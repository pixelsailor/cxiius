// Aggregates public site content for future AI system prompt assembly (ADR-008 Rule 6).
// This module is the only server entry point that imports `$lib/content/*`.

import { getAvailability } from '$lib/content/availability';
import { getBackground } from '$lib/content/background';
import { getDesignPortfolio } from '$lib/content/design-portfolio';
import { getEducation } from '$lib/content/education';
import { getExperience } from '$lib/content/experience';
// import { getProjects } from '$lib/content/projects';
import { getSkills } from '$lib/content/skills';

/**
 * Returns a plain-text block describing published design portfolio entries for prompt injection.
 * Extend here when additional domains should inform the system prompt; keep imports centralized.
 */
export async function assembleSystemPromptFromSiteContent(): Promise<string> {
	const portfolio = await getDesignPortfolio();
	// const projects = await getProjects();
	const skills = await getSkills();
	const experience = await getExperience();
	const education = await getEducation();
	const background = await getBackground();
	const availability = await getAvailability();

	// Design-Portfolio.ts
	const portfolioArr: string[] = ['## Design portfolio (published on site)'];
	for (const p of portfolio) {
		portfolioArr.push(`- **${p.name}** [${p.projectType}] (${p.circa}): ${p.description} **Tech:** ${p.technologies.join(', ')}.`);
	}
	const portfolioLines = portfolioArr.join('\n');

	// Projects.ts
	// TODO: Projects needs to be refactored to either make it more adaptable to other project types or
	// it should be rolled up into the Design-Portfolio.ts domain.

	// Skills.ts
	const skillsArr: string[] = ['## Skills'];
	for (const s of skills) {
		skillsArr.push(`### ${s.name}`);
		for (const skill of s.skills) {
			skillsArr.push(`- **${skill.name}**: [${skill.proficiency}]`);
		}
	}
	const skillsLines = skillsArr.join('\n');

	// Experience.ts
	const experienceArr: string[] = ['## Experience'];
	for (const e of experience) {
		experienceArr.push(`**${e.title}** - _${e.company}_ | ${e.startDate} to ${e.endDate}`);
		experienceArr.push(`${e.context}`);
		experienceArr.push(`- **Contributions:** ${e.contributions.join(', ')}`);
		experienceArr.push(`- **Outcomes:** ${e.outcomes}`);
		experienceArr.push(`- **Tech:** ${e.tech.join(', ')}`);
	}
	const experienceLines = experienceArr.join('\n');

	// Education.ts
	const educationArr: string[] = ['## Education'];
	for (const e of education) {
		educationArr.push(`### ${e.credential} - _${e.institution}_ | ${e.completedDate}`);
		educationArr.push(`${e.notes}`);
		if (e.honors) {
			educationArr.push(`- **Honors:** ${e.honors.join(', ')}`);
		}
	}
	const educationLines = educationArr.join('\n');

	// Background.ts
	const militaryBackgroundArr: string[] = [
		'## Military Service',
		`### ${background.military.rank} - _${background.military.branch}_ | ${background.military.startDate} to ${background.military.endDate}`,
		`${background.military.summary}`
	];
	const militaryBackgroundLines = militaryBackgroundArr.join('\n');

	const martialArtsBackgroundArr: string[] = ['## Martial Arts', ...background.martialArts.map((m) => `### ${m.rank} - _${m.style}_ | ${m.school}_ | ${m.earnedDate}`)];
	const martialArtsBackgroundLines = martialArtsBackgroundArr.join('\n');

	const instructorRolesBackgroundArr: string[] = [
		'## Instructor Roles',
		...background.instructorRoles.map((i) => `### ${i.title} - _${i.organisation}_ | ${i.startDate} to ${i.endDate}`)
	];
	const instructorRolesBackgroundLines = instructorRolesBackgroundArr.join('\n');

	// Availability.ts
	const availabilityArr: string[] = ['## Availability'];
	availabilityArr.push(`- ${availability.statusMessage}`);
	availabilityArr.push(`- **Location Preference:** ${availability.locationPreference.join(', ')}`);
	availabilityArr.push(`- **Willing to Relocate:** ${availability.willingToRelocate ? 'Yes' : 'No'}`);
	const availabilityLines = availabilityArr.join('\n');

	return [
		skillsLines,
		portfolioLines,
		experienceLines,
		educationLines,
		militaryBackgroundLines,
		martialArtsBackgroundLines,
		instructorRolesBackgroundLines,
		availabilityLines
	].join('\n\n');
}
