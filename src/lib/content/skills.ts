/**
 * @fileoverview Flat technical skill records and proficiency metadata for AI prompts and resume UI grouping.
 * @module lib/content/skills
 */

/** Ordered proficiency keys from lowest to highest practical experience. */
export const PROFICIENCY_ORDER = ['none', 'emerging', 'competent', 'proficient', 'fluent'] as const;

export type Proficiency = (typeof PROFICIENCY_ORDER)[number];

/** Resume chart grouping modes (applied in UI via skills-presentation utils). */
export const SKILL_VIEW_MODES = ['category', 'proficiency', 'stack'] as const;

export type SkillViewMode = (typeof SKILL_VIEW_MODES)[number];

/** Canonical category ids for datasource tagging (not presentation order). */
export const SKILL_CATEGORY_IDS = [
  'languages-markup',
  'frameworks-libraries',
  'ui-and-design',
  'testing-and-qa',
  'backend-apis-data',
  'tooling-cloud-delivery',
  'ai-assisted-development',
  'collaboration-process'
] as const;

export type SkillCategoryId = (typeof SKILL_CATEGORY_IDS)[number];

/** Tech stack ids for optional resume grouping. */
export const SKILL_STACK_IDS = [
  'web-fundamentals',
  'angular',
  'react',
  'svelte',
  'design-accessibility',
  'testing-quality',
  'data-apis',
  'platform-delivery',
  'ai-assisted',
  'collaboration',
  't3-stack',
  'mern',
  'mean',
  'react-aws',
  'jamstack',
  'angular-enterprise',
  'nextjs-supabase',
  'lamp'
] as const;

export type SkillStackId = (typeof SKILL_STACK_IDS)[number];

/** Category metadata for prompts and category-mode charts. */
export type SkillCategoryMeta = {
  id: SkillCategoryId;
  name: string;
};

/** Stack metadata for stack-mode charts and prompt tags. */
export type SkillStackMeta = {
  id: SkillStackId;
  name: string;
};

/**
 * Single skill entry in the content datasource.
 * @remarks One row per skill; use categoryId and stackIds for grouping in the resume UI.
 */
export type SkillRecord = {
  /** Stable key for keys in lists and future migrations. */
  id: string;
  name: string;
  proficiency: Proficiency;
  /**
   * Whole years of substantive use (portfolio estimate).
   * @remarks Non-negative; aligned with narrative in experience timelines and resume notes where present.
   */
  yearsOfExperience: number;
  notes?: string;
  categoryId: SkillCategoryId;
  stackIds: SkillStackId[];
};

/** Chart row shape (grouped at display time). */
export type Skill = {
  name: string;
  proficiency: Proficiency;
  notes?: string;
};

/** @deprecated Prefer SkillDisplayGroup from skills-presentation; kept for legacy getters. */
export type SkillCategory = {
  name: string;
  skills: Skill[];
};

/** Display metadata for one step on the proficiency scale (bar width, legend copy, color). */
export type ProficiencyLevel = {
  proficiency: Proficiency;
  level: number;
  name: string;
  description: string;
  avatar: string;
  avatarDescription: string;
  color: string;
  barWidthPercent: number;
};

const MAX_PROFICIENCY_LEVEL = 4;

const proficiencyMap: Record<
  Proficiency,
  { level: number; name: string; description: string; avatar: string; avatarDescription: string; color: string }
> = {
  none: {
    level: 0,
    name: 'No Experience',
    avatar: '',
    description: 'No practical experience.',
    avatarDescription: '',
    color: 'gray'
  },
  emerging: {
    level: 1,
    name: 'Emerging',
    avatar: 'zombie',
    description: 'Limited hands-on experience or not recently used; can ramp up quickly.',
    avatarDescription: 'Will beat and claw their way to devour the subject.',
    color: 'red'
  },
  competent: {
    level: 2,
    name: 'Competent',
    description:
      'Working knowledge or used sparingly in the last few years; can contribute meaningfully with occasional reference to documentation.',
    avatar: 'pirate',
    avatarDescription:
      "Capable of getting the job done through brute force and lots of sneering -- doesn't always know why something works... probably voodoo.",
    color: 'yellow'
  },
  proficient: {
    level: 3,
    name: 'Proficient',
    description:
      'Strong working knowledge or used regularly in the last few years; comfortable owning implementation independently.',
    avatar: 'cowboy',
    avatarDescription:
      'Never afraid to jump in and take command, using their vast know-how to easily adapt to unfamiliar territory and unexpected challenges.',
    color: 'blue'
  },
  fluent: {
    level: 4,
    name: 'Fluent',
    description: 'Extensive practical experience across multiple projects; primary working tool.',
    avatar: 'ninja',
    avatarDescription:
      'Mastery is not a goal to be achieved, but a journey to be embarked upon; always seeking to improve and grow.',
    color: 'green'
  }
} as const;

