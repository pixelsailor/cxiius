// Aggregates public site content for future AI system prompt assembly (ADR-008 Rule 6).
// This module is the only server entry point that imports `$lib/content/*`.

import { getDesignPortfolio } from '$lib/content/design-portfolio';

/**
 * Returns a plain-text block describing published design portfolio entries for prompt injection.
 * Extend here when additional domains should inform the system prompt; keep imports centralized.
 */
export async function assembleSystemPromptFromSiteContent(): Promise<string> {
	const portfolio = await getDesignPortfolio();
	const lines: string[] = [
		'## Design portfolio (published on site)',
		...portfolio.map((p) => `- ${p.name} [${p.projectType}] (${p.circa}): ${p.summary} Tech: ${p.technologies.join(', ')}.`)
	];
	return lines.join('\n');
}
