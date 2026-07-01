#!/usr/bin/env node
/**
 * Deterministic export: writes `static/resume/llms.txt` from `src/lib/content/` getters.
 * No external API or Cursor Agent CLI required.
 *
 *   npm run export:llms-txt
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getAiAssistantGuidelines } from '../src/lib/content/ai-assistant.ts';
import { getAvailability } from '../src/lib/content/availability.ts';
import { getBackground } from '../src/lib/content/background.ts';
import { getEducation } from '../src/lib/content/education.ts';
import { getExperience } from '../src/lib/content/experience.ts';
import { getIdentity } from '../src/lib/content/identity.ts';
import { getProjects } from '../src/lib/content/projects.ts';
import { getSkillRecords, SKILL_CATEGORIES } from '../src/lib/content/skills.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const outFile = join(repoRoot, 'static', 'resume', 'llms.txt');

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

/**
 * @param iso - YYYY-MM or YYYY
 */
function formatMonthYear(iso) {
  if (iso === 'present') return 'Present';
  const parts = iso.split('-');
  const year = parts[0];
  const month = parts[1];
  if (month === undefined) return year;
  const monthIndex = Number.parseInt(month, 10) - 1;
  if (monthIndex < 0 || monthIndex > 11) return iso;
  return `${MONTHS[monthIndex]} ${year}`;
}

function formatExperienceRange(startDate, endDate) {
  const end = endDate === 'present' ? 'Present' : formatMonthYear(endDate);
  return `${formatMonthYear(startDate)} - ${end}`;
}

function companyLabel(entry) {
  if (entry.formerlyKnownAs !== undefined && entry.formerlyKnownAs.trim() !== '') {
    return `${entry.company} (formerly ${entry.formerlyKnownAs})`;
  }
  return entry.company;
}

