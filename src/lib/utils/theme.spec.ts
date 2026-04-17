import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { applyTheme, clampThemeIndex } from './theme';

describe('clampThemeIndex', () => {
	it('rounds and clamps to 0 through 4', () => {
		expect(clampThemeIndex(0)).toBe(0);
		expect(clampThemeIndex(4)).toBe(4);
		expect(clampThemeIndex(-1)).toBe(0);
		expect(clampThemeIndex(99)).toBe(4);
		expect(clampThemeIndex(2.4)).toBe(2);
		expect(clampThemeIndex(2.5)).toBe(3);
	});
});

describe('applyTheme', () => {
	const dataset: Record<string, string> = {};

	const documentElement = {
		dataset,
		removeAttribute(name: string) {
			if (name === 'data-theme') {
				delete dataset.theme;
			}
		}
	};

	beforeEach(() => {
		Object.keys(dataset).forEach((k) => {
			delete dataset[k];
		});
		vi.stubGlobal('document', { documentElement });
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('clears data-theme for index 0 (system)', () => {
		dataset.theme = 'dark';
		applyTheme(0);
		expect(dataset.theme).toBeUndefined();
	});

	it('sets data-theme to light, stone, twilight, dark for indices 1 to 4', () => {
		applyTheme(1);
		expect(dataset.theme).toBe('light');
		applyTheme(2);
		expect(dataset.theme).toBe('stone');
		applyTheme(3);
		expect(dataset.theme).toBe('twilight');
		applyTheme(4);
		expect(dataset.theme).toBe('dark');
	});
});