export const SKILL_CATEGORIES: readonly SkillCategoryMeta[] = [
  { id: 'languages-markup', name: 'Languages & Markup' },
  { id: 'frameworks-libraries', name: 'Frameworks & Libraries' },
  { id: 'ui-and-design', name: 'UI & Design' },
  { id: 'testing-and-qa', name: 'Testing & Quality Assurance' },
  { id: 'backend-apis-data', name: 'Backend, APIs & Data' },
  { id: 'tooling-cloud-delivery', name: 'Tooling, Cloud & Delivery' },
  { id: 'ai-assisted-development', name: 'AI-Assisted Development' },
  { id: 'collaboration-process', name: 'Collaboration & Process' }
] as const;

export const SKILL_STACKS: readonly SkillStackMeta[] = [
  { id: 'web-fundamentals', name: 'Web fundamentals' },
  { id: 'angular', name: 'Angular' },
  { id: 'react', name: 'React' },
  { id: 'svelte', name: 'Svelte & PWA' },
  { id: 'design-accessibility', name: 'Design & accessibility' },
  { id: 'testing-quality', name: 'Testing & quality' },
  { id: 'data-apis', name: 'Data & APIs' },
  { id: 'platform-delivery', name: 'Platform & delivery' },
  { id: 'ai-assisted', name: 'AI-assisted development' },
  { id: 'collaboration', name: 'Collaboration' },
  { id: 't3-stack', name: 'T3 Stack' },
  { id: 'mern', name: 'MERN' },
  { id: 'mean', name: 'MEAN' },
  { id: 'react-aws', name: 'React + AWS' },
  { id: 'jamstack', name: 'JAMstack' },
  { id: 'angular-enterprise', name: 'Angular enterprise' },
  { id: 'nextjs-supabase', name: 'Next.js + Supabase' },
  { id: 'lamp', name: 'LAMP' }
] as const;

