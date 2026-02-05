---
name: generate-prd
description: Generate Product Requirements Documents through an interactive Q&A process. Use when the user asks to create a PRD, write requirements, document a feature, or plan implementation. Guides users through structured questions to build comprehensive PRDs saved to tasks/prd-[feature-name].md
---

# Generate Product Requirements Document (Interactive)

This skill guides users through creating detailed, actionable Product Requirements Documents (PRDs) using a question-and-answer format. No prior knowledge required—just answer the questions!

## When to Use

Use this skill when:
- User asks to create a PRD or requirements document
- User wants to document a feature before implementation
- User mentions "requirements", "spec", "specification", or "plan"
- User describes a feature and needs it structured for development

## What is a PRD?

Before starting, explain to the user:

> **What's a PRD?**
> 
> A Product Requirements Document (PRD) is like a blueprint for building a feature. It helps everyone understand:
> - What problem you're solving
> - Who it's for
> - What exactly needs to be built
> - How we'll know when it's done
> 
> I'll ask you a series of questions to create this document. You don't need any technical knowledge—just answer based on what you want the feature to do!
> 
> This usually takes 5-10 minutes and ensures your feature gets built exactly how you envision it.

## Interactive Workflow

### Step 1: Introduction & Feature Name

Start with a warm introduction and get the basic feature info:

**Say to the user:**

> Great! Let's create your PRD together. I'll walk you through some questions to make sure we capture everything important.
> 
> **First, let's start simple:**
> 
> 1. **What's a short name for this feature?** (e.g., "Task Priority System", "User Dashboard", "Export to PDF")

Wait for the feature name, then proceed to Step 2.

### Step 2: The Problem & Goal

**Say to the user:**

> Perfect! Now let's talk about the "why" behind this feature.
> 
> 2. **What problem does this solve, or what goal does it achieve?**
>    
>    In a sentence or two, describe what users struggle with today, or what new capability they'll gain.
>    
>    *Example: "Users can't tell which tasks are most urgent, so important work gets missed."*

Wait for their answer, then proceed to Step 3.

### Step 3: Target Users

Use the **AskQuestion** tool to present clickable options:

```json
{
  "title": "Who will use this feature?",
  "questions": [
    {
      "id": "target_users",
      "prompt": "Who is the primary user?",
      "options": [
        { "id": "all", "label": "All users — Everyone who uses the app" },
        { "id": "new", "label": "New users — People just getting started" },
        { "id": "existing", "label": "Existing users — People already familiar with the app" },
        { "id": "admin", "label": "Admin users — People managing the system" },
        { "id": "specific", "label": "Specific role — I'll describe who" }
      ]
    }
  ]
}
```

If they select "specific", ask in chat: "Please describe who will use this feature."

### Step 4: Core Functionality

**Say to the user:**

> Now let's break down what this feature actually does.
> 
> 3. **What are the key actions users will take?**
>    
>    List 2-5 main things users will be able to do with this feature.
>    
>    *Example:*
>    - *Assign a priority level (high/medium/low) to any task*
>    - *See priority badges on each task card*
>    - *Filter tasks by priority*

Wait for their answer, then proceed to Step 5.

### Step 5: Scope & Boundaries

Use the **AskQuestion** tool:

```json
{
  "title": "Let's define what's included",
  "questions": [
    {
      "id": "scope",
      "prompt": "How complete should the first version be?",
      "options": [
        { "id": "mvp", "label": "MVP — Just the core functionality to start" },
        { "id": "complete", "label": "Complete — All the bells and whistles" },
        { "id": "iterative", "label": "Iterative — Start simple, add more later" }
      ]
    }
  ]
}
```

Then ask in chat:

> 4. **What should this feature NOT do?**
>    
>    This helps keep scope manageable. List 2-3 things that are explicitly out of scope for now.
>    
>    *Example:*
>    - *No automatic priority assignment*
>    - *No notifications based on priority*
>    - *No priority for recurring tasks*

Wait for their answer, then proceed to Step 6.

### Step 6: Success Criteria

**Say to the user:**

