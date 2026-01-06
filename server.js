import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { speechToText } from './llm-client.js';
import { callLLM } from './llm-client.js';
import { synthesizeTTS } from './tts-client.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('client connected');
  let audioChunks = [];

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'audio_chunk') {
        const buf = Buffer.from(msg.data, 'base64');
        audioChunks.push(buf);

        if (audioChunks.length > 6) {
          const merged = Buffer.concat(audioChunks);
          audioChunks = [];
          const transcript = await speechToText(merged);
          ws.send(JSON.stringify({ type: 'transcript', text: transcript }));

          // call LLM to judge and produce response
          const judgement = await callLLM(transcript, {}); // pass session state here
          ws.send(JSON.stringify({ type: 'judgement', ...judgement }));

          if (judgement.tts_text) {
            const audioBase64 = await synthesizeTTS(judgement.tts_text, 'male_voice');
            ws.send(JSON.stringify({ type: 'tts', audioBase64 }));
          }
        }
      }
    } catch(e) {
      console.error('error processing ws message', e);
    }
  });

  ws.on('close', () => console.log('client disconnected'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, ()=> console.log('server listening on', PORT));