const skillRecords: SkillRecord[] = [
  {
    id: 'css',
    name: 'CSS',
    proficiency: 'proficient',
    yearsOfExperience: 27,
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals', 'design-accessibility']
  },
  {
    id: 'html',
    name: 'Semantic HTML',
    proficiency: 'fluent',
    yearsOfExperience: 27,
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    proficiency: 'proficient',
    yearsOfExperience: 24,
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'php',
    name: 'PHP',
    proficiency: 'competent',
    yearsOfExperience: 3,
    notes: 'Primary use in freelance era (2010-2013); less recent',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'python',
    name: 'Python',
    proficiency: 'emerging',
    yearsOfExperience: 1,
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'sass-scss',
    name: 'Sass/SCSS',
    proficiency: 'fluent',
    yearsOfExperience: 14,
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals', 'design-accessibility']
  },
  {
    id: 'sql',
    name: 'SQL',
    proficiency: 'emerging',
    yearsOfExperience: 1,
    categoryId: 'languages-markup',
    stackIds: ['data-apis']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    proficiency: 'fluent',
    yearsOfExperience: 13,
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals', 'angular', 'react', 'svelte']
  },
  {
    id: 'angular',
    name: 'Angular',
    proficiency: 'fluent',
    yearsOfExperience: 13,
    notes: 'Primary framework across two long-term enterprise engagements; up to Angular 21',
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  },
  {
    id: 'angular-material',
    name: 'Angular Material',
    proficiency: 'fluent',
    yearsOfExperience: 10,
    categoryId: 'ui-and-design',
    stackIds: ['angular', 'design-accessibility']
  },
  {
    id: 'nx',
    name: 'Nx',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    notes: 'Monorepo management in enterprise Angular contexts',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['angular', 'platform-delivery']
  },
  {
    id: 'primeng',
    name: 'PrimeNG',
    proficiency: 'fluent',
    yearsOfExperience: 1,
    categoryId: 'ui-and-design',
    stackIds: ['angular']
  },
  {
    id: 'rxjs',
    name: 'RxJS',
    proficiency: 'proficient',
    yearsOfExperience: 10,
    notes: 'Used extensively in Angular contexts',
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  },
  {
    id: 'svelte',
    name: 'Svelte',
    proficiency: 'proficient',
    yearsOfExperience: 1,
    notes: 'Primary stack for this portfolio and recent PWA work',
    categoryId: 'frameworks-libraries',
    stackIds: ['svelte']
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    proficiency: 'proficient',
    yearsOfExperience: 1,
    categoryId: 'frameworks-libraries',
    stackIds: ['svelte']
  },
  {
    id: 'dexie',
    name: 'Dexie',
    proficiency: 'competent',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['svelte', 'data-apis']
  },
  {
    id: 'indexeddb',
    name: 'IndexedDB',
    proficiency: 'competent',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['svelte', 'data-apis']
  },
  {
    id: 'supabase',
    name: 'Supabase',
    proficiency: 'competent',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['svelte', 'data-apis']
  },
  {
    id: 'jquery',
    name: 'jQuery',
    proficiency: 'competent',
    yearsOfExperience: 2,
    notes: 'Deep historical use; superseded by modern frameworks in current work',
    categoryId: 'frameworks-libraries',
    stackIds: ['web-fundamentals', 'react']
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    proficiency: 'emerging',
    yearsOfExperience: 1,
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'qwik',
    name: 'Qwik',
    proficiency: 'emerging',
    yearsOfExperience: 1,
    categoryId: 'frameworks-libraries',
    stackIds: []
  },
  {
    id: 'react',
    name: 'React',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    notes: 'Used extensively at Fortra and in component library work',
    categoryId: 'frameworks-libraries',
    stackIds: ['react', 'mern']
  },
  {
    id: 'react-hook-form',
    name: 'React Hook Form',
    proficiency: 'competent',
    yearsOfExperience: 2,
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'react-router',
    name: 'React Router',
    proficiency: 'competent',
    yearsOfExperience: 2,
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'tanstack-query',
    name: 'TanStack Query',
    proficiency: 'competent',
    yearsOfExperience: 2,
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    proficiency: 'competent',
    yearsOfExperience: 3,
    categoryId: 'frameworks-libraries',
    stackIds: ['web-fundamentals', 'lamp']
  },
  {
    id: 'zod',
    name: 'Zod',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    categoryId: 'backend-apis-data',
    stackIds: []
  },
  {
    id: 'zustand',
    name: 'Zustand',
    proficiency: 'competent',
    yearsOfExperience: 1,
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    proficiency: 'competent',
    yearsOfExperience: 4,
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'component-library-architecture',
    name: 'Component library architecture',
    proficiency: 'fluent',
    yearsOfExperience: 5,
    notes: 'Opinionated, accessible, AI-compatible component systems',
    categoryId: 'frameworks-libraries',
    stackIds: ['design-accessibility', 'angular', 'react']
  },
  {
    id: 'design-systems',
    name: 'Design systems',
    proficiency: 'fluent',
    yearsOfExperience: 5,
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'figma',
    name: 'Figma',
    proficiency: 'competent',
    yearsOfExperience: 1,
    notes: 'Design-to-code workflows; product design and prototyping',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'mui',
    name: 'Material UI (MUI)',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    categoryId: 'ui-and-design',
    stackIds: ['react', 'design-accessibility']
  },
  {
    id: 'responsive-design',
    name: 'Responsive design',
    proficiency: 'fluent',
    yearsOfExperience: 20,
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility', 'web-fundamentals']
  },
  {
    id: 'storybook',
    name: 'Storybook',
    proficiency: 'competent',
    yearsOfExperience: 1,
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'angular', 'react']
  },
  {
    id: 'tailwindcss',
    name: 'TailwindCSS',
    proficiency: 'fluent',
    yearsOfExperience: 6,
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility', 'svelte', 'react', 'angular']
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX design',
    proficiency: 'fluent',
    yearsOfExperience: 26,
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'wcag-accessibility',
    name: 'WCAG accessibility',
    proficiency: 'proficient',
    yearsOfExperience: 5,
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'code-review',
    name: 'Code review',
    proficiency: 'proficient',
    yearsOfExperience: 5,
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'collaboration']
  },
  {
    id: 'jest',
    name: 'Jest',
    proficiency: 'competent',
    yearsOfExperience: 5,
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'react', 'angular']
  },
  {
    id: 'karma',
    name: 'Karma',
    proficiency: 'competent',
    yearsOfExperience: 5,
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'angular']
  },
  {
    id: 'msw',
    name: 'Mock Service Worker (MSW)',
    proficiency: 'competent',
    yearsOfExperience: 2,
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'react']
  },
  {
    id: 'playwright',
    name: 'Playwright',
    proficiency: 'competent',
    yearsOfExperience: 1,
    notes: 'E2E testing in React product contexts at Fortra',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'react']
  },
  {
    id: 'testing-library',
    name: 'Testing Library',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'react', 'angular']
  },
  {
    id: 'unit-testing',
    name: 'Unit testing',
    proficiency: 'proficient',
    yearsOfExperience: 5,
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality']
  },
  {
    id: 'vitest',
    name: 'Vitest',
    proficiency: 'proficient',
    yearsOfExperience: 1,
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'svelte']
  },
  {
    id: 'expressjs',
    name: 'Express.js',
    proficiency: 'emerging',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    proficiency: 'competent',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    proficiency: 'emerging',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'mysql',
    name: 'MySQL',
    proficiency: 'competent',
    yearsOfExperience: 2,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    proficiency: 'competent',
    yearsOfExperience: 2,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis', 'platform-delivery']
  },
  {
    id: 'oauth-jwt',
    name: 'OAuth / JWT',
    proficiency: 'competent',
    yearsOfExperience: 1,
    notes: 'Including AWS Cognito-backed flows in product work',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'openapi-swagger',
    name: 'OpenAPI / Swagger',
    proficiency: 'competent',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    proficiency: 'competent',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'rest',
    name: 'REST',
    proficiency: 'fluent',
    yearsOfExperience: 16,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis', 'web-fundamentals']
  },
  {
    id: 'sailsjs',
    name: 'Sails.js',
    proficiency: 'emerging',
    yearsOfExperience: 1,
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'aws',
    name: 'AWS (EC2, DynamoDB, Cognito)',
    proficiency: 'competent',
    yearsOfExperience: 2,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'data-apis']
  },
  {
    id: 'cicd-pipelines',
    name: 'CI/CD pipelines',
    proficiency: 'proficient',
    yearsOfExperience: 5,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    proficiency: 'proficient',
    yearsOfExperience: 1,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'svelte']
  },
  {
    id: 'docker',
    name: 'Docker',
    proficiency: 'proficient',
    yearsOfExperience: 2,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'git',
    name: 'Git',
    proficiency: 'proficient',
    yearsOfExperience: 13,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'collaboration']
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    proficiency: 'emerging',
    yearsOfExperience: 1,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'gitlab-cicd',
    name: 'GitLab CI/CD',
    proficiency: 'competent',
    yearsOfExperience: 3,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    proficiency: 'competent',
    yearsOfExperience: 5,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'vite',
    name: 'Vite',
    proficiency: 'proficient',
    yearsOfExperience: 1,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'svelte', 'react']
  },
  {
    id: 'webpack',
    name: 'Webpack',
    proficiency: 'competent',
    yearsOfExperience: 2,
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'wrangler',
    name: 'Wrangler',
    proficiency: 'proficient',
    yearsOfExperience: 1,
    notes: 'Cloudflare Workers deploy and local dev for this site',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'svelte']
  },
  {
    id: 'ai-component-apis',
    name: 'AI-compatible component APIs',
    proficiency: 'fluent',
    yearsOfExperience: 1,
    notes: 'Component libraries with guardrails for reliable AI coding agent output',
    categoryId: 'ai-assisted-development',
    stackIds: ['ai-assisted', 'design-accessibility']
  },
  {
    id: 'multi-model-workflows',
    name: 'Multi-model workflows',
    proficiency: 'competent',
    yearsOfExperience: 1,
    notes: 'Selecting and adapting models for different task types within a single project',
    categoryId: 'ai-assisted-development',
    stackIds: ['ai-assisted']
  },
  {
    id: 'agile-scrum',
    name: 'Agile / Scrum',
    proficiency: 'fluent',
    yearsOfExperience: 16,
    categoryId: 'collaboration-process',
    stackIds: ['collaboration']
  },
  {
    id: 'atlassian-suite',
    name: 'Atlassian suite (Jira, Confluence)',
    proficiency: 'proficient',
    yearsOfExperience: 16,
    categoryId: 'collaboration-process',
    stackIds: ['collaboration']
  }
];

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
    barWidthPercent: (meta.level / MAX_PROFICIENCY_LEVEL) * 100
  };
};