> Almost done! Now let's define what success looks like.
> 
> 5. **How will we know this feature is working well?**
>    
>    Think about:
>    - What should users be able to do easily?
>    - What should be faster or simpler?
>    - What metrics matter?
>    
>    *Example:*
>    - *Users can change priority in under 2 clicks*
>    - *High-priority tasks are immediately visible*
>    - *Users understand the feature without training*

Wait for their answer, then proceed to Step 7.

### Step 7: Additional Context (Optional)

Use the **AskQuestion** tool:

```json
{
  "title": "Any other details?",
  "questions": [
    {
      "id": "design_needs",
      "prompt": "Do you have design requirements or mockups?",
      "options": [
        { "id": "none", "label": "No — Use standard patterns" },
        { "id": "describe", "label": "Yes — I'll describe them" },
        { "id": "link", "label": "Yes — I have a link or file" }
      ]
    },
    {
      "id": "technical_constraints",
      "prompt": "Any technical requirements or constraints?",
      "options": [
        { "id": "none", "label": "No — Standard implementation" },
        { "id": "yes", "label": "Yes — I'll specify" }
      ]
    }
  ]
}
```

If they select "describe", "link", or "yes", ask follow-up questions in chat to gather those details.

### Step 8: Generate PRD

Now that you have all the information, say:

> Perfect! I have everything I need. Let me create your PRD now...

Then generate the PRD following the structure in the "PRD Structure" section below.

### Step 9: Present the PRD

After saving the PRD, provide a friendly summary:

> ✅ **Your PRD is ready!**
> 
> I've created `tasks/prd-[feature-name].md` with:
> - Clear goals and user stories
> - Specific functional requirements
> - Scope boundaries (what's NOT included)
> - Success metrics
> 
> **What's next?**
> 
> You can:
> 1. **Review the PRD** — Tell me if you'd like to adjust anything
> 2. **Start building** — Say "implement US-001" to start with the first user story
> 3. **Share it** — The PRD is a great document to share with your team
> 
> Would you like to review the PRD first, or shall we start implementing?

## PRD Structure

#### 1. Introduction/Overview
Brief description of the feature and the problem it solves (2-3 sentences).

#### 2. Goals
Specific, measurable objectives as a bullet list:
- Goal 1
- Goal 2
- Goal 3

#### 3. User Stories
Each story needs:
- **Title**: Short descriptive name (e.g., "US-001: Add priority field to database")
- **Description**: "As a [user], I want [feature] so that [benefit]"
- **Acceptance Criteria**: Verifiable checklist of what "done" means

**Format:**

```markdown
### US-001: [Title]
**Description:** As a [user], I want [feature] so that [benefit].

**Acceptance Criteria:**
- [ ] Specific verifiable criterion
- [ ] Another criterion
- [ ] Typecheck/lint passes
- [ ] **[UI stories only]** Verify in browser using dev-browser skill
```

**Critical rules for user stories:**
- Each story should be small enough to implement in one focused session
- Acceptance criteria must be verifiable, not vague
  - ❌ Bad: "Works correctly"
  - ✅ Good: "Button shows confirmation dialog before deleting"
- For any story with UI changes: Always include "Verify in browser using dev-browser skill" as the last acceptance criterion

#### 4. Functional Requirements
Numbered list of specific functionalities:
- FR-1: The system must allow users to...
- FR-2: When a user clicks X, the system must...
- FR-3: The system must validate...

Be explicit and unambiguous. Number each requirement for easy reference.

#### 5. Non-Goals (Out of Scope)
What this feature will NOT include. Critical for managing scope:
- No priority-based notifications or reminders
- No automatic priority assignment
- No priority inheritance for subtasks

#### 6. Design Considerations (Optional)
- UI/UX requirements
- Link to mockups if available
- Relevant existing components to reuse
- Design system patterns to follow

#### 7. Technical Considerations (Optional)
- Known constraints or dependencies
- Integration points with existing systems
- Performance requirements
- Database schema changes needed
- API endpoints required

#### 8. Success Metrics
How will success be measured?
- "Reduce time to complete X by 50%"
- "Increase conversion rate by 10%"
- "Users can change priority in under 2 clicks"

#### 9. Open Questions
Remaining questions or areas needing clarification:
- Should priority affect task ordering within a column?
- Should we add keyboard shortcuts for priority changes?

## Writing Guidelines

### For Junior Developers and AI Agents

The PRD reader may be a junior developer or AI agent. Therefore:

- **Be explicit and unambiguous**: Avoid jargon or explain it
- **Provide enough detail**: Understand purpose and core logic
- **Number requirements**: Easy reference (FR-1, US-001, etc.)
- **Use concrete examples**: Where helpful
- **Avoid assumptions**: State requirements clearly

### User Story Quality Checklist

Before finalizing each user story, verify:
- [ ] Story is small enough for one focused session
- [ ] Description follows "As a [user], I want [feature] so that [benefit]"
- [ ] Acceptance criteria are verifiable (not vague)
- [ ] UI stories include browser verification step
- [ ] Story has a clear, numbered identifier (US-001, US-002, etc.)

## Output

**Format**: Markdown (.md)  
**Location**: `tasks/` directory  
**Filename**: `prd-[feature-name].md` (kebab-case)

Example: `tasks/prd-task-priority-system.md`

**Important**: Create the `tasks/` directory if it doesn't exist.

## Example PRD Structure

```markdown
# PRD: Task Priority System

## Introduction

Add priority levels to tasks so users can focus on what matters most. Tasks can be marked as high, medium, or low priority, with visual indicators and filtering to help users manage their workload effectively.

## Goals

- Allow assigning priority (high/medium/low) to any task
- Provide clear visual differentiation between priority levels
- Enable filtering and sorting by priority
- Default new tasks to medium priority

## User Stories

### US-001: Add priority field to database
**Description:** As a developer, I need to store task priority so it persists across sessions.

**Acceptance Criteria:**
- [ ] Add priority column to tasks table: 'high' | 'medium' | 'low' (default 'medium')
- [ ] Generate and run migration successfully
- [ ] Typecheck passes

### US-002: Display priority indicator on task cards
**Description:** As a user, I want to see task priority at a glance so I know what needs attention first.

**Acceptance Criteria:**
- [ ] Each task card shows colored priority badge (red=high, yellow=medium, gray=low)
- [ ] Priority visible without hovering or clicking
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Add `priority` field to tasks table ('high' | 'medium' | 'low', default 'medium')
- FR-2: Display colored priority badge on each task card
- FR-3: Include priority selector in task edit modal
- FR-4: Add priority filter dropdown to task list header
- FR-5: Sort by priority within each status column (high to medium to low)

## Non-Goals

- No priority-based notifications or reminders
- No automatic priority assignment based on due date
- No priority inheritance for subtasks

## Technical Considerations

- Reuse existing badge component with color variants
- Filter state managed via URL search params
- Priority stored in database, not computed

## Success Metrics

- Users can change priority in under 2 clicks
- High-priority tasks immediately visible at top of lists
- No regression in task list performance

## Open Questions

- Should priority affect task ordering within a column?
- Should we add keyboard shortcuts for priority changes?
```

## Pre-Save Checklist

Before saving the PRD, verify:

- [ ] Introduced the PRD process to the user
- [ ] Walked through all Q&A steps (feature name, problem/goal, users, functionality, scope, success criteria)
- [ ] Used AskQuestion tool for multiple-choice questions
- [ ] Incorporated all user answers into the PRD
- [ ] User stories are small and specific
- [ ] Functional requirements are numbered and unambiguous
- [ ] Non-goals section defines clear boundaries
- [ ] UI stories include browser verification step
- [ ] Saved to `tasks/prd-[feature-name].md`
- [ ] Created `tasks/` directory if it didn't exist
- [ ] Provided friendly summary with next steps

## Important Notes

- **Do NOT start implementing**: Just create the PRD
- **Focus on clarity**: Write for developers who may not have context
- **Be specific**: Vague requirements lead to confusion
- **Number everything**: Makes referencing easy in discussions
- **Include verification steps**: Especially for UI work

## Tone & Approach

- **Use plain language**: Avoid jargon—the user may not be technical
- **Be encouraging**: Frame this as a conversation, not an interrogation
- **Explain the "why"**: Help users understand why each question matters
- **Adapt to their level**: If they're technical, you can use more precise terms; if not, keep it simple
- **Show progress**: Let them know how far through the process they are ("Almost done!", "Just two more questions")
- **Be patient**: If an answer is unclear, ask for clarification in a friendly way