function categoryNameById(id) {
  return SKILL_CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

function buildSkillsSection(records) {
  const lines = ['## Technical Proficiencies'];
  let currentCategory = null;
  for (const record of records) {
    if (record.categoryId !== currentCategory) {
      currentCategory = record.categoryId;
      lines.push('', `### ${categoryNameById(record.categoryId)}`);
    }
    const note =
      record.notes !== undefined && record.notes.trim() !== ''
        ? ` (${record.notes})`
        : '';
    lines.push(
      `- ${record.name} [${record.proficiency}] | ${record.yearsOfExperience} years${note}`
    );
  }
  return lines.join('\n');
}

function buildExperienceSection(experience) {
  const lines = ['## Professional Experience'];
  for (const entry of experience) {
    lines.push(
      '',
      `### ${entry.title}`,
      `**${companyLabel(entry)}** - ${entry.location}`,
      `*${formatExperienceRange(entry.startDate, entry.endDate)}*`,
      '',
      `**Context:** ${entry.context}`,
      '',
      '#### Responsibilities and contributions',
      ...entry.contributions.map((c) => `- ${c}`),
      '',
      `#### Key outcomes`,
      entry.outcomes,
      '',
      `#### Skills`,
      entry.tech.join(', ')
    );
  }
  return lines.join('\n');
}

function buildProjectsSection(projects) {
  const lines = ['## Projects and portfolio'];
  for (const project of projects) {
    if (project.includeInPortfolio) {
      lines.push(
        '',
        `### ${project.name} [${project.projectType}] (${project.circa}) [${project.status}]`,
        project.summary,
        project.description,
        `**Technologies:** ${project.technologies.join(', ')}`
      );
      if (project.liveUrl !== undefined && project.liveUrl.trim() !== '') {
        lines.push(`**Live URL:** ${project.liveUrl}`);
      }
    } else {
      lines.push(
        '',
        `### ${project.name} (${project.status})`,
        project.summary,
        `**Context:** ${project.context}`,
        ...project.selectionAndFreshness.map((line) => `- ${line}`),
        `**Tech stack:** ${project.techStack.join(', ')}`
      );
    }
  }
  return lines.join('\n');
}

function buildEducationSection(education) {
  const lines = ['## Education'];
  for (const entry of education) {
    lines.push(
      '',
      `### ${entry.credential}`,
      `**${entry.institution}** - ${entry.location}`,
      `*${entry.completedDate}*`
    );
    if (entry.honors !== undefined && entry.honors.length > 0) {
      for (const honor of entry.honors) {
        lines.push(`- ${honor}`);
      }
    }
    if (entry.notes !== undefined && entry.notes.trim() !== '') {
      lines.push(`- ${entry.notes}`);
    }
  }
  return lines.join('\n');
}

function buildBackgroundSections(background) {
  const military = [
    '## Military Service',
    '',
    `### ${background.military.rank}, ${background.military.rate}`,
    `**${background.military.branch}** - ${background.military.locations.join(' & ')}`,
    `*${background.military.startDate} - ${background.military.endDate}*`,
    '',
    background.military.summary,
    ...background.military.highlights.map((h) => `- ${h}`)
  ];

  const martialArts = [
    '## Martial Arts',
    ...background.martialArts.map(
      (m) =>
        `- **${m.rank}**, ${m.style} - ${m.school}, ${m.location} (earned ${m.earnedDate})`
    )
  ];

  const instructors = [
    '## Leadership and instructional experience',
    ...background.instructorRoles.map(
      (role) =>
        `### ${role.title}\n**${role.organisation}** - ${role.location} | *${role.startDate} - ${role.endDate}*\n\n${role.summary}`
    )
  ];

  const workStyle = [
    '## Work style',
    '',
    `**Traits:** ${background.workStyle.traits.join(', ')}`,
    '',
    '**Non-negotiables:**',
    ...background.workStyle.nonNegotiables.map((n) => `- ${n}`),
    '',
    `**Philosophy:** ${background.workStyle.philosophy}`
  ];

  return [...military, '', ...martialArts, '', ...instructors, '', ...workStyle].join('\n');
}

function buildAvailabilitySection(availability) {
  return [
    '## Availability',
    '',
    `- ${availability.statusMessage}`,
    `- **Open to:** ${availability.openTo.join(', ')}`,
    `- **Location preference:** ${availability.locationPreference.join(', ')}`,
    `- **Willing to relocate:** ${availability.willingToRelocate ? 'Yes' : 'No'}`,
    `- **As of:** ${availability.asOf}`
  ].join('\n');
}

function extractDerivativeAuthoringNotes(guidelines) {
  const marker =
    'When discussing experience or accomplishments, lead with narrative context';
  const start = guidelines.indexOf(marker);
  if (start === -1) return [];
  const rest = guidelines.slice(start);
  const end = rest.indexOf('\n\nWhen appropriate, reflect the voice profile');
  const paragraph = end === -1 ? rest.trim() : rest.slice(0, end).trim();
  return paragraph.split('\n').filter((line) => line.trim() !== '');
}

async function main() {
  const [identity, experience, skillRecords, projects, education, background, availability, guidelines] =
    await Promise.all([
      getIdentity(),
      getExperience(),
      getSkillRecords(),
      getProjects(),
      getEducation(),
      getBackground(),
      getAvailability(),
      getAiAssistantGuidelines()
    ]);

  const authoringNotes = extractDerivativeAuthoringNotes(guidelines);

  const sections = [
    '> This document is derived from the site typed content source (`src/lib/content/`). Intended for AI systems, language models, and automated tools when generating targeted derivatives such as tailored resumes, cover letters, bio pages, or portfolio summaries. Preserve narrative context when creating derivatives; omit or condense only when a specific output format requires it.',
    '',
    `# ${identity.name}`,
    '',
    `**Role:** ${identity.role}`,
    `**Location:** ${identity.location}`,
    `**Email:** ${identity.contact.email}`,
    `**URL:** ${identity.contact.url}`,
    `**LinkedIn:** ${identity.contact.linkedin}`,
    `**Dribbble:** ${identity.contact.dribbble}`,
    `**GitHub:** ${identity.contact.github}`,
    `**Experience:** ${identity.yearsExperience}+ years`,
    '',
    '---',
    '',
    '## Professional Identity',
    '',
    identity.summary,
    '',
    '### Differentiators',
    ...identity.differentiators.map((d) => `- **${d.headline}:** ${d.detail}`),
    '',
    identity.usabilityAccessibilityCommitment,
    '',
    `**Personal facts:** ${identity.personalFacts.join('; ')}.`,
    '',
    '---',
    '',
    buildSkillsSection(skillRecords),
    '',
    '---',
    '',
    buildExperienceSection(experience),
    '',
    '---',
    '',
    buildProjectsSection(projects),
    '',
    '---',
    '',
    buildEducationSection(education),
    '',
    '---',
    '',
    buildBackgroundSections(background),
    '',
    '---',
    '',
    buildAvailabilitySection(availability),
    '',
    '---',
    '',
    '## Notes for AI Systems',
    '',
    '- Preserve the narrative context of each role - the "why it mattered" - not just the task list.',
    ...authoringNotes.map((line) => (line.startsWith('-') ? line : `- ${line}`)),
    '',
    '- When highlighting strengths, draw on the differentiators listed under Professional Identity rather than inventing new claims.',
    '- Stay factual: do not infer employers, dates, proficiency levels, or metrics not stated in this document.'
  ];

  const text = `${sections.join('\n').trimEnd()}\n`;
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, text, 'utf8');
  console.log(`Wrote ${outFile}`);
}

main().catch((err) => {
  console.error('[export-llms-txt]', err);
  process.exitCode = 1;
});
