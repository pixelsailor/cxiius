<script lang="ts">
	import { Button } from 'bits-ui';
	import type { PageProps } from './$types';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { LinkedInIcon, DribbbleIcon, GithubIcon, PdfIcon } from '$lib/ui/icons';

	const resumePdfPath = '/assets/ben-thompson__frontend-swe.pdf' as Pathname;

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Benjamin Thompson - Resume</title>
	<meta name="description" content="Benjamin Thompson - Resume" />
	<meta
		name="keywords"
		content="Benjamin Thompson, Resume, Software Engineer, Front-End Engineer, UI/UX Designer, Component Systems, Accessibility, Usability, Performance, Security"
	/>
	<meta name="author" content="Benjamin Thompson" />
</svelte:head>

<div class="container" id="page-top">
	<article class="page-content">
		<section class="identity-section will-fade">
			<h1 class="headline-large name">{data.identity.name}</h1>
			<h2 class="headline-small role">{data.identity.role}</h2>
			<ul class="supporting-links link">
				<li class="supporting-link">
					<a href="https://{data.identity.contact.linkedin}" class="linkedin-link">
						<LinkedInIcon size="sm" ariaLabel="LinkedIn" />
						LinkedIn
					</a>
				</li>
				<li class="supporting-link">
					<a href="https://{data.identity.contact.dribbble}" class="dribbble-link">
						<DribbbleIcon size="sm" ariaLabel="Dribbble" />
						Dribbble
					</a>
				</li>
				<li class="supporting-link">
					<a href="https://{data.identity.contact.github}" class="github-link">
						<GithubIcon size="sm" ariaLabel="Github" />
						Github
					</a>
				</li>
				<li class="supporting-link align-right">
					<a href={resolve(resumePdfPath)} class="pdf-link" download>
						<PdfIcon size="sm" ariaLabel="PDF" />
						Download
					</a>
				</li>
			</ul>
		</section>
		<section class="summary-section will-fade">
			<p class="title-large summary">
				Front-End Engineer with 20+ years of experience architecting enterprise-scale web applications and design systems. Builds component-driven platforms that enforce
				accessibility, consistency, and usability by design while enabling AI-assisted development workflows. Proven leader in aligning cross-functional teams to deliver
				performant, maintainable, and user-centered solutions.
			</p>
		</section>
		<section class="differentiators-section will-fade">
			<dl class="differentiators-list">
				{#each data.identity.differentiators as differentiator (differentiator.headline)}
					<div class="differentiator-item">
						<dt class="title-medium">{differentiator.headline}</dt>
						<dd class="body-large">{differentiator.detail}</dd>
					</div>
				{/each}
			</dl>
		</section>
		<section class="experience-section will-fade">
			<h3 class="headline-small">Experience</h3>
			{#each data.experience as experience (experience.title)}
				<div class="experience-item will-fade">
					<h4 class="title-large experience-item__title">{experience.title}</h4>
					<div class="experience-item__company-details">
						<h5 class="title-medium experience-item__company">{experience.company}</h5>
						<div class="experience-item__location-dates">
							<span class="title-small experience-item__location">{experience.location}</span>
							<span class="title-small experience-item__dates">{experience.startDate} to {experience.endDate}</span>
						</div>
					</div>
					<div class="experience-item__contributions">
						<p class="body-large experience-item__context">{experience.context}</p>
						<ul class="experience-item__contributions-list">
							{#each experience.contributions as contribution (contribution)}
								<li class="body-large experience-item__contribution">{contribution}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</section>
		<section class="skills-section will-fade">
			<h3 class="headline-small">Skills</h3>
			<div class="skills-list">
				{#each data.skills as skillCategory (skillCategory.name)}
					<div class="skill-category">
						<h4 class="title-small skill-category__name">{skillCategory.name}</h4>
						<ul class="skill-category__skills-list">
							{#each skillCategory.skills as skill (skill.name)}
								<li class="skill-category__skill-item">{skill.name}</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</section>

		<section class="education-section will-fade">
			<h3 class="headline-small education-section__title">Education</h3>
			{#each data.education as education (education.credential)}
				<div class="education-item will-fade">
					<h4 class="title-medium education-item__title">{education.credential}</h4>
					<div class="education-item__institution-details">
						<h5 class="title-small education-item__institution">{education.institution}</h5>
						<div class="education-item__location-dates">
							<span class="title-small education-item__location">{education.location}</span>
							<span class="title-small education-item__dates">{education.completedDate}</span>
						</div>
					</div>
					<ul class="education-item__honors-list">
						{#each education.honors as honor (honor)}
							<li class="body-large education-item__honor">{honor}</li>
						{/each}
					</ul>
					<p class="body-medium education-item__notes">{education.notes}</p>
				</div>
			{/each}
		</section>
	</article>

	<div class="scroll-to-top-container">
		<Button.Root href="#page-top" class="button" id="scroll-to-top-button">Scroll to Top</Button.Root>
	</div>
</div>

<style>
	.supporting-links {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		padding: 0;
		margin: 0;
		list-style: none;
	}

	.supporting-link a {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
		border: none;

		&.linkedin-link:hover {
			color: #0077b5;
		}
		&.dribbble-link:hover {
			color: #ea4c89;
		}
		&.github-link:hover {
			color: #a855f7;
		}
		&.pdf-link:hover {
			color: #b92b27;
		}
	}

	.supporting-link.align-right {
		margin-left: auto;
	}

	.page-content {
		color: var(--foreground);
	}

	.page-content:hover .will-fade {
		color: var(--muted);
		text-shadow: 0 0 10px var(--muted);
	}

	.page-content .will-fade {
		transition: color 0.45s ease-in-out;
	}

	.page-content .will-fade:hover {
		color: var(--foreground);
		text-shadow: none;
	}

	section {
		padding-block: 1rem;
	}

	h3 {
		font-style: italic;
	}

	.differentiator-item {
		padding-block: 0.5rem;
	}

	dt {
		font-style: italic;
	}

	.experience-item,
	.education-item {
		padding-block: 1rem;
	}

	.experience-item__title {
		margin-bottom: 0.25rem;
	}

	.experience-item__company {
		font-style: italic;
		margin-bottom: 0;
	}

	.experience-item__company-details,
	.education-item__institution-details {
		display: flex;
		flex-direction: row;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.experience-item__location-dates,
	.education-item__location-dates {
		display: flex;
		line-height: 1;
	}

	.experience-item__location,
	.education-item__location {
		margin-right: 1rem;
	}

	.experience-item__location::after,
	.education-item__location::after {
		content: '|';
		padding-left: 1rem;
	}

	.experience-item__contribution {
		line-height: 1.3;
		margin-block: 0.5rem;
	}

	.skills-list {
		columns: 3;
		column-gap: 3rem;
	}

	@media (max-width: 768px) {
		.skills-list {
			columns: 2;
		}
	}

	@media (max-width: 480px) {
		.skills-list {
			columns: 1;
		}
	}

	.skill-category {
		break-inside: avoid;
	}

	.skill-category__name {
		margin: 0 0 0.5rem 0;
		line-height: 1;
	}

	.skill-category__skills-list {
		margin-block: 0 1.5rem;
	}

	.education-item__notes {
		margin-block: 0.5rem;
		font-style: italic;
	}
</style>
