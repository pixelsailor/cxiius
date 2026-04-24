import { platform } from 'node:os';

import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  compilerOptions: {
    // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
    runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
  },
  kit: {
    adapter: adapter(),
    prerender: {
      // Explicit entries so each filter query variant is emitted as static HTML (ADR-002 no-JS baseline).
      // Windows cannot create filenames containing `?`, so query variants are listed on POSIX only; use Linux CI for full static parity.
      entries: ['*', '/portfolio', ...(platform() === 'win32' ? [] : ['/portfolio?type=all', '/portfolio?type=branding', '/portfolio?type=illustration', '/portfolio?type=ui'])]
    }
  }
};

export default config;
