# ADR Governance — CXII

## 1. Purpose

This document defines the rules, processes, and expectations for Architectural Decision Records (ADRs) in the CXII project. It is the authoritative reference for both human developers and AI agents operating in this codebase.

ADRs exist to solve a specific problem: architectural decisions made early in a project are forgotten, re-litigated, or silently reversed — especially when AI agents lack persistent memory across sessions. The ADR system provides a durable record of what was decided, why it was decided, and what is no longer valid.

ADRs are **not** implementation guides, tutorials, or style preferences. They record significant decisions that shape the architecture, constrain future choices, or replace a previously valid approach.

---

## 2. What Qualifies as an ADR

An ADR is warranted when a decision meets one or more of the following criteria:

- It affects how a significant portion of the codebase is structured or written
- It chooses between two or more viable approaches (and the rejected alternatives matter)
- It deprecates or replaces a pattern that was previously in use
- It establishes a convention that agents or developers must follow consistently
- It would be non-obvious to a new contributor (human or agent) without explanation
- Reversing it would require changes across multiple files or layers

**Not every decision needs an ADR.** Formatting choices, minor naming decisions, and one-off implementation details belong in comments or inline documentation — not here.

When in doubt, ask: _Would an agent making this decision independently arrive at the same answer without this record?_ If no, write the ADR.

---

## 3. ADR Statuses

Every ADR must carry exactly one of the following statuses:

| Status       | Meaning                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `proposed`   | Under discussion. Not yet authoritative. Must not be treated as a binding decision.                                                              |
| `active`     | Approved and in force. All agents and developers must comply.                                                                                    |
| `deprecated` | No longer recommended, but not replaced by a specific alternative. The decision may still describe existing code that has not yet been migrated. |
| `superseded` | Replaced by a newer ADR. Must reference the superseding ADR by number. Must not be treated as valid guidance.                                    |

ADRs are **never deleted**. The history of why a decision was made — and why it was abandoned — is itself valuable. Deleting an ADR removes the context that prevents the same mistake from being made again.

---

## 4. Lifecycle

### 4.1 Proposing an ADR

Anyone — human or agent — may propose an ADR. A proposal must:

1. Use the canonical ADR template (`/adr/TEMPLATE.md`) without modification to required fields
2. Be assigned the next sequential number from the index
3. Be created with status `proposed`
4. Be added to the index (`/adr/INDEX.md`) with status `proposed`

An agent proposing an ADR must explicitly surface it to the developer for review. An agent **must not** proceed as if a `proposed` ADR is authoritative.

### 4.2 Review

A proposed ADR is reviewed by the human developer before it becomes active. Review should consider:

- Whether the decision is scoped correctly (not too broad, not too narrow)
- Whether the alternatives section honestly represents rejected approaches
- Whether the consequences section is realistic about tradeoffs
- Whether the decision would create or resolve any conflicts with existing active ADRs

### 4.3 Activation

An ADR moves from `proposed` to `active` only when explicitly approved by the human developer. This means:

- Updating the `Status` field in the ADR file to `active`
- Updating the corresponding entry in the index
- If applicable, generating or updating any related Cursor rules

Agents **must not** self-promote an ADR from `proposed` to `active`.

### 4.4 Deprecation vs. Supersession

**Deprecated** — Use when a pattern is being retired without a direct replacement. The old approach is no longer recommended, but no specific ADR defines what to do instead. Example: an experimental approach that proved unworkable, where the decision is simply to stop using it.

**Superseded** — Use when a new ADR directly replaces this one. The superseding ADR number must be recorded in the `Superseded By` field. Example: switching state management libraries, where ADR-004 replaces ADR-001.

When superseding an ADR:

1. Update the old ADR's status to `superseded` and record the new ADR number
2. Update the new ADR to reference the ADR it supersedes in the `Supersedes` field
3. Update both entries in the index

---

## 5. Agent Rules

These rules govern all AI agents operating in the CXII codebase. They define how agents must behave when making decisions, modifying code, or encountering ambiguity. These rules are binding.

---

### 5.1 Consult Before Deciding

Before making any architectural decision — including selecting a pattern, library, structure, or approach — an agent must consult the ADR index for relevant `active` ADRs.

- If a relevant `active` ADR exists, it is **binding**
- If no ADR exists, the agent may proceed using best judgment or propose a new ADR (see 5.3)

