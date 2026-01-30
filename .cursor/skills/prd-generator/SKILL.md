---
name: prd-generator
description: Generate AI-optimized Product Requirements Documents with 100-point scoring framework. Use when the user wants to create a PRD, define requirements for a feature, document a new feature, spec a feature, or asks about writing product specs.
---

# PRD Generator

Generate clear, actionable, AI-optimized Product Requirements Documents suitable for implementation by developers or AI agents.

## Workflow Overview

1. **Clarify** - Ask targeted questions to understand requirements
2. **Research** - Quick research if topic is unfamiliar (max 60 seconds)
3. **Write** - Generate structured PRD with all required sections
4. **Score** - Self-evaluate against 100-point framework
5. **Save** - Output to `tasks/prd-[feature-name].md`

**Important**: Do NOT implement the feature. Only create the PRD.

---

## Phase 0: Clarification (MANDATORY)

Before writing ANY PRD content, ask the user these questions:

```
I'll create a PRD for: **[feature name]**

To make this PRD highly targeted, please answer briefly:

1. **Target Users**: Who will use this? (developers, end-users, admins, agencies?)
2. **Core Problem**: What pain point does this solve? Any metrics on current impact?
3. **Success Criteria**: How will you measure success? (KPIs, adoption rate, time saved?)
4. **Constraints**: Any technical, budget, timeline, or platform constraints?
5. **Existing Context**: Greenfield project or integrating with existing systems?

(Type "skip" to proceed with assumptions, or answer inline like "1A, 2B...")
```

**WAIT for user response before proceeding.**

If user says "skip" or provides the feature description inline, extract what you can and note assumptions clearly in the PRD.

---

## Phase 1: Quick Research (Optional, Max 60 seconds)

Only search if topic is unfamiliar. Limit to 2 web searches max:
- One for domain/market context
- One for technical patterns (if needed)

Do NOT over-research. Move to writing quickly.

---

## Phase 2: PRD Structure

Generate the PRD with these sections:

### 1. Executive Summary
Brief vision statement and key value proposition (2-3 sentences).

### 2. Problem Statement
Quantified pain points by user segment. Include:
- Current state and pain points
- Impact metrics if available
- Who is affected and how

### 3. Goals & Metrics

Format as a table with SMART goals and priorities:

```markdown
| Priority | Goal | Success Metric | Target |
|----------|------|----------------|--------|
| P0 | [Primary goal] | [Measurable KPI] | [Target value] |
| P1 | [Secondary goal] | [Measurable KPI] | [Target value] |
| P2 | [Nice-to-have] | [Measurable KPI] | [Target value] |
```

**Priority Definitions:**
- **P0**: Must have for launch, blocking
- **P1**: Important, include if possible
- **P2**: Nice to have, can defer

### 4. Non-Goals (Out of Scope)
Explicit boundaries - what this feature will NOT include. Be specific:
- List 3-5 explicit non-goals
- Helps AI agents avoid scope creep
- Prevents misunderstandings

### 5. User Personas
2-3 specific personas with use cases:

```markdown
#### Persona: [Name] ([Role])
- **Context**: [Their situation]
- **Goal**: [What they want to achieve]
- **Scenario**: [Specific use case]
```

### 6. User Stories

Each story needs:
- **ID**: US-XXX (numbered for reference)
- **Title**: Short descriptive name
- **Description**: "As a [user], I want [feature] so that [benefit]"
- **Acceptance Criteria**: Verifiable checklist using Given-When-Then or checkbox format

**Story Format:**
```markdown
### US-001: [Title]
**Priority:** P0 | P1 | P2
**Description:** As a [user], I want [feature] so that [benefit].

**Acceptance Criteria:**
- [ ] Given [context], when [action], then [result]
- [ ] Specific verifiable criterion
- [ ] Typecheck/lint passes
- [ ] **[UI stories only]** Verify in browser using dev-browser skill
```

**Critical**: Acceptance criteria must be verifiable. "Works correctly" is bad. "Button shows confirmation dialog before deleting" is good.

### 7. Functional Requirements
Numbered list with codes for easy reference:

```markdown
- **FR-001** [P0]: The system must allow users to...
- **FR-002** [P1]: When a user clicks X, the system must...
- **FR-003** [P2]: The API should return...
```

Include priority and acceptance criteria where helpful.

### 8. Non-Functional Requirements (Optional)
- **Security**: Authentication, authorization, data protection
- **Performance**: Load time, throughput, latency targets
- **Reliability**: Uptime, error handling, recovery
- **Accessibility**: WCAG compliance level

### 9. Implementation Phases
Dependency-ordered phases with clear deliverables:

```markdown
#### Phase 1: Foundation (1-2 days)
- [ ] Database schema changes
- [ ] API endpoints
- **Deliverable**: Backend ready for frontend integration

#### Phase 2: UI Components (1-2 days)
- [ ] Component A
- [ ] Component B
- **Deliverable**: Feature visible in UI

#### Phase 3: Polish (1 day)
- [ ] Edge cases
- [ ] Error handling
- **Deliverable**: Production-ready feature
```

### 10. Technical Considerations (Optional)
- Architecture decisions
- Integration points
- Data models or API contracts
- Dependencies on external systems

### 11. Risks & Mitigations
Top 3-5 risks with mitigation strategies:

```markdown
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk description] | High/Med/Low | High/Med/Low | [Strategy] |
```

### 12. Open Questions
Remaining questions or areas needing clarification before implementation.

---

## Phase 3: Self-Score (100-Point Framework)

After writing the PRD, score it against this framework:

### Category A: AI-Specific Optimization (25 points)
| Criterion | Points | Description |
|-----------|--------|-------------|
| Sequential Phases | 0-10 | Phases ordered by dependencies, each 5-15 min work |
| Explicit Non-Goals | 0-8 | Dedicated Non-Goals section with explicit boundaries |
| Structured Format | 0-7 | FR codes, consistent headings, Given-When-Then criteria |

### Category B: Traditional PRD Core (25 points)
| Criterion | Points | Description |
|-----------|--------|-------------|
| Problem Statement | 0-7 | Quantified pain points, metrics |
| Goals & Metrics | 0-8 | SMART goals, P0/P1 priorities |
| User Personas | 0-5 | Named personas with scenarios |
| Technical Specs | 0-5 | Architecture, integrations, data models |

### Category C: Implementation Clarity (30 points)
| Criterion | Points | Description |
|-----------|--------|-------------|
| Functional Requirements | 0-10 | FR codes, P0/P1/P2, acceptance criteria |
| Non-Functional Requirements | 0-5 | Security, performance, reliability |
| Architecture | 0-10 | Diagrams, data flow, API contracts |
| Phased Implementation | 0-5 | Clear phases, deliverables |

### Category D: Completeness (20 points)
| Criterion | Points | Description |
|-----------|--------|-------------|
| Risk Assessment | 0-5 | 3-5 risks with mitigations |
| Dependencies | 0-3 | External and internal dependencies |
| Examples | 0-7 | Code snippets, API examples |
| Documentation Quality | 0-5 | Formatting, ToC, glossary |

**Grade Scale:** A+ (90-100), A (80-89), B (70-79), C (60-69), D (<60)

---

## Phase 4: Output

- **Format**: Markdown (.md)
- **Location**: `tasks/`
- **Filename**: `prd-[feature-name].md` (kebab-case)

Include the score at the bottom of the PRD:

```markdown
---
## PRD Quality Score: XX/100 (Grade: X)
Generated: [Date]
```

---

## Writing Guidelines

The PRD reader may be a junior developer or AI agent:
- Be explicit and unambiguous
- Avoid jargon or explain it
- Number requirements for easy reference (FR-001, US-001)
- Use concrete examples
- Each phase should be 5-15 minutes of focused work
- Acceptance criteria must be verifiable (no "works correctly")

---

## Pre-Save Checklist

Before saving the PRD:
- [ ] Asked clarification questions (Phase 0)
- [ ] Executive summary clearly states value proposition
- [ ] Problem statement includes quantified pain points
- [ ] Goals are SMART with P0/P1/P2 priorities
- [ ] Non-goals section explicitly defines boundaries
- [ ] User personas are specific with scenarios
- [ ] User stories are small and have verifiable acceptance criteria
- [ ] Functional requirements are numbered (FR-XXX) with priorities
- [ ] Implementation phases are dependency-ordered
- [ ] Risks identified with mitigations
- [ ] Self-scored against 100-point framework
- [ ] Saved to `tasks/prd-[feature-name].md`

---

## Quick Reference: Scoring a PRD

To score an existing PRD:

```
Score this PRD: [file path]
```

Output format:
```markdown
## PRD Score Report: [PRD Title]

### Overall Score: XX/100 (Grade: X)

| Category | Score | Max |
|----------|-------|-----|
| A. AI-Specific Optimization | XX | 25 |
| B. Traditional PRD Core | XX | 25 |
| C. Implementation Clarity | XX | 30 |
| D. Completeness | XX | 20 |

### Top 3 Improvement Recommendations
1. [Highest impact fix] - +X points
2. [Second priority] - +X points
3. [Third priority] - +X points

### Verdict
[1-2 sentence summary of PRD quality and AI-readiness]
```

---

## Example

See [example-prd.md](example-prd.md) for a complete PRD example with scoring.
