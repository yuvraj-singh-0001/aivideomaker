import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Download, Maximize, Volume2, 
  VolumeX, Subtitles, Film, CheckCircle2, Sparkles, Share2, FileText, ArrowLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { VideoCompositor } from '../services/videoCompositor';
import { audioEngine } from '../services/audioEngine';

export default function ScreenFinalVideo({
  project,
  onBackToFilmmaking,
  onBackToStory
}) {
  const canvasRef = useRef(null);
  const compositorRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState('');

  const scenes = project.scenes || [];
  const currentScene = scenes[currentSceneIdx] || scenes[0];
  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 6), 0);

  // Initialize Canvas Compositor
  useEffect(() => {
    if (!canvasRef.current) return;

    const comp = new VideoCompositor(canvasRef.current);
    comp.subtitlesEnabled = subtitlesEnabled;
    comp.setVideoFormat(project.videoFormat || 'movie');
    comp.onSceneChange = (idx) => {
      setCurrentSceneIdx(idx);
    };
    comp.onPlaybackEnd = () => {
      setIsPlaying(false);
    };

    comp.preloadScenes(scenes).then(() => {
      // Draw first frame preview
      if (scenes.length > 0) {
        comp._drawFrame(scenes[0], 0);
      }
    });

    compositorRef.current = comp;

    return () => {
      if (comp) {
        comp.stop();
      }
    };
  }, [project.id]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!compositorRef.current) return;

    if (isPlaying) {
      compositorRef.current.pause();
      setIsPlaying(false);
    } else {
      compositorRef.current.subtitlesEnabled = subtitlesEnabled;
      compositorRef.current.play(currentSceneIdx, project.genreId || 'horror');
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (!compositorRef.current) return;
    setCurrentSceneIdx(0);
    compositorRef.current.subtitlesEnabled = subtitlesEnabled;
    compositorRef.current.play(0, project.genreId || 'horror');
    setIsPlaying(true);
  };

  const toggleSubtitles = () => {
    const nextState = !subtitlesEnabled;
    setSubtitlesEnabled(nextState);
    if (compositorRef.current) {
      compositorRef.current.subtitlesEnabled = nextState;
      if (!isPlaying && scenes.length > 0) {
        compositorRef.current._drawFrame(scenes[currentSceneIdx], 0);
      }
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioEngine.setVolume(next ? 0 : 0.7);
  };

  const handleFullscreen = () => {
    if (!canvasRef.current) return;
    if (canvasRef.current.requestFullscreen) {
      canvasRef.current.requestFullscreen();
    }
  };

  // One-Click MP4 Export
  const handleExportMP4 = async () => {
    if (!compositorRef.current || isExporting) return;

    // Pause any live playback first
    compositorRef.current.stop();
    setIsPlaying(false);

    setIsExporting(true);
    setExportProgress(0);

    try {
      const result = await compositorRef.current.exportVideo(
        (progress) => setExportProgress(progress),
        project.genreId || 'horror'
      );

      if (result && result.url) {
        setDownloadUrl(result.url);
        const ext = result.isMp4 ? 'mp4' : 'webm';
        const filename = `${project.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_final.${ext}`;
        setDownloadFilename(filename);

        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Trigger automatic download
        const a = document.createElement('a');
        a.href = result.url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Download Screenplay Script
  const handleDownloadScript = () => {
    const screenplayLines = [
      `TITLE: ${project.title.toUpperCase()}`,
      `GENRE: ${project.genre || 'Cinematic'}`,
      `ESTIMATED RUNTIME: ${totalDuration} seconds`,
      `==================================================`,
      `RAW STORY:`,
      project.story,
      `==================================================\n`
    ];

    scenes.forEach((s, idx) => {
      screenplayLines.push(`[SCENE ${idx + 1}] - ${s.cameraAngle.toUpperCase()}`);
      screenplayLines.push(`LIGHTING: ${s.lighting}`);
      screenplayLines.push(`SFX: ${s.sfx}`);
      screenplayLines.push(`EMOTION: ${s.emotion}`);
      screenplayLines.push(`VOICEOVER: "${s.voiceover}"`);
      screenplayLines.push(`VISUAL PROMPT: ${s.visualPrompt}`);
      screenplayLines.push(`--------------------------------------------------\n`);
    });

    const blob = new Blob([screenplayLines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/[^a-z0-9]/gi, '_')}_screenplay.txt`;
    a.click();
  };

  return (
    <div className="screen-container">
      {/* Top Banner */}
      <section className="final-header glass-panel">
        <div>
          <div className="badge badge-gold">
            <Film size={14} /> Screen 4 — Final Cinematic Video
          </div>
          <h1 className="cinema-font mt-2">{project.title}</h1>
          <p className="text-secondary">
            Your final cinematic movie is ready with stitched visual scenes, camera movements, voice-over, background music score, and movie subtitles.
          </p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary" onClick={onBackToFilmmaking}>
            <ArrowLeft size={16} /> Back to Studio
          </button>

          <button 
            className="btn btn-primary btn-lg pulse-btn"
            onClick={handleExportMP4}
            disabled={isExporting}
          >
            <Download size={18} />
            <span>{isExporting ? `Rendering MP4 (${exportProgress}%)...` : 'Download Final Video (MP4) 📥'}</span>
          </button>
        </div>
      </section>

      {/* Main Theatre Player Layout */}
      <div className="theatre-layout">
        {/* Cinema Video Player Canvas */}
        <div className="cinema-player-box glass-panel-glow">
          <div className="canvas-aspect-wrapper">
            <canvas 
              ref={canvasRef} 
              width={1280} 
              height={720}
              className="theatre-canvas"
              onClick={togglePlay}
            />

            {!isPlaying && (
              <div className="player-big-play-overlay" onClick={togglePlay}>
                <div className="big-play-btn">
                  <Play size={44} fill="#07080d" />
                </div>
              </div>
            )}
          </div>

          {/* Player Control Bar */}
          <div className="player-controls-bar">
            <div className="controls-left">
              <button className="control-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause size={20} fill="#ffffff" /> : <Play size={20} fill="#ffffff" />}
              </button>

              <button className="control-btn" onClick={handleRestart} title="Replay from Beginning">
                <RotateCcw size={18} />
              </button>

              <div className="shot-indicator">
                <span className="badge badge-gold">
                  Shot {currentSceneIdx + 1} of {scenes.length}
                </span>
                <span className="shot-angle-text">
                  {currentScene?.cameraAngle}
                </span>
              </div>
            </div>

            <div className="controls-right">
              <button 
                className={`control-btn ${subtitlesEnabled ? 'active-gold' : ''}`} 
                onClick={toggleSubtitles} 
                title="Toggle Subtitles"
              >
                <Subtitles size={18} />
              </button>

              <button className="control-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <button className="control-btn" onClick={handleFullscreen} title="Fullscreen">
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Export & Project Summary Sidebar */}
        <div className="theatre-sidebar">
          {/* Export Ready Card */}
          <div className="glass-panel export-card">
            <div className="card-header-row">
              <h3 className="cinema-font">
                <Sparkles size={18} color="#f59e0b" /> Ready for Export
              </h3>
              <span className="badge badge-emerald">HD 720p / 1080p</span>
            </div>

            <p className="text-secondary mt-2">
              Generate a standalone MP4 video file with all audio channels and subtitles hard-coded, ready to share on YouTube, Instagram, WhatsApp, or client presentations.
            </p>

            {isExporting && (
              <div className="export-progress-container mt-3">
                <div className="progress-labels">
                  <span>Rendering Frames & Audio...</span>
                  <strong>{exportProgress}%</strong>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${exportProgress}%` }} />
                </div>
              </div>
            )}

            <button 
              className="btn btn-primary btn-block btn-lg mt-3"
              onClick={handleExportMP4}
              disabled={isExporting}
            >
              <Download size={18} />
              <span>{isExporting ? 'Composing Movie...' : 'Download MP4 Movie'}</span>
            </button>

            {downloadUrl && (
              <div className="download-success-box mt-3" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', fontWeight: 600 }}>
                  <CheckCircle2 size={18} color="#10b981" />
                  <span>Movie Exported Successfully!</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '6px 0 10px 0' }}>{downloadFilename}</p>
                <a 
                  href={downloadUrl} 
                  download={downloadFilename}
                  className="btn btn-primary btn-block"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                >
                  <Download size={18} />
                  <span>Save Video File to Device</span>
                </a>
              </div>
            )}
          </div>

          {/* Film Screenplay & Metadata */}
          <div className="glass-panel export-card mt-3">
            <h4 className="cinema-font">Movie Screenplay & Assets</h4>
            <div className="metadata-list mt-2">
              <div className="meta-row">
                <span>Story Language:</span>
                <strong>Hindi / Hinglish</strong>
              </div>
              <div className="meta-row">
                <span>Total Scenes:</span>
                <strong>{scenes.length} Shots</strong>
              </div>
              <div className="meta-row">
                <span>Runtime:</span>
                <strong>{totalDuration}s</strong>
              </div>
              <div className="meta-row">
                <span>Audio Track:</span>
                <strong>Procedural {project.genreId || 'Horror'} Score</strong>
              </div>
              <div className="meta-row">
                <span>Free Generation:</span>
                <strong style={{ color: '#10b981' }}>Active (Zero API Cost)</strong>
              </div>
            </div>

            <div className="action-button-stack mt-3">
              <button className="btn btn-secondary btn-block" onClick={handleDownloadScript}>
                <FileText size={16} /> Download Screenplay Script (.TXT)
              </button>

              <button className="btn btn-secondary btn-block" onClick={onBackToStory}>
                ✍️ Edit Story Script
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
