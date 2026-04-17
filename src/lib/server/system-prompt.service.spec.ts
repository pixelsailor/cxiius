import { describe, it, expect } from 'vitest';
import { assembleSystemPromptFromSiteContent } from './system-prompt.service';

describe('assembleSystemPromptFromSiteContent', () => {
	it('returns a string including portfolio header and entry lines', async () => {
		const text = await assembleSystemPromptFromSiteContent();
		expect(text).toContain('## Design portfolio (published on site)');
		expect(text).toMatch(/- .+\[(branding|illustration|ui)\]/);
	});
});
