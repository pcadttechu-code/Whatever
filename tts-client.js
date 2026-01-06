import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Synthesizes text to speech using OpenAI's TTS model.
 * @param {string} text - The text to synthesize.
 * @param {string} voice - The voice to use (e.g., 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer').
 * @returns {Promise<string>} Base64-encoded MP3 audio data.
 */
export async function synthesizeTTS(text, voice = 'nova') {
  try {
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
      response_format: 'aac',
    });

    // Convert the response stream to a Buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    console.log('TTS Buffer size:', buffer.length);
    // Return the base64-encoded string
    return buffer.toString('base64');

  } catch (error) {
    console.error('Error in synthesizeTTS:', error);
    return ''; // Return empty string on error
  }
}
