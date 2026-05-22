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
  'collaboration'
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

const MAX_PROFICIENCY_LEVEL = 5;

const proficiencyMap: Record<Proficiency, { level: number; name: string; description: string; avatar: string; avatarDescription: string; color: string }> = {
  none: {
    level: 1,
    name: 'No Experience',
    avatar: '',
    description: 'No practical experience.',
    avatarDescription: '',
    color: 'gray'
  },
  emerging: {
    level: 2,
    name: 'Emerging',
    avatar: 'zombie',
    description: 'Limited hands-on experience or not recently used; can ramp up quickly.',
    avatarDescription: 'Will beat and claw their way to devour the subject.',
    color: 'red'
  },
  competent: {
    level: 3,
    name: 'Competent',
    description: 'Working knowledge or used sparingly in the last few years; can contribute meaningfully with occasional reference to documentation.',
    avatar: 'pirate',
    avatarDescription: "Capable of getting the job done through brute force and lots of sneering -- doesn't always know why something works... probably voodoo.",
    color: 'yellow'
  },
  proficient: {
    level: 4,
    name: 'Proficient',
    description: 'Strong working knowledge or used regularly in the last few years; comfortable owning implementation independently.',
    avatar: 'cowboy',
    avatarDescription: 'Never afraid to jump in and take command, using their vast know-how to easily adapt to unfamiliar territory and unexpected challenges.',
    color: 'blue'
  },
  fluent: {
    level: 5,
    name: 'Fluent',
    description: 'Extensive practical experience across multiple projects; primary working tool.',
    avatar: 'ninja',
    avatarDescription: 'Mastery is not a goal to be achieved, but a journey to be embarked upon; always seeking to improve and grow.',
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
  { id: 'collaboration', name: 'Collaboration' }
] as const;

const skillRecords: SkillRecord[] = [
  {
    id: 'css',
    name: 'CSS',
    proficiency: 'proficient',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals', 'design-accessibility']
  },
  {
    id: 'html',
    name: 'HTML',
    proficiency: 'fluent',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    proficiency: 'proficient',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'php',
    name: 'PHP',
    proficiency: 'competent',
    notes: 'Primary use in freelance era (2010-2013); less recent',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'python',
    name: 'Python',
    proficiency: 'emerging',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'sass-scss',
    name: 'Sass/SCSS',
    proficiency: 'fluent',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals', 'design-accessibility']
  },
  {
    id: 'semantic-html-aria',
    name: 'Semantic HTML / ARIA',
    proficiency: 'proficient',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals', 'design-accessibility']
  },
  {
    id: 'sql',
    name: 'SQL',
    proficiency: 'emerging',
    categoryId: 'languages-markup',
    stackIds: ['data-apis']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    proficiency: 'fluent',
    categoryId: 'languages-markup',
    stackIds: ['web-fundamentals', 'angular', 'react', 'svelte']
  },
  {
    id: 'angular',
    name: 'Angular',
    proficiency: 'fluent',
    notes: 'Primary framework across two long-term enterprise engagements; up to Angular 21',
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  },
  {
    id: 'angular-material',
    name: 'Angular Material',
    proficiency: 'fluent',
    categoryId: 'frameworks-libraries',
    stackIds: ['angular', 'design-accessibility']
  },
  {
    id: 'nx',
    name: 'Nx',
    proficiency: 'proficient',
    notes: 'Monorepo management in enterprise Angular contexts',
    categoryId: 'frameworks-libraries',
    stackIds: ['angular', 'platform-delivery']
  },
  {
    id: 'primeng',
    name: 'PrimeNG',
    proficiency: 'fluent',
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  },
  {
    id: 'rxjs',
    name: 'RxJS',
    proficiency: 'proficient',
    notes: 'Used extensively in Angular contexts',
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  },
  {
    id: 'svelte',
    name: 'Svelte',
    proficiency: 'proficient',
    notes: 'Primary stack for this portfolio and recent PWA work',
    categoryId: 'frameworks-libraries',
    stackIds: ['svelte']
  },
  {
    id: 'sveltekit',
    name: 'SvelteKit',
    proficiency: 'proficient',
    categoryId: 'frameworks-libraries',
    stackIds: ['svelte']
  },
  {
    id: 'dexie',
    name: 'Dexie',
    proficiency: 'competent',
    categoryId: 'frameworks-libraries',
    stackIds: ['svelte', 'data-apis']
  },
  {
    id: 'indexeddb',
    name: 'IndexedDB',
    proficiency: 'competent',
    categoryId: 'frameworks-libraries',
    stackIds: ['svelte', 'data-apis']
  },
  {
    id: 'supabase',
    name: 'Supabase',
    proficiency: 'competent',
    categoryId: 'frameworks-libraries',
    stackIds: ['svelte', 'data-apis']
  },
  {
    id: 'jquery',
    name: 'jQuery',
    proficiency: 'competent',
    notes: 'Deep historical use; superseded by modern frameworks in current work',
    categoryId: 'frameworks-libraries',
    stackIds: ['web-fundamentals', 'react']
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    proficiency: 'emerging',
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'qwik',
    name: 'Qwik',
    proficiency: 'emerging',
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'react',
    name: 'React',
    proficiency: 'proficient',
    notes: 'Used extensively at Fortra and in component library work',
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'react-hook-form',
    name: 'React Hook Form',
    proficiency: 'competent',
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'react-router',
    name: 'React Router',
    proficiency: 'competent',
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'tanstack-query',
    name: 'TanStack Query',
    proficiency: 'competent',
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    proficiency: 'competent',
    categoryId: 'frameworks-libraries',
    stackIds: ['web-fundamentals']
  },
  {
    id: 'zod',
    name: 'Zod',
    proficiency: 'proficient',
    categoryId: 'frameworks-libraries',
    stackIds: ['react', 'angular', 'svelte']
  },
  {
    id: 'zustand',
    name: 'Zustand',
    proficiency: 'competent',
    categoryId: 'frameworks-libraries',
    stackIds: ['react']
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    proficiency: 'competent',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'component-library-architecture',
    name: 'Component library architecture',
    proficiency: 'fluent',
    notes: 'Opinionated, accessible, AI-compatible component systems',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility', 'angular', 'react']
  },
  {
    id: 'design-systems',
    name: 'Design systems',
    proficiency: 'fluent',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'figma',
    name: 'Figma',
    proficiency: 'competent',
    notes: 'Design-to-code workflows; product design and prototyping',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'mui',
    name: 'Material UI (MUI)',
    proficiency: 'proficient',
    categoryId: 'ui-and-design',
    stackIds: ['react', 'design-accessibility']
  },
  {
    id: 'responsive-design',
    name: 'Responsive design',
    proficiency: 'fluent',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility', 'web-fundamentals']
  },
  {
    id: 'storybook',
    name: 'Storybook',
    proficiency: 'competent',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility', 'angular', 'react']
  },
  {
    id: 'tailwindcss',
    name: 'TailwindCSS',
    proficiency: 'fluent',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility', 'svelte', 'react', 'angular']
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX design',
    proficiency: 'fluent',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'wcag-accessibility',
    name: 'WCAG accessibility',
    proficiency: 'proficient',
    categoryId: 'ui-and-design',
    stackIds: ['design-accessibility']
  },
  {
    id: 'code-review',
    name: 'Code review',
    proficiency: 'proficient',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'collaboration']
  },
  {
    id: 'jest',
    name: 'Jest',
    proficiency: 'proficient',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'react', 'angular']
  },
  {
    id: 'karma',
    name: 'Karma',
    proficiency: 'proficient',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'angular']
  },
  {
    id: 'msw',
    name: 'Mock Service Worker (MSW)',
    proficiency: 'competent',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'react']
  },
  {
    id: 'playwright',
    name: 'Playwright',
    proficiency: 'competent',
    notes: 'E2E testing in React product contexts at Fortra',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'react']
  },
  {
    id: 'testing-library',
    name: 'Testing Library',
    proficiency: 'proficient',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'react', 'angular']
  },
  {
    id: 'unit-testing',
    name: 'Unit testing',
    proficiency: 'proficient',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality']
  },
  {
    id: 'vitest',
    name: 'Vitest',
    proficiency: 'proficient',
    categoryId: 'testing-and-qa',
    stackIds: ['testing-quality', 'svelte']
  },
  {
    id: 'expressjs',
    name: 'Express.js',
    proficiency: 'emerging',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    proficiency: 'competent',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    proficiency: 'emerging',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'mysql',
    name: 'MySQL',
    proficiency: 'competent',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    proficiency: 'competent',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis', 'platform-delivery']
  },
  {
    id: 'oauth-jwt',
    name: 'OAuth / JWT',
    proficiency: 'competent',
    notes: 'Including AWS Cognito-backed flows in product work',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'openapi-swagger',
    name: 'OpenAPI / Swagger',
    proficiency: 'competent',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    proficiency: 'competent',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'rest',
    name: 'REST',
    proficiency: 'fluent',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis', 'web-fundamentals']
  },
  {
    id: 'sailsjs',
    name: 'Sails.js',
    proficiency: 'emerging',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'serverless',
    name: 'Serverless',
    proficiency: 'emerging',
    categoryId: 'backend-apis-data',
    stackIds: ['platform-delivery', 'svelte']
  },
  {
    id: 'sqlite',
    name: 'SQLite',
    proficiency: 'competent',
    categoryId: 'backend-apis-data',
    stackIds: ['data-apis']
  },
  {
    id: 'aws',
    name: 'AWS (EC2, DynamoDB, Cognito)',
    proficiency: 'competent',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'data-apis']
  },
  {
    id: 'cicd-pipelines',
    name: 'CI/CD pipelines',
    proficiency: 'proficient',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    proficiency: 'proficient',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'svelte']
  },
  {
    id: 'docker',
    name: 'Docker',
    proficiency: 'proficient',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'git',
    name: 'Git',
    proficiency: 'proficient',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'collaboration']
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    proficiency: 'emerging',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'gitlab-cicd',
    name: 'GitLab CI/CD',
    proficiency: 'competent',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'jenkins',
    name: 'Jenkins',
    proficiency: 'competent',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'vite',
    name: 'Vite',
    proficiency: 'proficient',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'svelte', 'react']
  },
  {
    id: 'webpack',
    name: 'Webpack',
    proficiency: 'competent',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery']
  },
  {
    id: 'wrangler',
    name: 'Wrangler',
    proficiency: 'proficient',
    notes: 'Cloudflare Workers deploy and local dev for this site',
    categoryId: 'tooling-cloud-delivery',
    stackIds: ['platform-delivery', 'svelte']
  },
  {
    id: 'ai-component-apis',
    name: 'AI-compatible component APIs',
    proficiency: 'fluent',
    notes: 'Component libraries with guardrails for reliable AI coding agent output',
    categoryId: 'ai-assisted-development',
    stackIds: ['ai-assisted', 'design-accessibility']
  },
  {
    id: 'multi-model-workflows',
    name: 'Multi-model workflows',
    proficiency: 'fluent',
    notes: 'Selecting and adapting models for different task types within a single project',
    categoryId: 'ai-assisted-development',
    stackIds: ['ai-assisted']
  },
  {
    id: 'agile-scrum',
    name: 'Agile / Scrum',
    proficiency: 'fluent',
    categoryId: 'collaboration-process',
    stackIds: ['collaboration']
  },
  {
    id: 'atlassian-suite',
    name: 'Atlassian suite (Jira, Confluence)',
    proficiency: 'proficient',
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

const categoryNameById = (id: SkillCategoryId): string => SKILL_CATEGORIES.find((category) => category.id === id)?.name ?? id;

/**
 * Returns metadata for each proficiency tier shown on the resume skills chart.
 */
export const getProficiencyLevels = (): Promise<ProficiencyLevel[]> =>
  Promise.resolve((['emerging', 'competent', 'proficient', 'fluent'] as const).map((proficiency) => toProficiencyLevel(proficiency)));

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
export const getSkillRecords = (): Promise<SkillRecord[]> => Promise.resolve(sortRecordsByCategoryAndName(skillRecords));

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
    lines.push(`- **${record.name}**: [${record.proficiency}] | stacks: ${stacks}`);
    if (record.notes !== undefined && record.notes.trim() !== '') {
      lines.push(`  - ${record.notes}`);
    }
  }

  return lines.join('\n');
};
