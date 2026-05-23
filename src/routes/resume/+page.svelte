<script lang="ts">
  import { Button } from 'bits-ui';
  import type { PageData } from './$types';
  import { resolve } from '$app/paths';
  import type { Pathname } from '$app/types';
  import { getProficiencyLevel } from '$lib/content/skills';
  import { LinkedInIcon, DribbbleIcon, GithubIcon, PdfIcon } from '$lib/ui/icons';
  import { ResumeSkillsExplorer } from '$lib/ui/skills-explorer';
  import { isJavaScriptEnabled } from '$lib/utils/jsEnabled';

  const resumePdfPath = '/assets/ben-thompson__frontend-swe.pdf' as Pathname;

  let { data }: { data: PageData } = $props();
  
  let isJsEnabled = $state(isJavaScriptEnabled());
  
  let skillsExplorerMounted = $state(false);

  function formatAvatarLabel(avatar: string): string {
    return avatar.length > 0 ? avatar.charAt(0).toUpperCase() + avatar.slice(1) : '';
  }
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
        Front-End Engineer with 20+ years of experience architecting enterprise-scale web applications and design
        systems. Builds component-driven platforms that enforce accessibility, consistency, and usability by design
        while enabling AI-assisted development workflows. Proven leader in aligning cross-functional teams to deliver
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
    <section class="skills-section will-fade" aria-labelledby="skills-heading">
      <h3 class="headline-small" id="skills-heading">Skills</h3>
      <noscript>
        <div class="skills-chart">
          <div class="skills-chart__bars">
            <div class="skills-scale" aria-hidden="true">
              {#each data.proficiencyLevels as level, index (level.proficiency)}
                <span
                  class="skills-scale__label label-large"
                  class:skills-scale__label--end={index === data.proficiencyLevels.length - 1}
                  style:left="{level.barWidthPercent}%"
                >
                  {formatAvatarLabel(level.avatar)}
                </span>
              {/each}
            </div>
            {#each data.skills as skillCategory (skillCategory.name)}
              <div class="skill-category">
                <h4 class="title-medium skill-category__name">{skillCategory.name}</h4>
                <ul class="skill-bars">
                  {#each skillCategory.skills as skill (skill.name)}
                    {@const level = getProficiencyLevel(skill.proficiency)}
                    <li class="skill-bar">
                      <div
                        class="skill-bar__track"
                        role="meter"
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-valuenow={level.level}
                        aria-label="{skill.name}: {level.name}"
                      >
                        <div
                          class="skill-bar__fill skill-bar__fill--level-{level.level}"
                          style:width="{level.barWidthPercent}%"
                        >
                          <span class="skill-bar__label title-small">{skill.name}</span>
                        </div>
                      </div>
                    </li>
                  {/each}
                </ul>
              </div>
            {/each}
          </div>
          <aside class="skills-chart__legend" aria-label="Proficiency level descriptions">
            {#each [...data.proficiencyLevels].toReversed() as level (level.proficiency)}
              <article class="skills-legend__item">
                <h4 class="title-medium skills-legend__title">{formatAvatarLabel(level.avatar)}</h4>
                <p class="body-large skills-legend__text">
                  <em>{level.avatarDescription}</em>
                </p>
                <p class="body-medium">{level.description}</p>
              </article>
              <hr class="skills-legend__divider" />
            {/each}
          </aside>
        </div>
      </noscript>

      {#if isJsEnabled}
        <div class="skills-explorer-shell" data-explorer-ready={skillsExplorerMounted ? '' : undefined}>
          <ResumeSkillsExplorer
            skillRecords={data.skillRecords}
            skillCategories={data.skillCategories}
            onChartReady={(ready) => {
              skillsExplorerMounted = ready;
            }}
          />
        </div>
      {/if}
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
  .role {
    font-size: clamp(1rem, 2.33vw, 1.5rem);
  }

  .summary {
    font-size: clamp(1rem, 2.33vw, 1.375rem);
  }

  .supporting-links {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 1rem 0 0;
    list-style: none;
  }

  @media (min-width: 600px) {
    .supporting-links {
      flex-direction: row;
      gap: 1rem;
      margin-top: 0;
    }
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

  @media (min-width: 600px) {
    .supporting-link.align-right {
      margin-left: auto;
    }
  }

  .page-content {
    color: var(--foreground);
  }

  @media ((hover: hover) and (pointer: fine)) {
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
    border-bottom: 1px solid var(--muted);
  }

  .experience-item__title {
    font-size: clamp(1.125rem, 2.33vw, 1.375rem);
    margin-bottom: 0.25rem;
  }

  .experience-item__company {
    font-size: clamp(1rem, 2.33vw, 1.125rem);
    font-style: italic;
    margin-bottom: 0;
  }

  .experience-item__company-details,
  .education-item__institution-details {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }

  @media (min-width: 600px) {
    .experience-item__company-details,
    .education-item__institution-details {
      flex-direction: row;
    }
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

  .skills-chart {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-top: 0.5rem;
  }

  @media (min-width: 768px) {
    .skills-chart {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
      align-items: start;
    }
  }

  .skills-scale {
    position: relative;
    height: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .skills-scale__label {
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    line-height: 1;
    font-style: italic;
    white-space: nowrap;
  }

  .skills-scale__label--end {
    transform: translateX(-100%);
  }

  .skill-category {
    margin-bottom: 1.25rem;
  }

  .skill-category__name {
    margin: 0 0 0.5rem;
    line-height: 1;
  }

  .skill-bars {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .skill-bar {
    margin-bottom: 0.35rem;
  }

  .skill-bar__track {
    height: 1.75rem;
    border-radius: 0.35rem;
    background-color: var(--background-alt);
    overflow: hidden;
  }

  .skill-bar__fill {
    display: flex;
    align-items: center;
    height: 100%;
    min-width: 0;
    padding-inline: 0.5rem;
    border-radius: inherit;
    box-sizing: border-box;
    color: var(--contrast);
    background-image: linear-gradient(180deg, hsl(0 0% 100% / 0.22), hsl(0 0% 0% / 0.12));
    background-blend-mode: overlay;
  }

  .skill-bar__fill--level-0 {
    background-color: var(--p-zinc-500);
  }

  .skill-bar__fill--level-1 {
    background-color: var(--fuchsia-800);
  }

  .skill-bar__fill--level-2 {
    background-color: var(--amber-700);
  }

  .skill-bar__fill--level-3 {
    background-color: var(--blue-800);
  }

  .skill-bar__fill--level-4 {
    background-color: var(--green-700);
  }

  .skill-bar__label {
    color: var(--white);
    font-family: var(--sans-font-family);
    text-shadow: var(--shadow-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .skills-chart__legend {
    position: sticky;
    top: 4rem;
  }

  .skills-legend__item {
    margin-bottom: 1.25rem;
  }

  .skills-legend__item:last-child {
    margin-bottom: 0;
  }

  .skills-legend__title {
    margin: 0 0 0.35rem;
    line-height: 1.1;
  }

  .skills-legend__text {
    margin: 0;
    line-height: 1.35;
    opacity: 0.9;
  }

  .skills-legend__text em {
    display: block;
    margin-bottom: 0.35rem;
    font-style: italic;
  }

  .skills-section__intro {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-bottom: 0.85rem;
  }

  .skills-explorer-shell {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .skills-section__dek {
    max-width: 70ch;
  }

  .education-item__notes {
    margin-block: 0.5rem;
    font-style: italic;
  }
</style>
