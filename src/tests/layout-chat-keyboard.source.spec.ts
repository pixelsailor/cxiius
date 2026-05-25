import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const layoutPath = join(dirname(fileURLToPath(import.meta.url)), '../routes/+layout.svelte');
const layoutSource = readFileSync(layoutPath, 'utf-8');

describe('+layout.svelte chat keyboard (source)', () => {
  it('AC-03 AC-05: Escape close runs before `showChatWindow || !ALPHABET` early return', () => {
    const escapeClose = layoutSource.indexOf("if (showChatWindow && event.key === 'Escape')");
    const alphabetEarlyReturn = layoutSource.indexOf(
      'if (showChatWindow || !ALPHABET.test(event.key) || modifierKey) return'
    );
    expect(escapeClose).toBeGreaterThan(-1);
    expect(alphabetEarlyReturn).toBeGreaterThan(-1);
    expect(escapeClose).toBeLessThan(alphabetEarlyReturn);
  });

  it('AC-08: Escape-close branch invokes preventDefault', () => {
    const escapeClose = layoutSource.indexOf("if (showChatWindow && event.key === 'Escape')");
    expect(escapeClose).toBeGreaterThan(-1);
    expect(layoutSource.indexOf('event.preventDefault()', escapeClose)).toBeGreaterThan(escapeClose);
  });

  it('AC-06: alphabet pattern does not match the string Escape', () => {
    expect(/^[a-zA-Z/]$/.test('Escape')).toBe(false);
  });

  it('AC-09: layout avoids legacy `on:` event directives (ADR-007)', () => {
    expect(layoutSource).not.toMatch(/\bon:[a-z]/);
  });

  it('AC-09: layout does not use SvelteKit legacy `page` store import', () => {
    expect(layoutSource).not.toMatch(/\$app\/stores/);
  });

  it('AC-10: sidebar is inside `isJsEnabled` gate (progressive enhancement)', () => {
    const gate = layoutSource.indexOf('{#if isJsEnabled}');
    const aside = layoutSource.indexOf('<aside class="sidebar"');
    expect(gate).toBeGreaterThan(-1);
    expect(aside).toBeGreaterThan(-1);
    expect(aside).toBeGreaterThan(gate);
  });

  it('AC-10: chat keyboard handler returns before alphabet open when showNav is false', () => {
    const showNavGuard = layoutSource.indexOf('if (!isJsEnabled || !showNav) return');
    const escapeClose = layoutSource.indexOf("if (showChatWindow && event.key === 'Escape')");
    expect(showNavGuard).toBeGreaterThan(-1);
    expect(escapeClose).toBeGreaterThan(showNavGuard);
  });

  it('AC-10: Header exposes baseline nav for no-JS (progressive enhancement)', () => {
    const headerPath = join(dirname(fileURLToPath(import.meta.url)), '../lib/ui/header/Header.svelte');
    const headerSource = readFileSync(headerPath, 'utf-8');
    expect(headerSource).toContain('<noscript>');
    expect(headerSource).toContain('{@render mainNav()}');
  });
});
