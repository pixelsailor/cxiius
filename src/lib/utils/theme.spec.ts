import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { THEME_STORAGE_KEY, applyTheme, clampThemeIndex, persistThemeIndex, readStoredThemeIndex } from './theme';

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

describe('THEME_STORAGE_KEY', () => {
  it('is the documented localStorage key', () => {
    expect(THEME_STORAGE_KEY).toBe('cxii.themeIndex');
  });
});

describe('readStoredThemeIndex / persistThemeIndex', () => {
  let store: Record<string, string>;

  const makeLocalStorage = () => {
    store = {};
    return {
      getItem: (key: string) => (key in store ? store[key] : null),
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      }
    };
  };

  beforeEach(() => {
    store = {};
    const ls = makeLocalStorage();
    vi.stubGlobal('localStorage', ls);
    // Server-side Vitest has no `window`; theme helpers require it for browser detection.
    vi.stubGlobal('window', { localStorage: ls });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('read returns null when window is undefined (SSR)', () => {
    vi.stubGlobal('window', undefined);
    expect(readStoredThemeIndex()).toBeNull();
  });

  it('read returns null for missing key', () => {
    expect(readStoredThemeIndex()).toBeNull();
  });

  it('read returns null for empty or whitespace-only value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, '');
    expect(readStoredThemeIndex()).toBeNull();
    localStorage.setItem(THEME_STORAGE_KEY, '   ');
    expect(readStoredThemeIndex()).toBeNull();
  });

  it('read returns clamped index for valid decimal strings', () => {
    localStorage.setItem(THEME_STORAGE_KEY, '0');
    expect(readStoredThemeIndex()).toBe(0);
    localStorage.setItem(THEME_STORAGE_KEY, '3');
    expect(readStoredThemeIndex()).toBe(3);
    localStorage.setItem(THEME_STORAGE_KEY, '99');
    expect(readStoredThemeIndex()).toBe(4);
  });

  it('read returns null for non-numeric value and removes the key', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'nope');
    expect(readStoredThemeIndex()).toBeNull();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });

  it('persist writes clamped string under THEME_STORAGE_KEY', () => {
    persistThemeIndex(2);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('2');
    persistThemeIndex(100);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('4');
  });

  it('persist is a no-op when window is undefined', () => {
    vi.stubGlobal('window', undefined);
    expect(() => persistThemeIndex(2)).not.toThrow();
  });
});
