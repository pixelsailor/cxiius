/**
 * @fileoverview Aggregates public site content for AI system prompt assembly (ADR-008 Rule 6).
 * @module lib/server/system-prompt
 */

import { getAvailability } from '$lib/content/availability';
import { getBackground } from '$lib/content/background';
import { getEducation } from '$lib/content/education';
import { getExperience } from '$lib/content/experience';
import { getProjects } from '$lib/content/projects';
import { getSkills } from '$lib/content/skills';

/**
 * Returns a plain-text block aggregating public site content for prompt injection.
 * Extend here when additional domains should inform the system prompt; keep imports centralized.
 */
export async function assembleSystemPromptFromSiteContent(): Promise<string> {
	const projects = await getProjects();
	const skills = await getSkills();
	const experience = await getExperience();
	const education = await getEducation();
	const background = await getBackground();
	const availability = await getAvailability();

	// Voice Profile.ts
	const voiceProfileBackgroundArr: string[] = ['## Voice Profile', `### Default Tone: ${background.voice.defaultTone}`, ...background.voice.styleNotes.map((s) => `- ${s}`)];
	const voiceProfileBackgroundLines = voiceProfileBackgroundArr.join('\n');

	const projectsArr: string[] = ['## Projects and portfolio (all entries)'];
	for (const p of projects) {
		if (p.includeInPortfolio) {
			projectsArr.push(`- **${p.name}** [${p.projectType}] (${p.circa}) [${p.status}]: ${p.description} **Tech:** ${p.technologies.join(', ')}.`);
		} else {
			projectsArr.push(`### ${p.name} (${p.status})`);
			projectsArr.push(p.summary);
			projectsArr.push(`**Context:** ${p.context}`);
			for (const line of p.selectionAndFreshness) {
				projectsArr.push(`- **Selection & freshness:** ${line}`);
			}
			for (const line of p.dataAndSync) {
				projectsArr.push(`- **Data & sync:** ${line}`);
			}
			for (const line of p.assistant) {
				projectsArr.push(`- **Assistant:** ${line}`);
			}
			for (const line of p.authorNotes) {
				projectsArr.push(`- **Author notes:** ${line}`);
			}
			for (const line of p.roadmap) {
				projectsArr.push(`- **Roadmap:** ${line}`);
			}
			projectsArr.push(`- **Tech stack:** ${p.techStack.join(', ')}`);
			const linkParts: string[] = [];
			if (p.links.publicSite !== undefined && p.links.publicSite.trim() !== '') {
				linkParts.push(`public site: ${p.links.publicSite}`);
			}
			if (p.links.repository !== undefined && p.links.repository.trim() !== '') {
				linkParts.push(`repository: ${p.links.repository}`);
			}
			if (linkParts.length > 0) {
				projectsArr.push(`- **Links:** ${linkParts.join('; ')}`);
			}
		}
	}
	const projectsLines = projectsArr.join('\n');

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

	// Interests.ts
	const interestsBackgroundArr: string[] = ['## Interests', ...background.interests.map((i) => `### ${i.name} - ${i.notes}`)];
	const interestsBackgroundLines = interestsBackgroundArr.join('\n');

	// Favorites.ts
	const favoritesBackgroundArr: string[] = [
		'## Favorites',
		`### Books: ${background.favorites.books.join(', ')}`,
		`### Bands: ${background.favorites.bands.join(', ')}`,
		`### Movies: ${background.favorites.movies.join(', ')}`,
		`### Sports Teams: ${background.favorites.sportsTeams.join(', ')}`
	];
	const favoritesBackgroundLines = favoritesBackgroundArr.join('\n');

	// Work Style.ts
	const workStyleBackgroundArr: string[] = [
		'## Work Style',
		`### Traits: ${background.workStyle.traits.join(', ')}`,
		`### Non-Negotiables: ${background.workStyle.nonNegotiables.join(', ')}`,
		`### Influences: ${background.workStyle.influences.join(', ')}`,
		`### Philosophy: ${background.workStyle.philosophy}`
	];
	const workStyleBackgroundLines = workStyleBackgroundArr.join('\n');

	// Availability.ts
	const availabilityArr: string[] = ['## Availability'];
	availabilityArr.push(`- ${availability.statusMessage}`);
	availabilityArr.push(`- **Location Preference:** ${availability.locationPreference.join(', ')}`);
	availabilityArr.push(`- **Willing to Relocate:** ${availability.willingToRelocate ? 'Yes' : 'No'}`);
	const availabilityLines = availabilityArr.join('\n');

	return [
		voiceProfileBackgroundLines,
		skillsLines,
		projectsLines,
		experienceLines,
		educationLines,
		militaryBackgroundLines,
		martialArtsBackgroundLines,
		instructorRolesBackgroundLines,
		interestsBackgroundLines,
		favoritesBackgroundLines,
		workStyleBackgroundLines,
		availabilityLines
	].join('\n\n');
}
