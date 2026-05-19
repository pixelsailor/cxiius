/**
 * @fileoverview Defines technical skill categories, proficiency scale metadata, and getters for resume and AI prompt assembly.
 * @module lib/content/skills
 */

/** Ordered proficiency keys from lowest to highest practical experience. */
export const PROFICIENCY_ORDER = ['none', 'emerging', 'competent', 'proficient', 'fluent'] as const;

export type Proficiency = (typeof PROFICIENCY_ORDER)[number];

/** A single technology or practice with an assigned proficiency tier. */
export type Skill = {
  name: string;
  proficiency: Proficiency;
  notes?: string;
};

/** Skills grouped under a resume-facing category heading. */
export type SkillCategory = {
  name: string;
  skills: Skill[];
};

/** Display metadata for one step on the proficiency scale (bar width, legend copy, color). */
export type ProficiencyLevel = {
  proficiency: Proficiency;
  /** Numeric tier on a 1-5 scale; drives bar width as level / 5. */
  level: number;
  /** Human-readable tier label (e.g. Fluent). */
  name: string;
  description: string;
  /** Playful tier alias used on the scale axis (e.g. ninja). */
  avatar: string;
  avatarDescription: string;
  /** Token key for bar fill styling: gray, red, yellow, blue, or green. */
  color: string;
  /** Bar fill width as a percentage of the track (level / 5 * 100). */
  barWidthPercent: number;
};

const MAX_PROFICIENCY_LEVEL = 5;

const proficiencyMap: Record<
  Proficiency,
  { level: number; name: string; description: string; avatar: string; avatarDescription: string; color: string }
> = {
  none: {
    level: 1,
    name: 'No Experience',
    avatar: '',
    description: 'No practical experience.',
    avatarDescription: '',
    color: 'gray',
  },
  emerging: {
    level: 2,
    name: 'Emerging',
    avatar: 'zombie',
    description: 'Limited hands-on experience or not recently used; can ramp up quickly.',
    avatarDescription: 'Will beat and claw their way to devour the subject.',
    color: 'red',
  },
  competent: {
    level: 3,
    name: 'Competent',
    description:
      'Working knowledge or used sparingly in the last few years; can contribute meaningfully with occasional reference to documentation.',
    avatar: 'pirate',
    avatarDescription:
      "Capable of getting the job done through brute force and lots of sneering -- doesn't always know why something works... probably voodoo.",
    color: 'yellow',
  },
  proficient: {
    level: 4,
    name: 'Proficient',
    description:
      'Strong working knowledge or used regularly in the last few years; comfortable owning implementation independently.',
    avatar: 'cowboy',
    avatarDescription:
      'Never afraid to jump in and take command, using their vast know-how to easily adapt to unfamiliar territory and unexpected challenges.',
    color: 'blue',
  },
  fluent: {
    level: 5,
    name: 'Fluent',
    description: 'Extensive practical experience across multiple projects; primary working tool.',
    avatar: 'ninja',
    avatarDescription:
      'Mastery is not a goal to be achieved, but a journey to be embarked upon; always seeking to improve and grow.',
    color: 'green',
  },
} as const;

const toProficiencyLevel = (proficiency: Proficiency): ProficiencyLevel => {
  const meta = proficiencyMap[proficiency];
  return {
    proficiency,
    level: meta.level,
    name: meta.name,
    description: meta.description,
    avatar: meta.avatar,
    avatarDescription: meta.avatarDescription,
    color: meta.color,
    barWidthPercent: (meta.level / MAX_PROFICIENCY_LEVEL) * 100,
  };
};

/**
 * Returns metadata for each proficiency tier shown on the resume skills chart.
 * @returns Levels from emerging through fluent (excludes none)
 */
export const getProficiencyLevels = (): Promise<ProficiencyLevel[]> =>
  Promise.resolve(
    (['emerging', 'competent', 'proficient', 'fluent'] as const).map((proficiency) => toProficiencyLevel(proficiency)),
  );

/**
 * Resolves display metadata for a single proficiency key.
 * @param proficiency - Tier key from a skill entry
 */
export const getProficiencyLevel = (proficiency: Proficiency): ProficiencyLevel => toProficiencyLevel(proficiency);

