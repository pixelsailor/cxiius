# CXII — cxii.us

> A personal landing page that doubles as a conversational interface. No nav bars. No menus. Just a prompt and a mind behind it.

---

## Developing

**Stack:** TypeScript, npm; ESLint, Prettier, Vitest; SvelteKit with the Cloudflare adapter. Cursor-facing agent conventions (including the Svelte MCP documentation workflow) live in [`.cursor/rules/svelte-mcp-workflow.mdc`](.cursor/rules/svelte-mcp-workflow.mdc).

Start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

## Purpose of This Document

This README defines **high-level architecture, constraints, and guiding decisions** required to begin development without ambiguity in foundational systems.

It intentionally avoids:
- Component-level implementation details
- UX micro-interactions
- Visual design specifics

Those belong in separate documentation.

This document exists to ensure:
- Early decisions do not create architectural dead-ends
- Core systems remain aligned with project intent
- Development can begin without waterfall-style specification

---

## Concept

CXII is both an umbrella company and a personal identity. The site reflects that duality: minimal and corporate at a glance, personal and expressive through interaction.

The interface is intentionally ambiguous and rewards curiosity. Discoverability is not optimized for mass usability.

---

## Core Interaction Model (Abstract)

- A persistent, global interface is always available
- Input is the primary mechanism of interaction
- System supports two pathways:
  - **Slash commands** — Typing `/` reveals a command palette of pre-defined routes.
  - **Free-form input** — Anything else is routed to an AI chatbot that answers questions about the owner.
- Voice input feeds into the same pipeline as text

