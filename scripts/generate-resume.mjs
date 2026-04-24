#!/usr/bin/env node
/**
 * Generates `src/routes/resume/llms.txt` by sending structured content JSON to the
 * Cursor Agent CLI (`agent`). The model writes the resume; this script prepares
 * input and persists output.
 *
 * Run from repo root (requires devDependency `tsx` for `.ts` imports):
 *   npm run generate:resume
 *   npm run generate:resume:verbose
 *
 * Optional env:
 *   CURSOR_AGENT_BIN  — Path to the agent launcher if not on PATH. On Windows this is often
 *                        `.../cursor-agent/agent.ps1` (run via PowerShell; the script handles that).
 *
 * Loads `CURSOR_AGENT_BIN` from repo `.env` if set there (does not override existing env vars).
 *
 * Not deployed; not callable from the app.
 */

import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const outDir = join(repoRoot, 'src', 'routes', 'resume');
const outFile = join(outDir, 'llms.txt');
const contentDir = join(repoRoot, 'src', 'lib', 'content');
const agentDefPath = join(repoRoot, '.cursor', 'agents', 'resume-writer.md');

/**
 * Minimal `.env` loader for local dev (no dotenv dependency). Only sets keys not already in `process.env`.
 */
function loadDotEnv() {
  try {
    const p = join(repoRoot, '.env');
    const text = readFileSync(p, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  } catch {
    // no or unreadable .env
  }
}

function parseMode(argv) {
  const rest = argv.slice(2);
  if (rest.includes('verbose')) return 'verbose';
  if (rest.includes('concise')) return 'concise';
  return 'concise';
}

function stripYamlFrontmatter(markdown) {
  const m = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\s*/);
  if (!m) return markdown.trim();
  return markdown.slice(m[0].length).trim();
}

function resolveAgentBinary() {
  const fromEnv = process.env.CURSOR_AGENT_BIN;
  if (fromEnv && fromEnv.trim() !== '') {
    return fromEnv.trim();
  }
  const isWin = process.platform === 'win32';
  try {
    const out = execFileSync(isWin ? 'where' : 'which', ['agent'], {
      encoding: 'utf8',
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    const first = out.split(/\r?\n/)[0];
    if (first) return first;
  } catch {
    // ignore
  }
  // Windows: `where` often misses `agent.ps1` (PATHEXT). Resolve like the shell does.
  if (isWin) {
    try {
      const out = execFileSync('powershell.exe', ['-NoProfile', '-Command', '(Get-Command agent -ErrorAction Stop).Source'], {
        encoding: 'utf8',
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'ignore']
      }).trim();
      if (out) return out;
    } catch {
      // ignore
    }
  }
  return null;
}

/**
 * On Windows, `agent` is often `agent.ps1`; Node cannot exec `.ps1` directly, so we use PowerShell.
 */
function spawnAgent(agentPath, agentArgs) {
  const isPs1 = process.platform === 'win32' && agentPath.toLowerCase().endsWith('.ps1');
  if (isPs1) {
    return spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', agentPath, ...agentArgs], {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
      windowsHide: true,
      env: process.env
    });
  }
  return spawnSync(agentPath, agentArgs, {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
    windowsHide: true,
    env: process.env
  });
}

/**
 * Discover `*.ts` in content dir (no hardcoded domain filenames).
 */
function listContentModules() {
  return readdirSync(contentDir).filter((f) => f.endsWith('.ts') && !f.startsWith('_'));
}

/**
 * Import a module and call every export whose name starts with `get` and is a function.
 */
async function loadDomain(fileName) {
  const stem = basename(fileName, '.ts');
  const href = pathToFileURL(join(contentDir, fileName)).href;
  let mod;
  try {
    mod = await import(href);
  } catch (err) {
    console.error(`[generate-resume] Failed to import ${fileName}:`, err);
    return { stem, domain: {} };
  }
  const domain = {};
  for (const [key, value] of Object.entries(mod)) {
    if (typeof value !== 'function' || !key.startsWith('get')) continue;
    try {
      domain[key] = await value();
    } catch (err) {
      console.error(`[generate-resume] Failed to load ${fileName} (${key}):`, err);
    }
  }
  return { stem, domain };
}

function buildModeBlock(mode) {
  if (mode === 'verbose') {
    return `Mode: **verbose**. No length cap. Include all provided information with full detail. Optimise for a downstream LLM reading this as a knowledge source, not a hiring manager skimming a PDF.`;
  }
  return `Mode: **concise**. Hard cap of two pages of equivalent text. Omit minor roles, familiar-level skills, and anything that does not strengthen the professional narrative. Every line must earn its place.`;
}