Failure to consult the ADR system before making architectural decisions is a violation of this governance model.

---

### 5.2 Status Defines Authority

ADR status determines how it must be treated:

- `active` → authoritative and must be followed
- `proposed` → non-binding; must not influence implementation
- `deprecated` / `superseded` → invalid for new decisions

Existing code that follows deprecated or superseded patterns **does not justify continuing their use**.

---

### 5.3 Agents May Propose, Not Approve

An agent may create an ADR when encountering a decision that is not already governed.

The agent must:

1. Create the ADR using the canonical template
2. Assign status `proposed`
3. Add it to the index
4. Explicitly notify the developer for review

An agent must not:

- Treat a proposed ADR as authoritative
- Mark an ADR as `active`
- Proceed as if the decision is finalized

---

### 5.4 Surface Conflicts Immediately

If an instruction conflicts with an `active` ADR, the agent must pause and surface the conflict before proceeding.

The agent must not:

- Silently ignore the ADR
- Silently override the instruction

The agent should respond in the following form:

> “This instruction conflicts with ADR-XXX ([title]). That ADR establishes [decision summary]. How would you like to proceed?”

Resolution must come from the developer.

---

### 5.5 Do Not Infer Deprecation

An agent must not infer that a pattern is deprecated based on:

- Code comments
- File age
- Lack of usage
- Personal judgment

A pattern is only deprecated when explicitly recorded in an ADR with status `deprecated` or `superseded`.

If an agent believes a pattern should be deprecated, it must propose an ADR rather than acting unilaterally.

---

### 5.6 Scoped Compliance and Refactoring

Agents must respect task scope, but may perform **limited, opportunistic compliance fixes**.

#### 5.6.1 Disallowed

An agent must not:

- Perform broad or unrelated refactoring outside the assigned task
- Rewrite large sections of code solely to enforce ADR compliance
- Expand the scope of work beyond the original intent

Discovering an ADR violation alone does not justify fixing it.

---

#### 5.6.2 Allowed (Opportunistic Compliance)

An agent may make small changes to bring code into compliance with `active` ADRs **within files it is already modifying**, provided that all of the following are true:

1. **Locality** — The change is in the same file or directly adjacent code
2. **Relevance** — The change supports or simplifies the current task
3. **Low Risk** — The change does not alter behavior in a non-obvious way
4. **Containment** — The change does not require cascading updates across multiple files

Examples of allowed changes:

- Updating a deprecated helper usage while modifying the same function
- Renaming or restructuring to match an enforced pattern within the touched file
- Replacing a deprecated utility with its approved alternative when already in use

---

#### 5.6.3 Escalation Boundary

If bringing code into compliance would require:

- Changes across multiple files
- Architectural restructuring
- Migration of a pattern used broadly

The agent must:

- Leave the code unchanged
- Note the violation
- Optionally suggest a follow-up task or ADR

---

### 5.7 Handling Partial Compliance

An `active` ADR may describe a target architecture that is not yet fully implemented across the codebase.

In these cases:

- The ADR remains fully authoritative
- Existing non-compliant code is considered **technical debt**, not a valid precedent
- Agents must follow the ADR for all new or modified code

Partial adoption does not weaken the authority of an ADR.

---

### 5.8 When No ADR Exists

If no relevant ADR exists, the agent may:

1. Proceed using best judgment, or
2. Propose a new ADR if the decision is:
   - Non-trivial
   - Likely to be repeated
   - Architecturally significant

The agent should prefer proposing an ADR when the decision would benefit future consistency.

---

## 6. Ownership Model

Each ADR has a **Primary Owner** responsible for its accuracy and a set of **Reviewers** who must sign off on changes.
Ownership is assigned by functional domain, not by individual.

| Domain           | Scope                                                     |
| ---------------- | --------------------------------------------------------- |
| **Platform**     | Build systems, orchestration, environment config, logging |
| **Architecture** | State management, routing, dependencies, feature patterns |
| **UI**           | Components, design, accessibility, internationalization   |
| **Security**     | Authentication, RBAC, XSS prevention, storage security    |
| **Quality**      | Testing                                                   |

- Every ADR must include:
  - `Primary Owner: <Domain>`
  - `Reviewers: <Domain>, ...`

