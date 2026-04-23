# ADR-012: Commit Message Conventions for Semantic Release

---

## Metadata

| Field             | Value           |
| ----------------- | --------------- |
| **ADR Number**    | ADR-012         |
| **Status**        | proposed        |
| **Date**          | 2026-04-23      |
| **Primary Owner** | Quality         |
| **Decider**       | Human developer |

---

## Conditional Fields

| Field            | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| **Related ADRs** | ADR-001 — Project File and Folder Structure; ADR-006 — Type and Schema Conventions |

---

## Scope

This ADR governs Git commit message format for all commits merged into repository history, including commits created by humans, AI agents, and CI tooling. It applies to normal commits and revert commits. It defines which commit header types are valid for release automation and what structure each message must use.

This ADR does not govern branch naming, pull request title format, changelog rendering templates, or release branch strategy.

---

## Context

The project is adding `semantic-release` to automate semantic versioning from commit history. Automated versioning and changelog generation require commit messages that are machine-parseable and semantically consistent. Without a strict format, release automation misclassifies changes, fails to determine the correct version bump, or produces inaccurate release notes.

The Angular commit message guideline provides a concrete Conventional Commit variant with explicit required header structure, allowed types, and expectations for body/footer usage. Adopting that structure gives the project a well-documented standard that tools and contributors can follow consistently.

---

## Decision

The project uses Angular-style Conventional Commits for all commits that affect repository history consumed by `semantic-release`.

Every commit message must use this header format:

`<type>(<scope>): <short summary>`

The `<scope>` is optional. The `<type>` is required and must be one of:

- `build`
- `ci`
- `docs`
- `feat`
- `fix`
- `perf`
- `refactor`
- `test`

Header summary rules:

- Use imperative present tense.
- Do not capitalize the first word.
- Do not end with a period.

Body and footer rules:

- `docs` commits may omit a body.
- Non-`docs` commits include a body that explains motivation and impact.
- Footer is optional and is used for issue references, breaking changes, and deprecations.
- Breaking changes are declared with `BREAKING CHANGE: ...` in the footer.
- Deprecations are declared with `DEPRECATED: ...` in the footer.

Revert commit rules:

- Revert commits use the `revert: <original header>` form.
- Revert body includes `This reverts commit <SHA>` and the reason for reverting.

Release impact mapping for `semantic-release`:

- `feat` triggers a minor version bump.
- `fix` and `perf` trigger a patch version bump.
- Commits with `BREAKING CHANGE:` trigger a major version bump.
- Other allowed types (`build`, `ci`, `docs`, `refactor`, `test`) are valid and may appear in changelog output, but do not by themselves require a version bump.

---

## Alternatives Considered

### Free-form commit messages with manual release notes

Allow any commit style and perform versioning manually.

**Rejected because:** Manual interpretation introduces inconsistency and operational overhead, and it undermines deterministic release automation.

### Basic Conventional Commits without Angular constraints

Use generic Conventional Commits with loosely enforced wording and structure.

**Rejected because:** Generic guidance leaves room for interpretation that can reduce consistency across contributors. Angular’s stricter format provides clear, battle-tested rules that are easier to validate and teach.

---

## Consequences

### Benefits

- Release automation can derive version bumps consistently from commit history.
- Commit logs become easier to scan and reason about across features and fixes.
- Changelog generation quality improves because messages follow one predictable structure.
- AI agents have explicit constraints for generated commit messages.

### Trade-offs

- Contributors must learn and follow stricter commit conventions.
- Existing habits around capitalized summaries or ad-hoc types must change.
- Some commits require additional writing effort in the body/footer for clarity and compliance.

### Follow-up

- Add commit linting and `semantic-release` configuration that validates these rules in CI.
- Document quick examples in contributor-facing docs when release automation is enabled.

---

## Agent Directives

- **When** creating a commit: use `<type>(<scope>): <short summary>` with one of `build|ci|docs|feat|fix|perf|refactor|test`; keep summary lowercase-first, imperative, and without trailing period.
- **When** creating a non-`docs` commit: include a body describing motivation and impact.
- **When** representing a breaking change: include `BREAKING CHANGE:` footer text describing migration impact.
- **When** creating a revert: use `revert:` header and include `This reverts commit <SHA>` in the body.

---

## Notes

- Source guideline: [Angular Commit Message Format](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md).
