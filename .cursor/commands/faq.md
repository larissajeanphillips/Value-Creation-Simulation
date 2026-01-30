# faq

Frequently asked questions with quick answers.

This command will be available in chat with `/faq`

When triggered, display these common questions and answers:

---

# Frequently Asked Questions

## Adding Features

**"How do I add a new page?"**
→ Just ask: "Create a new page called [name] that shows [content]"
Example: "Create a new page called Settings that shows user preferences"

**"How do I add a chart or graph?"**
→ Describe the data: "Add a bar chart showing sales by month"
→ Or be specific: "Add a pie chart with these categories: Marketing 40%, Sales 35%, Operations 25%"

**"How do I add a form?"**
→ Describe the fields: "Create a form with name, email, and message fields"
→ Include validation: "Make email required and validate it's a real email format"

**"How do I change colors or styling?"**
→ Be specific: "Make the header dark blue" or "Change the button color to green"
→ Or general: "Make it look more professional" or "Use a warmer color palette"

**"How do I add a database?"**
→ Ask: "I need to store [type of data]. Help me set up a database."
→ For simple cases, we can start with local storage or a JSON file.

---

## Running & Testing

**"How do I see my app?"**
→ Run `/launch` to start it, then open http://localhost:3000 in your browser.

**"My app won't start - what do I do?"**
→ First, try `/restart` to stop and restart everything.
→ If that doesn't work, describe the error message you see.

**"How do I stop the app?"**
→ Press Ctrl+C in the terminal where it's running, or close the terminal.
→ Or use `/restart` which stops and restarts.

---

## Making Changes

**"How do I undo a change?"**
→ Press Cmd+Z (Mac) or Ctrl+Z (Windows) to undo in the editor.
→ For bigger undos: "Undo the last change you made" or "Go back to before [specific change]"

**"What if I break something?"**
→ Don't worry! Git saves your history.
→ Just say: "Something broke, can we go back to when it was working?"
→ I can show you what changed and help you fix it.

**"Can I rename my app?"**
→ Just ask: "Rename my app to [new name]"
→ I'll update the title, package name, and any headers.

---

## Sharing & Deployment

**"How do I share my app with others?"**
→ Ask: "How do I deploy this app?" - we'll walk through options.
→ Options include: sharing a link, deploying to the cloud, or sharing the code.

**"Can someone else work on this with me?"**
→ Yes! Use `/commit` to save changes, then share the GitHub repository.
→ They can clone it and make their own changes.

**"How do I save my work?"**
→ Use `/commit` to save and push to GitHub.
→ Use `/commit-locally` to save without pushing (if you're not ready to share).

---

## AI & Chatbot Features

**"How do I add an AI chatbot?"**
→ Run `/add-ai` - it will guide you through connecting to AI Gateway.
→ This is optional and only needed if you want AI-powered responses.

**"What's AI Gateway?"**
→ It's McKinsey's service that connects your app to AI models like GPT.
→ You need credentials from Platform McKinsey to use it.
→ Your app works fine without it - AI features just won't respond.

---

## Data & Files

**"Can I use my own data?"**
→ Yes! Ask: "Help me connect to [Excel/CSV/API/database]"
→ I can import data from files or connect to external sources.

**"How do I upload files?"**
→ If your app has file upload: use the upload button in your app.
→ To add file upload: "Add a file upload feature"

**"Where is my data stored?"**
→ By default, sample data is just in the code (not saved).
→ For real apps, we can add a database or connect to existing data sources.

---

## General

**"I don't know what I want yet"**
→ That's fine! Just describe the problem you're trying to solve.
→ Example: "My team needs a better way to track project feedback"
→ I'll suggest features and we can iterate.

**"This is too complicated"**
→ No worries - let's simplify. Tell me one thing you want to change.
→ We can go step by step at whatever pace works for you.

**"Can I see the code?"**
→ Yes! Click on any file in the left sidebar to see it.
→ Or ask: "Show me the code for [specific component]"

---

**Have a question not listed here?** Just ask! There are no bad questions.