const sortRecordsByCategoryAndName = (records: SkillRecord[]): SkillRecord[] => {
  const categoryOrder = new Map(SKILL_CATEGORIES.map((category, index) => [category.id, index]));
  return [...records].sort((a, b) => {
    const categoryDiff = (categoryOrder.get(a.categoryId) ?? 99) - (categoryOrder.get(b.categoryId) ?? 99);
    if (categoryDiff !== 0) {
      return categoryDiff;
    }
    return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
  });
};

const recordToSkill = (record: SkillRecord): Skill => ({
  name: record.name,
  proficiency: record.proficiency,
  notes: record.notes
});

const stackNameById = (id: SkillStackId): string => SKILL_STACKS.find((stack) => stack.id === id)?.name ?? id;

const categoryNameById = (id: SkillCategoryId): string =>
  SKILL_CATEGORIES.find((category) => category.id === id)?.name ?? id;

/**
 * Returns metadata for each proficiency tier shown on the resume skills chart.
 */
export const getProficiencyLevels = (): Promise<ProficiencyLevel[]> =>
  Promise.resolve(
    (['emerging', 'competent', 'proficient', 'fluent'] as const).map((proficiency) => toProficiencyLevel(proficiency))
  );

/**
 * Resolves display metadata for a single proficiency key.
 * @param proficiency - Tier key from a skill entry
 */
