/**
 * Sort key for portfolio ordering: leading four-digit year in `circa`.
 * If missing, year is 0 (sorts older than dated entries; tie-break keeps stable order).
 */
export function circaYearFromString(circa: string): number {
	const m = /^(\d{4})/.exec(circa.trim());
	return m !== null ? parseInt(m[1], 10) : 0;
}