The interface behaves as a **command-driven system**, not a traditional website.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **SvelteKit** | Static-first, edge-ready, zero runtime overhead |
| Rendering | **SSG + Edge Functions** | Content routes prebuilt as static HTML; AI endpoint runs as a Worker |
| Adapter | **`@sveltejs/adapter-cloudflare`** | Targets CF Pages + Workers in a single deployment unit |
| AI Provider | **Anthropic Claude API** (`claude-haiku-4-5-20251001`) | Fast, cheap, sufficient for personal Q&A; upgrade path to Sonnet if needed |
| UI Component Libraries | **bits-ui** (primary) | Headless, accessible primitives — use as the base layer for components in `$lib/ui/` when applicable; see [ADR-011](adr/ADR-011-ui-component-library-bits-ui.md). LLM-oriented docs index: [bits-ui.com/llms.txt](https://bits-ui.com/llms.txt) (links to per-topic `llms.txt` pages). |
| Styling | **Plain CSS** (custom properties) | No framework bloat; full control over animation |
| Speech | **Web Speech API** | Native browser API, zero dependencies |
| Deployment | **Cloudflare Pages** | GitHub-connected CI/CD, free SSL, global CDN |
| Rate Limiting | **Cloudflare Workers KV** | Stateless IP-based counter; no external database needed |
| Analytics | **Cloudflare Web Analytics** | Privacy-first, cookieless, free |

---

## System Architecture

### Core Principles

1. **Global Interface Layer**
   - Mounted at the layout level
   - Persists across all routes
   - Never blocks or is blocked by navigation

2. **Dual Routing Model**
   - **Path-based routing** for static, crawlable content
   - **Input-driven routing** for user interaction

3. **Intent Resolution Layer**
   - Determines whether input maps to:
     - A known route
     - AI interaction
   - Prevents unnecessary AI usage when deterministic navigation is sufficient

4. **Stateless Backend by Default**
   - No persistent server
   - Each AI request is independent
   - Minimizes complexity, cost, and attack surface

---

## Hosting & Runtime

**Platform:** Cloudflare Pages + Workers

### Rationale

- Edge execution for low latency
- Native serverless runtime for API proxy
- Secure environment variable handling
- Built-in KV store for lightweight state (rate limiting, caching)
- Integrated CI/CD via GitHub

### Constraints

- Workers are stateless
- Execution time and streaming behavior must be validated
- No reliance on long-lived processes

---

## Rendering Strategy

- **Static Site Generation (SSG)** for all content routes
- **Edge Function (Worker)** for AI endpoint

### Implications

- All primary content is prerendered and directly accessible
- AI layer is an enhancement, not a dependency
- Site remains functional without JavaScript (excluding AI features)

---

## Content Model

All content is defined in **typed source files**.

### Principles

- Single source of truth
- Version-controlled
- No CMS
- No database

### Usage

Content feeds:
- Static pages
- AI system prompt
- Sitemap

This eliminates duplication and ensures consistency across systems.

---

## AI System Design

### Strategy

- Entire knowledge base is embedded in the system prompt
- No RAG or external data sources
- Prompt is constructed from structured content

### Characteristics

- Deterministic data source
- Low latency
- Minimal infrastructure

### Constraints

- AI is limited strictly to domain-specific responses
- Output length is capped to control cost and behavior

---

## Input Handling Pipeline

All user input (text or voice) follows a unified pipeline:

1. Input received
2. Intent evaluated
3. Routed to:
   - Static route navigation
   - AI endpoint

### Design Goals

- Avoid unnecessary AI calls
- Keep interaction predictable
- Maintain clear separation between deterministic and generative behavior

---

## API Layer

### Responsibilities

- Proxy requests to AI provider
- Enforce input constraints
- Handle rate limiting
- Normalize responses
- Handle error states

### Requirements

- Streaming support (subject to platform constraints)
- Consistent response format
- Clear failure modes

---

## State Management

### Approach

- Global application state exists at the interface level
- Backend remains stateless

### Principles

- UI state is centralized where appropriate
- Independent features may manage local state if isolated
- No persistence required for core functionality

---

## Security Model (Summary)

### Key Protections

1. **API Key Isolation**
   - Stored only in Worker environment

2. **Rate Limiting**
   - IP-based via KV store

3. **Prompt Constraints**
   - Explicit behavioral boundaries

4. **Input Limits**
   - Hard cap enforced server-side

### Design Philosophy

Security is handled through **constraint and simplicity**, not layered complexity.

---

## Performance & Cost Controls

### Mechanisms

- Token limits per request
- Rate limiting
- Optional response caching (KV-based)

### Goal

Maintain predictable and low operational cost without degrading experience.

---

## Accessibility Strategy

Two parallel experiences:

1. **Enhanced Interface** — for sighted users
2. **Semantic Structure** — for crawlers and assistive technologies

### Requirements

- All content must exist independent of the interface layer
- Navigation must be possible without interaction
- No content is hidden from the accessibility tree

---

## Explicit Non-Goals

- No database
- No user accounts
- No persistent sessions
- No complex AI orchestration (RAG, memory, agents)

---

## Open Areas (Intentionally Deferred)

The following are intentionally undefined at this stage:

- Component architecture beyond the bits-ui base layer for `$lib/ui/` (see [ADR-011](adr/ADR-011-ui-component-library-bits-ui.md))
- Visual design system
- Interaction micro-details
- Analytics implementation
- Voice interaction behavior
- Multi-turn conversation support

These will be defined in separate documentation as needed.

---

## Suggested Supporting Documents

To keep this README focused, the following documents should be created:

### 1. UI / Interaction Guidelines
- Input behavior
- Command palette interactions
- Accessibility specifics

### 2. API Specification
- Request/response formats
- Error handling contract
- Streaming behavior details

### 3. Content Authoring Guide
- Structure of content files
- Tone/voice guidelines
- Update workflow

### 4. Development Notes
- Experimental ideas
- Platform-specific findings
- Implementation constraints discovered during development

---

## Guiding Principles

1. **Curiosity is the navigation**
2. **AI is an enhancement, not the foundation**
3. **Content is the product**
4. **Single source of truth**
5. **Stateless by default**
6. **Edge-native architecture**

---

## Summary

This project is defined by **constraints and intent**, not features.

The goal is not to predefine the experience, but to ensure that whatever is built:
- Remains coherent
- Avoids architectural rework
- Aligns with the core philosophy

If a decision does not impact system architecture, it does not belong in this document.
