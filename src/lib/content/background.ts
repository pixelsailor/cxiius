// $lib/content/background.ts
// Content domain: background outside of professional work history —
// military service, martial arts, instructional roles, and related facts.

export type MilitaryService = {
  rank: string
  rate: string
  branch: string
  locations: string[]
  startDate: string
  endDate: string
  summary: string
  highlights: string[]
}

export type MartialArt = {
  style: string
  rank: string
  school: string
  location: string
  earnedDate: string
}

export type InstructorRole = {
  title: string
  organisation: string
  location: string
  startDate: string
  endDate: string
  summary: string
}

export type Background = {
  military: MilitaryService
  martialArts: MartialArt[]
  instructorRoles: InstructorRole[]
}

const data: Background = {
  military: {
    rank: 'Petty Officer 3rd Class',
    rate: 'Boatswain\'s Mate',
    branch: 'US Coast Guard Reserve',
    locations: ['Everett, WA', 'Port O\'Connor, TX'],
    startDate: '2008',
    endDate: '2016',
    summary:
      'Served eight years in the US Coast Guard Reserve as small boat crew and boarding team member.',
    highlights: [
      'Completed USCG \'A\' School (Yorktown, VA, 2009)',
      'Earned the Navigation Rules Ace Award',
      'Trained in Search & Rescue Fundamentals',
      'Responsibilities included crew safety, navigation lookout duties, and maintenance of vessels, equipment, safety devices, and firearms',
    ],
  },
  martialArts: [
    {
      style: 'Tracy\'s Kenpo',
      rank: '1st Degree Black Belt',
      school: 'Professional Self Defense of Durango',
      location: 'Durango, CO',
      earnedDate: '2003',
    },
  ],
  instructorRoles: [
    {
      title: 'Assistant Karate Instructor',
      organisation: 'Sanchin Karate',
      location: 'San Antonio, TX',
      startDate: '2011',
      endDate: '2013',
      summary:
        'Led warm-up activities for youth after-school programs and adult classes. Worked one-on-one with students during group training to correct form and technique.',
    },
    {
      title: 'Snowboard Instructor',
      organisation: 'Eldora Mountain Resort',
      location: 'Nederland, CO',
      startDate: '1999',
      endDate: '2001',
      summary:
        'Taught private and group lessons for students ages 7–70. Assessed individual challenges and adapted instruction style and riding method to each learner\'s needs and abilities.',
    },
    {
      title: 'Snowboard Instructor',
      organisation: 'Purgatory Resort',
      location: 'Durango, CO',
      startDate: '2001',
      endDate: '2003',
      summary:
        'Taught private and group lessons. Continued developing adaptive instruction techniques across a diverse student range.',
    },
  ],
}

export const getBackground = (): Promise<Background> => Promise.resolve(data)
