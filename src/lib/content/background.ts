// $lib/content/background.ts
// Content domain: broad personal background for "about me" style responses.

export type MilitaryService = {
	rank: string;
	rate: string;
	branch: string;
	regions: string[];
	startDate: string;
	endDate: string;
	summary: string;
	highlights: string[];
};

export type MartialArt = {
	style: string;
	rank: string;
	school: string;
	region: string;
	earnedDate: string;
};

export type InstructorRole = {
	title: string;
	organisation: string;
	region: string;
	startDate: string;
	endDate: string;
	summary: string;
};

export type Interest = {
	name: string;
	notes: string;
};

export type FavoriteList = {
	books: string[];
	bands: string[];
	movies: string[];
	sportsTeams: string[];
};

export type WorkStyle = {
	traits: string[];
	nonNegotiables: string[];
	influences: string[];
	philosophy: string;
};

export type VoiceProfile = {
	defaultTone: string;
	styleNotes: string[];
};

export type Background = {
	military: MilitaryService;
	martialArts: MartialArt[];
	instructorRoles: InstructorRole[];
	interests: Interest[];
	favorites: FavoriteList;
	workStyle: WorkStyle;
	voice: VoiceProfile;
};

const data: Background = {
	military: {
		rank: 'Petty Officer 3rd Class',
		rate: "Boatswain's Mate",
		branch: 'US Coast Guard Reserve',
		regions: ['Pacific Northwest', 'Texas Gulf Coast'],
		startDate: '2008',
		endDate: '2016',
		summary: 'Served eight years in the US Coast Guard Reserve as small boat crew and boarding team member.',
		highlights: [
			"Completed USCG 'A' School in 2009",
			'Earned the Navigation Rules Ace Award',
			'Trained in search and rescue fundamentals',
			'Handled crew safety, navigation lookout duties, and maintenance of vessels, equipment, safety devices, and firearms'
		]
	},
	martialArts: [
		{
			style: "Tracy's Kenpo",
			rank: '1st Degree Black Belt',
			school: 'Professional Self Defense',
			region: 'Southwest Colorado',
			earnedDate: '2003'
		}
	],
	instructorRoles: [
		{
			title: 'Assistant Karate Instructor',
			organisation: 'Sanchin Karate',
			region: 'South Central Texas',
			startDate: '2011',
			endDate: '2013',
			summary:
				'Led warm-ups for youth after-school programs and adult classes, then coached students one-on-one during group training to improve form and technique.'
		},
		{
			title: 'Snowboard Instructor',
			organisation: 'Eldora Mountain Resort',
			region: 'Colorado Front Range',
			startDate: '1999',
			endDate: '2001',
			summary:
				'Taught private and group lessons for students from children to older adults, adapting coaching style and riding methods to each learner.'
		},
		{
			title: 'Snowboard Instructor',
			organisation: 'Purgatory Resort',
			region: 'Southwest Colorado',
			startDate: '2001',
			endDate: '2003',
			summary:
				'Taught private and group lessons while continuing to refine adaptive coaching techniques for a broad range of student needs and abilities.'
		}
	],
	interests: [
		{
			name: 'Snowboarding',
			notes:
				'Started in 1989 and rode at least one day every season for 20 years. Known as a go-to instructor for half-pipe and terrain park coaching.'
		},
		{
			name: 'LEGO',
			notes: 'Provides a hands-on creative outlet in contrast to screen-heavy work.'
		},
		{
			name: 'PC gaming',
			notes:
				'Supports creative problem-solving and systems thinking, including exploring alternatives beyond the default or most popular path.'
		},
		{
			name: 'Landscape and astrophotography',
			notes:
				'Enjoys capturing natural scenes and night skies, especially in remote mountain settings.'
		},
		{
			name: 'Camping and overlanding',
			notes: 'Prefers remote mountain trips and open natural spaces away from urban noise.'
		}
	],
	favorites: {
		books: [
			'The Hunt for Red October',
			'Tom Clancy classics',
			"The Hitchhiker's Guide to the Galaxy series",
			'Dune series',
			'The Murderbot Diaries'
		],
		bands: [
			'311',
			'Coheed and Cambria',
			'The Dear Hunter',
			'Royal Blood',
			'Muse',
			'Two Door Cinema Club',
			'Mellowdrone',
			'Portugal. The Man'
		],
		movies: ['Back to the Future', 'Anchorman', 'Dune', 'Elf', 'Grave of the Fireflies', 'Snatch', 'Three Amigos'],
		sportsTeams: ['Denver Broncos', 'Colorado Avalanche', 'Denver Nuggets', 'Los Angeles Dodgers']
	},
	workStyle: {
		traits: ['Adaptable', 'High standards', 'Clear communication', 'Team-first mindset'],
		nonNegotiables: [
			'Documentation is essential',
			'Real usability testing is required',
			'Consistency in design matters',
			'Do not sacrifice production quality for speed'
		],
		influences: [
			'Snowboard instruction shaped a mentoring-oriented leadership style',
			'Gaming and LEGO reinforced creative problem-solving and iterative system improvement'
		],
		philosophy:
			'Great products come from collaboration and diverse perspectives. Applications should adapt to users rather than forcing users to adapt to rigid systems. Interfaces should be approachable, and testing should cover both intended and edge-case behaviors across design and development.'
	},
	voice: {
		defaultTone: 'Conversational and personal, with professional clarity',
		styleNotes: ['Charming when appropriate', 'Use dry wit lightly', 'Stay direct, respectful, and practical']
	}
};

export const getBackground = (): Promise<Background> => Promise.resolve(data);