const data: SkillCategory[] = [
  {
    name: 'Languages & Markup',
    skills: [
      { name: 'HTML', proficiency: 'fluent' },
      { name: 'CSS', proficiency: 'proficient' },
      { name: 'Sass/SCSS', proficiency: 'fluent' },
      { name: 'JavaScript / TypeScript', proficiency: 'proficient' },
      { name: 'PHP', proficiency: 'competent', notes: 'Primary use in freelance era (2010-2013); less recent' },
      { name: 'Python', proficiency: 'emerging' },
      { name: 'Node.js', proficiency: 'competent' },
    ]
  },
  {
    name: 'Frameworks & Libraries',
    skills: [
      { name: 'Angular', proficiency: 'fluent', notes: 'Primary framework across two long-term enterprise engagements; up to Angular 21' },
      { name: 'React', proficiency: 'proficient', notes: 'Used extensively at Fortra and in component library work' },
      { name: 'Svelte', proficiency: 'competent' },
      { name: 'Qwik', proficiency: 'emerging' },
      { name: 'Astro', proficiency: 'emerging' },
      { name: 'Web Components', proficiency: 'emerging' },
      { name: 'TailwindCSS', proficiency: 'fluent' },
      { name: 'Bootstrap', proficiency: 'competent' },
      { name: 'Angular Material', proficiency: 'fluent' },
      { name: 'Material UI (MUI)', proficiency: 'proficient' },
      { name: 'PrimeNG', proficiency: 'fluent' },
      { name: 'Shadcn UI', proficiency: 'emerging' },
      { name: 'Semantic / Fomantic UI', proficiency: 'competent' },
      { name: 'RxJS', proficiency: 'proficient', notes: 'Used extensively in Angular contexts' },
      { name: 'jQuery', proficiency: 'competent', notes: 'Deep historical use; superseded by modern frameworks in current work' },
      { name: 'WordPress', proficiency: 'competent' }
    ]
  },
  {
    name: 'Component Systems & Design',
    skills: [
      {
        name: 'Component library architecture',
        proficiency: 'fluent',
        notes: 'Core specialisation - design and implementation of opinionated, accessible, AI-compatible component systems'
      },
      { name: 'Design systems', proficiency: 'fluent' },
      { name: 'Storybook', proficiency: 'competent' },
      { name: 'Figma', proficiency: 'emerging', notes: 'Design-to-code workflows; also used for product design and prototyping' },
      { name: 'UI/UX design', proficiency: 'fluent' },
      { name: 'Accessibility (WCAG)', proficiency: 'proficient' },
      { name: 'Responsive design', proficiency: 'fluent' }
    ]
  },
  {
    name: 'Testing & Quality',
    skills: [
      { name: 'Jest', proficiency: 'proficient' },
      { name: 'Vitest', proficiency: 'proficient' },
      { name: 'Karma', proficiency: 'proficient' },
      { name: 'Testing Library', proficiency: 'proficient' },
      { name: 'Mock Service Worker (MSW)', proficiency: 'competent' },
      { name: 'Unit testing', proficiency: 'proficient' },
    ]
  },
  {
    name: 'Build Tools & Toolchain',
    skills: [
      { name: 'Vite', proficiency: 'proficient' },
      { name: 'Webpack', proficiency: 'competent' },
      { name: 'Rollup', proficiency: 'emerging' },
      { name: 'Nx', proficiency: 'proficient', notes: 'Used for monorepo management in enterprise Angular contexts' },
      { name: 'PostCSS', proficiency: 'proficient' }
    ]
  },
  {
    name: 'Backend & APIs',
    skills: [
      { name: 'SvelteKit', proficiency: 'competent' },
      { name: 'Next.js', proficiency: 'emerging' },
      { name: 'Express.js', proficiency: 'emerging' },
      { name: 'Sails.js', proficiency: 'emerging' },
      { name: 'REST', proficiency: 'fluent' },
      { name: 'GraphQL', proficiency: 'competent' },
      { name: 'Dexie', proficiency: 'competent' },
      { name: 'Supabase', proficiency: 'competent' }
    ]
  },
  {
    name: 'Databases',
    skills: [
      { name: 'MySQL', proficiency: 'competent' },
      { name: 'IndexedDB', proficiency: 'competent' },
      { name: 'PostgreSQL', proficiency: 'competent' },
      { name: 'SQLite', proficiency: 'competent' },
      { name: 'MongoDB', proficiency: 'competent' }
    ]
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      { name: 'Docker', proficiency: 'proficient' },
      { name: 'AWS (EC2, DynamoDB, Cognito)', proficiency: 'competent' },
      { name: 'Cloudflare', proficiency: 'proficient' },
      { name: 'CI/CD pipelines', proficiency: 'proficient' },
      { name: 'Jenkins', proficiency: 'competent' },
      { name: 'Git', proficiency: 'proficient' },
      { name: 'GitHub', proficiency: 'proficient' },
      { name: 'GitLab', proficiency: 'proficient' }
    ]
  },
  {
    name: 'AI-Assisted Development',
    skills: [
      { name: 'Cursor', proficiency: 'fluent', notes: 'Primary AI development environment at LevelBlue; also personal tooling' },
      { name: 'Multi-model workflows', proficiency: 'fluent', notes: 'Selecting and adapting models for different task types within a single project' },
      {
        name: 'AI-compatible component API design',
        proficiency: 'fluent',
        notes: 'Designing component libraries with guardrails that produce reliable output from AI coding agents'
      },
      { name: 'Copilot', proficiency: 'competent', notes: 'Personal tooling' }
    ]
  },
  {
    name: 'Collaboration & Process',
    skills: [
      { name: 'Figma (collaboration)', proficiency: 'emerging' },
      { name: 'Atlassian suite (Jira, Confluence)', proficiency: 'proficient' },
      { name: 'Notion', proficiency: 'proficient' },
      { name: 'Agile / Scrum', proficiency: 'fluent' },
      { name: 'Kanban', proficiency: 'proficient' }
    ]
  }
];

/**
 * Returns all skill categories and entries for pages and the system prompt.
 */
export const getSkills = (): Promise<SkillCategory[]> => Promise.resolve(data);
