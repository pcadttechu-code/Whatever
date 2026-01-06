# Vocal Coach Web App - Complete Setup Guide

## Overview

This is a fully functional Vocal Coach Web App built with Next.js (frontend) and Express (backend) that uses OpenAI's APIs for:
- **Speech-to-Text (STT)**: Whisper model for transcribing user audio
- **Language Model (LLM)**: GPT-4o-mini for generating vocal coaching feedback
- **Text-to-Speech (TTS)**: OpenAI TTS for reading feedback aloud

## Prerequisites

- **Node.js 18+** and npm
- **OpenAI API Key** (obtain from https://platform.openai.com/account/api-keys)

## Installation & Setup

### 1. Set Up Environment Variables

```bash
cd vocal-coach-app
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## Running the Application

### Terminal 1: Start the Backend Server

```bash
cd vocal-coach-app/server
node server.js
```

You should see:
```
Server running on http://localhost:8080
WebSocket server ready on ws://localhost:8080
```

### Terminal 2: Start the Frontend Development Server

```bash
cd vocal-coach-app/frontend
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 3. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## How to Use the Application

1. **Click "Start Session"**: This will request microphone permission. Allow it to proceed.

2. **Click "Start Recording"**: Begin speaking your persuasive speech attempt in Spanish or English.

3. **Click "Stop Recording"**: End your recording when finished.

4. **Wait for Feedback**: The app will:
   - Transcribe your audio using Whisper
   - Analyze your speech using GPT-4o-mini
   - Generate coaching feedback
   - Read the feedback aloud using TTS

5. **Review Feedback**: You'll see:
   - **Decision**: Pass or Fail
   - **Feedback**: Specific areas for improvement
   - **Audio**: The feedback will play automatically

## API Integration Details

### Speech-to-Text (Whisper)
- **Model**: whisper-1
- **Input**: WebM audio from browser microphone
- **Output**: Transcribed text

### Language Model (GPT-4o-mini)
- **System Prompt**: Professional vocal coach persona
- **Input**: Transcribed speech text
- **Output**: JSON with decision, feedback, and TTS text
- **Response Format**: Structured JSON mode for reliable parsing

### Text-to-Speech (OpenAI TTS)
- **Model**: tts-1
- **Voice**: nova (natural and clear)
- **Input**: Feedback text from LLM
- **Output**: Base64-encoded MP3 audio

## Troubleshooting

### "OPENAI_API_KEY not found"
- Ensure `.env` file exists in the `vocal-coach-app` directory
- Verify your API key is correctly set in `.env`
- Restart both backend and frontend servers after updating `.env`

### "WebSocket connection failed"
- Ensure backend server is running on port 8080
- Check that no other process is using port 8080
- Verify firewall settings allow localhost connections

### "Microphone permission denied"
- Check browser microphone permissions
- Try a different browser or incognito mode
- Ensure you're using HTTPS in production (WSS required)

### "No audio output after recording"
- Verify your OpenAI API key is valid and has sufficient credits
- Check browser console for error messages
- Ensure speaker/audio output is enabled on your device

## Production Deployment

For production deployment:

1. **Frontend**: Deploy to Vercel, Netlify, or AWS S3 + CloudFront
2. **Backend**: Deploy to Heroku, Render, AWS Lambda, or Google Cloud Run
3. **Security**:
   - Use environment variables for API keys (never commit `.env`)
   - Enable HTTPS/WSS for secure WebSocket connections
   - Add rate limiting to prevent abuse
   - Validate and sanitize all user inputs

## File Structure

```
vocal-coach-app/
├── frontend/
│   ├── pages/
│   │   ├── _app.js        # Next.js app wrapper
│   │   └── index.js       # Main UI component
│   ├── styles.css         # Styling
│   ├── next.config.js     # Next.js configuration
│   └── package.json       # Frontend dependencies
├── server/
│   ├── server.js          # Express + WebSocket server
│   ├── llm-client.js      # STT and LLM integration
│   ├── tts-client.js      # TTS integration
│   └── package.json       # Backend dependencies
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Template for environment variables
└── README.md              # Original project documentation
```

## API Costs

OpenAI API usage will incur costs:
- **Whisper (STT)**: ~$0.02 per minute of audio
- **GPT-4o-mini (LLM)**: ~$0.15 per 1M input tokens, $0.60 per 1M output tokens
- **TTS**: ~$15 per 1M characters

Monitor your usage at https://platform.openai.com/account/usage/overview

## Support & Documentation

- OpenAI API Docs: https://platform.openai.com/docs
- Next.js Docs: https://nextjs.org/docs
- Express Docs: https://expressjs.com
- WebSocket Docs: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

## License

This project is provided as-is for educational and development purposes.
