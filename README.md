# Vocal Coach Web App (Minimal Scaffold)

This repository is a minimal scaffold implementing the Vocal Coach app you requested:
- Next.js frontend that captures mic audio and streams to backend via WebSocket.
- Express backend with WebSocket endpoint that accepts audio chunks and demonstrates STT/LLM/TTS flow.
- Placeholder connectors for LLM, STT and TTS — you must add provider code and API keys.

**Important**: This scaffold is for local development. I cannot deploy to external hosting from here. Instructions to deploy are below.

## Structure
- `/frontend` — Next.js app (pages, components)
- `/server` — Express + ws backend
- `.env.example` — environment variables template

## How to run locally

Prerequisites: Node 18+, npm

1. Start backend
```bash
cd server
npm install
# set environment variables from .env.example
cp .env.example .env
# edit .env and add API keys
node server.js
```

2. Start frontend
```bash
cd frontend
npm install
npm run dev
# open http://localhost:3000
```

## Notes
- The frontend includes a "Start session" button which must be clicked once to allow microphone access. After granting permission the app will stream audio to the backend.
- The backend contains placeholder functions `speechToText`, `callLLM`, and `synthesizeTTS` in `server/llm-client.js` and `server/tts-client.js`. Replace those with real calls to OpenAI/Google/ElevenLabs or other providers.
- For production hosting: deploy frontend on Vercel/Netlify and backend on Heroku/AWS/GCP as a secure HTTPS/WSS endpoint. Configure env vars and HTTPS.

## Deployment (summary)
- Frontend: Vercel (recommended for Next.js)
- Backend: Heroku, Render, or Google Cloud Run. Ensure backend supports WebSocket or use WebRTC alternative.
- Use secure env variables for API keys, enable HTTPS/WSS, and configure OAuth redirect URIs for Copilot/Gemini integrations.

