export const THEME_NAMES = ['system', 'light', 'stone', 'twilight', 'dark'] as const;

export type ThemeName = (typeof THEME_NAMES)[number];

/** Single localStorage key for persisted theme index (`0`–`4`). */
export const THEME_STORAGE_KEY = 'cxii.themeIndex';

const EXPLICIT_DATA_THEMES = ['light', 'stone', 'twilight', 'dark'] as const;

export function clampThemeIndex(v: number): 0 | 1 | 2 | 3 | 4 {
	return Math.min(4, Math.max(0, Math.round(v))) as 0 | 1 | 2 | 3 | 4;
}

function canUseLocalStorage(): boolean {
	if (typeof window === 'undefined') return false;
	try {
		return typeof localStorage !== 'undefined' && localStorage !== null;
	} catch {
		return false;
	}
}

/**
 * Reads a persisted theme index from localStorage (browser only).
 * Returns `null` when unset, empty, non-numeric, or when not in a browser — leaving layout default `0` unchanged.
 * Invalid non-numeric values clear the key so a bad entry does not linger.
 */
export function readStoredThemeIndex(): 0 | 1 | 2 | 3 | 4 | null {
	if (!canUseLocalStorage()) return null;
	try {
		const raw = localStorage.getItem(THEME_STORAGE_KEY);
		if (raw === null) return null;
		const trimmed = raw.trim();
		if (trimmed === '') return null;
		const n = Number.parseInt(trimmed, 10);
		if (Number.isNaN(n)) {
			localStorage.removeItem(THEME_STORAGE_KEY);
			return null;
		}
		return clampThemeIndex(n);
	} catch {
		return null;
	}
}

/** Persists a theme index under {@link THEME_STORAGE_KEY}. No-op on server or if storage is unavailable. */
export function persistThemeIndex(index: number): void {
	if (!canUseLocalStorage()) return;
	try {
		const i = clampThemeIndex(index);
		localStorage.setItem(THEME_STORAGE_KEY, String(i));
	} catch {
		// Quota / private mode: ignore
	}
}

export function applyTheme(index: number): void {
	const i = clampThemeIndex(index);
	if (i === 0) {
		document.documentElement.removeAttribute('data-theme');
		return;
	}
	document.documentElement.dataset.theme = EXPLICIT_DATA_THEMES[i - 1];
}
