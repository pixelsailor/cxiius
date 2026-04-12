// $lib/content/skills.ts
// Content domain: technical proficiencies, categorised by area.
//
// Proficiency scale:
//   fluent     — primary working tools; used daily or near-daily across multiple projects
//   proficient — solid working knowledge; used regularly, comfortable owning implementation
//   familiar   — working knowledge; can contribute meaningfully, may reference docs

export type Proficiency = 'fluent' | 'proficient' | 'familiar'

export type Skill = {
  name: string
  proficiency: Proficiency
  notes?: string
}

export type SkillCategory = {
  name: string
  skills: Skill[]
}

const data: SkillCategory[] = [
  {
    name: 'Languages & Markup',
    skills: [
      { name: 'HTML', proficiency: 'fluent' },
      { name: 'CSS', proficiency: 'fluent' },
      { name: 'SASS / SCSS', proficiency: 'fluent' },
      { name: 'JavaScript', proficiency: 'fluent' },
      { name: 'TypeScript', proficiency: 'fluent' },
      { name: 'PHP', proficiency: 'proficient', notes: 'Primary use in freelance era (2010–2013); less recent' },
    ],
  },
  {
    name: 'Frameworks & Libraries',
    skills: [
      { name: 'Angular', proficiency: 'fluent', notes: 'Primary framework across two long-term enterprise engagements; up to Angular 21' },
      { name: 'React', proficiency: 'fluent', notes: 'Used extensively at Fortra/DDI and in component library work' },
      { name: 'SvelteKit', proficiency: 'proficient' },
      { name: 'SolidJS', proficiency: 'familiar' },
      { name: 'Qwik', proficiency: 'familiar' },
      { name: 'Web Components', proficiency: 'proficient' },
      { name: 'TailwindCSS', proficiency: 'proficient' },
      { name: 'Bootstrap', proficiency: 'fluent' },
      { name: 'Material UI', proficiency: 'proficient' },
      { name: 'RxJS', proficiency: 'proficient', notes: 'Used extensively in Angular contexts' },
      { name: 'jQuery', proficiency: 'fluent', notes: 'Deep historical use; superseded by modern frameworks in current work' },
      { name: 'WordPress', proficiency: 'proficient' },
    ],
  },
  {
    name: 'Component Systems & Design',
    skills: [
      { name: 'Component library architecture', proficiency: 'fluent', notes: 'Core specialisation — design and implementation of opinionated, accessible, AI-compatible component systems' },
      { name: 'Design systems', proficiency: 'fluent' },
      { name: 'Storybook', proficiency: 'proficient' },
      { name: 'Figma', proficiency: 'fluent', notes: 'Design-to-code workflows; also used for product design and prototyping' },
      { name: 'UI/UX design', proficiency: 'fluent' },
      { name: 'Accessibility (WCAG)', proficiency: 'proficient' },
      { name: 'Responsive design', proficiency: 'fluent' },
    ],
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
      { name: 'Component testing', proficiency: 'proficient' },
    ],
  },
  {
    name: 'Build Tools & Toolchain',
    skills: [
      { name: 'Vite', proficiency: 'proficient' },
      { name: 'Webpack', proficiency: 'proficient' },
      { name: 'Rollup', proficiency: 'familiar' },
      { name: 'Nx', proficiency: 'proficient', notes: 'Used for monorepo management in enterprise Angular contexts' },
    ],
  },
  {
    name: 'Backend & APIs',
    skills: [
      { name: 'Node.js', proficiency: 'proficient' },
      { name: 'Next.js', proficiency: 'proficient' },
      { name: 'Express.js', proficiency: 'proficient' },
      { name: 'Sails.js', proficiency: 'familiar' },
      { name: 'REST', proficiency: 'fluent' },
      { name: 'GraphQL', proficiency: 'proficient' },
    ],
  },
  {
    name: 'Databases',
    skills: [
      { name: 'MySQL', proficiency: 'proficient' },
      { name: 'NoSQL', proficiency: 'familiar' },
      { name: 'IndexedDB', proficiency: 'familiar' },
    ],
  },
  {
    name: 'DevOps & Cloud',
    skills: [
      { name: 'Docker', proficiency: 'proficient' },
      { name: 'AWS (EC2, DynamoDB, Cognito)', proficiency: 'familiar' },
      { name: 'Cloudflare', proficiency: 'proficient' },
      { name: 'CI/CD pipelines', proficiency: 'proficient' },
      { name: 'Jenkins', proficiency: 'familiar' },
    ],
  },
  {
    name: 'AI-Assisted Development',
    skills: [
      { name: 'Cursor', proficiency: 'fluent', notes: 'Primary AI development environment at LevelBlue; also personal tooling' },
      { name: 'Multi-model workflows', proficiency: 'fluent', notes: 'Selecting and adapting models for different task types within a single project' },
      { name: 'AI-compatible component API design', proficiency: 'fluent', notes: 'Designing component libraries with guardrails that produce reliable output from AI coding agents' },
    ],
  },
  {
    name: 'Collaboration & Process',
    skills: [
      { name: 'Git', proficiency: 'fluent' },
      { name: 'GitHub', proficiency: 'fluent' },
      { name: 'GitLab', proficiency: 'proficient' },
      { name: 'Figma (collaboration)', proficiency: 'fluent' },
      { name: 'Atlassian suite (Jira, Confluence)', proficiency: 'proficient' },
      { name: 'Notion', proficiency: 'proficient' },
      { name: 'Agile / Scrum', proficiency: 'proficient' },
      { name: 'Kanban', proficiency: 'proficient' },
    ],
  },
]

export const getSkills = (): Promise<SkillCategory[]> => Promise.resolve(data)
