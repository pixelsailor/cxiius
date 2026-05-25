import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const skillsExplorerDir = dirname(fileURLToPath(import.meta.url));
const libUiIndexPath = join(skillsExplorerDir, '../index.ts');
const skillsExplorerIndexPath = join(skillsExplorerDir, 'index.ts');
const explorerComponentPath = join(skillsExplorerDir, 'ResumeSkillsExplorer.svelte');
const resumePagePath = join(skillsExplorerDir, '../../../routes/resume/+page.svelte');

const readComponent = (filename: string): string => readFileSync(join(skillsExplorerDir, filename), 'utf-8');

const chartSource = readComponent('ResumeSkillsChart.svelte');
const popoverSource = readComponent('ResumeSkillsChartOptionsPopover.svelte');
const baselineSource = readComponent('ResumeSkillsBaseline.svelte');
const skillsExplorerIndexSource = readFileSync(skillsExplorerIndexPath, 'utf-8');
const libUiIndexSource = readFileSync(libUiIndexPath, 'utf-8');
const resumePageSource = readFileSync(resumePagePath, 'utf-8');

describe('skills-explorer split (source)', () => {
  it('AC-01: chart component has canvas only, no Popover or options pane markup', () => {
    expect(chartSource).toContain('<canvas');
    expect(chartSource).not.toMatch(/\bPopover\b/);
    expect(chartSource).not.toContain('skills-explorer-pane');
    expect(chartSource).not.toContain('skill-domains');
  });

  it('AC-02: popover component has Popover tree, no Chart.js or canvas', () => {
    expect(popoverSource).toContain("import { Popover, mergeProps } from 'bits-ui'");
    expect(popoverSource).toContain('<Popover.Root');
    expect(popoverSource).not.toMatch(/\bchart\.js\b/);
    expect(popoverSource).not.toContain('<canvas');
  });

  it('AC-P2-01: ResumeSkillsExplorer deleted and not imported from resume or barrels', () => {
    expect(existsSync(explorerComponentPath)).toBe(false);
    expect(resumePageSource).not.toContain('ResumeSkillsExplorer');
    expect(skillsExplorerIndexSource).not.toContain('ResumeSkillsExplorer');
    expect(libUiIndexSource).not.toContain('ResumeSkillsExplorer');
    expect(skillsExplorerIndexSource).toContain('ResumeSkillsChart');
    expect(skillsExplorerIndexSource).toContain('ResumeSkillsChartOptionsPopover');
    expect(libUiIndexSource).toContain('ResumeSkillsChart');
    expect(libUiIndexSource).toContain('ResumeSkillsChartOptionsPopover');
  });

  it('AC-P2-02 AC-P2-11 AC-P2-15: page composes siblings with minimal inclusion bridge and customAnchor', () => {
    expect(resumePageSource).toContain('<ResumeSkillsChartOptionsPopover');
    expect(resumePageSource).toContain('<ResumeSkillsChart');
    expect(resumePageSource).toContain('bind:includedSkillIds');
    expect(resumePageSource).toContain('bind:inclusionHydrated');
    expect(resumePageSource).toContain('bind:chartType');
    expect(resumePageSource).toContain('bind:chartTypeHydrated');
    expect(resumePageSource).toContain('customAnchor={chartOptionsAnchorEl}');
    expect(resumePageSource).toContain('class="skills-explorer-anchor"');
    expect(resumePageSource).not.toContain('chartOptionsOpen');
    expect(resumePageSource).not.toContain('chartOptionsPane');
    expect(resumePageSource).not.toMatch(/onpointerenter/);
    expect(resumePageSource).not.toContain('bind:open');
  });

  it('AC-10: popover owns hydration and persistence for chartType', () => {
    expect(popoverSource).toContain('hydrateChartType');
    expect(popoverSource).toContain('writePersistedChartType');
    expect(popoverSource).toContain('chartTypeHydrated');
    expect(chartSource).not.toContain('hydrateChartType');
    expect(chartSource).not.toContain('writePersistedChartType');
    expect(resumePageSource).not.toContain('hydrateChartType');
    expect(resumePageSource).not.toContain('writePersistedChartType');
  });

  it('AC-P2-10: popover owns hydration and persistence for includedSkillIds', () => {
    expect(popoverSource).toContain('new SvelteSet<string>()');
    expect(popoverSource).toContain('hydrateIncludedSkillIds');
    expect(popoverSource).toContain('writeIncludedSkillIds');
    expect(chartSource).not.toContain('hydrateIncludedSkillIds');
    expect(chartSource).not.toContain('writeIncludedSkillIds');
    expect(resumePageSource).not.toContain('hydrateIncludedSkillIds');
    expect(resumePageSource).not.toContain('writeIncludedSkillIds');
  });

  it('AC-P2-12 AC-P2-13: popover uses bits-ui openOnHover; not $lib/ui/popover wrapper', () => {
    expect(popoverSource).toContain("import { Popover, mergeProps } from 'bits-ui'");
    expect(popoverSource).not.toContain('$lib/ui/popover');
    expect(popoverSource).toContain('<Popover.Root');
    expect(popoverSource).toContain('<Popover.Trigger');
    expect(popoverSource).toContain('<Popover.Portal');
    expect(popoverSource).toContain('<Popover.Content');
    expect(popoverSource).toContain('openOnHover');
    expect(popoverSource).toContain('openDelay={POPOVER_OPEN_DELAY_MS}');
    expect(popoverSource).toContain('closeDelay={POPOVER_CLOSE_DELAY_MS}');
    expect(popoverSource).not.toContain('bind:open={chartOptionsOpen}');
    expect(resumePageSource).not.toContain('bind:open={chartOptionsOpen}');
  });

  it('AC-P2-03 AC-P2-14: built-in trigger buttons in child snippet with mergeProps', () => {
    expect(popoverSource).toContain('{#snippet child({ props })}');
    expect(popoverSource).toContain("mergeProps(props, { class: 'button-group' })");
    expect(popoverSource).toContain('Tech stacks');
    expect(popoverSource).toContain('Skills by domain');
    expect(popoverSource).toContain('Chart type');
    expect(popoverSource).not.toContain('class="sr-only"');
    expect(popoverSource).not.toContain('trigger?: Snippet');
  });

  it('AC-P2-15 AC-P2-16: customAnchor on Content; selectedPane is internal state', () => {
    expect(popoverSource).toContain('customAnchor={customAnchor ?? undefined}');
    expect(popoverSource).toContain('let selectedPane = $state<ChartOptionsPane>');
    expect(popoverSource).not.toContain('selectedPane = $bindable');
    expect(popoverSource).not.toContain('selectedPane?: ChartOptionsPane');
  });

  it('AC-P2-19: trigger buttons reference skills-chart-options popover id', () => {
    expect(popoverSource).toContain('aria-controls="skills-chart-options"');
    expect(popoverSource).toContain('id="skills-chart-options"');
    expect(popoverSource).toContain('aria-expanded={popoverOpen}');
  });

  it('AC-P2-20: popover retains fieldset/legend and domain checkbox labels', () => {
    expect(popoverSource).toContain('<fieldset class="fieldset__tech-stacks"');
    expect(popoverSource).toContain('tech-stacks__legend sr-only');
    expect(popoverSource).toContain('type="radio"');
    expect(popoverSource).toContain('use:categoryCheckboxState');
    expect(popoverSource).toContain('type="checkbox"');
  });

  it('AC-P2-26: resume page still ships noscript static skills chart', () => {
    expect(resumePageSource).toContain('<noscript>');
    expect(resumePageSource).toMatch(/<noscript>[\s\S]*class="skills-chart"/);
  });

  it('AC-P2-27: baseline component unchanged by split (no chart/popover imports)', () => {
    expect(baselineSource).not.toContain('ResumeSkillsChart');
    expect(baselineSource).not.toContain('ResumeSkillsChartOptionsPopover');
    expect(baselineSource).not.toContain('bits-ui');
  });
});