- Choose the Primary Owner based on **long-term responsibility**
- Include all impacted domains as Reviewers
- ADRs must not be approved without Reviewer sign-off

Ownership fields are required in the ADR metadata.

---

## 7. Authoring Rules

### 7.1 Use the Template

Every ADR must use `/adr/TEMPLATE.md`. All required fields must be present. Optional fields may be omitted only if they are genuinely not applicable — not for convenience.

### 7.2 Language Standards

- Write in **present tense** and **declarative statements**: "The project uses X" not "We decided to use X"
- Be **specific**: name the library, pattern, or file type rather than describing it in general terms
- Avoid hedging language: "should", "try to", "generally" weaken the record and introduce ambiguity for agents
- The **Context** section may use past tense to describe the situation at time of decision
- The **Consequences** section should honestly name both benefits and tradeoffs

### 7.3 Alternatives Must Be Genuine

The Alternatives Considered section must describe the real options that were evaluated. Listing only weak alternatives to make the decision look obvious defeats the purpose. If an alternative was seriously considered and rejected, the reason for rejection must be recorded.

### 7.4 Numbering and Naming

ADR files are named using the format: `ADR-NNN-short-title.md` where `NNN` is zero-padded to three digits.

- `ADR-001-state-management.md`
- `ADR-012-api-response-schema.md`

Numbers are assigned sequentially and never reused, even if an ADR is superseded or deprecated.

### 7.5 Linking

When an ADR supersedes another, both must reference each other:

- The old ADR: `Superseded By: ADR-NNN`
- The new ADR: `Supersedes: ADR-NNN`

When an ADR is closely related to another without superseding it, use the `Related ADRs` field.

---

## 8. Relationship to Other Artifacts

### 8.1 ADRs and Cursor Rules

ADRs record decisions. Cursor rules enforce them. These are complementary but distinct:

- An active ADR **may** produce one or more Cursor rules that enforce its constraints at the agent level
- A Cursor rule that contradicts an active ADR is an error — the ADR takes precedence, and the rule must be corrected
- Not every ADR requires a Cursor rule; some decisions are architectural context rather than enforceable constraints
- When a Cursor rule is created from an ADR, the rule file should reference the ADR number for traceability

### 8.2 ADRs and Deprecated Patterns

Deprecated and superseded patterns are tracked directly within the ADR index rather than in a separate registry.

- Every deprecated or superseded pattern must have a corresponding ADR
- The index must include a concise mapping of deprecated patterns to their ADR
- This mapping is derived from ADRs; the ADR file remains the source of truth

This ensures a single source of truth while providing fast lookup for agents.

### 8.3 ADRs and Skills/Components

An active ADR may mandate the use of a specific shared component, utility, or skill. When it does, the ADR is the authoritative source for that requirement. The component or skill itself should reference the ADR in its documentation.

---

## 9. Index Maintenance

The index (`/adr/INDEX.md`) is the single source of truth for:

- What ADRs exist
- Their current status
- Their relationship to deprecated or superseded patterns

The index must be treated as a strictly synchronized companion to the ADR files.

### 9.1 Synchronization Requirements

- The index must be updated in the same commit or session as any ADR creation or status change
- An ADR file and its index entry must never be out of sync
- Deprecated or superseded patterns introduced or modified in an ADR must be reflected in the index

### 9.2 Structure

The index is a lookup table, not a summary. Detailed context belongs in ADR files.

Each ADR entry must include:

- ADR number
- Title
- Status
- One-line description

In addition, the index must include a **derived deprecated pattern mapping**.

This mapping must:

- List each deprecated or superseded pattern
- Reference the ADR that governs it
- Remain concise and scannable for agent use

### 9.3 Authority and Consistency

- The ADR file is always the authoritative source of truth
- The index is a structured projection of ADR data for fast lookup
- If inconsistencies arise, they must be resolved immediately in favor of the ADR

The index must remain reliable, current, and complete at all times. Any breakdown in index integrity undermines the entire ADR system.

---

## 10. Bootstrap Note

This governance document is itself the foundational artifact of the ADR system. It does not require its own ADR. Any future changes to this governance document that alter the process significantly should be recorded as an ADR.

---

_Last updated: project initialization_
_Owner: human developer — this document may not be modified by agents without explicit instruction_
