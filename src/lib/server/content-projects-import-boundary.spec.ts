import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, expect } from 'vitest';

const PROJECTS_IMPORT = '$lib/content/projects';

async function listServerTsFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue;
      out.push(...(await listServerTsFiles(p)));
    } else if (e.isFile() && e.name.endsWith('.ts') && !e.name.endsWith('.spec.ts')) {
      out.push(p);
    }
  }
  return out;
}

describe('ADR-008 Rule 6 — projects domain import from server (AC-10)', () => {
  it('only system-prompt.service.ts imports the unified projects module', async () => {
    const serverRoot = join(process.cwd(), 'src/lib/server');
    const files = await listServerTsFiles(serverRoot);
    const importers: string[] = [];
    for (const f of files) {
      const text = await readFile(f, 'utf8');
      if (text.includes(PROJECTS_IMPORT)) {
        importers.push(f);
      }
    }
    expect(importers.length).toBe(1);
    expect(importers[0]).toMatch(/system-prompt\.service\.ts$/);
  });
});
