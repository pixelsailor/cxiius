import { describe, expect, it } from 'vitest';
import { SvelteSet } from 'svelte/reactivity';
import { render } from 'vitest-browser-svelte';
import type { SkillCategoryMeta, SkillRecord, SkillStackMeta } from '$lib/content/skills';
import ResumeSkillsChartOptionsPopover from './ResumeSkillsChartOptionsPopover.svelte';

const skillCategories: readonly SkillCategoryMeta[] = [
  { id: 'languages-markup', name: 'Languages & Markup' },
  { id: 'frameworks-libraries', name: 'Frameworks & Libraries' }
];

const skillStacks: readonly SkillStackMeta[] = [
  { id: 'angular', name: 'Angular' },
  { id: 'react', name: 'React' }
];

const skillRecords: SkillRecord[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    proficiency: 'fluent',
    yearsOfExperience: 10,
    categoryId: 'languages-markup',
    stackIds: ['angular', 'react']
  },
  {
    id: 'angular',
    name: 'Angular',
    proficiency: 'fluent',
    yearsOfExperience: 12,
    categoryId: 'frameworks-libraries',
    stackIds: ['angular']
  }
];

describe('ResumeSkillsChartOptionsPopover', () => {
  it('AC-P2-03 AC-P2-04 AC-P2-19: built-in triggers open correct pane on hover', async () => {
    const screen = await render(ResumeSkillsChartOptionsPopover, {
      props: {
        skillRecords,
        skillCategories,
        skillStacks
      }
    });

    const techStacksButton = screen.getByRole('button', { name: /Tech stacks/i });
    const domainsButton = screen.getByRole('button', { name: /Skills by domain/i });
    expect(techStacksButton).toBeTruthy();
    expect(domainsButton).toBeTruthy();
    expect(techStacksButton.element().getAttribute('aria-controls')).toBe('skills-chart-options');
    expect(domainsButton.element().getAttribute('aria-controls')).toBe('skills-chart-options');

    await techStacksButton.hover();
    expect(screen.getByRole('heading', { name: 'Tech Stacks' })).toBeTruthy();

    await domainsButton.hover();
    expect(screen.getByRole('heading', { name: 'Skill Domains' })).toBeTruthy();
  });

  it('AC-P2-20: tech-stacks pane exposes fieldset, sr-only legend, and stack radios', async () => {
    const screen = await render(ResumeSkillsChartOptionsPopover, {
      props: {
        skillRecords,
        skillCategories,
        skillStacks
      }
    });

    await screen.getByRole('button', { name: /Tech stacks/i }).hover();
    await expect.poll(() => document.querySelector('fieldset.fieldset__tech-stacks')).not.toBeNull();

    const fieldset = document.querySelector('fieldset.fieldset__tech-stacks');
    expect(fieldset).not.toBeNull();

    const legend = fieldset?.querySelector('legend.tech-stacks__legend');
    expect(legend?.textContent).toContain('Select one tech stack');

    const radios = fieldset?.querySelectorAll('input[type="radio"]');
    expect(radios?.length).toBeGreaterThan(0);
  });

  it('AC-P2-06: selecting a tech stack replaces includedSkillIds with stack skills', async () => {
    const includedSkillIds = new SvelteSet(skillRecords.map((record) => record.id));
    const screen = await render(ResumeSkillsChartOptionsPopover, {
      props: {
        skillRecords,
        skillCategories,
        skillStacks,
        includedSkillIds
      }
    });

    await screen.getByRole('button', { name: /Tech stacks/i }).hover();
    await screen.getByRole('radio', { name: 'Angular' }).click();

    expect(includedSkillIds.has('typescript')).toBe(true);
    expect(includedSkillIds.has('angular')).toBe(true);
    expect(includedSkillIds.has('react')).toBe(false);
    expect(includedSkillIds.size).toBe(2);
  });

  it('AC-P2-05: toggling a domain skill checkbox mutates shared includedSkillIds', async () => {
    const includedSkillIds = new SvelteSet(skillRecords.map((record) => record.id));
    const screen = await render(ResumeSkillsChartOptionsPopover, {
      props: {
        skillRecords,
        skillCategories,
        skillStacks,
        includedSkillIds
      }
    });

    await screen.getByRole('button', { name: /Skills by domain/i }).hover();

    const typescriptCheckbox = screen.getByRole('checkbox', { name: 'TypeScript' });
    expect(includedSkillIds.has('typescript')).toBe(true);

    await typescriptCheckbox.click();
    expect(includedSkillIds.has('typescript')).toBe(false);

    await typescriptCheckbox.click();
    expect(includedSkillIds.has('typescript')).toBe(true);
  });
});
