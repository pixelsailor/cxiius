// $lib/content/design-portfolio.ts
// Content domain: design portfolio (distinct from product/tool projects in projects.ts).

export const DESIGN_PORTFOLIO_PROJECT_TYPES = ['branding', 'illustration', 'ui'] as const;

export type DesignPortfolioProjectType = (typeof DESIGN_PORTFOLIO_PROJECT_TYPES)[number];

export type DesignPortfolioEntry = {
	slug: string;
	name: string;
	projectType: DesignPortfolioProjectType;
	images: { thumbnail: string; hero: string; full: string };
	/**
	 * Human-readable timeframe; for sorting, use a leading four-digit year (e.g. "2024" or "2024 - Q2").
	 * See circaYearFromString in portfolio load (leading year parse).
	 */
	circa: string;
	technologies: string[];
	summary: string;
	description: string;
	liveUrl?: string;
	/** If true, this entry wins the hero slot over default "most recent by circa" logic. */
	featuredAsHero?: boolean;
};

const data: DesignPortfolioEntry[] = [
	{
		slug: 'aurora-brand-refresh',
		name: 'Aurora brand refresh',
		projectType: 'branding',
		images: {
			thumbnail: 'https://placehold.co/480x320/12121c/39ff14/png?text=Thumb+Branding',
			hero: 'https://placehold.co/1200x640/12121c/39ff14/png?text=Hero+Branding',
			full: 'https://placehold.co/1600x900/12121c/39ff14/png?text=Full+Branding'
		},
		circa: '2021 - brand system',
		technologies: ['Identity', 'Typography', 'Color systems'],
		summary: 'Modular identity kit for a regional product studio.',
		description: 'Logo construction, paired type, and a restrained neon-on-dark palette built for glass UI shells and print alike.'
	},
	{
		slug: 'circuit-console-ui',
		name: 'Circuit console UI',
		projectType: 'ui',
		images: {
			thumbnail: 'https://placehold.co/480x320/0a0a12/7cff6a/png?text=Thumb+UI',
			hero: 'https://placehold.co/1200x640/0a0a12/7cff6a/png?text=Hero+UI',
			full: 'https://placehold.co/1600x900/0a0a12/7cff6a/png?text=Full+UI'
		},
		circa: '2024 - product UI',
		technologies: ['Svelte', 'Design tokens', 'A11y patterns'],
		summary: 'Dense operator console layout with glass panels and neon accents.',
		description: 'Responsive shell for status-heavy workflows: sticky region headers, keyboard-first focus order, and motion kept behind reduced-motion preferences.'
	},
	{
		slug: 'signal-illustration-pack',
		name: 'Signal illustration pack',
		projectType: 'illustration',
		images: {
			thumbnail: 'https://placehold.co/480x320/151528/44ff99/png?text=Thumb+Illustration',
			hero: 'https://placehold.co/1200x640/151528/44ff99/png?text=Hero+Illustration',
			full: 'https://placehold.co/1600x900/151528/44ff99/png?text=Full+Illustration'
		},
		circa: '2023 - editorial',
		technologies: ['Vector', 'Texture', 'Spot art'],
		summary: 'Spot illustrations for onboarding and empty states.',
		description: 'A coherent family of marks that reads at small sizes and pairs with the glass UI without fighting the grid.',
		featuredAsHero: true
	},
	{
		slug: 'ledger-mobile-chrome',
		name: 'Ledger mobile chrome',
		projectType: 'ui',
		images: {
			thumbnail: 'https://placehold.co/480x320/101018/55ee77/png?text=Thumb+Mobile',
			hero: 'https://placehold.co/1200x640/101018/55ee77/png?text=Hero+Mobile',
			full: 'https://placehold.co/1600x900/101018/55ee77/png?text=Full+Mobile'
		},
		circa: '2020 - mobile shell',
		technologies: ['iOS patterns', 'Android', 'Motion specs'],
		summary: 'Navigation and surfaces for a finance companion app.',
		description: 'Chrome-level patterns only: tab bar, sheets, and headers that stay readable on OLED blacks with minimal glow.'
	}
];

export const getDesignPortfolio = (): Promise<DesignPortfolioEntry[]> => Promise.resolve(data);
