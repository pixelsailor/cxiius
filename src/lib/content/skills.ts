// $lib/content/skills.ts
// Content domain: technical proficiencies, categorised by area.
//
// Proficiency scale:
//   fluent - primary working tools; used daily or near-daily across multiple projects
//   proficient - solid working knowledge; used regularly, comfortable owning implementation
//   familiar - working knowledge; can contribute meaningfully, may reference docs

export type Proficiency = 'fluent' | 'proficient' | 'familiar';

export type Skill = {
  name: string;
  proficiency: Proficiency;
  notes?: string;
};

export type SkillCategory = {
  name: string;
  skills: Skill[];
};

const data: SkillCategory[] = [
  {
    name: 'Languages & Markup',
    skills: [
      { name: 'HTML', proficiency: 'fluent' },
      { name: 'CSS', proficiency: 'fluent' },
      { name: 'Sass/SCSS', proficiency: 'fluent' },
      { name: 'JavaScript', proficiency: 'fluent' },
      { name: 'TypeScript', proficiency: 'fluent' },
      { name: 'PHP', proficiency: 'proficient', notes: 'Primary use in freelance era (2010-2013); less recent' },
      { name: 'XML', proficiency: 'familiar' },
      { name: 'JSON', proficiency: 'fluent' },
      { name: 'YAML', proficiency: 'familiar' },
      { name: 'Markdown', proficiency: 'fluent' },
    ]
  },
  {
    name: 'Frameworks & Libraries',
    skills: [
      { name: 'Angular', proficiency: 'fluent', notes: 'Primary framework across two long-term enterprise engagements; up to Angular 21' },
      { name: 'React', proficiency: 'proficient', notes: 'Used extensively at Fortra and in component library work' },
      { name: 'Svelte + SvelteKit', proficiency: 'proficient' },
      { name: 'SolidJS', proficiency: 'familiar' },
      { name: 'Qwik', proficiency: 'familiar' },
      { name: 'Astro', proficiency: 'familiar' },
      { name: 'Lit', proficiency: 'familiar' },
      { name: 'Web Components', proficiency: 'proficient' },
      { name: 'TailwindCSS', proficiency: 'fluent' },
      { name: 'Bootstrap', proficiency: 'proficient' },
      { name: 'Angular Material', proficiency: 'fluent' },
      { name: 'Material UI (MUI)', proficiency: 'proficient' },
      { name: 'PrimeNG', proficiency: 'proficient' },
      { name: 'Shadcn UI', proficiency: 'familiar' },
      { name: 'Semantic / Foundation UI', proficiency: 'familiar' },
      { name: 'RxJS', proficiency: 'proficient', notes: 'Used extensively in Angular contexts' },
      { name: 'jQuery', proficiency: 'proficient', notes: 'Deep historical use; superseded by modern frameworks in current work' },
      { name: 'WordPress', proficiency: 'proficient' }
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
      { name: 'Webpack', proficiency: 'familiar' },
      { name: 'Rollup', proficiency: 'familiar' },
      { name: 'Nx', proficiency: 'proficient', notes: 'Used for monorepo management in enterprise Angular contexts' },
      { name: 'PostCSS', proficiency: 'proficient' },
    ]
  },
  {
    name: 'Backend & APIs',
    skills: [
      { name: 'Node.js', proficiency: 'proficient' },
      { name: 'Next.js', proficiency: 'familiar' },
      { name: 'Express.js', proficiency: 'familiar' },
      { name: 'Sails.js', proficiency: 'familiar' },
      { name: 'REST', proficiency: 'fluent' },
      { name: 'GraphQL', proficiency: 'proficient' }
    ]
  },
  {
    name: 'Databases',
    skills: [
      { name: 'MySQL', proficiency: 'proficient' },
      { name: 'NoSQL', proficiency: 'familiar' },
      { name: 'IndexedDB', proficiency: 'familiar' },
      { name: 'SQL', proficiency: 'proficient' },
      { name: 'PostgreSQL', proficiency: 'familiar' },
      { name: 'SQLite', proficiency: 'familiar' },
      { name: 'MongoDB', proficiency: 'familiar' },
      { name: 'Supabase', proficiency: 'familiar' },
    ]
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      { name: 'Docker', proficiency: 'proficient' },
      { name: 'AWS (EC2, DynamoDB, Cognito)', proficiency: 'familiar' },
      { name: 'Cloudflare', proficiency: 'proficient' },
      { name: 'CI/CD pipelines', proficiency: 'proficient' },
      { name: 'Jenkins', proficiency: 'familiar' },
      { name: 'Git', proficiency: 'proficient' },
      { name: 'GitHub', proficiency: 'proficient' },
      { name: 'GitLab', proficiency: 'proficient' },
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
      { name: 'Copilot', proficiency: 'familiar', notes: 'Personal tooling' }
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
