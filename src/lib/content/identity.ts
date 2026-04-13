// $lib/content/identity.ts
// Content domain: professional identity, differentiators, and working philosophy.

export type Differentiator = {
	headline: string;
	detail: string;
};

export type Identity = {
	name: string;
	role: string;
	location: string;
	contact: {
		email: string;
		linkedin: string;
		dribbble: string;
	};
	yearsExperience: number;
	summary: string;
	differentiators: Differentiator[];
	personalFacts: string[];
};

const data: Identity = {
	name: 'Benjamin Thompson',
	role: 'Senior Software Engineer — Front-End Architecture, Component Systems, UI/UX',
	location: 'Boerne, TX 78006',
	contact: {
		email: 'ben@cxii.us',
		linkedin: 'linkedin.com/in/cxiius',
		dribbble: 'dribbble.com/cxiius'
	},
	yearsExperience: 20,
	summary:
		'Senior front-end engineer and UI/UX designer with over two decades of experience building accessible, responsive, and secure enterprise-grade web applications. Work sits at the intersection of engineering rigor and design sensibility — architecting component systems that encode brand and accessibility standards structurally, rather than relying on convention or documentation alone.',
	differentiators: [
		{
			headline: 'Component systems that enforce consistency structurally',
			detail:
				'Designs component libraries where correct usage is the path of least resistance — making it structurally difficult to produce inconsistent, inaccessible, or off-brand output, regardless of who or what is writing the implementation.'
		},
		{
			headline: 'Equal fluency in design and engineering',
			detail:
				"Operates effectively as a sole contributor across the full product surface: UX planning, visual design, component architecture, and production code. Can own an entire product's UI end-to-end or embed within a cross-functional team as the bridge between design intent and engineering execution."
		},
		{
			headline: 'AI-native development patterns',
			detail:
				'Has directly architected component systems designed to serve both human developers and AI coding agents — establishing guardrails that preserve code integrity, accessibility standards, and design fidelity at scale in multi-model, AI-assisted development environments.'
		},
		{
			headline: 'Enterprise complexity, made navigable',
			detail:
				'Specialises in making data-intensive, technically complex tools feel accessible and intuitive — particularly in cybersecurity and SaaS contexts where practitioners need clarity under pressure.'
		}
	],
	personalFacts: ['US Coast Guard Reserve veteran (2008–2016)', "1st Degree Black Belt, Tracy's Kenpo"]
};

export const getIdentity = (): Promise<Identity> => Promise.resolve(data);
