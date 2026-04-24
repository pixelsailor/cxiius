# ADR-009: API Boundary Security and Sanitization Model

> **Validity rule:** Any `{{ ... }}` placeholder remaining in this file renders the ADR invalid and it must not be treated as authoritative regardless of its stated status.

---

## Metadata

| Field             | Value           |
| ----------------- | --------------- |
| **ADR Number**    | ADR-009         |
| **Status**        | `active`        |
| **Date**          | 2026-04-10      |
| **Primary Owner** | Security        |
| **Decider**       | Human developer |

---

## Conditional Fields

| Field            | Value                                         |
| ---------------- | --------------------------------------------- |
| **Related ADRs** | ADR-005 — Error Handling Conventions          |
| **Compliance**   | OWASP Top 10 (input validation, API security) |

---

## Scope

This ADR governs the **entire API boundary between client input and the AI provider**, including:

- `/api/ai` Worker endpoint
- Input validation and sanitization rules
- Rate limiting implementation using Cloudflare Workers KV
- API proxy behavior and request shaping
- Secret handling and server-only execution boundaries

This ADR applies to:

- All server-side code in `src/lib/server/`
- All client interactions that result in AI requests

This ADR does **not** govern:

- Response formatting (e.g., markdown rendering)
- UI presentation details beyond validation feedback
- General frontend state management

---

## Context

The CXII system exposes a conversational interface that routes user input to an AI provider. The backend is stateless and deployed on Cloudflare Workers, with no persistent database and minimal infrastructure.

User input is inherently untrusted. Without strict constraints, the system risks:

- Excessive cost from unbounded token usage
- Abuse via automated or high-frequency requests
- Prompt injection attempts altering model behavior
- Expansion into unintended use cases beyond the domain scope

ADR-005 established a validation-first philosophy at the UI level, requiring invalid states to be prevented before submission. However, UI validation alone is insufficient, as all client input must be treated as untrusted.

A consistent, enforceable model is required to define:

- What input is allowed
- How requests are constrained
- How the API proxy behaves
- Where authority and enforcement reside

---

## Decision

The system enforces a **strict, constraint-based API boundary model** where the Cloudflare Worker is the sole authority over all input validation, rate limiting, and AI request construction.

### 1. Input Constraints

- The API accepts **only a single string field**: `input`

- Maximum input length is **500 characters**

- Requests containing:
  - Non-string input
  - Structured data (e.g., JSON payloads beyond the defined schema)
  - Missing or empty input
    are rejected

- Input is treated as **opaque text** and is not interpreted as instructions beyond user intent

---

### 2. Validation Model

- Validation is enforced at **two layers**:
  - **Frontend (ADR-005)**: prevents invalid input and informs the user
  - **Backend (Worker)**: enforces all constraints regardless of client behavior

- Backend validation is authoritative and must reject any non-compliant request

---

### 3. Rate Limiting

Rate limiting is enforced per IP using Cloudflare Workers KV with a hybrid model:

#### Request Limit

- Maximum **5 requests per 30 seconds per IP**

#### Token Budget

- Maximum **~10,000 tokens per 5-minute rolling window per IP**
- Token usage is estimated using:
  - Input length approximation
  - Fixed output token allowance

#### Behavior on Violation

- Requests exceeding limits are rejected with a structured error response
- No degradation or fallback responses are permitted

---

### 4. API Proxy Strictness

The Worker implements a **strict contract proxy**:

- The client cannot specify:
  - Model
  - Token limits
  - Temperature
  - System prompt
  - Any provider-specific parameters

- The Worker exclusively defines:
  - Model selection
  - Maximum output tokens (~300–500)
  - System prompt (constructed from `$lib/content`)
  - All provider configuration

The API is **not a general-purpose LLM interface** and must not behave as one.

---

### 5. Prompt Boundary Enforcement

- The system prompt is constructed exclusively from controlled, structured content
- User input is appended as data and must not alter system behavior

The model is explicitly instructed to:

- Answer only questions related to the defined subject domain
- Refuse out-of-scope requests with a friendly redirect toward supported topics

No attempt is made to:

- Detect or classify prompt injection patterns
- Filter specific phrases or keywords

Security is achieved through **context isolation and capability restriction**, not input pattern matching.

---

### 6. Secret Handling

- API keys and secrets are stored only in:
  - Cloudflare Worker environment variables
  - Local `.env` files for development

- All logic requiring secrets resides in `src/lib/server/`, which is server-only by design and enforced at build time

- Secrets must never:
  - Be exposed to client-side code
  - Be serialized in responses
  - Be logged

---

### 7. Error Handling

All rejected requests must return structured, explicit error responses.

Example:

```json
{
  "error": "rate_limit_exceeded",
  "type": "token_budget",
  "retry_after": 120
}
```

Silent failures or degraded responses are not permitted.

---

## Alternatives Considered

### Thin Proxy (Pass-through API)

The Worker forwards most parameters from the client to the AI provider.

**Rejected because:**
This exposes the system as a public LLM interface, allowing users to manipulate cost, behavior, and model configuration. It violates the domain constraints of the project.

---

### Request-Only Rate Limiting

Limit only the number of requests per time window.

**Rejected because:**
This does not account for token usage, leading to unpredictable costs and allowing abuse via large inputs.

---

### Token-Only Rate Limiting

Limit only token usage without request caps.

**Rejected because:**
This allows rapid bursts of small requests, increasing system load and reducing fairness across users.

---

### Input Sanitization via Pattern Filtering

Apply regex or heuristic filtering to detect prompt injection attempts.

**Rejected because:**
This adds complexity without meaningful security benefit in a system with no tools, no external data access, and a fixed prompt boundary.

---

## Consequences

### Benefits

- Predictable and bounded operational cost
- Strong protection against abuse without complex infrastructure
- Clear separation between trusted (server) and untrusted (client) layers
- Fully deterministic API behavior for agents and developers
- Reduced attack surface through strict capability limitation

---

### Trade-offs

- Reduced flexibility in API usage and experimentation
- Additional implementation complexity in rate limiting logic
- Potential false positives in rate limiting due to approximate token estimation
- User experience may include temporary lockouts under heavy usage

---

### Follow-up

- Define KV schema and helper utilities for rate limiting
- Standardize error response types across API endpoints
- Validate Worker execution limits under real traffic conditions

---

## Agent Directives

- **When** creating or modifying `/api/ai` endpoint: enforce input schema `{ input: string }` and reject all other fields
- **When** handling user input server-side: reject input exceeding 500 characters
- **When** constructing AI requests: do not accept or forward client-specified model or token parameters
- **When** adding new API routes that call external services: implement validation before the external call
- **When** implementing rate limiting: enforce both request count and token budget checks before processing
- **When** accessing secrets: restrict usage to `src/lib/server/` and never expose values to client code
- **When** handling out-of-scope queries: return a refusal with a domain-appropriate redirection

---

## Notes

This ADR formalizes the system’s security philosophy: **constraints over complexity**. The API boundary is intentionally narrow, and all behavior is defined by controlled inputs, fixed configuration, and domain-limited context.
