// $lib/content/experience.ts
// Content domain: professional work history.

export type TechTag = string;

export type ExperienceEntry = {
  title: string;
  company: string;
  formerlyKnownAs?: string;
  location: string;
  industry?: string;
  employmentType: 'full-time' | 'contract' | 'freelance';
  startDate: string;
  endDate: string | 'present';
  context: string;
  contributions: string[];
  outcomes: string;
  tech: TechTag[];
};

const data: ExperienceEntry[] = [
  {
    title: 'Lead UI Developer',
    company: 'LevelBlue',
    formerlyKnownAs: 'TrustWave',
    location: 'Dallas, TX (Remote / Contract)',
    industry: 'Cybersecurity',
    employmentType: 'contract',
    startDate: '2025-07',
    endDate: '2026-04',
    context:
      'Embedded within a contracted strike team - three developers and one UI designer - brought in to rescue a product that had been stalled in development for over a year. The mandate was to deliver a fully functional application within a six-month window.',
    contributions: [
      'Architected an opinionated Angular 21 component library that enforced design system compliance by construction - making it structurally difficult to produce inconsistent or off-brand output. The library codified decisions around color, typography, spacing, and interaction patterns, eliminating ad-hoc variation at the component level.',
      "Designed the component library's API and consumption patterns to serve both human developers and AI coding agents equally - establishing guardrails that preserved code integrity, accessibility standards, and design fidelity regardless of who (or what) was writing the implementation.",
      "The team adopted Cursor as the primary AI development environment, selecting and adapting different underlying models for different task types. The component library's opinionated structure became the foundation for reliable AI-assisted output at scale.",
      'This approach compressed feature delivery from months to weeks while maintaining enterprise-grade quality standards.'
    ],
    outcomes:
      'Delivered a previously stalled application within the contracted six-month window. Established a component architecture capable of supporting multi-model, AI-assisted development without sacrificing consistency or accessibility.',
    tech: ['Angular 21', 'TypeScript', 'Component library architecture', 'Design systems', 'Cursor', 'AI-assisted development', 'Multi-model workflows', 'Zod', 'PrimeNG', 'Multi-tenant architecture', 'Route guards', 'RBAC', 'RxJS']
  },
  {
    title: 'Senior Software Engineer',
    company: 'Fortra',
    formerlyKnownAs: 'HelpSystems',
    location: 'Eden Prairie, MN (Remote)',
    industry: 'Cybersecurity',
    employmentType: 'full-time',
    startDate: '2021-02',
    endDate: '2025-01',
    context: "Transitioned (after Fortra's acquisition of DDI) to a centralized UX engineering role supporting multiple product teams and front-end stacks.",
    contributions: [
      "Built the Angular implementation of Fortra's React-based design system, serving as the sole Angular specialist and enabling adoption of shared UI standards across non-React applications.",
      'Partnered with UX and engineering teams to implement Figma-driven designs in production, ensuring consistency between design and code across products.',
      'Acted as lead UI developer on React-based applications, contributing to feature delivery and aligning implementations with shared component and design system standards.',
      'Supported cross-team development through reusable patterns and component-driven architecture, improving consistency and reducing duplication across the portfolio.'
    ],
    outcomes: 'Enabled design system adoption across multiple frameworks and teams, supporting consistent UI delivery during post-acquisition integration and product expansion.',
    tech: [
      'Angular',
      'React',
      'TypeScript',
      'JavaScript',
      'SASS/SCSS',
      'React Router',
      'Zustand',
      'Tanstack Query',
      'React Hook Form',
      'Zod',
      'Component libraries',
      'Figma-to-code',
      'SaaS product development',
      'Storybook',
      'Jest',
      'Testing Library',
      'Material UI',
      'TailwindCSS',
      'Playwright',
      'Mock Service Worker (MSW)',
      'RBAC'
    ]
  },
  {
    title: 'Front-End UI/UX Engineer',
    company: 'Digital Defense, Inc.',
    location: 'San Antonio, TX',
    industry: 'Cybersecurity',
    employmentType: 'full-time',
    startDate: '2013-05',
    endDate: '2021-02',
    context:
      'Joined as one of two front-end engineers to re-architect Frontline VM, a flagship SaaS vulnerability management platform, rebuilding the application from the ground up in AngularJS and delivering it to production.',
    contributions: [
      'Owned UI architecture and UX design for a complex, data-intensive security platform, translating practitioner workflows into an interface optimized for clarity, speed, and usability.',
      'Built and maintained shared Angular component libraries, establishing reusable patterns that improved consistency and accelerated development across Frontline and related applications.',
      'Championed and implemented responsive design despite internal resistance, turning adaptability into a differentiator in client demos and field adoption.',
      'Led modernization of Frontline, migrating the application from AngularJS to Angular 7+ and introducing improved accessibility standards and updated UI patterns.',
      'Designed and delivered POCs and MVPs using AWS services including Cognito, EC2 and DynamoDB, expanding internal capabilities and supporting new product directions.'
    ],
    outcomes: 'Delivered and evolved a flagship platform recognized by analysts including Gartner and Frost & Sullivan, and awarded SC Magazine "Best Buy" for usability.',
    tech: [
      'AngularJS',
      'Angular',
      'TypeScript',
      'JavaScript',
      'SASS/SCSS',
      'Component libraries',
      'SaaS product development',
      'Storybook',
      'Jest',
      'AWS',
      'Cognito',
      'EC2',
      'DynamoDB',
      'Bootstrap',
      'Angular Material',
      'TailwindCSS',
      'Python',
      'Multi tenant architecture',
      'RBAC',
      'Route guards',
      'RxJS'
    ]
  },
  {
    title: 'Web Designer and Developer',
    company: 'Independent Contractor',
    location: 'San Antonio, TX',
    employmentType: 'freelance',
    startDate: '2010-11',
    endDate: '2013-04',
    context: 'Operated as a sole proprietor offering full-cycle web design and development services to small businesses and nonprofits.',
    contributions: [
      'Managed complete project lifecycles independently: client discovery, requirements gathering, UX planning, visual design, responsive front-end development, deployment, and ongoing maintenance.',
      "Designed and developed custom WordPress themes and bespoke content management systems tailored to each client's operational needs.",
      'Designed branding and marketing materials including logos, business cards, and promotional assets.',
      'Communicated technical concepts clearly to non-technical clients, providing creative direction alongside practical guidance.'
    ],
    outcomes:
      'Delivered end-to-end web presence and CMS solutions for a range of small business and nonprofit clients, including the University of Colorado Bookstore, Extelligence Internet Services, and several independent organisations.',
    tech: ['WordPress', 'PHP', 'HTML', 'CSS', 'JavaScript', 'jQuery', 'Custom CMS development', 'E-commerce', 'Responsive design', 'Branding']
  },
  {
    title: 'Lead UI and Graphic Designer',
    company: 'MOD Systems',
    location: 'Seattle, WA',
    industry: 'Software Development',
    employmentType: 'full-time',
    startDate: '2006-02',
    endDate: '2010-04',
    context:
      'MOD Systems was a media-on-demand platform provider building infrastructure to bridge the gap between physical and digital media - enabling retail stores to sell digital content before streaming made that model obsolete. The core product was an in-store kiosk system letting customers browse, sample, and burn albums or custom playlists to CD. Served as the sole designer for the entire company.',
    contributions: [
      "Designed the complete user experience for MOD's platform across three device form factors: in-store touchscreen kiosks, mobile devices, and set-top boxes.",
      'MOD in-store kiosk UI: interface for browsing, sampling, and purchasing or burning music in retail environments - deployed in partner stores including Starbucks HEAR Music, Best Buy, Blockbuster, Hollywood Video, and Circuit City.',
      "MOD mobile music player: UI for MOD's mobile playback application.",
      'GreenPlay set-top box UI: interface for a streaming television and movie platform that completed a limited hardware trial.',
      'MetaWallet: designed a virtual wallet platform enabling charitable giving, user-to-user transfers, and loaning of physical assets - ran a pilot program in Bolivia focused on mobile payments well before smartphones, PayPal, or Venmo made such transactions mainstream.',
      'Produced design concepts and final specifications used in sales presentations that secured digital movie rights from major studios and network television networks.',
      'Directed contract design teams responsible for the GreenPlay set-top box UI and managed external creative resources.',
      'Created all company marketing materials: investor presentations, advertising assets, business cards, and brand materials.'
    ],
    outcomes:
      'Sole creative force behind a platform that shipped across major national retail partners. Design work directly contributed to enterprise sales and content rights negotiations. Multiple products moved from concept to real-world deployment. The company wound down as the industry shifted away from physical media entirely.',
    tech: ['UI/UX design', 'Interaction design', 'Brand design', 'Corporate web development', 'Presentation design', 'Cross-device design (kiosk, mobile, set-top box)']
  },
  {
    title: 'Staff Graphic Designer & Production Assistant',
    company: 'Directory Plus',
    location: 'Durango, CO',
    industry: 'Advertising',
    employmentType: 'full-time',
    startDate: '2002-02',
    endDate: '2004-05',
    context: 'Directory Plus produced printed Yellow Pages directories for businesses across the southwestern United States.',
    contributions: [
      'Designed custom print advertisements for hundreds of clients across southwestern Colorado and New Mexico.',
      "Managed the design team's day-to-day operations: delegating tasks, tracking schedules, and maintaining quality standards.",
      'Assisted in final production: paginating books and preparing press-ready files for submission to the printer.',
      'Worked directly with clients on custom ad requests, translating specifications into finished print work.'
    ],
    outcomes: 'Maintained production quality and schedule across a high-volume regional print directory operation.',
    tech: ['Print design', 'Production management', 'Client services']
  }
];

export const getExperience = (): Promise<ExperienceEntry[]> => Promise.resolve(data);
