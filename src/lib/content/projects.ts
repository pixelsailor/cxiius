// $lib/content/projects.ts
// Content domain: notable personal projects (products, tools, experiments).

export type ProjectEntry = {
  name: string
  status: string
  /** One-paragraph overview for pages and prompts */
  summary: string
  /** Problem space, audience intent, and motivation */
  context: string
  /** How the product decides what to suggest and how it stays “fresh” */
  selectionAndFreshness: string[]
  /** Local-first storage, sync, and collaboration */
  dataAndSync: string[]
  /** In-app AI: suggestions, edits, and guardrails */
  assistant: string[]
  /** Relationship of the author to the work — usage, ambition */
  authorNotes: string[]
  /** Near- and longer-term direction */
  roadmap: string[]
  techStack: string[]
  /** Public URLs when they exist; omit or leave empty until launch */
  links: {
    publicSite?: string
    repository?: string
  }
}

const data: ProjectEntry[] = [
  {
    name: "What's For Dinner",
    status: 'Active development — private beta planned next',
    summary:
      'A Svelte 5 / SvelteKit web app with offline support that helps pick a meal from a personal recipe collection. Suggestions weigh time of day and how often each recipe is prepared, surfacing favorites while also bringing forward dishes that have not been cooked in a while so the rotation stays interesting.',
    context:
      'Built as a solo side project for day-to-day household cooking: the goal is to reduce decision fatigue when choosing what to cook, using the recipes you already trust rather than generic lists. Long-term intent is to offer it more broadly — a public web experience and a companion Ionic app — after proving the workflow in real daily use.',
    selectionAndFreshness: [
      'Meal ideas are chosen from the user’s own library — not a generic catalog.',
      'Selection factors in time of day and preparation frequency so suggestions match the moment and avoid repetitive loops.',
      'The experience balances familiar favorites with recipes that have gone unstaged for a while, to keep meals from feeling stale.',
    ],
    dataAndSync: [
      'Offline-first: core recipes remain available without a network connection.',
      'Dexie powers local database storage in the browser.',
      'Supabase provides authentication and cloud backup so recipes can sync across devices and be shared with others.',
    ],
    assistant: [
      'A built-in assistant suggests new recipes and helps edit existing ones in place.',
      'Users can attach dietary and method preferences when asking for ideas — for example gluten-free, vegan, or avoiding specific techniques such as sous vide.',
      'AI-assisted changes apply directly in the recipe text — including substitutions and on-the-fly edits — rather than only returning a separate suggestion block.',
    ],
    authorNotes: [
      'Developed solo as a personal tool used almost daily for recipe ideas and for working through practical kitchen constraints as the main cook at home.',
    ],
    roadmap: [
      'Near term: private beta before a wider release.',
      'Longer term: ship as a public site and as an Ionic app for mobile.',
    ],
    techStack: [
      'Svelte 5',
      'SvelteKit',
      'Dexie',
      'Supabase',
      'Progressive Web App / offline-capable web',
    ],
    links: {},
  },
]

export const getProjects = (): Promise<ProjectEntry[]> => Promise.resolve(data)
