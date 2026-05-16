// $lib/content/skills.ts
// Content domain: technical proficiencies, categorised by area.
//
// Proficiency scale:
//   1: No Experience - No practical experience.
//   2: Emerging - Limited hands-on experience; can ramp up quickly.
//   3: Competent - Working knowledge; can contribute meaningfully with occasional reference to documentation.
//   4: Proficient - Strong working knowledge; comfortable owning implementation independently.
//   5: Fluent - Primary working tool; extensive practical experience across multiple projects.

export type Proficiency = 'fluent' | 'proficient' | 'competent' | 'emerging' | 'none';

export type Skill = {
  name: string;
  proficiency: Proficiency;
  notes?: string;
};

export type SkillCategory = {
  name: string;
  skills: Skill[];
};

const proficiencyMap: Record<Proficiency, { level: number; name: string; description: string; avatar: string; avatar_description: string; color: string }> = {
  none: {
    level: 1,
    name: 'No Experience',
    avatar: '',
    description: 'No practical experience.',
    avatar_description: '',
    color: 'gray',
  },
  emerging: {
    level: 2,
    name: 'Emerging',
    avatar: 'zombie',
    description: 'Limited hands-on experience or not recently used; can ramp up quickly.',
    avatar_description: 'Will beat and claw their way to devour the subject',
    color: 'red',
  },
  competent: {
    level: 3,
    name: 'Competent',
    description: 'Working knowledge or used sparingly in the last few years; can contribute meaningfully with occasional reference to documentation.',
    avatar: 'pirate',
    avatar_description: 'Capable of getting the job done through brute force and lots of snearing -- doesn\'t always know why something works... probably voodoo.',
    color: 'yellow',
  },
  proficient: {
    level: 4,
    name: 'Proficient',
    description: 'Strong working knowledge or used regularly in the last few years; comfortable owning implementation independently.',
    avatar: 'cowbow',
    avatar_description: 'Never afraid to jump in and take command, using their vast know-how to easily adapt to unfamiliar territory and unexpected challenges.',
    color: 'blue',
  },
  fluent: {
    level: 5,
    name: 'Fluent',
    description: 'Extensive practical experience across multiple projects; primary working tool.',
    avatar: 'ninja',
    avatar_description: 'Mastery is not a goal to be achieved, but a journey to be embarked upon; always seeking to improve and grow.',
    color: 'green',
  },
} as const;

const data: SkillCategory[] = [
  {
    name: 'Languages & Markup',
    skills: [
      { name: 'HTML', proficiency: 'fluent' },
      { name: 'CSS', proficiency: 'fluent' },
      { name: 'Sass/SCSS', proficiency: 'fluent' },
      { name: 'JavaScript', proficiency: 'fluent' },
      { name: 'TypeScript', proficiency: 'fluent' },
      { name: 'PHP', proficiency: 'competent', notes: 'Primary use in freelance era (2010-2013); less recent' },
      { name: 'XML', proficiency: 'competent' },
      { name: 'JSON', proficiency: 'fluent' },
      { name: 'Python', proficiency: 'emerging' },
      { name: 'Node.js', proficiency: 'competent' },
    ]
  },
  {
    name: 'Frameworks & Libraries',
    skills: [
      { name: 'Angular', proficiency: 'fluent', notes: 'Primary framework across two long-term enterprise engagements; up to Angular 21' },
      { name: 'React', proficiency: 'proficient', notes: 'Used extensively at Fortra and in component library work' },
      { name: 'Svelte + SvelteKit', proficiency: 'proficient' },
      { name: 'Qwik', proficiency: 'competent' },
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
      { name: 'Storybook', proficiency: 'proficient' },
      { name: 'Figma', proficiency: 'proficient', notes: 'Design-to-code workflows; also used for product design and prototyping' },
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
      { name: 'MSW (Mock Service Worker)', proficiency: 'proficient' },
      { name: 'Unit testing', proficiency: 'proficient' },
      { name: 'Component testing', proficiency: 'proficient' }
    ]
  },
  {
    name: 'Build Tools & Toolchain',
    skills: [
      { name: 'npm', proficiency: 'proficient' },
      { name: 'yarn', proficiency: 'proficient' },
      { name: 'pnpm', proficiency: 'proficient' },
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
      { name: 'Next.js', proficiency: 'emerging' },
      { name: 'Express.js', proficiency: 'emerging' },
      { name: 'Sails.js', proficiency: 'emerging' },
      { name: 'REST', proficiency: 'fluent' },
      { name: 'GraphQL', proficiency: 'proficient' }
    ]
  },
  {
    name: 'Databases',
    skills: [
      { name: 'MySQL', proficiency: 'competent' },
      { name: 'GraphQL', proficiency: 'competent' },
      { name: 'IndexedDB', proficiency: 'competent' },
      { name: 'PostgreSQL', proficiency: 'competent' },
      { name: 'SQLite', proficiency: 'competent' },
      { name: 'MongoDB', proficiency: 'competent' },
      { name: 'Supabase', proficiency: 'competent' }
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
      { name: 'Figma (collaboration)', proficiency: 'proficient' },
      { name: 'Atlassian suite (Jira, Confluence)', proficiency: 'proficient' },
      { name: 'Notion', proficiency: 'proficient' },
      { name: 'Agile / Scrum', proficiency: 'fluent' },
      { name: 'Kanban', proficiency: 'proficient' }
    ]
  }
];

export const getSkills = (): Promise<SkillCategory[]> => Promise.resolve(data);
