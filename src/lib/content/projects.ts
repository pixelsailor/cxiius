/**
 * @fileoverview Unified project and design-portfolio content: on-site case studies and AI-only product narratives.
 * @module lib/content/projects
 */
import { circaYearFromString } from '$lib/utils/circa-year';

export const DESIGN_PORTFOLIO_PROJECT_TYPES = ['branding', 'illustration', 'ui'] as const;

export type DesignPortfolioProjectType = (typeof DESIGN_PORTFOLIO_PROJECT_TYPES)[number];

/** Image asset for portfolio UI. Use meaningful alt when the image conveys information; empty string is allowed for decorative repeats. */
export type DesignPortfolioImage = {
	src: string;
	alt: string;
};

/**
 * On-site design portfolio case study. Requires full image sets for grid and detail pages.
 * includeInPortfolio is a literal for discriminated unions with NonPortfolioProjectEntry.
 */
export type DesignPortfolioEntry = {
	/** When true, entry appears on /portfolio and in portfolio-only getters. */
	includeInPortfolio: true;
	/** Human-authored lifecycle or publication status; migrated portfolio rows use the default Shipped. */
	status: string;
	slug: string;
	name: string;
	projectType: DesignPortfolioProjectType;
	images: {
		thumbnail: DesignPortfolioImage;
		full: DesignPortfolioImage;
		hero?: DesignPortfolioImage;
		/** Extra images for the portfolio entry detail page only (not the index grid). */
		showcase?: DesignPortfolioImage[];
	};
	/**
	 * Human-readable timeframe; for sorting, use a leading four-digit year (e.g. "2024" or "2024 - Q2").
	 * See circaYearFromString in circa-year util (leading year parse).
	 */
	circa: string;
	technologies: string[];
	summary: string;
	description: string;
	liveUrl?: string;
	/** If true, this entry wins the hero slot over default most recent by circa logic. */
	featuredAsHero?: boolean;
};

/** Optional image bundle for non-portfolio entries; slots are individually optional. */
export type NonPortfolioProjectImages = {
	thumbnail?: DesignPortfolioImage;
	full?: DesignPortfolioImage;
	hero?: DesignPortfolioImage;
	showcase?: DesignPortfolioImage[];
};

/**
 * Product/tool narrative for AI and future off-portfolio use. Omits full portfolio image requirements;
 * projectType is optional (not a design case-study label).
 */
export type NonPortfolioProjectEntry = {
	includeInPortfolio: false;
	slug: string;
	name: string;
	status: string;
	projectType?: DesignPortfolioProjectType;
	/** Optional; used only for prompt or future context, not for portfolio sort. */
	circa?: string;
	images?: NonPortfolioProjectImages;
	summary: string;
	context: string;
	selectionAndFreshness: string[];
	dataAndSync: string[];
	assistant: string[];
	authorNotes: string[];
	roadmap: string[];
	techStack: string[];
	links: {
		publicSite?: string;
		repository?: string;
	};
};

/** All records in the projects domain. */
export type ProjectContentEntry = DesignPortfolioEntry | NonPortfolioProjectEntry;

