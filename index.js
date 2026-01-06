import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket(window.location.protocol.replace('http', 'ws') + '//' + window.location.host + '/ws');
    wsRef.current.onopen = () => console.log('ws open');
    wsRef.current.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'transcript') setTranscript(msg.text);
        if (msg.type === 'judgement') setMessages(prev => [...prev, msg]);
        if (msg.type === 'tts') {
          const audio = new Audio('data:audio/aac;base64,' + msg.audioBase64);
          audio.play();
        }
      } catch(e) {
        console.error('invalid ws message', e);
      }
    };
    return () => wsRef.current && wsRef.current.close();
  }, []);

  async function startSession() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.addEventListener('dataavailable', async e => {
      if (!e.data || e.data.size === 0) return;
      const arr = await e.data.arrayBuffer();
      const base64 = arrayBufferToBase64(arr);
      wsRef.current.send(JSON.stringify({ type: 'audio_chunk', data: base64 }));
    });

    mediaRecorder.start(500);
  }

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i=0;i<len;i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  return (
    <div style={{padding:20,fontFamily:'sans-serif'}}>
      <Head><title>Vocal Coach</title></Head>
      <h1>Vocal Coach</h1>
      <button onClick={startSession}>Start session (click once)</button>
      <div style={{marginTop:10}}>
        <strong>Live transcript:</strong>
        <div style={{background:'#f5f5f5',padding:10,marginTop:6}}>{transcript}</div>
      </div>
      <div style={{marginTop:10}}>
        <strong>Messages:</strong>
        <div>
          {messages.map((m,i)=> <pre key={i} style={{background:'#fff8dc',padding:8}}>{JSON.stringify(m,null,2)}</pre>)}
        </div>
      </div>
    </div>
  );
}
