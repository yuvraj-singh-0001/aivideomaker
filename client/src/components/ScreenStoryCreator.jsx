import React, { useState } from 'react';
import { 
  PenTool, Sparkles, User, Image as ImageIcon, Upload, 
  Trash2, Plus, Sliders, Film, Volume2, Monitor, Smartphone, Tv, Smile, Award, Wand2
} from 'lucide-react';
import { VIDEO_FORMATS, CINEMATIC_STYLES, MUSIC_MOODS, extractOrSynthesizeCharacters } from '../services/aiDirector';

export default function ScreenStoryCreator({
  project,
  onUpdateProject,
  onStartFilmmaking,
  isProcessing
}) {
  const [story, setStory] = useState(project.story || '');
  const [videoFormat, setVideoFormat] = useState(project.videoFormat || 'movie');
  const [styleId, setStyleId] = useState(project.styleId || 'cinematic');
  const [genreId, setGenreId] = useState(project.genreId || 'horror');
  const [aspectRatio, setAspectRatio] = useState(project.aspectRatio || '16:9');
  const [voiceLang, setVoiceLang] = useState(project.voiceLang || 'hi-IN');
  const [characters, setCharacters] = useState(project.characters || []);

  // Character edit state
  const [showAddChar, setShowAddChar] = useState(false);
  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState('heroine');
  const [newCharDesc, setNewCharDesc] = useState('');
  const [newCharAvatar, setNewCharAvatar] = useState('');

  // Handle character photo upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setNewCharAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCharacter = (e) => {
    e.preventDefault();
    if (!newCharName.trim()) return;

    const newChar = {
      id: `char-${Date.now()}`,
      name: newCharName.trim(),
      role: newCharRole,
      description: newCharDesc.trim() || 'distinct character appearance',
      avatar: newCharAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80'
    };

    const updated = [...characters, newChar];
    setCharacters(updated);
    setNewCharName('');
    setNewCharDesc('');
    setNewCharAvatar('');
    setShowAddChar(false);

    onUpdateProject({ ...project, characters: updated });
  };

  const handleRemoveCharacter = (id) => {
    const updated = characters.filter(c => c.id !== id);
    setCharacters(updated);
    onUpdateProject({ ...project, characters: updated });
  };

  const handleAutoDetectCharacters = () => {
    if (!story.trim()) return;
    const detected = extractOrSynthesizeCharacters(story, videoFormat, genreId);
    if (detected.length > 0) {
      setCharacters(detected);
      onUpdateProject({ ...project, characters: detected });
    }
  };

  // Launch AI Filmmaker with selected video format
  const handleLaunchFilmmaker = () => {
    if (!story.trim()) return;

    let finalChars = characters;
    if (!finalChars || finalChars.length === 0) {
      finalChars = extractOrSynthesizeCharacters(story.trim(), videoFormat, genreId);
    }

    const updatedProject = {
      ...project,
      story: story.trim(),
      videoFormat,
      styleId,
      genreId,
      aspectRatio,
      voiceLang,
      characters: finalChars
    };

    onUpdateProject(updatedProject);
    onStartFilmmaking(updatedProject);
  };

  return (
    <div className="screen-container">
      {/* Header */}
      <section className="creator-header glass-panel">
        <div>
          <div className="badge badge-gold">
            <PenTool size={14} /> Screen 2 — Story & Format Creator
          </div>
          <h1 className="cinema-font mt-2">Write Prompt, Choose Format & Characters</h1>
          <p className="text-secondary">
            Write your prompt in <strong>Hindi, Hinglish, or English</strong>. Create Movies, Breaking News TV Broadcasts, or 3D Cartoon Animations with 1-click automatic AI filmmaking.
          </p>
        </div>

        <button 
          className="btn btn-primary btn-lg pulse-btn"
          onClick={handleLaunchFilmmaker}
          disabled={!story.trim() || isProcessing}
        >
          <Sparkles size={20} />
          <span>{isProcessing ? 'Directing Scenes...' : '🎬 Start Automatic AI Filmmaking'}</span>
        </button>
      </section>

      {/* 1. Video Format Selector (Movie, News, Cartoon, Documentary) */}
      <section className="format-selector-section glass-panel mb-4">
        <div className="card-header-row mb-2">
          <label className="section-title">
            <span>🎥 Choose Video Format / Category</span>
          </label>
          <span className="badge badge-cyan capitalize">{videoFormat} Mode Active</span>
        </div>
        <p className="section-hint">Select whether you want a Cinema Movie, Live News Broadcast, or 3D Cartoon Animation.</p>

        <div className="format-cards-grid">
          {VIDEO_FORMATS.map((fmt) => (
            <div
              key={fmt.id}
              className={`format-card ${videoFormat === fmt.id ? 'active' : ''}`}
              onClick={() => {
                setVideoFormat(fmt.id);
                if (fmt.id === 'news') setGenreId('action');
                if (fmt.id === 'cartoon') setStyleId('3d');
              }}
            >
              <div className="format-card-icon">{fmt.icon}</div>
              <div className="format-card-body">
                <strong className="format-name">{fmt.name}</strong>
                <span className="format-tag">{fmt.tag}</span>
                <p className="format-desc">{fmt.desc}</p>
              </div>
              {videoFormat === fmt.id && <div className="format-check">✓</div>}
            </div>
          ))}
        </div>
      </section>

      <div className="creator-grid">
        {/* Left Column: Story Script Input */}
        <div className="creator-left">
          <div className="glass-panel creator-card">
            <div className="card-header-row">
              <label className="section-title">
                <span>✨ AI Director Master Prompt (Any Topic, Any Story, Any Language)</span>
              </label>
              <div className="word-counter">
                {story.trim().split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            <textarea
              className="story-textarea"
              rows={8}
              placeholder={`Describe ANY video or movie you want AI to generate (Hindi, Hinglish, or English)...

Examples:
• A dramatic 35mm cinema film: Ek anokha safar jahan har mod par ek naya mod aur jazbaat hain.
• A 3D cartoon animation: A cute curious creature discovering a magical hidden waterfall.
• A futuristic sci-fi thriller: Deep space explorers discovering an ancient alien artifact on a frozen planet.
• A funny comedy scene: Two friends trying to cook dinner for their boss with comical chaos.
• Breaking News: Urgent live report from the national observatory.
• Or paste your full customized script, characters, and dialogues!`}
              value={story}
              onChange={(e) => setStory(e.target.value)}
            />

            {/* Flow AI Quick Style Chips (Updates format and style cleanly) */}
            <div className="quick-inspiration-row">
              <span className="inspiration-label">Format Presets:</span>
              <button 
                type="button" 
                className={`chip-btn ${videoFormat === 'cartoon' ? 'active' : ''}`}
                onClick={() => { setVideoFormat('cartoon'); setStyleId('3d'); }}
              >
                ✨ 3D Animation
              </button>
              <button 
                type="button" 
                className={`chip-btn ${videoFormat === 'movie' && styleId === 'cinematic' ? 'active' : ''}`}
                onClick={() => { setVideoFormat('movie'); setStyleId('cinematic'); }}
              >
                🎬 35mm Cinema Film
              </button>
              <button 
                type="button" 
                className={`chip-btn ${styleId === 'cyberpunk' ? 'active' : ''}`}
                onClick={() => { setVideoFormat('movie'); setStyleId('cyberpunk'); setGenreId('cyber'); }}
              >
                🌆 Cyberpunk Sci-Fi
              </button>
              <button 
                type="button" 
                className={`chip-btn ${videoFormat === 'news' ? 'active' : ''}`}
                onClick={() => { setVideoFormat('news'); setStyleId('cinematic'); setGenreId('action'); }}
              >
                📺 Breaking News Live
              </button>
              <button 
                type="button" 
                className={`chip-btn ${styleId === 'anime' ? 'active' : ''}`}
                onClick={() => { setVideoFormat('movie'); setStyleId('anime'); }}
              >
                🎨 Anime / Fantasy
              </button>
              <button 
                type="button" 
                className={`chip-btn ${videoFormat === 'documentary' ? 'active' : ''}`}
                onClick={() => { setVideoFormat('documentary'); setStyleId('cinematic'); setGenreId('ancient'); }}
              >
                🏛️ NatGeo Documentary
              </button>
            </div>
          </div>

          {/* Visual Style Selector */}
          <div className="glass-panel creator-card mt-4">
            <label className="section-title">
              <span>🎨 Visual Render Style</span>
            </label>
            <p className="section-hint">Select the artistic visual look for AI to render each shot.</p>

            <div className="styles-grid">
              {CINEMATIC_STYLES.map((style) => (
                <div
                  key={style.id}
                  className={`style-card ${styleId === style.id ? 'active' : ''}`}
                  onClick={() => setStyleId(style.id)}
                >
                  <div className="style-icon">{style.icon}</div>
                  <div className="style-info">
                    <div className="style-name">{style.name}</div>
                    <div className="style-tag">{style.tag}</div>
                    <div className="style-desc">{style.desc}</div>
                  </div>
                  {styleId === style.id && <div className="style-checkmark">✓</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Characters & Settings */}
        <div className="creator-right">
          {/* Characters Uploader */}
          <div className="glass-panel creator-card">
            <div className="card-header-row">
              <label className="section-title">
                <span>🎭 Characters ({characters.length})</span>
              </label>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={handleAutoDetectCharacters}
                  title="Automatically extract characters from your prompt"
                >
                  <Wand2 size={13} />
                  <span>Auto-Detect</span>
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowAddChar(!showAddChar)}
                >
                  <Plus size={14} />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <p className="section-hint">
              Upload photo of characters (Hero, Anchor, Cartoon Lead). AI keeps their appearance and clothing consistent throughout all scenes.
            </p>

            {/* Existing Characters List */}
            <div className="characters-list">
              {characters.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.12)', margin: '0.5rem 0' }}>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8' }}>
                    ✨ AI automatically extracts characters from your prompt when you start filmmaking, or click <strong>Auto-Detect</strong> anytime!
                  </p>
                </div>
              ) : (
                characters.map((char) => (
                  <div key={char.id} className="character-item">
                    <img src={char.avatar} alt={char.name} className="char-avatar" />
                    <div className="char-details">
                      <div className="char-name-row">
                        <strong>{char.name}</strong>
                        <span className="badge badge-gold">{char.role}</span>
                      </div>
                      <p className="char-desc">{char.description}</p>
                    </div>
                    <button 
                      className="btn-icon btn-icon-danger"
                      onClick={() => handleRemoveCharacter(char.id)}
                      title="Remove Character"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add Character Form */}
            {showAddChar && (
              <form onSubmit={handleAddCharacter} className="add-char-form glass-panel">
                <div className="form-row">
                  <div className="form-col">
                    <label>Character Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Kabir, News Anchor Rohit, Chintu"
                      value={newCharName}
                      onChange={(e) => setNewCharName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-col">
                    <label>Role</label>
                    <select value={newCharRole} onChange={(e) => setNewCharRole(e.target.value)}>
                      <option value="hero">Main Lead / Hero</option>
                      <option value="heroine">Heroine</option>
                      <option value="anchor">News Anchor / Presenter</option>
                      <option value="mystery">Mysterious Character</option>
                      <option value="villain">Villain / Antagonist</option>
                      <option value="sidekick">Side Character</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label>Appearance & Clothing (for AI visual consistency)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. wearing blue suit and tie, holding microphone"
                    value={newCharDesc}
                    onChange={(e) => setNewCharDesc(e.target.value)}
                  />
                </div>

                <div className="form-group mt-2">
                  <label>Upload Character Photo / Face Reference</label>
                  <div className="file-upload-box">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      id="char-file-input"
                      className="hidden-file-input"
                    />
                    <label htmlFor="char-file-input" className="file-upload-label">
                      {newCharAvatar ? (
                        <div className="uploaded-preview">
                          <img src={newCharAvatar} alt="preview" />
                          <span>Photo selected (click to change)</span>
                        </div>
                      ) : (
                        <div className="upload-placeholder">
                          <Upload size={22} />
                          <span>Click to upload character photo from phone/PC</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="form-actions mt-3">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddChar(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Character
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Video Format & Audio Settings */}
          <div className="glass-panel creator-card mt-4">
            <label className="section-title">
              <span>⚙️ Video Format & Voice Settings</span>
            </label>

            {/* Aspect Ratio */}
            <div className="form-group mt-3">
              <label className="sub-label">Screen Aspect Ratio</label>
              <div className="aspect-ratio-row">
                <button
                  type="button"
                  className={`aspect-btn ${aspectRatio === '16:9' ? 'active' : ''}`}
                  onClick={() => setAspectRatio('16:9')}
                >
                  <Monitor size={18} />
                  <span>16:9 Landscape / TV</span>
                </button>
                <button
                  type="button"
                  className={`aspect-btn ${aspectRatio === '9:16' ? 'active' : ''}`}
                  onClick={() => setAspectRatio('9:16')}
                >
                  <Smartphone size={18} />
                  <span>9:16 Shorts / Reel</span>
                </button>
              </div>
            </div>

            {/* Voice Language */}
            <div className="form-group mt-3">
              <label className="sub-label">Voiceover Narrator</label>
              <select value={voiceLang} onChange={(e) => setVoiceLang(e.target.value)}>
                <option value="hi-IN">🇮🇳 Hindi Voice Narrator (hi-IN)</option>
                <option value="en-IN">🇮🇳 Indian English / Hinglish Narrator (en-IN)</option>
                <option value="en-US">🎬 English Cinematic Narrator (en-US)</option>
              </select>
            </div>

            {/* BGM Mood */}
            <div className="form-group mt-3">
              <label className="sub-label">Background Music Score</label>
              <select value={genreId} onChange={(e) => setGenreId(e.target.value)}>
                {MUSIC_MOODS.map(m => (
                  <option key={m.id} value={m.id}>{m.name} — ({m.desc})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Big CTA Button */}
          <div className="mt-4">
            <button 
              className="btn btn-primary btn-block btn-xl pulse-btn"
              onClick={handleLaunchFilmmaker}
              disabled={!story.trim() || isProcessing}
            >
              <Sparkles size={22} />
              <span>{isProcessing ? 'Directing Scenes...' : '1-Click Generate Video 🎬'}</span>
            </button>
            <p className="free-guarantee-note">
              ✓ 100% Free • Royalty-Free Safe for YouTube/Instagram • No paid API required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