const portfolioData: DesignPortfolioEntry[] = [
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'chateau-cinq-logo',
		name: 'Chateau Cinq logo',
		projectType: 'branding',
		images: {
			thumbnail: {
				src: '/images/chateaucinq_logo-thumb.webp',
				alt: 'A stylized illustration of grapes on the vine over a leaf with the text "Le Chateau Cinq" in a stylized font.'
			},
			full: { src: '/images/chateaucinq_logo-933.webp', alt: 'A stylized illustration of grapes on the vine over a leaf with the text "Le Chateau Cinq" in a stylized font.' }
		},
		circa: '2001',
		technologies: ['Identity', 'Typography', 'Color systems', 'Logo design', 'Branding', 'Adobe Illustrator'],
		summary: 'Logo design for a fictional wine estate.',
		description:
			'Logo construction, paired type, and a restrained palette built for print and web alike. Created for a fictional wine estate as part of a project for Sessions.edu.'
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'cubs-website',
		name: 'University of Colorado Book Store website',
		projectType: 'ui',
		images: {
			thumbnail: { src: '/images/cubs_home-thumb.webp', alt: 'A screenshot of the University of Colorado Book Store website homepage.' },
			full: { src: '/images/cubs_home-933.webp', alt: 'A screenshot of the University of Colorado Book Store website homepage.' },
			hero: { src: '/images/cubs_home-hero.webp', alt: 'A screenshot of the University of Colorado Book Store website homepage.' },
			showcase: [
				{ src: '/images/cubs_grad-933.webp', alt: 'A screenshot of the University of Colorado Book Store website graduation page.' },
				{ src: '/images/cubs_item-933.webp', alt: 'A screenshot of the University of Colorado Book Store website item detail page.' }
			]
		},
		circa: '2005',
		technologies: ['HTML', 'CSS', 'JavaScript', 'ColdFusion', 'Adobe Photoshop', 'Adobe Illustrator'],
		summary: 'Website design for the University of Colorado Book Store.',
		description:
			'Consulted with the University of Colorado on campus bookstore to evaluate the then current website and provided recommendations for improvement. Was hired afterward to redesign the website focusing on improving the user experience by providing a more intuitive and informative experience. The website was built using the existing ColdFusion platform and designed using Adobe Photoshop.'
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'gp-city-illustration',
		name: 'Greenplay ecosystem illustration',
		projectType: 'illustration',
		images: {
			thumbnail: {
				src: '/images/gp_city-thumb.webp',
				alt: 'A stylized isometric illustration of a city showing SD cards in use at different locations and with different devices.'
			},
			full: { src: '/images/gp_city-933.webp', alt: 'A stylized isometric illustration of a city showing SD cards in use at different locations and with different devices.' }
		},
		circa: '2007',
		technologies: ['Vector', 'Adobe Illustrator', 'Adobe Photoshop'],
		summary: 'Marketing campaign illustrations for the Greenplay ecosystem.',
		description: 'Marketing campaign illustrations for the Greenplay ecosystem.'
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'greenplay-player-ui',
		name: 'Greenplay player UI',
		projectType: 'ui',
		images: {
			thumbnail: {
				src: '/images/gemini_episodes-thumb.webp',
				alt: 'A screenshot of the Greenplay player UI showing a list of episodes for the show "It\'s Always Sunny in Philadelphia."'
			},
			full: {
				src: '/images/gemini_livingroom-933.webp',
				alt: 'A modern living room with Swedish style wood furniture and a large TV with the Greenplayer movie ribbon on the screen.'
			},
			hero: {
				src: '/images/gemini_livingroom-hero.webp',
				alt: 'A modern living room with Swedish style wood furniture and a large TV with the Greenplayer movie ribbon on the screen.'
			},
			showcase: [
				{ src: '/images/gemini_home-933.webp', alt: 'A screenshot of the Greenplay player UI showing the movie selection ribbon on the home screen.' },
				{
					src: '/images/gemini_moviedetail-933.webp',
					alt: 'A screenshot of the Greenplay player UI showing the detail screen for the movie "Gamer," with the movie title, description, and rating.'
				}
			]
		},
		featuredAsHero: true,
		circa: '2007',
		technologies: ['Adobe Photoshop', 'Adobe Illustrator'],
		summary: 'UI design for Greenplay Greenplayer.',
		description:
			'The Greenplayer was a streaming media player that was used in the Greenplay ecosystem. Developed by MOD Systems in a time when Netflix only mailed physical DVDs, the Greenplayer was an attempt to bring movie rentals purchased from brick and mortar retailers into the digital age.'
	},
	// {
	// 	slug: 'greenplay-corporate-ui',
	// 	name: 'Greenplay corporate UI',
	// 	projectType: 'ui',
	// 	images: {
	// 		thumbnail: { src: '/images/gpweb2-thumb.webp', alt: 'A screenshot of the Greenplay marketing website homepage.' },
	// 		hero: { src: '/images/gpweb2-hero.webp', alt: 'A screenshot of the Greenplay marketing website homepage featuring a rendering of a Greenplay branded set-top box.' },
	// 		full: { src: '/images/gpweb2.webp', alt: '' }
	// 	},
	// 	circa: '2007',
	// 	technologies: ['UI/UX design', 'Interaction design', 'Brand design', 'Corporate web development'],
	// 	summary: 'Marketing website design for Greenplay.',
	// 	description: "Original design concept for Greenplay's marketing website.",
	// 	featuredAsHero: true
	// },
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'bedrock-wordpress-theme',
		name: 'Bedrock WordPress theme',
		projectType: 'ui',
		images: {
			thumbnail: {
				src: '/images/bedrock_showcase-thumb.webp',
				alt: 'A photo of a small black car with the ocean in the background during sunset. The text, "The slide header" is superimposed on the image.'
			},
			full: {
				src: '/images/bedrock_showcase-933.webp',
				alt: 'A screenshot of the "Showcase" template from the Bedrock WordPress theme showing a photo of a small black car with the ocean in the background during sunset and an descriptive excerpt of the article underneath. A list of popular posts is shown in an aside column on the right.'
			},
			showcase: [
				{
					src: '/images/bedrock_posts-933.webp',
					alt: 'A screenshot of the "Archive" template from the Bedrock WordPress theme showing a list of posts with their titles and excerpts.'
				}
			]
		},
		circa: '2012',
		technologies: ['WordPress', 'PHP', 'HTML', 'CSS', 'JavaScript'],
		summary: 'Bedrock WordPress theme.',
		description:
			'Bedrock was a small personal project intended to be a foundational piece for extending WordPress themes. It was minimalistic and focused on performance and accessibility featuring common elements that were frequently missing from other themes.'
	},
	// {
	// 	slug: 'extelligence-logo',
	// 	name: 'Extelligence logo',
	// 	projectType: 'branding',
	// 	images: {
	// 		thumbnail: { src: '/images/extelligence_logo-thumb.webp', alt: 'The Extelligence wordmark.' },
	// 		full: { src: 'https://placehold.co/1600x900/101018/55ee77/png?text=Full+Branding', alt: '' }
	// 	},
	// 	circa: '2012',
	// 	technologies: ['Identity', 'Typography', 'Color systems', 'Logo design', 'Branding', 'Adobe Illustrator'],
	// 	summary: 'Logo design for Extelligence.',
	// 	description: 'Logo design for Extelligence.'
	// },
	// {
	// 	slug: 'extelligence-website',
	// 	name: 'Extelligence website',
	// 	projectType: 'ui',
	// 	images: {
	// 		thumbnail: { src: '/images/extelligence_cm-thumb.webp', alt: 'A screenshot of the Extelligence website homepage.' },
	// 		full: { src: 'https://placehold.co/1600x900/101018/55ee77/png?text=Full+UI', alt: '' }
	// 	},
	// 	circa: '2012',
	// 	technologies: ['WordPress', 'HTML', 'CSS', 'JavaScript', 'Adobe Photoshop'],
	// 	summary: 'Corporate marketing website for Extelligence.',
	// 	description: 'Corporate marketing website for Extelligence.'
	// },
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'media-management-system',
		name: 'MOD Media Management System',
		projectType: 'ui',
		images: {
			thumbnail: {
				src: '/images/mms_campaignart-thumb.webp',
				alt: 'A screenshot of the Media Management System demonstrating selecting artwork for an in-store marketing campaign.'
			},
			full: { src: '/images/mms_addart-933.webp', alt: 'A screenshot of the Media Management System demonstrating selecting artwork for an in-store marketing campaign.' },
			hero: { src: '/images/mms_campaignart-hero.webp', alt: 'A screenshot of the Media Management System demonstrating selecting artwork for an in-store marketing campaign.' },
			showcase: [
				{ src: '/images/mms_alerts-933.webp', alt: 'A screenshot of the Media Management System showing alert notifications.' },
				{ src: '/images/mms_analytics-933.webp', alt: 'A screenshot of the Media Management System showing active users.' },
				{ src: '/images/mms_editregions-933.webp', alt: 'A screenshot of the Media Management System showing the United States with western states highlighted.' }
			]
		},
		circa: '2007',
		technologies: ['Adobe Photoshop', 'HTML', 'CSS', 'JavaScript'],
		summary: "UI for MOD Systems' Media Management System.",
		description:
			"The MOD Media Management System was a conceptual, web-based application for managing media content for in-store marketing campaigns. It was designed to complement a client's physical media kiosk system in stores as well as integrate with overhead digital signage systems. Client's could manage campaigns not only for single stores, but customizable regions or even the entire country. The MMS enabled in-store marketing campaigns to be managed from a central location, allowing for real-time updates and adjustments throughout all stores and included powerful options for managing artwork, playlists, and other media content. Workflows were deliberately designed to be easy to understand and use for everyone from the average sales associate to campaign managers and executives."
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'mod-systems-website',
		name: 'MOD Systems website',
		projectType: 'ui',
		images: {
			thumbnail: { src: '/images/modcom_products-thumb.webp', alt: 'A screenshot of the MOD Systems website products page showing a small kiosk screen with headphones and a CD.' },
			full: { src: '/images/modcom_home-933.webp', alt: 'A screenshot of the MOD Systems website products page showing a small kiosk screen with headphones and a CD.' },
			showcase: [
				{
					src: '/images/modcom_merch-933.webp',
					alt: 'A screenshot of the MOD Systems website "merchandise" page describing the company\'s kiosk and media server with photos of each.'
				},
				{ src: '/images/modcom_endpoints-933.webp', alt: 'A screenshot of the MOD Systems website "endpoints" page highlighting digital and physical media devices.' }
			]
		},
		circa: '2008',
		technologies: ['HTML', 'CSS', 'Adobe Photoshop', 'Adobe Illustrator'],
		summary: 'Corporate website for MOD Systems.',
		description:
			"Built and maintained the MOD Systems corporate website. The site featured a clean, modern design with a focus on showcasing the company's products and services offering a central location for customers to learn more about the company and its services. It included a new logo, color scheme, and typography, as well as a new set of icons and illustrations to help convey the company's brand and values. The website was built using HTML, CSS, and JavaScript, and was hosted on the company's own servers."
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'frontline-vulnerability-manager',
		name: 'Frontline Vulnerability Manager',
		projectType: 'ui',
		images: {
			thumbnail: {
				src: '/images/fvm_av-thumb.webp',
				alt: 'A screenshot of the Frontline Vulnerability Manager Active View screen showing various graphs and charts displaying vulnerability data.'
			},
			full: { src: '/images/fvm_macbook-933.webp', alt: 'A screenshot of the Frontline Vulnerability Manager showing a list network assets with vulnerabilities.' },
			hero: {
				src: '/images/fvm_av-hero.webp',
				alt: 'A screenshot of the Frontline Vulnerability Manager Active View screen showing various graphs and charts displaying vulnerability data.'
			},
			showcase: [
				{ src: '/images/fvm_dashboard-933.webp', alt: 'A screenshot of the Frontline Vulnerability Manager showing application dashboard.' },
				{ src: '/images/fvm_assets-933.webp', alt: 'A screenshot of the Frontline Vulnerability Manager showing a list network assets with vulnerabilities.' },
				{ src: '/images/fvm_theme-933.webp', alt: 'A screenshot of the Frontline Vulnerability Manager showing the screen for creating a custom theme.' }
			]
		},
		circa: '2013',
		technologies: ['HTML', 'CSS', 'Sass', 'TypeScript', 'AngularJS', 'Bootstrap', 'Webpack', 'Jasmine', 'Python', 'Django'],
		summary: 'UI design for Frontline VM.',
		description:
			"Developed as a complete overhaul of Digital Defense's flagship SaaS vulnerability management platform, Version 6 was built from the ground up with a modern technology stack and was designed to be more user-friendly and intuitive. The new version included a new informative UI, more effecient workflows, and a focus on accessibility and security."
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'electronique-logo',
		name: 'Electronique Services & Consulting logo',
		projectType: 'branding',
		images: {
			thumbnail: { src: '/images/electronique_logo-thumb.webp', alt: 'The Electronique Services & Consulting logo with a large stylized letter "Q" in the center.' },
			full: { src: '/images/electronique_logo-933.webp', alt: 'The Electronique Services & Consulting logo with a large stylized letter "Q" in the center.' }
		},
		circa: '2000',
		technologies: ['Identity', 'Typography', 'Color systems', 'Logo design', 'Branding', 'Adobe Illustrator'],
		summary: 'Logo design for Electronique Services & Consulting.',
		description: 'Logo design for Electronique Services & Consulting.'
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'metawallet-website',
		name: 'MetaWallet website',
		projectType: 'ui',
		images: {
			thumbnail: { src: '/images/mw_home-thumb.webp', alt: 'A screenshot of the MetaWallet website homepage.' },
			full: { src: '/images/mw_home-933.webp', alt: 'A screenshot of the MetaWallet website homepage.' },
			hero: { src: '/images/mw_home-hero.webp', alt: 'A screenshot of the MetaWallet website homepage.' },
			showcase: [
				{ src: '/images/mw_funddetails-933.webp', alt: 'A screenshot of the MetaWallet website funding details page.' },
				{ src: '/images/mw_publiclibrary-933.webp', alt: "A screenshot of the MetaWallet website public library page showing the user's collection of music available to borrow." }
			]
		},
		circa: '2007 - Q3',
		technologies: ['UI/UX design', 'Interaction design', 'Brand design', 'Corporate web development', 'Adobe Photoshop'],
		summary: 'UI design for the MetaWallet and MetaFund services.',
		description:
			'MetaWallet/MetaFund began as a service to send and receive money to and from other users. Initially offered as a pilot program in Bolivia focused on mobile payments well before smartphones, PayPal, or Venmo made such transactions mainstream, it was designed for cheap, keypad-based mobile devices commonly found in developing countries. The idea grew from simple mobile-to-mobile transfers to a full-featured digital wallet that went beyond simple transfers to include charitable giving, user-to-user transfers, and loaning of physical assets.'
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'norge-familie-logo',
		name: 'Norge Familie logo',
		projectType: 'branding',
		images: {
			thumbnail: { src: '/images/nf_logo-thumb.webp', alt: 'The Norge Familie logo -- a simple depiction of a viking ship with bold lines and colors.' },
			full: { src: '/images/nf_logo-933.webp', alt: 'The Norge Familie logo -- a simple depiction of a viking ship with bold lines and colors.' },
			showcase: [{ src: '/images/nf_oldlogo-933.webp', alt: 'The original Norge Familie logo -- an intentionally crude depiction of a viking ship with rough lines.' }]
		},
		circa: '2024',
		technologies: ['Identity', 'Typography', 'Color systems', 'Logo design', 'Branding', 'Adobe Illustrator'],
		summary: 'Logo design for Norge Familie.',
		description:
			"Logo design for Norge Familie. The original logo was intentionally crude and designed to be a simple, bold representation of the company's Viking heritage. The new logo is a more refined, modern design that is more consistent with the company's brand identity."
	},
	{
		includeInPortfolio: true as const,
		status: 'Shipped',
		slug: 'profession-self-defense-logo',
		name: 'Profession Self Defense of Durango logo',
		projectType: 'branding',
		images: {
			thumbnail: {
				src: '/images/psdd_logo-thumb.webp',
				alt: 'The Profession Self Defense of Durango logo -- a mountain peak with a traditional Japanese Torii, or gate, in the center and Japanese characters on either side. The text "Profession Self Defense of Durango" surrounds the graphic in a circle.'
			},
			full: {
				src: '/images/psdd_logo-933.webp',
				alt: 'The Profession Self Defense of Durango logo -- a mountain peak with a traditional Japanese Torii, or gate, in the center and Japanese characters on either side. The text "Profession Self Defense of Durango" surrounds the graphic in a circle.'
			}
		},
		circa: '2003',
		technologies: ['Identity', 'Typography', 'Color systems', 'Logo design', 'Branding', 'Adobe Illustrator'],
		summary: 'Logo design for Profession Self Defense of Durango.',
		description: 'Logo design for Profession Self Defense of Durango.'
	}
];

