<script lang="ts">
	import { SKILL_STACKS } from '$lib/content/skills';
	import type {
		SkillCategoryMeta,
		SkillCategoryId,
		SkillRecord,
		SkillStackId,
		Proficiency
	} from '$lib/content/skills';
	import { getProficiencyLevel } from '$lib/content/skills';

	/** Full skill datasource from route `load()` preserving SSR ordering. */
	let {
		skillRecords,
		categories,
		hideVisually = false
	}: {
		skillRecords: SkillRecord[];
		categories: readonly SkillCategoryMeta[];
		hideVisually?: boolean;
	} = $props();

	const stacksLabel = (ids: SkillStackId[]): string =>
		ids.map((stackId) => SKILL_STACKS.find((stackMeta) => stackMeta.id === stackId)?.name ?? stackId).join(', ');

	const rows = $derived.by(() => {
		const categoryOrder = new Map<SkillCategoryId, number>(
			categories.map((categoryMeta, slot) => [categoryMeta.id, slot])
		);
		return [...skillRecords].sort((a, b) => {
			const left = categoryOrder.get(a.categoryId) ?? 99;
			const right = categoryOrder.get(b.categoryId) ?? 99;
			if (left !== right) return left - right;
			return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
		});
	});
	const categoryName = (categoryId: SkillCategoryId): string =>
		categories.find((candidate) => candidate.id === categoryId)?.name ?? categoryId;
	const proficiencyName = (proficiencyKey: Proficiency): string =>
		getProficiencyLevel(proficiencyKey).name;
</script>

<!--
@component
SSR-only friendly skills baseline table exposing every datasource row including years of experience stacks and categories.
Sight users optionally hide duplicates once the hydrated Chart explorer takes over while screen readers retain the markup.
-->

<div class="resume-skills-baseline" class:sr-only={hideVisually}>
	<table class="skills-baseline-table">
		<caption class="skills-baseline-table__caption">Complete skills datasource</caption>
		<thead>
			<tr>
				<th scope="col">Skill</th>
				<th scope="col">Proficiency</th>
				<th scope="col">Years</th>
				<th scope="col">Category</th>
				<th scope="col">Stacks</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as skillRow (skillRow.id)}
				<tr>
					<th scope="row" class="skills-baseline-table__skill">{skillRow.name}</th>
					<td>{proficiencyName(skillRow.proficiency)}</td>
					<td>{skillRow.yearsOfExperience}</td>
					<td>{categoryName(skillRow.categoryId)}</td>
					<td>{stacksLabel(skillRow.stackIds)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.skills-baseline-table {
		width: 100%;
		border-collapse: collapse;
		margin-top: 0.25rem;
	}

	.skills-baseline-table__caption {
		text-align: left;
		font-weight: 600;
		padding-bottom: 0.35rem;
	}

	th,
	td {
		border: 1px solid color-mix(in srgb, var(--foreground-alt) 30%, transparent);
		padding: 0.35rem 0.5rem;
		text-align: left;
	}

	.skills-baseline-table__skill {
		font-weight: 600;
	}
</style>
