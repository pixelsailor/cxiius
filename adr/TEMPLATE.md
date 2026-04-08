# ADR-{{ NNN }}: {{ Title }}

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field | Value |
|---|---|
| **ADR Number** | ADR-{{ NNN }} |
| **Status** | `proposed` |
| **Date Created** | {{ YYYY-MM-DD }} |
| **Last Updated** | {{ YYYY-MM-DD }} |
| **Decider** | {{ Name or role of the human who approved this ADR }} |

> **Status** must be exactly one of: `proposed`, `active`, `deprecated`, `superseded`.
> Only a human developer may change status to `active`. Agents may set `proposed` only.

---

## Conditional Fields

> Include only the fields that apply. Omit this section entirely if none apply.
> A `superseded` ADR must include **Superseded By**. A superseding ADR must include **Supersedes**.

| Field | Value |
|---|---|
| **Supersedes** | {{ ADR-NNN — title }} |
| **Superseded By** | {{ ADR-NNN — title }} |
| **Related ADRs** | {{ ADR-NNN — title, ADR-NNN — title }} |
| **Cursor Rules** | {{ Filename(s) of any Cursor rules generated from this ADR }} |
| **Deprecated Patterns** | {{ Pattern name(s) this ADR formally deprecates }} |
| **Compliance** | {{ relevant standards, e.g., WCAG 2.1 AA, OWASP Top 10 }} |

---

## Scope

{{ Define the boundaries of this decision. What parts of the codebase, layers, or workflows does it govern? What does it explicitly not govern? Scope prevents this ADR from being applied beyond its intended domain. Be specific — name route groups, file types, layers, or modules where applicable. }}

---

## Context

{{ Describe the situation that made this decision necessary. What problem exists, what pressures or constraints shaped the options, and what was the state of the codebase at the time? Write in past tense. Do not justify the decision here — only describe the conditions that led to it. }}

---

## Decision

{{ State the decision in clear, declarative present tense. Begin with a direct statement of what was chosen and why. Name the specific library, pattern, file convention, or approach. Avoid hedging language — "should", "try to", and "generally" are not appropriate here. This section must be unambiguous enough that an agent can act on it without additional context. }}

---

## Alternatives Considered

### {{ Alternative A — Name }}

{{ Describe the alternative accurately and charitably. }}

**Rejected because:** {{ State the specific reason this was not chosen. }}

---

### {{ Alternative B — Name }}

{{ Describe the alternative accurately and charitably. }}

**Rejected because:** {{ State the specific reason this was not chosen. }}

---

> Add or remove alternative subsections as needed. At least one alternative must be documented.
> Delete this instruction block before marking the ADR active.

---

## Consequences

### Benefits

{{ List the concrete benefits of this decision. Be specific — vague benefits like "better maintainability" are not useful. Name what improves, for whom, and why. }}

### Trade-offs

{{ Honestly name the costs, constraints, or risks this decision introduces. An ADR with no trade-offs is incomplete. What becomes harder, slower, or more constrained as a result of this decision? }}

### Follow-up

{{ Optional. List any actions, migrations, or future decisions this ADR makes necessary. If follow-up items are non-trivial, consider whether each warrants its own ADR. Omit this subsection if there are no meaningful follow-up items. }}

---

## Agent Directives

> This section contains actionable, pattern-triggered instructions for AI agents only.
> **Inclusion rule:** Every directive must be triggerable by a recognizable pattern — a file type, an import, a function call, a naming convention, or a structural cue. Do not include general reminders, restatements of the decision, or guidance that requires human judgment to apply.
> Omit this section entirely if no such directives exist for this ADR.

- **When** {{ pattern, condition, or trigger }}: {{ exact action the agent must take }}
- **When** {{ pattern, condition, or trigger }}: {{ exact action the agent must take }}

---

## Notes

{{ Optional. Capture anything relevant that does not belong in the sections above — external references, links to prior discussion, historical context, or clarifications. Omit this section if there is nothing to add. }}
