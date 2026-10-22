import React, { useState } from 'react';
import { Smartphone, Copy, Check, X, Code, Mic, Film, Database, Server } from 'lucide-react';

export default function MobileApiModal({ isOpen, onClose }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [selectedLang, setSelectedLang] = useState('flutter'); // 'flutter' | 'reactnative' | 'curl'

  if (!isOpen) return null;

  const endpoints = [
    {
      title: '1. Ultra-Realistic Neural Human Voice (TTS)',
      method: 'POST',
      path: '/api/tts',
      desc: 'Generates 100% human-grade, emotion-rich MP3 audio in Hindi (Mother/Hero) and English.',
      payload: {
        text: 'बेटा, गिर जाना हार नहीं है।',
        speaker: 'mother',
        lang: 'hi-IN'
      },
      flutterSnippet: `final res = await http.post(
  Uri.parse('http://<YOUR_IP>:5000/api/tts'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'text': 'बेटा, गिर जाना हार नहीं है।',
    'speaker': 'mother',
    'lang': 'hi-IN'
  }),
);
// Play response.bodyBytes in AudioPlayer`,
      rnSnippet: `const response = await fetch('http://<YOUR_IP>:5000/api/tts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'बेटा, गिर जाना हार नहीं है।',
    speaker: 'mother',
    lang: 'hi-IN'
  })
});
const blob = await response.blob();`,
      curlSnippet: `curl -X POST http://localhost:5000/api/tts \\
  -H "Content-Type: application/json" \\
  -d '{"text":"नमस्ते बेटा","speaker":"mother","lang":"hi-IN"}' \\
  --output voice.mp3`
    },
    {
      title: '2. AI Story & Screenplay Decomposer',
      method: 'POST',
      path: '/api/decompose-story',
      desc: 'Breaks any Hindi/Hinglish/English story or master prompt into camera shots, dialogues, and lighting.',
      payload: {
        story: 'Ek ladka gaon mein bada sapna dekhta hai...',
        genre: 'romance',
        videoFormat: 'cartoon'
      },
      flutterSnippet: `final res = await http.post(
  Uri.parse('http://<YOUR_IP>:5000/api/decompose-story'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'story': storyController.text,
    'videoFormat': 'cartoon'
  }),
);
final data = jsonDecode(res.body);
final scenes = data['scenes'];`,
      rnSnippet: `const res = await fetch('http://<YOUR_IP>:5000/api/decompose-story', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ story: userStory, videoFormat: 'movie' })
});
const { scenes } = await res.json();`,
      curlSnippet: `curl -X POST http://localhost:5000/api/decompose-story \\
  -H "Content-Type: application/json" \\
  -d '{"story":"Ek ladka raat ko jungle mein kho jata hai...","videoFormat":"movie"}'`
    },
    {
      title: '3. Project Database (Cloud Sync)',
      method: 'GET & POST',
      path: '/api/projects',
      desc: 'Fetch, save, and sync filmmaking projects and scene beats across mobile and web.',
      payload: {
        id: 'proj-123',
        title: 'My Mobile Film',
        scenes: []
      },
      flutterSnippet: `// Get All Projects
final res = await http.get(Uri.parse('http://<YOUR_IP>:5000/api/projects'));
final projects = jsonDecode(res.body)['projects'];`,
      rnSnippet: `// Save Project
await fetch('http://<YOUR_IP>:5000/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(currentProject)
});`,
      curlSnippet: `curl http://localhost:5000/api/projects`
    },
    {
      title: '4. Open-Source Video Diffusion Specs (Wan 2.1 & LTX)',
      method: 'GET',
      path: '/api/video-engine/specs',
      desc: 'Inspects self-hosted Wan 2.1 (Alibaba) and LTX-Video connection status and hardware profiles.',
      payload: null,
      flutterSnippet: `final res = await http.get(Uri.parse('http://<YOUR_IP>:5000/api/video-engine/specs'));
final specs = jsonDecode(res.body);`,
      rnSnippet: `const res = await fetch('http://<YOUR_IP>:5000/api/video-engine/specs');
const specs = await res.json();`,
      curlSnippet: `curl http://localhost:5000/api/video-engine/specs`
    }
  ];

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card mobile-api-modal glass-panel-glow" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="d-flex align-center gap-3">
            <div className="icon-badge-gold">
              <Smartphone size={22} />
            </div>
            <div>
              <h2 className="cinema-font" style={{ fontSize: '1.4rem', margin: 0 }}>
                Mobile App Developer API Hub
              </h2>
              <p className="text-secondary" style={{ fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                Connect these live endpoints into your Flutter, React Native, or Android/iOS App
              </p>
            </div>
          </div>
          <button className="icon-btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Code Lang Tabs */}
        <div className="api-tabs-bar">
          <button 
            className={`api-tab-btn ${selectedLang === 'flutter' ? 'active' : ''}`}
            onClick={() => setSelectedLang('flutter')}
          >
            Flutter (Dart)
          </button>
          <button 
            className={`api-tab-btn ${selectedLang === 'reactnative' ? 'active' : ''}`}
            onClick={() => setSelectedLang('reactnative')}
          >
            React Native (JS/TS)
          </button>
          <button 
            className={`api-tab-btn ${selectedLang === 'curl' ? 'active' : ''}`}
            onClick={() => setSelectedLang('curl')}
          >
            cURL / Terminal
          </button>
        </div>

        {/* Endpoints List */}
        <div className="api-endpoints-scroll">
          {endpoints.map((ep, idx) => {
            const codeSnippet = selectedLang === 'flutter' 
              ? ep.flutterSnippet 
              : selectedLang === 'reactnative' 
              ? ep.rnSnippet 
              : ep.curlSnippet;

            return (
              <div key={idx} className="api-endpoint-card glass-panel">
                <div className="api-endpoint-top">
                  <span className={`method-badge method-${ep.method.toLowerCase().split(' ')[0]}`}>
                    {ep.method}
                  </span>
                  <code className="endpoint-path">{ep.path}</code>
                  <button 
                    className="btn btn-secondary btn-xs copy-btn"
                    onClick={() => handleCopy(codeSnippet, idx)}
                  >
                    {copiedIdx === idx ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    <span>{copiedIdx === idx ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>

                <h4 style={{ margin: '8px 0 4px 0', fontSize: '1.05rem', color: '#f8fafc' }}>{ep.title}</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#94a3b8' }}>{ep.desc}</p>

                <div className="code-block-wrapper">
                  <pre className="code-block">
                    <code>{codeSnippet}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="modal-footer" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
          <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
            💡 <strong style={{ color: '#e2e8f0' }}>Production Tip:</strong> Replace <code>http://localhost:5000</code> with your live cloud domain (e.g. <code>https://api.yourdomain.com</code>) when deploying to app stores.
          </div>
          <button className="btn btn-primary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
