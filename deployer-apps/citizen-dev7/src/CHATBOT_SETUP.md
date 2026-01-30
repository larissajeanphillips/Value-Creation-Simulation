# AI Chatbot Setup (Advanced)

This questionnaire helps you create **custom AI agents** for your domain - specialized chatbots that understand your industry.

**This is optional.** Most users can skip this and use the `/setup` command for a simpler experience.

---

## When to Use This

Use this guide if you want to:
- Create industry-specific AI agents (healthcare, finance, legal, etc.)
- Build chatbots with specialized domain knowledge
- Set up multi-agent systems with routing

**If you just want a basic app without AI:** Use `/setup` instead - no AI Gateway needed.

---

## Prerequisites

Before filling this out, you need:
1. **AI Gateway credentials** from Platform McKinsey
2. A clear idea of what domain/industry you're working in
3. Understanding of what questions your chatbot should answer

**Don't have credentials?** Run `/add-ai` in Cursor chat for help getting them.

---

## 1. Industry & Domain Information

**What industry are you in?**
Examples: Healthcare, Finance, Manufacturing, Legal, Energy, Retail

**Answer:**
<!-- Your industry here -->


**What is the main purpose of your chatbot?**
Examples: Cost optimization, Compliance review, Risk analysis, Customer support, Design review

**Answer:**
<!-- Your main purpose here -->


**Describe your domain** (2-3 sentences):
What does your organization do? What problems will this chatbot help solve?

**Answer:**
<!-- Your description here -->


---

## 2. Agent Specializations

If you want multiple specialized agents (optional), define them here. Each agent handles a specific type of question.

**Don't need multiple agents?** Skip this section - a single general agent works fine.

### Agent 1

**Name:** <!-- e.g., "Compliance Review" -->

**When should this agent be used?**
<!-- What keywords or topics trigger this agent? -->

**What should this agent know about?**
<!-- Domain knowledge, regulations, standards, etc. -->


### Agent 2 (Optional)

**Name:**

**When should this agent be used?**

**What should this agent know about?**


### Agent 3 (Optional)

**Name:**

**When should this agent be used?**

**What should this agent know about?**


---

## 3. Reference Data (Optional)

Do you have documents the AI should reference when answering questions?

Examples:
- Company policies or guidelines
- Industry regulations
- Product specifications
- Best practices documents

- [ ] Yes, I have reference documents to add
- [ ] No, just use general knowledge

**If yes, what kind of documents?**
<!-- Describe your reference materials -->


---

## 4. AI Gateway Credentials

**Get these from Platform McKinsey > AI Gateway**

**Instance ID:**
<!-- Your instance ID -->

**API Key:**
<!-- Format: clientID:clientSecret -->


---

## 5. How to Use This

Once filled out:

1. **Save this file**
2. **In Cursor chat, type:**
   ```
   I've filled out CHATBOT_SETUP.md. Please generate my agents.
   ```
3. **Cursor will create:**
   - Agent files in `agents/`
   - System prompts in `configs/prompts/`
   - Routing configuration
   - AI Gateway integration

---

## Example: Healthcare Compliance Bot

**Industry:** Healthcare / Medical Devices

**Purpose:** Help engineers check if designs meet FDA requirements

**Agents:**
1. **Compliance Review** - FDA regulations, 510(k) requirements
2. **Risk Analysis** - Safety hazards, failure modes
3. **Design Validation** - Testing protocols, verification

**Reference Data:** FDA guidance documents, ISO standards, previous submissions

---

## Need Help?

- **Getting AI Gateway credentials:** Run `/add-ai` in chat
- **Understanding agents:** Ask "What are agents and how do they work?"
- **General questions:** Just ask in chat!
