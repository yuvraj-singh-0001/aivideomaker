import React, { useState } from 'react';
import { 
  Sparkles, Film, Camera, Volume2, Mic, Clock, 
  RotateCcw, Play, CheckCircle2, Sliders, ChevronRight, Eye, RefreshCw, Plus, Trash2
} from 'lucide-react';
import { CAMERA_ANGLES } from '../services/aiDirector';
import { voiceEngine } from '../services/voiceEngine';

export default function ScreenAIFilmmaking({
  project,
  onUpdateProject,
  onProceedToFinal,
  onBackToCreator
}) {
  const [scenes, setScenes] = useState(project.scenes || []);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [isRegenerating, setIsRegenerating] = useState(null);
  const [isSpeakingPreview, setIsSpeakingPreview] = useState(false);

  const selectedScene = scenes[selectedSceneIndex] || scenes[0];

  // Pipeline steps indicator
  const pipelineSteps = [
    { title: 'Story Decomposition', desc: 'Hindi/Hinglish NLP split into dramatic beats', status: 'done' },
    { title: 'Camera Direction', desc: 'Angles, shot scale, POV & lighting assignment', status: 'done' },
    { title: 'Visual Rendering', desc: 'Real-time 1080p AI cinematic shot generation', status: 'done' },
    { title: 'Voiceover & Dialogue', desc: 'Synthesizing voice lines with subtitles', status: 'done' },
    { title: 'Audio & BGM Score', desc: 'Procedural suspense soundscape & SFX', status: 'done' }
  ];

  // Re-generate individual scene visual dynamically
  const handleRegenerateScene = async (index) => {
    setIsRegenerating(index);
    const sceneToUpdate = scenes[index];
    const newSeed = Math.floor(Math.random() * 899999) + 100000;
    
    let newImageUrl = sceneToUpdate.backupUrl;
    try {
      const res = await fetch(`http://localhost:5000/api/search-visuals?q=${encodeURIComponent(sceneToUpdate.visualPrompt || sceneToUpdate.scriptText)}&format=${project.videoFormat || 'movie'}`);
      if (res.ok) {
        const data = await res.json();
        if (data.url) newImageUrl = data.url;
      }
    } catch {
      // Fallback
    }

    const updatedScenes = [...scenes];
    updatedScenes[index] = {
      ...sceneToUpdate,
      seed: newSeed,
      imageUrl: newImageUrl,
      backupUrl: newImageUrl
    };
    setScenes(updatedScenes);
    onUpdateProject({ ...project, scenes: updatedScenes });
    setIsRegenerating(null);
  };

  // Change camera angle for a scene
  const handleCameraChange = async (index, newAngleType) => {
    const angleObj = CAMERA_ANGLES.find(a => a.type === newAngleType) || CAMERA_ANGLES[0];
    const updatedScenes = [...scenes];
    const scene = updatedScenes[index];

    // Reconstruct prompt with new camera angle
    const updatedPrompt = `${angleObj.type}, ${scene.scriptText}. Lighting: ${scene.lighting}. Masterpiece cinematic 4k.`;
    const newSeed = Math.floor(Math.random() * 899999) + 100000;

    let newImageUrl = scene.imageUrl;
    try {
      const res = await fetch(`http://localhost:5000/api/search-visuals?q=${encodeURIComponent(updatedPrompt)}&format=${project.videoFormat || 'movie'}`);
      if (res.ok) {
        const data = await res.json();
        if (data.url) newImageUrl = data.url;
      }
    } catch {
      // Keep existing
    }

    updatedScenes[index] = {
      ...scene,
      cameraAngle: angleObj.type,
      cameraDescription: angleObj.desc,
      visualPrompt: updatedPrompt,
      seed: newSeed,
      imageUrl: newImageUrl,
      backupUrl: newImageUrl
    };

    setScenes(updatedScenes);
    onUpdateProject({ ...project, scenes: updatedScenes });
  };

  // Update voiceover text for a scene
  const handleVoiceoverChange = (index, text) => {
    const updatedScenes = [...scenes];
    updatedScenes[index] = {
      ...updatedScenes[index],
      voiceover: text,
      scriptText: text
    };
    setScenes(updatedScenes);
    onUpdateProject({ ...project, scenes: updatedScenes });
  };

  // Test listen to voiceover
  const handlePlayVoiceover = (text) => {
    if (isSpeakingPreview) {
      voiceEngine.stop();
      setIsSpeakingPreview(false);
    } else {
      setIsSpeakingPreview(true);
      voiceEngine.speak(text, {
        lang: project.voiceLang || 'hi-IN'
      }).then(() => {
        setIsSpeakingPreview(false);
      });
    }
  };

  // Delete scene
  const handleDeleteScene = (index) => {
    if (scenes.length <= 1) return;
    const updatedScenes = scenes.filter((_, idx) => idx !== index);
    setScenes(updatedScenes);
    setSelectedSceneIndex(Math.max(0, index - 1));
    onUpdateProject({ ...project, scenes: updatedScenes });
  };

  // Add blank shot
  const handleAddScene = async () => {
    const num = scenes.length + 1;
    const defaultText = `Shot ${num}: The journey continues with exciting cinematic depth.`;
    let visualUrl = 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1280&auto=format&fit=crop&q=80';

    try {
      const res = await fetch(`http://localhost:5000/api/search-visuals?q=${encodeURIComponent(defaultText)}&format=${project.videoFormat || 'movie'}`);
      if (res.ok) {
        const data = await res.json();
        if (data.url) visualUrl = data.url;
      }
    } catch {
      // Fallback
    }

    const newScene = {
      id: `scene-${Date.now()}`,
      sceneNumber: num,
      title: `Shot ${num}: New Cinematic Beat`,
      scriptText: defaultText,
      cameraAngle: 'Extreme Wide Aerial Shot',
      cameraDescription: 'Expansive view establishing the cinematic landscape',
      lighting: 'Atmospheric natural cinema lighting',
      emotion: 'Anticipation',
      sfx: 'Cinematic orchestral swell',
      voiceover: defaultText,
      duration: 5.0,
      visualPrompt: defaultText,
      seed: Math.floor(Math.random() * 899999) + 100000,
      imageUrl: visualUrl,
      backupUrl: visualUrl,
      motionType: 'zoom-in'
    };
    const updated = [...scenes, newScene];
    setScenes(updated);
    setSelectedSceneIndex(updated.length - 1);
    onUpdateProject({ ...project, scenes: updated });
  };

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 6), 0);

  return (
    <div className="screen-container">
      {/* Header Bar */}
      <section className="filmmaking-header glass-panel">
        <div>
          <div className="badge badge-gold">
            <Sparkles size={14} /> Screen 3 — Automatic AI Filmmaking Studio
          </div>
          <h1 className="cinema-font mt-2">{project.title || 'AI Director Timeline'}</h1>
          <p className="text-secondary">
            AI has automatically deconstructed your story into <strong>{scenes.length} cinematic shots</strong> with tailored camera angles, lighting, voiceovers, and visual prompts.
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={onBackToCreator}>
            ✍️ Back to Story
          </button>
          <button className="btn btn-primary btn-lg pulse-btn" onClick={onProceedToFinal}>
            <Play size={18} fill="#07080d" />
            <span>Assemble & Play Final Video 🎥</span>
          </button>
        </div>
      </section>

      {/* AI Pipeline Stepper */}
      <div className="pipeline-stepper-glass glass-panel">
        <div className="stepper-title-row">
          <span className="stepper-main-title cinema-font">⚡ AI Autonomous Director Pipeline</span>
          <span className="stepper-status-badge">
            <CheckCircle2 size={15} color="#10b981" /> All Systems Green • Zero Paid API
          </span>
        </div>

        <div className="pipeline-steps-grid">
          {pipelineSteps.map((step, i) => (
            <div key={i} className="pipeline-step-item">
              <div className="step-number-circle">
                <CheckCircle2 size={16} />
              </div>
              <div className="step-info">
                <strong>{step.title}</strong>
                <span>{step.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storyboard & Timeline Editor Workspace */}
      <div className="filmmaking-workspace">
        {/* Left: Shot Cards Strip */}
        <div className="storyboard-sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">
              <Film size={16} /> Scene Storyboard ({scenes.length} Shots)
            </span>
            <button className="btn btn-secondary btn-sm" onClick={handleAddScene} title="Add Shot">
              <Plus size={14} /> Add Shot
            </button>
          </div>

          <div className="storyboard-list">
            {scenes.map((scene, idx) => (
              <div
                key={scene.id}
                className={`storyboard-card ${selectedSceneIndex === idx ? 'active' : ''}`}
                onClick={() => setSelectedSceneIndex(idx)}
              >
                <div className="card-thumb-mini">
                  {scene.videoUrl ? (
                    <video 
                      src={scene.videoUrl} 
                      muted 
                      playsInline 
                      loop 
                      autoPlay 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <img src={scene.imageUrl} alt={scene.title} />
                  )}
                  <span className="mini-badge">Shot {idx + 1}</span>
                  <span className="mini-duration">{scene.duration}s</span>
                  {scene.videoUrl && (
                    <span style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(16, 185, 129, 0.85)', color: '#fff', fontSize: '0.62rem', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                      ▶ Motion
                    </span>
                  )}
                </div>
                <div className="card-mini-content">
                  <h4 className="mini-title">{scene.title}</h4>
                  <p className="mini-angle">🎥 {scene.cameraAngle}</p>
                  <p className="mini-script">{scene.voiceover}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="timeline-summary glass-panel mt-3">
            <div className="summary-row">
              <span>Total Film Runtime:</span>
              <strong>{totalDuration} seconds ({Math.floor(totalDuration / 60)}m {totalDuration % 60}s)</strong>
            </div>
            <div className="summary-row">
              <span>Aspect Ratio:</span>
              <strong>{project.aspectRatio || '16:9 Cinema'}</strong>
            </div>
            <div className="summary-row">
              <span>Art Style:</span>
              <strong className="capitalize">{project.styleId || 'Cinematic'}</strong>
            </div>
            <div className="summary-row">
              <span>Video Engine:</span>
              <strong style={{ color: '#10b981' }}>Option 2: Hybrid Real Moving Video</strong>
            </div>
          </div>
        </div>

        {/* Right: Selected Scene Inspector & Fine-Tuning */}
        <div className="scene-inspector glass-panel">
          {selectedScene && (
            <>
              {/* Scene Visual Preview: Real Moving Video or HD Keyframe */}
              <div className="inspector-preview-wrapper">
                {selectedScene.videoUrl ? (
                  <video 
                    src={selectedScene.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="inspector-image"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                ) : (
                  <img 
                    src={selectedScene.imageUrl} 
                    alt={selectedScene.title} 
                    className="inspector-image"
                  />
                )}
                
                <div className="preview-floating-tags">
                  <span className="badge badge-gold">
                    <Camera size={13} /> {selectedScene.cameraAngle}
                  </span>
                  <span className="badge badge-cyan">
                    <Clock size={13} /> {selectedScene.duration}s
                  </span>
                  <span className="badge badge-purple">
                    {selectedScene.emotion}
                  </span>
                </div>

                <button 
                  className={`btn-regenerate-floating ${isRegenerating === selectedSceneIndex ? 'spin' : ''}`}
                  onClick={() => handleRegenerateScene(selectedSceneIndex)}
                  title="Regenerate this Shot with New AI Variation"
                  disabled={isRegenerating === selectedSceneIndex}
                >
                  <RefreshCw size={16} />
                  <span>{isRegenerating === selectedSceneIndex ? 'Generating...' : 'Re-roll Shot Visual'}</span>
                </button>
              </div>

              {/* Scene Details Editor */}
              <div className="inspector-form mt-4">
                <div className="form-row">
                  <div className="form-col">
                    <label className="sub-label">Camera Angle & Director Lens</label>
                    <select 
                      value={selectedScene.cameraAngle}
                      onChange={(e) => handleCameraChange(selectedSceneIndex, e.target.value)}
                    >
                      {CAMERA_ANGLES.map(ca => (
                        <option key={ca.type} value={ca.type}>{ca.type} — ({ca.desc})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-col">
                    <label className="sub-label">Shot Duration (seconds)</label>
                    <input 
                      type="number" 
                      min="3" 
                      max="15" 
                      value={selectedScene.duration || 6}
                      onChange={(e) => {
                        const updated = [...scenes];
                        updated[selectedSceneIndex].duration = Number(e.target.value);
                        setScenes(updated);
                        onUpdateProject({ ...project, scenes: updated });
                      }}
                    />
                  </div>
                </div>

                {/* Voiceover Dialogue */}
                <div className="form-group mt-3">
                  <div className="card-header-row">
                    <label className="sub-label">🎙️ Voiceover Line & Subtitle</label>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePlayVoiceover(selectedScene.voiceover)}
                    >
                      <Volume2 size={14} />
                      <span>{isSpeakingPreview ? 'Stop Voice' : 'Test Voice'}</span>
                    </button>
                  </div>
                  <textarea 
                    rows={2}
                    value={selectedScene.voiceover}
                    onChange={(e) => handleVoiceoverChange(selectedSceneIndex, e.target.value)}
                    placeholder="Dialogue or voice narration line..."
                  />
                </div>

                {/* Lighting & SFX Audio Cue */}
                <div className="form-row mt-3">
                  <div className="form-col">
                    <label className="sub-label">Lighting & Atmosphere</label>
                    <input 
                      type="text" 
                      value={selectedScene.lighting} 
                      onChange={(e) => {
                        const updated = [...scenes];
                        updated[selectedSceneIndex].lighting = e.target.value;
                        setScenes(updated);
                        onUpdateProject({ ...project, scenes: updated });
                      }}
                    />
                  </div>
                  <div className="form-col">
                    <label className="sub-label">Sound FX / Atmosphere Cue</label>
                    <input 
                      type="text" 
                      value={selectedScene.sfx} 
                      onChange={(e) => {
                        const updated = [...scenes];
                        updated[selectedSceneIndex].sfx = e.target.value;
                        setScenes(updated);
                        onUpdateProject({ ...project, scenes: updated });
                      }}
                    />
                  </div>
                </div>

                {/* AI Visual Prompt */}
                <div className="form-group mt-3">
                  <label className="sub-label">🤖 AI Prompt (Generated Automatically)</label>
                  <textarea 
                    rows={2}
                    className="code-textarea"
                    value={selectedScene.visualPrompt}
                    onChange={(e) => {
                      const updated = [...scenes];
                      updated[selectedSceneIndex].visualPrompt = e.target.value;
                      setScenes(updated);
                      onUpdateProject({ ...project, scenes: updated });
                    }}
                  />
                </div>

                {/* Delete Shot */}
                <div className="inspector-footer-actions mt-3">
                  {scenes.length > 1 && (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteScene(selectedSceneIndex)}
                    >
                      <Trash2 size={14} /> Remove This Shot
                    </button>
                  )}

                  <button className="btn btn-primary" onClick={onProceedToFinal}>
                    <span>Watch Full Movie in Screen 4</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
