// $lib/content/experience.ts
// Content domain: professional work history.

export type TechTag = string

export type ExperienceEntry = {
  title: string
  company: string
  formerlyKnownAs?: string
  location: string
  employmentType: 'full-time' | 'contract' | 'freelance'
  startDate: string
  endDate: string | 'present'
  context: string
  contributions: string[]
  outcomes: string
  tech: TechTag[]
}

const data: ExperienceEntry[] = [
  {
    title: 'Lead UI Developer',
    company: 'LevelBlue',
    location: 'Dallas, TX (Remote / Contract)',
    employmentType: 'contract',
    startDate: '2025-07',
    endDate: '2026-04',
    context:
      'LevelBlue is a cybersecurity company. Embedded within a contracted strike team — three developers and one UI designer — brought in to rescue a product that had been stalled in development for over a year. The mandate was to deliver a fully functional application within a six-month window.',
    contributions: [
      'Owned all interface design for the rescued product end-to-end.',
      'Architected an opinionated Angular 21 component library that enforced design system compliance by construction — making it structurally difficult to produce inconsistent or off-brand output. The library codified decisions around color, typography, spacing, and interaction patterns, eliminating ad-hoc variation at the component level.',
      'Designed the component library\'s API and consumption patterns to serve both human developers and AI coding agents equally — establishing guardrails that preserved code integrity, accessibility standards, and design fidelity regardless of who (or what) was writing the implementation.',
      'The team adopted Cursor as the primary AI development environment, selecting and adapting different underlying models for different task types. The component library\'s opinionated structure became the foundation for reliable AI-assisted output at scale.',
      'This approach compressed feature delivery from months to weeks while maintaining enterprise-grade quality standards.',
    ],
    outcomes:
      'Delivered a previously stalled application within the contracted six-month window. Established a component architecture capable of supporting multi-model, AI-assisted development without sacrificing consistency or accessibility.',
    tech: [
      'Angular 21',
      'TypeScript',
      'Component library architecture',
      'Design systems',
      'Cursor',
      'AI-assisted development',
      'Multi-model workflows',
    ],
  },
  {
    title: 'Senior Software Engineer',
    company: 'Fortra',
    formerlyKnownAs: 'Digital Defense, Inc. (DDI)',
    location: 'Eden Prairie, MN (Remote)',
    employmentType: 'full-time',
    startDate: '2013-05',
    endDate: '2025-01',
    context:
      'Joined Digital Defense Inc. as one of only two frontend developers tasked with re-engineering Frontline — DDI\'s flagship SaaS vulnerability management platform and primary revenue stream — from the ground up on Angular 1.x. Frontline aggregates, visualises, and helps security teams act on large volumes of vulnerability scan data. DDI was later acquired by Fortra.',
    contributions: [
      'Served as primary UI/UX designer for the Frontline Vulnerability Management platform — responsible for making a data-intensive, technically complex security tool feel accessible and intuitive to practitioners.',
      'Championed responsive design for Frontline at a time when the idea was pushed back on internally. Persisted in advocating for it; it was ultimately adopted and became a standout highlight when demoing the product to clients.',
      'Designed and developed internal Angular and React component libraries used across Frontline and other internal web applications.',
      'Worked independently to design, prototype, and deliver proof-of-concept applications and MVPs for new internal revenue streams.',
      'Post-acquisition: joined the UX Implementation team translating Figma designs into production-quality code, then moved to a focused strike team as the primary frontend developer for new features and application development.',
      'Continued to own significant frontend architecture decisions and component library maintenance throughout both eras.',
    ],
    outcomes:
      'Contributed to a product that earned top analyst recognition — accolades from Gartner and Frost & Sullivan, SC Magazine "Best Buy" designation specifically noting ease of use — and was a key factor in Fortra\'s acquisition of DDI. Delivered 11+ years of continuous, high-quality frontend work across multiple product lines and organisational transitions.',
    tech: [
      'Angular',
      'React',
      'TypeScript',
      'JavaScript',
      'SASS/SCSS',
      'Component libraries',
      'Figma-to-code',
      'SaaS product development',
      'Storybook',
      'Jest',
      'Testing Library',
    ],
  },
  {
    title: 'Web Designer and Developer',
    company: 'Independent Contractor',
    location: 'San Antonio, TX',
    employmentType: 'freelance',
    startDate: '2010-11',
    endDate: '2013-04',
    context:
      'Operated as a sole proprietor offering full-cycle web design and development services to small businesses and nonprofits.',
    contributions: [
      'Managed complete project lifecycles independently: client discovery, requirements gathering, UX planning, visual design, responsive front-end development, deployment, and ongoing maintenance.',
      'Designed and developed custom WordPress themes and bespoke content management systems tailored to each client\'s operational needs.',
      'Designed branding and marketing materials including logos, business cards, and promotional assets.',
      'Communicated technical concepts clearly to non-technical clients, providing creative direction alongside practical guidance.',
    ],
    outcomes:
      'Delivered end-to-end web presence and CMS solutions for a range of small business and nonprofit clients, including the University of Colorado Bookstore, Extelligence Internet Services, and several independent organisations.',
    tech: [
      'WordPress',
      'PHP',
      'HTML',
      'CSS',
      'JavaScript',
      'jQuery',
      'Custom CMS development',
      'E-commerce',
      'Responsive design',
      'Branding',
    ],
  },
  {
    title: 'Principal UI/UX Designer',
    company: 'MOD Systems',
    location: 'Seattle, WA',
    employmentType: 'full-time',
    startDate: '2006-02',
    endDate: '2010-04',
    context:
      'MOD Systems was a media-on-demand platform provider building infrastructure to bridge the gap between physical and digital media — enabling retail stores to sell digital content before streaming made that model obsolete. The core product was an in-store kiosk system letting customers browse, sample, and burn albums or custom playlists to CD. Served as the sole designer for the entire company.',
    contributions: [
      'Designed the complete user experience for MOD\'s platform across three device form factors: in-store touchscreen kiosks, mobile devices, and set-top boxes.',
      'MOD in-store kiosk UI: interface for browsing, sampling, and purchasing or burning music in retail environments — deployed in partner stores including Starbucks HEAR Music, Best Buy, Blockbuster, Hollywood Video, and Circuit City.',
      'MOD mobile music player: UI for MOD\'s mobile playback application.',
      'GreenPlay set-top box UI: interface for a streaming television and movie platform that completed a limited hardware trial.',
      'MetaWallet: designed a virtual wallet platform enabling charitable giving, user-to-user transfers, and loaning of physical assets — ran a pilot program in Bolivia focused on mobile payments well before smartphones, PayPal, or Venmo made such transactions mainstream.',
      'Produced design concepts and final specifications used in sales presentations that secured digital movie rights from major studios and network television networks.',
      'Directed contract design teams and managed external creative resources.',
      'Created all company marketing materials: investor presentations, advertising assets, business cards, and brand materials.',
    ],
    outcomes:
      'Sole creative force behind a platform that shipped across major national retail partners. Design work directly contributed to enterprise sales and content rights negotiations. Multiple products moved from concept to real-world deployment. The company wound down as the industry shifted away from physical media entirely.',
    tech: [
      'UI/UX design',
      'Interaction design',
      'Brand design',
      'Corporate web development',
      'Presentation design',
      'Cross-device design (kiosk, mobile, set-top box)',
    ],
  },
  {
    title: 'Art Department Coordinator & Production Assistant',
    company: 'Directory Plus',
    location: 'Durango, CO',
    employmentType: 'full-time',
    startDate: '2002-02',
    endDate: '2004-05',
    context:
      'Directory Plus produced printed Yellow Pages directories for businesses across the southwestern United States.',
    contributions: [
      'Designed custom print advertisements for hundreds of clients across southwestern Colorado and New Mexico.',
      'Managed the design team\'s day-to-day operations: delegating tasks, tracking schedules, and maintaining quality standards.',
      'Assisted in final production: paginating books and preparing press-ready files for submission to the printer.',
      'Worked directly with clients on custom ad requests, translating specifications into finished print work.',
    ],
    outcomes:
      'Maintained production quality and schedule across a high-volume regional print directory operation.',
    tech: [
      'Print design',
      'Production management',
      'Client services',
    ],
  },
]

export const getExperience = (): Promise<ExperienceEntry[]> => Promise.resolve(data)
