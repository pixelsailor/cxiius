// $lib/content/design-portfolio.ts
// Content domain: design portfolio (distinct from product/tool projects in projects.ts).

import { circaYearFromString } from '$lib/utils/circa-year';

export const DESIGN_PORTFOLIO_PROJECT_TYPES = ['branding', 'illustration', 'ui'] as const;

export type DesignPortfolioProjectType = (typeof DESIGN_PORTFOLIO_PROJECT_TYPES)[number];

/** Image asset for portfolio UI. Use meaningful `alt` when the image conveys information; `''` is allowed for decorative repeats. */
export type DesignPortfolioImage = {
	src: string;
	alt: string;
};

export type DesignPortfolioEntry = {
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
	/** If true, this entry wins the hero slot over default "most recent by circa" logic. */
	featuredAsHero?: boolean;
};

const data: DesignPortfolioEntry[] = [
	{
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
		circa: '2000',
		technologies: ['HTML', 'CSS', 'JavaScript', 'ColdFusion', 'Adobe Photoshop', 'Adobe Illustrator'],
		summary: 'Website design for the University of Colorado Book Store.',
		description:
			'Consulted with the University of Colorado on campus bookstore to evaluate the then current website and provided recommendations for improvement. Was hired afterward to redesign the website focusing on improving the user experience by providing a more intuitive and informative experience. The website was built using the existing ColdFusion platform and designed using Adobe Photoshop.'
	},
	{
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
		circa: '2006',
		technologies: ['HTML', 'CSS', 'Adobe Photoshop', 'Adobe Illustrator'],
		summary: 'Corporate website for MOD Systems.',
		description:
			"One of my first projects after joining MOD Systems was to redesign the company website -- taking it from a basic \"about us\" page to a more modern, informative, and engaging experience. The new website featured a clean, modern design with a focus on showcasing the company's products and services offering a central location for customers to learn more about the company and its services. It included a new logo, color scheme, and typography, as well as a new set of icons and illustrations to help convey the company's brand and values. The website was built using HTML, CSS, and JavaScript, and was hosted on the company's own servers."
	},
	{
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
		technologies: ['HTML', 'CSS', 'Sass', 'TypeScript', 'AngularJS', 'Angular Material', 'Webpack', 'Jasmine', 'Python', 'Django'],
		summary: 'UI design for Frontline VM.',
		description:
			"Developed as a complete overhaul of Digital Defense's flagship SaaS vulnerability management platform, Version 6 was built from the ground up with a modern technology stack and was designed to be more user-friendly and intuitive. The new version included a new informative UI, more effecient workflows, and a focus on accessibility and security."
	},
	{
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
		circa: '2000',
		technologies: ['UI/UX design', 'Interaction design', 'Brand design', 'Corporate web development', 'Adobe Photoshop'],
		summary: 'UI design for the MetaWallet and MetaFund services.',
		description:
			'MetaWallet/MetaFund began as a service to send and receive money to and from other users. Initially offered as a pilot program in Bolivia focused on mobile payments well before smartphones, PayPal, or Venmo made such transactions mainstream, it was designed for cheap, keypad-based mobile devices commonly found in developing countries. The idea grew from simple mobile-to-mobile transfers to a full-featured digital wallet that went beyond simple transfers to include charitable giving, user-to-user transfers, and loaning of physical assets.'
	},
	{
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

export const getDesignPortfolio = (): Promise<DesignPortfolioEntry[]> => Promise.resolve([...data].sort((a, b) => circaYearFromString(b.circa) - circaYearFromString(a.circa)));
