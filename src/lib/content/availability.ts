// $lib/content/availability.ts
// Content domain: current availability status and engagement preferences.
//
// WARNING: THIS FILE REQUIRES MANUAL UPDATES when status changes.
//     It is intentionally not sourced from an external API - keep it current.

export type EngagementType = 'full-time' | 'contract' | 'freelance' | 'consulting';

export type Availability = {
	/**
	 * Whether Ben is currently open to new work.
	 */
	available: boolean;
	/**
	 * Free-text status message shown to users asking about availability.
	 * Should read naturally in a conversational context.
	 * Example: "Currently open to contract or full-time roles starting immediately."
	 */
	statusMessage: string;
	/**
	 * Last date this record was confirmed accurate. ISO 8601 date string.
	 */
	asOf: string;
	/**
	 * Engagement types Ben is open to, in order of preference.
	 */
	openTo: EngagementType[];
	/**
	 * Any specific notes about preferences, constraints, or context.
	 * Optional - omit if nothing meaningful to add.
	 */
	notes?: string;
};

// --- UPDATE THIS BLOCK WHEN STATUS CHANGES ---
// When status changes: update `available`, `statusMessage`, and `asOf`.

const data: Availability = {
	available: true,
	statusMessage: 'Currently available for new work. My contract with LevelBlue wrapped up in April 2026 and I am actively looking for my next engagement - contract or full-time.',
	asOf: '2026-04-12',
	openTo: ['contract', 'full-time'],
	notes: undefined
};

// ---------------------------------------------------------------------------

export const getAvailability = (): Promise<Availability> => Promise.resolve(data);
