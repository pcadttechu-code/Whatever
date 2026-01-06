import { OpenAI } from 'openai';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a professional vocal coach specializing in persuasive speaking and confidence.
Your task is to analyze a user's spoken transcript and provide constructive feedback.
The user is practicing a persuasive speech.
Your response MUST be a single JSON object with the following keys:
1. "decision": A string, either "pass" or "fail", based on the perceived confidence and clarity of the speech.
2. "feedback_short": A concise, one-sentence summary of the main feedback point (e.g., "Improve vowel clarity and soften the ending.").
3. "tts_text": A short, encouraging, or instructional sentence for the user to hear (e.g., "Try again, focus on vowel clarity and warmth.").

Do not include any other text or markdown outside of the JSON object.`;

/**
 * Transcribes an audio buffer using OpenAI's Whisper model.
 * @param {Buffer} buffer - The audio buffer from the WebSocket.
 * @returns {Promise<string>} The transcribed text.
 */
export async function speechToText(buffer) {
  const tempFilePath = path.join('/tmp', `audio-${Date.now()}.webm`);
  try {
    // 1. Save the buffer to a temporary file
    await fs.promises.writeFile(tempFilePath, buffer);

    // 2. Call the Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
    });

    // 3. Return the transcribed text
    return transcription.text;
  } catch (error) {
    console.error('Error in speechToText:', error);
    return `Error: Could not transcribe audio. ${error.message}`;
  } finally {
    // 4. Clean up the temporary file
    try {
      await fs.promises.unlink(tempFilePath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp file:', cleanupError);
    }
  }
}

/**
 * Calls the LLM to get feedback on the transcript.
 * @param {string} transcript - The transcribed text from the user.
 * @param {object} state - Current session state (not used in this minimal implementation).
 * @returns {Promise<{decision: string, feedback_short: string, tts_text: string}>} The structured feedback.
 */
export async function callLLM(transcript, state) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // A fast and capable model for this task
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `User's speech attempt: "${transcript}"` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const jsonResponse = completion.choices[0].message.content;
    return JSON.parse(jsonResponse);

  } catch (error) {
    console.error('Error in callLLM:', error);
    // Return a safe fallback response
    return {
      decision: 'fail',
      feedback_short: 'LLM error. Check API key and model response.',
      tts_text: 'There was an error processing your request. Please try again.'
    };
  }
}
