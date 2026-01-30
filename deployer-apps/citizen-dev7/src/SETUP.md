# Agent Workspace Setup Questionnaire

Fill out this questionnaire to generate your industry-specific agent workspace. Once complete, share this file with Cursor and say: **"I've filled out SETUP.md. Please generate my industry-specific agents."**

---

## 1. Industry & Domain Information

**What industry are you in?**
<!-- Example: Healthcare, Finance, Manufacturing, Legal, Energy, etc. -->

**Answer:**
<!-- TODO: Replace with your industry (e.g., Healthcare, Finance, Manufacturing, Legal, Energy, etc.) -->


**What is your main objective for this agent system?**
<!-- Example: Cost optimization, Compliance review, Risk analysis, Design review, Quality assurance, etc. -->

**Answer:**
<!-- TODO: Replace with your main objective for this agent system -->



**Provide a brief description of your domain** (2-3 sentences):
<!-- What does your organization do? What problems are you trying to solve? -->

**Answer:**
<!-- TODO: Replace with a brief description of your domain (2-3 sentences) -->




---

## 2. Agent Specializations

Define 3-5 specialized agents for your domain. Each agent should handle a specific type of task or area of expertise.

### Agent 1

**Name:**
<!-- Short, descriptive name. Example: "Compliance Review", "Risk Analysis", "Cost Optimization" -->

<!-- TODO: Replace with your first agent's name -->

**When should this agent be used?**
<!-- Describe the scenarios, objectives, or keywords that should trigger this agent -->

<!-- TODO: Describe when this agent should be used -->



**What domain knowledge should this agent have?**
<!-- Key concepts, regulations, standards, methodologies this agent needs to know -->

<!-- TODO: List the domain knowledge this agent needs -->



### Agent 2

**Name:**

<!-- TODO: Replace with your second agent's name -->

**When should this agent be used?**

<!-- TODO: Describe when this agent should be used -->

**What domain knowledge should this agent have?**

<!-- TODO: List the domain knowledge this agent needs -->

### Agent 3

**Name:**

<!-- TODO: Replace with your third agent's name -->

**When should this agent be used?**

<!-- TODO: Describe when this agent should be used -->



**What domain knowledge should this agent have?**

<!-- TODO: List the domain knowledge this agent needs -->


---

## 3. Reference Data (Optional but Recommended)

**Do you have reference data that agents should access?**
<!-- Reference data examples: specifications, cost tables, regulatory documents, best practices, design templates -->

- [ ] Yes, I have reference data
- [x] No reference data yet

**If yes, describe what reference data you'll provide:**
<!-- For each agent, what files/data will you place in reference/{agent_name}/ directory? -->





---

## 4. AI Gateway Configuration

**IMPORTANT:** All LLM calls must go through McKinsey's AI Gateway. Get your credentials from Platform McKinsey.

### Your AI Gateway Credentials

**Instance ID:**
<!-- Get this from Platform McKinsey AI Gateway service -->

**Answer:**

<!-- TODO: Replace with your AI Gateway Instance ID from Platform McKinsey -->



**API Key:**
<!-- Get this from Platform McKinsey AI Gateway service -->
<!-- Format: This should be a single string in the format "clientID:clientSecret" -->
<!-- Note: This same API key works for all AI providers (OpenAI, Anthropic, Cohere, etc.) -->

**Answer:**

<!-- TODO: Replace with your AI Gateway API Key from Platform McKinsey (format: clientID:clientSecret) -->

---

## 5. Model Selection

Choose how you want to select models for your agents:

- [ ] **Explore models and optimize selection** - Cursor will fetch available models from your AI Gateway and suggest the best models for routing, analysis, and specialized tasks based on cost and capability.

- [x] **Use recommended defaults** - Use the latest GPT model (e.g., gpt-4o) for all agents. Quick setup, good quality, but potentially higher cost.

**Which option do you prefer?** (Check one above)

**Additional preferences** (if any):
<!-- Example: "Prefer Anthropic models", "Keep costs under $X/month", "Need fastest response time" -->

<!-- TODO: Add any additional model preferences -->



---

## 6. Output Format Preferences (Optional)

**Do you have specific requirements for agent outputs?**
<!-- Example: "Must include cost estimates", "Need regulatory citations", "Require risk scores", etc. -->

**Answer:**

<!-- TODO: Add any important constraints agents should respect -->


---

## 7. Constraints & Considerations (Optional)

**Are there important constraints agents should respect?**
<!-- Example: Safety requirements, regulatory compliance, cost limits, technical constraints, etc. -->

**Answer:**

<!-- TODO: Add any specific output format requirements -->


---

## Example Completed Setup (Healthcare)

To help you understand what a completed setup looks like, here's an example:

### 1. Industry & Domain
- **Industry:** Healthcare / Medical Devices
- **Main Objective:** Regulatory compliance review and FDA submission readiness
- **Description:** We design and manufacture Class II medical devices (glucose monitors, blood pressure cuffs). We need to ensure designs meet FDA regulations before submission.

### 2. Agent Specializations

**Agent 1: Compliance Review**
- When: Objectives mentioning compliance, regulatory, FDA, 510(k), PMA, ISO standards
- Knowledge: FDA 21 CFR Part 820, ISO 13485, ISO 14971, biocompatibility testing

**Agent 2: Risk Analysis**
- When: Objectives about risk assessment, hazard analysis, FMEA, safety
- Knowledge: ISO 14971 risk management, failure modes, hazard analysis methodologies

**Agent 3: Design Validation**
- When: Objectives about testing, verification, validation, protocols
- Knowledge: IEC 60601 testing standards, verification and validation procedures

### 3. Reference Data
- Yes, will provide: FDA guidance documents, device specifications, previous 510(k) submissions, ISO checklists

### 4. AI Gateway Configuration
- Instance ID: abc123def456
- API Key: my-client-id:my-client-secret

### 5. Model Selection
- [x] Explore models and optimize selection
- Preference: Balance cost and quality, prefer proven models

---

## Ready to Generate!

Once you've filled out all required sections:

1. **Save this file**
2. **In Cursor chat, say:** "I've filled out SETUP.md. Please generate my industry-specific agents."
3. **Cursor will:**
   - Validate your responses
   - Fetch available models from your AI Gateway (if you chose explore option)
   - Generate agent files, system prompts, and configurations
   - Update routing.yaml and settings.yaml
   - Provide next steps for testing

**Note:** Keep your credentials secure! They will be stored using environment variables, not hardcoded in files.