export const getProficiencyLevel = (proficiency: Proficiency): ProficiencyLevel => toProficiencyLevel(proficiency);

/**
 * Returns category metadata in datasource order.
 */
export const getSkillCategories = (): Promise<readonly SkillCategoryMeta[]> => Promise.resolve(SKILL_CATEGORIES);

/**
 * Returns tech stack metadata in datasource order.
 */
export const getSkillStacks = (): Promise<readonly SkillStackMeta[]> => Promise.resolve(SKILL_STACKS);

/**
 * Returns the flat skill datasource (primary export for AI and resume grouping).
 */
export const getSkillRecords = (): Promise<SkillRecord[]> =>
  Promise.resolve(sortRecordsByCategoryAndName(skillRecords));

/**
 * Groups flat records by category for legacy consumers.
 * @remarks Prefer getSkillRecords() plus skills-presentation grouping in the resume UI.
 */
export const getSkills = (): Promise<SkillCategory[]> =>
  getSkillRecords().then((records) =>
    SKILL_CATEGORIES.map((category) => ({
      name: category.name,
      skills: records
        .filter((record) => record.categoryId === category.id)
        .map(recordToSkill)
        .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
    })).filter((category) => category.skills.length > 0)
  );

/**
 * Plain-text skills block for system prompts: one line per skill with category and stack tags.
 */
export const formatSkillsForPrompt = (records: SkillRecord[]): string => {
  const lines: string[] = ['## Skills'];
  let currentCategory: SkillCategoryId | null = null;

  for (const record of records) {
    if (record.categoryId !== currentCategory) {
      currentCategory = record.categoryId;
      lines.push(`### ${categoryNameById(record.categoryId)}`);
    }
    const stacks = record.stackIds.map(stackNameById).join(', ');
    lines.push(`- **${record.name}**: [${record.proficiency}] | years=${record.yearsOfExperience} | stacks: ${stacks}`);
    if (record.notes !== undefined && record.notes.trim() !== '') {
      lines.push(`  - ${record.notes}`);
    }
  }

  return lines.join('\n');
};