const nonPortfolioData: NonPortfolioProjectEntry[] = [
	{
		includeInPortfolio: false,
		slug: 'cxiius',
		name: 'cxii.us',
		status: 'Live',
		summary:
			"Primary domain for all CXII-related work, currently serving as Benjamin Thompson's resume and portfolio while demonstrating modern frontend and platform engineering practices.",
		context:
			'Designed as more than a static resume site: cxii.us is a working product that showcases implementation decisions in real code, including structured content modeling and AI-assisted interaction patterns that surface richer context than traditional portfolio pages. Pages can be navigated without a traditional navigation bar by typing "/" followed by the desired page name.',
		selectionAndFreshness: [
			'Positions the site itself as a first-class project artifact rather than only a container for other work.',
			'Uses AI integration to provide contextual answers and narrative depth beyond conventional resume and portfolio layouts.',
			'Acts as the canonical public surface for CXII identity, portfolio, and experience content.'
		],
		dataAndSync: [
			'Content is maintained as typed TypeScript domains to keep data consistent across route rendering and assistant contexts.',
			'Runtime behavior is deployed on Cloudflare Workers for production hosting and edge execution.'
		],
		assistant: [
			'Anthropic SDK powers assistant capabilities that expand how visitors can explore experience, project context, and technical depth.',
			'AI interactions are treated as part of the product experience, not an afterthought layered on top of static content.'
		],
		authorNotes: ['The current live site is both a professional profile and an implementation-level demonstration of practical SvelteKit and Cloudflare delivery patterns.'],
		roadmap: ['Continue evolving cxii.us as the primary CXII platform with deeper AI-assisted discovery and ongoing content expansion.'],
		techStack: ['Svelte', 'SvelteKit', 'Cloudflare Workers', 'Anthropic SDK', 'CSS', 'Vite', 'Vitest', 'Zod', 'bits-ui'],
		links: {}
	},
	{
		includeInPortfolio: false,
		slug: 'whats-for-dinner',
		name: "What's For Dinner",
		status: 'Active development - private beta planned next',
		summary:
			'A Svelte 5 / SvelteKit web app with offline support that helps pick a meal from a personal recipe collection. Suggestions weigh time of day and how often each recipe is prepared, surfacing favorites while also bringing forward dishes that have not been cooked in a while so the rotation stays interesting.',
		context:
			'Built as a solo side project for day-to-day household cooking: the goal is to reduce decision fatigue when choosing what to cook, using the recipes you already trust rather than generic lists. Long-term intent is to offer it more broadly - a public web experience and a companion Ionic app - after proving the workflow in real daily use.',
		selectionAndFreshness: [
			"Meal ideas are chosen from the user's own library - not a generic catalog.",
			'Selection factors in time of day and preparation frequency so suggestions match the moment and avoid repetitive loops.',
			'The experience balances familiar favorites with recipes that have gone unstaged for a while, to keep meals from feeling stale.'
		],
		dataAndSync: [
			'Offline-first: core recipes remain available without a network connection.',
			'Dexie powers local database storage in the browser.',
			'Supabase provides authentication and cloud backup so recipes can sync across devices and be shared with others.'
		],
		assistant: [
			'A built-in assistant suggests new recipes and helps edit existing ones in place.',
			'Users can attach dietary and method preferences when asking for ideas - for example gluten-free, vegan, or avoiding specific techniques such as sous vide.',
			'AI-assisted changes apply directly in the recipe text - including substitutions and on-the-fly edits - rather than only returning a separate suggestion block.'
		],
		authorNotes: ['Developed solo as a personal tool used almost daily for recipe ideas and for working through practical kitchen constraints as the main cook at home.'],
		roadmap: ['Near term: private beta before a wider release.', 'Longer term: ship as a public site and as an Ionic app for mobile.'],
		techStack: ['Svelte 5', 'SvelteKit', 'Dexie', 'Supabase', 'Progressive Web App / offline-capable web'],
		links: {}
	}
];

/**
 * Merged list in stable order: all portfolio records (same order as the legacy design-portfolio seed array), then non-portfolio rows.
 * @see getDesignPortfolio for on-site portfolio sort.
 */
const allProjectRecords: ProjectContentEntry[] = [...portfolioData, ...nonPortfolioData];

/**
 * Returns every project record (portfolio and non-portfolio) for AI and site-wide use.
 * Order: portfolio seed order, then non-portfolio entries.
 * @returns All entries; non-portfolio rows are included for system prompt and future consumers.
 */
export function getProjects(): Promise<ProjectContentEntry[]> {
	return Promise.resolve(allProjectRecords);
}

/**
 * Portfolio-only list for /portfolio routes: includeInPortfolio is true, sorted by leading circa year descending.
 * @returns Sorted case studies with full image requirements.
 */
export function getDesignPortfolio(): Promise<DesignPortfolioEntry[]> {
	const only = allProjectRecords.filter((e): e is DesignPortfolioEntry => e.includeInPortfolio === true);
	return Promise.resolve([...only].sort((a, b) => circaYearFromString(b.circa) - circaYearFromString(a.circa)));
}
