# add-ai

Add AI chatbot capabilities to your app.

This command will be available in chat with `/add-ai`

## Overview

This command helps users set up AI Gateway credentials to enable AI-powered responses in their chatbot. It's intentionally separate from the main setup flow because:
1. Not everyone needs AI features
2. It requires getting credentials from Platform McKinsey
3. The app works fine without it (just with placeholder responses)

## When to Use

- User selected "AI Chatbot" in setup but didn't configure AI Gateway
- User asks "how do I make the chatbot actually respond?"
- User explicitly runs `/add-ai`

## Flow

### Step 1: Explain What This Does

"**Adding AI Capabilities to Your App**

Right now, your chatbot shows placeholder responses. To make it actually respond using AI (like GPT or Claude), you need to connect it to McKinsey's AI Gateway.

This is a one-time setup that takes about 5 minutes."

### Step 2: Check If They Have Credentials

Use AskQuestion:

```json
{
  "title": "AI Gateway Setup",
  "questions": [
    {
      "id": "has_credentials",
      "prompt": "Do you have your AI Gateway credentials?\n\nYou need two things from Platform McKinsey:\n• Instance ID\n• API Key (format: clientID:clientSecret)\n\nIf you don't have these yet, I can help you get them.",
      "options": [
        { "id": "yes", "label": "Yes, I have my credentials" },
        { "id": "no", "label": "No, I need to get them" },
        { "id": "what", "label": "What's AI Gateway?" }
      ]
    }
  ]
}
```

### If "What's AI Gateway?"

Explain simply:

"**What is AI Gateway?**

AI Gateway is McKinsey's secure way to use AI models like GPT-4 and Claude.

Instead of each app connecting directly to OpenAI or Anthropic, everything goes through AI Gateway. This means:
- ✓ Enterprise security and compliance
- ✓ Usage tracking and cost management
- ✓ One set of credentials for all AI models
- ✓ McKinsey-approved and supported

**To get access:**
1. Go to [Platform McKinsey](https://platform.mckinsey.com)
2. Find the AI Gateway service
3. Create an instance (or use an existing one)
4. Get your Instance ID and API Key

Would you like to set this up now or come back later?"

### If "No, I need to get them"

Provide step-by-step instructions:

"**How to Get AI Gateway Credentials**

1. **Go to Platform McKinsey**
   Open https://platform.mckinsey.com in your browser

2. **Find AI Gateway**
   Search for 'AI Gateway' or find it in the services catalog

3. **Create or Select an Instance**
   - If you don't have one: Click 'Create Instance'
   - If you have one: Select it from your list

4. **Get Your Credentials**
   - **Instance ID**: Shown on the instance details page
   - **API Key**: Create one in the 'API Keys' section
     Format: `clientID:clientSecret`

5. **Come back here**
   Once you have both, run `/add-ai` again and select 'Yes, I have my credentials'

**Need help?** Ask your team lead or the Platform McKinsey support team."

### If "Yes, I have my credentials"

Collect the credentials:

"Great! I'll need two pieces of information:

**1. What's your Instance ID?**
(This is a string like `abc123def456`)"

Wait for response, then:

"**2. What's your API Key?**
(Format: `clientID:clientSecret` - keep this secure!)"

### Step 3: Configure the Environment

After collecting credentials:

1. Create or update the `.env` file:

```bash
cd deployer-apps/citizen-dev7/src
cat > .env << 'EOF'
AI_GATEWAY_INSTANCE_ID=<their_instance_id>
AI_GATEWAY_API_KEY=<their_api_key>
EOF
```

2. Confirm success:

"**AI Gateway configured!**

Your credentials have been saved to `.env`. 

**Important:** This file contains secrets and should never be committed to git. It's already in `.gitignore`.

Would you like to restart your app to apply the changes?"

### Step 4: Test the Connection

If they want to restart:

1. Run the restart command
2. After restart, suggest testing:

"Your app is restarting with AI enabled.

**Test it out:**
1. Open http://localhost:3000
2. Try sending a message in the chat
3. You should get a real AI response now!

If it's not working, let me know what you see and I'll help troubleshoot."

## Troubleshooting

**"I'm getting an authentication error"**
→ Double-check the API key format is `clientID:clientSecret`
→ Make sure there are no extra spaces
→ Verify the credentials are still valid in Platform McKinsey

**"The chatbot still shows placeholder responses"**
→ Did you restart the app after adding credentials?
→ Check that the `.env` file is in the right location
→ Try `/restart` to reload the configuration

**"I don't have access to AI Gateway"**
→ Contact your team lead or engagement manager
→ They can add you to an existing instance or help create one

## Security Notes

- Never commit `.env` to git (it's in `.gitignore`)
- Don't share your API key
- If you accidentally expose credentials, rotate them in Platform McKinsey immediately
