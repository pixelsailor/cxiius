// $lib/content/education.ts
// Content domain: formal education and certifications.

export type EducationEntry = {
	credential: string;
	institution: string;
	location: string;
	completedDate: string;
	honors?: string[];
	notes?: string;
};

const data: EducationEntry[] = [
	{
		credential: 'Associate of Science, Digital Media',
		institution: 'Full Sail University',
		location: 'Winter Park, FL',
		completedDate: '2005',
		honors: ['Class Valedictorian', 'Advanced Achiever Award', 'Certificate of Excellence', 'Perfect Attendance Award'],
		notes: "Featured in the inaugural issue of the school's quarterly publication."
	},
	{
		credential: 'Web Design Certificate',
		institution: 'Sessions.edu',
		location: 'Online',
		completedDate: '2000',
		notes: 'Project artwork featured in school promotional materials for several years following completion.'
	}
];

export const getEducation = (): Promise<EducationEntry[]> => Promise.resolve(data);
