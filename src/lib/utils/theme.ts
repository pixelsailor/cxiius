export const THEME_NAMES = ['system', 'light', 'stone', 'twilight', 'dark'] as const;

export type ThemeName = (typeof THEME_NAMES)[number];

const EXPLICIT_DATA_THEMES = ['light', 'stone', 'twilight', 'dark'] as const;

export function clampThemeIndex(v: number): 0 | 1 | 2 | 3 | 4 {
	return Math.min(4, Math.max(0, Math.round(v))) as 0 | 1 | 2 | 3 | 4;
}

export function applyTheme(index: number): void {
	const i = clampThemeIndex(index);
	if (i === 0) {
		document.documentElement.removeAttribute('data-theme');
		return;
	}
	document.documentElement.dataset.theme = EXPLICIT_DATA_THEMES[i - 1];
}
