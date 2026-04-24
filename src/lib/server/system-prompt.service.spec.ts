import { describe, it, expect } from 'vitest';
import { assembleSystemPromptFromSiteContent } from './system-prompt.service';

describe('assembleSystemPromptFromSiteContent', () => {
  it('includes the projects section and non-portfolio narrative fields from getProjects (AC-08)', async () => {
    const text = await assembleSystemPromptFromSiteContent();
    expect(text).toContain('## Projects and portfolio (all entries)');
    expect(text).toContain("What's For Dinner");
    expect(text).toContain('**Context:**');
    expect(text).toContain('**Selection & freshness:**');
  });

  it('includes portfolio-formatted lines for on-site case studies', async () => {
    const text = await assembleSystemPromptFromSiteContent();
    expect(text).toMatch(/\[branding]|\[ui]|\[illustration]/);
    expect(text).toContain('[Shipped]');
  });
});
