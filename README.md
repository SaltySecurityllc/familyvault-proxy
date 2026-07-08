# Family Vault AI Proxy

Secure backend proxy that keeps your Anthropic API key off the frontend.

## Setup

1. Install dependencies:
   npm install

2. Create your .env file:
   cp .env.example .env
   Then open .env and paste your Anthropic API key

3. Run locally:
   npm run dev

4. Deploy to Railway (free):
   - Go to railway.app
   - Click New Project → Deploy from GitHub
   - Connect this repo
   - Add environment variable: ANTHROPIC_API_KEY = your key
   - Railway gives you a live URL like https://familyvault-proxy.up.railway.app

5. Update your Family Vault app:
   Replace PROXY_URL in FamilyVault_v3.jsx with your Railway URL

## Endpoints

GET  /          → Health check
POST /api/ai    → Send messages to Claude

## Request format

POST /api/ai
{
  "messages": [
    { "role": "user", "content": "Explain this document..." }
  ],
  "systemPrompt": "You are a document assistant..."
}

## Response format

{
  "reply": "Claude's response text here..."
}