/**
 * System-style instructions: agent definition + explicit script contract.
 */
function buildFullPrompt(agentBody, mode, payload) {
  const modeBlock = buildModeBlock(mode);
  const json = JSON.stringify(payload, null, 2);
  return `${agentBody}

---

## Additional instructions (from generator)

${modeBlock}

You must follow the role above and these rules:
- Third person, professional register; present tense for the current role where applicable.
- Sections: Summary, Experience, Skills, Education, Projects, and any other domains present in the JSON.
- Experience: impact first; quantify where the data supports it.
- Skills: grouped by category, not alphabetically.
- Avoid filler phrases ("responsible for", "worked on", "helped with"), passive voice, and vague superlatives.
- Output plain text with \`##\` section headers and bullet lists only. No tables, no HTML, no JSON in the final answer.

Respond with **only** the resume document (no preamble or apology).

---

## Source data (JSON)

${json}
`;
}

function stripOuterCodeFence(text) {
  const t = text.trim();
  const m = t.match(/^```(?:[a-z]*)?\r?\n([\s\S]*)\r?\n```$/i);
  return m ? m[1].trim() : t;
}

function runAgent(agentPath, workspaceRoot, promptText) {
  const maxCmd = process.platform === 'win32' ? 7500 : 900_000;
  let promptPath = null;
  let lastArg = promptText;
  if (promptText.length > maxCmd) {
    promptPath = join(tmpdir(), `cxiius-resume-prompt-${Date.now()}.txt`);
    writeFileSync(promptPath, promptText, 'utf8');
    lastArg = `The complete instructions and JSON source data are in this file (read it fully, then output only the resume text):\n${promptPath}`;
  }
  try {
    const args = ['--print', '--mode=ask', '--trust', '--workspace', workspaceRoot, lastArg];
    const result = spawnAgent(agentPath, args);
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      const err = new Error(`agent exited with code ${result.status}`);
      err.stderr = result.stderr;
      err.stdout = result.stdout;
      throw err;
    }
    return stripOuterCodeFence(result.stdout ?? '');
  } finally {
    if (promptPath) {
      try {
        unlinkSync(promptPath);
      } catch {
        // ignore
      }
    }
  }
}

async function main() {
  loadDotEnv();
  const mode = parseMode(process.argv);

  let agentBody;
  try {
    agentBody = stripYamlFrontmatter(readFileSync(agentDefPath, 'utf8'));
  } catch (e) {
    console.error('[generate-resume] Missing or unreadable agent definition:', agentDefPath, e);
    process.exitCode = 1;
    return;
  }

  const modules = listContentModules();
  if (modules.length === 0) {
    console.error('[generate-resume] No TypeScript modules in', contentDir);
    process.exitCode = 1;
    return;
  }

  /** @type {Record<string, Record<string, unknown>>} */
  const payload = {};
  for (const file of modules.sort()) {
    const { stem, domain } = await loadDomain(file);
    if (Object.keys(domain).length === 0) {
      console.warn(`[generate-resume] Skipping ${file} (no getters succeeded)`);
      continue;
    }
    payload[stem] = domain;
  }

  if (Object.keys(payload).length === 0) {
    console.error('[generate-resume] No content domains loaded; aborting.');
    process.exitCode = 1;
    return;
  }

  const fullPrompt = buildFullPrompt(agentBody, mode, payload);

  const agentBin = resolveAgentBinary();
  if (!agentBin) {
    console.error(`
[generate-resume] Cursor Agent CLI not found.

Install the Cursor Agent CLI so the \`agent\` command is on your PATH (see https://cursor.com/docs/cli ),
or set CURSOR_AGENT_BIN to the full path of the launcher (on Windows often \`.../cursor-agent/agent.ps1\`).

This repository's Windows \`cursor\` shim does not reliably expose the headless \`agent --print\` workflow; the
standalone CLI is required for scripted runs.

If you prefer not to use the Cursor CLI here, add the Anthropic SDK and wire this script to call the API instead.
`);
    process.exitCode = 1;
    return;
  }

  let resumeText;
  try {
    resumeText = runAgent(agentBin, repoRoot, fullPrompt);
  } catch (e) {
    console.error('[generate-resume] Cursor agent failed:', e.message);
    if (e.stderr) console.error(e.stderr);
    if (e.stdout) console.error(e.stdout);
    process.exitCode = 1;
    return;
  }

  if (!resumeText || resumeText.trim() === '') {
    console.error('[generate-resume] Empty response from agent.');
    process.exitCode = 1;
    return;
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, resumeText.trimEnd() + '\n', 'utf8');
  console.log(`Wrote ${outFile} (${mode})`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
