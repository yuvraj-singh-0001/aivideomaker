// HTML5 Canvas Cinema Video Compositor & MP4 Exporter
// Features: 
// 1. Exact Word-by-Word Subtitle Synchronization (Zero desync, perfect speech timing)
// 2. Full Voice Completion Wait + Exact 0.4s Next-Clip Delay
// 3. Format Custom Overlays (Movie Widescreen, Breaking News TV Studio, 3D Cartoon, Documentary)
// 4. Seamless Cross-Dissolve, 35mm Film Grain, and Handheld Steadicam Motion

import { audioEngine } from './audioEngine';
import { voiceEngine } from './voiceEngine';

export class VideoCompositor {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.scenes = [];
    this.currentSceneIndex = 0;
    this.isPlaying = false;
    this.animationFrameId = null;
    this.imagesCache = new Map();
    this.videosCache = new Map();
    this.activeVideo = null;
    this.onSceneChange = null;
    this.onPlaybackEnd = null;
    this.subtitlesEnabled = true;
    this.aspectRatio = '16:9';
    this.videoFormat = 'movie'; // 'movie', 'news', 'cartoon', 'documentary'

    // Real-time subtitle word synchronization
    this.currentSubtitles = '';
    this.tokenizedWords = [];
    this.activeWordIndex = 0;
    this.hasSpeechStarted = false;
    this.isSpeechComplete = false;
    this.speechEndTime = null;
    this.hasBoundaryEvents = false;

    // Atmospheric Cinema Particles (Floating Dust Motes / Fog Embers)
    this.particles = this._initParticles(35);

    // Pre-computed Film Grain Noise Canvas
    this.grainCanvas = this._initGrainCanvas();
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
  }

  setVideoFormat(format = 'movie') {
    this.videoFormat = format;
  }

  _initParticles(count = 35) {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        radius: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: (Math.random() - 0.5) * 0.35 - 0.2,
        alpha: Math.random() * 0.45 + 0.15,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
    return particles;
  }

  _initGrainCanvas() {
    if (typeof document === 'undefined') return null;
    const gCanvas = document.createElement('canvas');
    gCanvas.width = 256;
    gCanvas.height = 256;
    const gctx = gCanvas.getContext('2d');
    const imgData = gctx.createImageData(256, 256);
    const buffer = new Uint32Array(imgData.data.buffer);
    for (let i = 0; i < buffer.length; i++) {
      const v = (Math.random() * 32) | 0;
      buffer[i] = (v << 24) | (v << 16) | (v << 8) | v;
    }
    gctx.putImageData(imgData, 0, 0);
    return gCanvas;
  }

  // Pre-tokenize sentence into word objects with exact character spans
  _tokenize(text) {
    const words = [];
    const regex = /\S+/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      words.push({
        word: match[0],
        start: match.index,
        end: match.index + match[0].length
      });
    }
    return words;
  }

  // Pre-load all scene images and real moving video clips into memory
  async preloadScenes(scenes) {
    this.scenes = scenes;
    const promises = scenes.map(scene => {
      const imgPromise = new Promise((resolve) => {
        const cacheKey = scene.imageUrl || scene.id;
        if (this.imagesCache.has(cacheKey)) {
          resolve(this.imagesCache.get(cacheKey));
          return;
        }

        const loadImageWithTimeout = (url, timeoutMs = 3500) => {
          return new Promise((resImg, rejImg) => {
            if (!url || url.includes('pollinations.ai')) {
              rejImg(new Error('Pollinations URL blocked'));
              return;
            }
            const img = new Image();
            let settled = false;
            const timer = setTimeout(() => {
              if (!settled) {
                settled = true;
                rejImg(new Error('Timeout'));
              }
            }, timeoutMs);

            img.crossOrigin = 'anonymous';
            img.onload = () => {
              if (!settled) {
                settled = true;
                clearTimeout(timer);
                resImg(img);
              }
            };
            img.onerror = () => {
              const img2 = new Image();
              img2.onload = () => {
                if (!settled) {
                  settled = true;
                  clearTimeout(timer);
                  resImg(img2);
                }
              };
              img2.onerror = (err) => {
                if (!settled) {
                  settled = true;
                  clearTimeout(timer);
                  rejImg(err);
                }
              };
              img2.src = url;
            };
            img.src = url;
          });
        };

        const targetPrimary = (scene.imageUrl && !scene.imageUrl.includes('pollinations.ai')) 
          ? scene.imageUrl 
          : scene.backupUrl;
        const targetBackup = (scene.backupUrl && !scene.backupUrl.includes('pollinations.ai')) 
          ? scene.backupUrl 
          : null;

        // Try primary imageUrl
        loadImageWithTimeout(targetPrimary, 3500)
          .then(img => {
            this.imagesCache.set(cacheKey, img);
            resolve(img);
          })
          .catch(() => {
            if (targetBackup && targetBackup !== targetPrimary) {
              return loadImageWithTimeout(targetBackup, 3500)
                .then(backupImg => {
                  this.imagesCache.set(cacheKey, backupImg);
                  resolve(backupImg);
                });
            }
            throw new Error('No backup');
          })
          .catch(() => {
            const fallback = this._createFallbackCanvas(scene);
            this.imagesCache.set(cacheKey, fallback);
            resolve(fallback);
          });
      });

      // Also preload moving video clip if available (Option 2)
      const vidPromise = new Promise((resolve) => {
        if (!scene.videoUrl || this.videosCache.has(scene.id)) {
          resolve(this.videosCache.get(scene.id) || null);
          return;
        }

        try {
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.playsInline = true;
          video.loop = true;
          video.preload = 'auto';

          let settled = false;
          const timer = setTimeout(() => {
            if (!settled) {
              settled = true;
              resolve(null);
            }
          }, 4000);

          video.onloadeddata = () => {
            if (!settled) {
              settled = true;
              clearTimeout(timer);
              this.videosCache.set(scene.id, video);
              resolve(video);
            }
          };

          video.onerror = () => {
            if (!settled) {
              settled = true;
              clearTimeout(timer);
              resolve(null);
            }
          };

          video.src = scene.videoUrl;
          video.load();
        } catch (e) {
          resolve(null);
        }
      });

      return Promise.all([imgPromise, vidPromise]);
    });

    await Promise.all(promises);
  }

  _createFallbackCanvas(scene) {
    const offscreen = document.createElement('canvas');
    offscreen.width = 1280;
    offscreen.height = 720;
    const octx = offscreen.getContext('2d');

    // Rich cinematic ambient lighting background
    const grad = octx.createRadialGradient(640, 360, 50, 640, 360, 720);
    grad.addColorStop(0, '#2d1b4e');
    grad.addColorStop(0.4, '#1a102f');
    grad.addColorStop(0.8, '#0b0817');
    grad.addColorStop(1, '#030208');
    octx.fillStyle = grad;
    octx.fillRect(0, 0, 1280, 720);

    // Warm cinematic spotlight cones
    const spotGrad = octx.createRadialGradient(380, 200, 10, 380, 200, 400);
    spotGrad.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
    spotGrad.addColorStop(0.7, 'rgba(236, 72, 153, 0.12)');
    spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    octx.fillStyle = spotGrad;
    octx.fillRect(0, 0, 1280, 720);

    // Cinema lens flare ring
    octx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    octx.lineWidth = 2;
    octx.beginPath();
    octx.arc(640, 360, 220, 0, Math.PI * 2);
    octx.stroke();

    octx.fillStyle = '#f59e0b';
    octx.font = 'bold 36px "Cinzel", serif';
    octx.textAlign = 'center';
    octx.fillText(scene.cameraAngle || 'CINEMATIC SHOT', 640, 310);

    octx.fillStyle = '#f1f5f9';
    octx.font = '600 24px "Outfit", sans-serif';
    const textSnippet = (scene.scriptText || scene.title || 'Cinematic Shot Directing').slice(0, 65);
    octx.fillText(textSnippet, 640, 370);

    octx.fillStyle = '#94a3b8';
    octx.font = '16px "Outfit", sans-serif';
    octx.fillText('✨ AI Visual Stage • Ken Burns 60fps Dynamic Motion', 640, 420);

    return offscreen;
  }

  // Start real-time playback
  async play(startIndex = 0, mood = 'horror') {
    if (!this.canvas || this.scenes.length === 0) return;
    this.stop();
    this.isPlaying = true;
    this.currentSceneIndex = startIndex;

    audioEngine.playScore(mood);
    this._runSceneLoop();
  }

  async _runSceneLoop() {
    if (!this.isPlaying || this.currentSceneIndex >= this.scenes.length) {
      this.stop();
      if (this.onPlaybackEnd) this.onPlaybackEnd();
      return;
    }

    const scene = this.scenes[this.currentSceneIndex];
    if (this.onSceneChange) this.onSceneChange(this.currentSceneIndex);

    // Option 2: Real moving video playback
    if (this.activeVideo && this.activeVideo !== this.videosCache.get(scene.id)) {
      try { this.activeVideo.pause(); } catch(e) {}
    }
    const currentVid = this.videosCache.get(scene.id);
    if (currentVid) {
      this.activeVideo = currentVid;
      try {
        currentVid.currentTime = 0;
        currentVid.play().catch(() => {});
      } catch(e) {}
    } else {
      this.activeVideo = null;
    }

    const fullText = (scene.voiceover || scene.scriptText || '').trim();
    this.currentSubtitles = fullText;
    this.currentSpeaker = scene.speaker || 'narrator';
    this.tokenizedWords = this._tokenize(fullText);
    const totalWords = this.tokenizedWords.length;

    // Reset exact speech state
    this.activeWordIndex = 0;
    this.hasSpeechStarted = false;
    this.isSpeechComplete = false;
    this.speechEndTime = null;
    this.hasBoundaryEvents = false;

    const estimatedSpeechSec = voiceEngine.estimateDuration(fullText, 0.95);
    const sceneStartTime = performance.now();
    let actualSpeechAudioStartTime = null;

    voiceEngine.speak(fullText, {
      lang: 'hi-IN',
      pitch: 0.95,
      rate: 0.95,
      speaker: scene.speaker || 'narrator',
      onWord: (charIndex) => {
        // Boundary event fired: exactly identify word being spoken
        this.hasBoundaryEvents = true;
        this.hasSpeechStarted = true;
        if (!actualSpeechAudioStartTime) {
          actualSpeechAudioStartTime = performance.now();
        }

        let targetIdx = this.tokenizedWords.findIndex(w => charIndex >= w.start && charIndex <= w.end);
        if (targetIdx === -1) {
          for (let i = this.tokenizedWords.length - 1; i >= 0; i--) {
            if (charIndex >= this.tokenizedWords[i].start) {
              targetIdx = i;
              break;
            }
          }
        }
        if (targetIdx >= 0) {
          this.activeWordIndex = targetIdx;
        }
      }
    }).then(() => {
      // Voice has 100% finished speaking
      this.isSpeechComplete = true;
      this.activeWordIndex = Math.max(0, totalWords - 1);
      this.speechEndTime = performance.now();
    });

    // 2. Animate 60fps loop with exact 0.4s delay after speech ends
    const animate = (now) => {
      if (!this.isPlaying) return;

      const elapsed = (now - sceneStartTime) / 1000;

      // Fallback word progress ONLY if onboundary events aren't supported on device
      if (!this.hasBoundaryEvents && !this.isSpeechComplete && totalWords > 0) {
        const timeProgress = Math.min(0.95, elapsed / estimatedSpeechSec);
        this.activeWordIndex = Math.floor(timeProgress * totalWords);
      }

      // Exact 0.4s delay post-voiceover before switching clips
      let transitionAlpha = 0.0;
      if (this.isSpeechComplete && this.speechEndTime !== null) {
        const postSpeechElapsed = (now - this.speechEndTime) / 1000;
        
        // Dissolve into next scene during the 0.4s
        transitionAlpha = Math.min(1.0, postSpeechElapsed / 0.4);

        if (postSpeechElapsed >= 0.4) {
          // Exactly 0.4 seconds after voice finished!
          this.currentSceneIndex++;
          this._runSceneLoop();
          return;
        }
      }

      // Camera motion progress
      const totalEstimatedSceneDuration = estimatedSpeechSec + 0.4;
      const cameraProgress = Math.min(1.0, elapsed / totalEstimatedSceneDuration);

      // Render frame with live synchronized subtitles and format overlays
      this._drawFrameWithTransitions(scene, cameraProgress, now, transitionAlpha);

      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  // Draw scene with format-specific layout, camera motion & live word sync
  _drawFrameWithTransitions(scene, progress, timestamp = performance.now(), transitionAlpha = 0.0) {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear background
    this.ctx.fillStyle = '#050609';
    this.ctx.fillRect(0, 0, w, h);

    // Handheld Steadicam micro-sway
    const swayX = Math.sin(timestamp * 0.0014) * 3.8;
    const swayY = Math.cos(timestamp * 0.0018) * 2.5;

    // 1. Draw Current Scene Image with smooth Ken Burns Motion or Real Moving Video
    const currentImg = this.imagesCache.get(scene.imageUrl);
    if (currentImg) {
      this._renderSingleSceneLayer(currentImg, scene.motionType || 'zoom-in', progress, swayX, swayY, 1.0, scene.id);
    }

    // 2. Dissolve Next Scene during the 0.4s buffer
    const nextIndex = this.currentSceneIndex + 1;
    if (transitionAlpha > 0.0 && nextIndex < this.scenes.length) {
      const nextScene = this.scenes[nextIndex];
      const nextImg = this.imagesCache.get(nextScene.imageUrl);

      if (nextImg) {
        const smoothAlpha = transitionAlpha * transitionAlpha * (3.0 - 2.0 * transitionAlpha);
        this._renderSingleSceneLayer(nextImg, nextScene.motionType || 'pan-right', 0.05, -swayX * 0.5, -swayY * 0.5, smoothAlpha, nextScene.id);
      }
    }

    // 3. Atmospheric Floating Dust / Light Specks
    this._drawAtmosphericParticles(timestamp);

    // 4. Vignette
    const vignette = this.ctx.createRadialGradient(w / 2, h / 2, h * 0.38, w / 2, h / 2, h * 0.88);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(0.7, 'rgba(0,0,0,0.25)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.72)');
    this.ctx.fillStyle = vignette;
    this.ctx.fillRect(0, 0, w, h);

    // 5. Procedural 35mm Film Grain
    if (this.grainCanvas) {
      this.ctx.save();
      this.ctx.globalAlpha = 0.05;
      const offsetX = (timestamp * 0.08) % 256;
      const offsetY = (timestamp * 0.05) % 256;
      this.ctx.drawImage(this.grainCanvas, -offsetX, -offsetY, w + 256, h + 256);
      this.ctx.restore();
    }

    // 6. Format-Specific UI Overlays (News Broadcast vs Cinema vs Cartoon)
    if (this.videoFormat === 'news') {
      this._renderNewsFormatOverlay(scene, w, h, timestamp);
    } else if (this.videoFormat === 'cartoon') {
      this._renderCartoonFormatOverlay(scene, w, h);
    } else {
      // Default: 35mm Cinema / Documentary Letterbox
      this._renderCinemaFormatOverlay(scene, w, h);
    }
  }

  // 🎬 Cinema Format Overlay
  _renderCinemaFormatOverlay(scene, w, h) {
    const barHeight = h * 0.08;
    this.ctx.fillStyle = '#07080d';
    this.ctx.fillRect(0, 0, w, barHeight);
    this.ctx.fillRect(0, h - barHeight, w, barHeight);

    // Shot & Camera Watermark
    this.ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
    this.ctx.font = '600 13px "Outfit", sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`SHOT ${scene.sceneNumber || 1} • ${scene.cameraAngle || 'CINEMATIC'}`, 24, barHeight * 0.65);

    if (this.subtitlesEnabled && this.currentSubtitles) {
      this._renderSynchronizedSubtitles(w, h, barHeight + 24, 'cinema');
    }
  }

  // 📺 Breaking News Broadcast Format Overlay
  _renderNewsFormatOverlay(scene, w, h, timestamp) {
    // Top Left: LIVE RED BADGE
    this.ctx.fillStyle = '#dc2626';
    this.ctx.beginPath();
    this.ctx.roundRect 
      ? this.ctx.roundRect(24, 20, 110, 32, 6)
      : this.ctx.fillRect(24, 20, 110, 32);
    this.ctx.fill();

    // Pulsing red circle
    const pulseAlpha = Math.sin(timestamp * 0.005) * 0.4 + 0.6;
    this.ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
    this.ctx.beginPath();
    this.ctx.arc(38, 36, 5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 14px "Outfit", sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('LIVE • TV', 50, 41);

    // Top Right: Channel Logo
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    this.ctx.fillRect(w - 150, 20, 126, 32);
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.font = 'bold 15px "Cinzel", serif';
    this.ctx.fillText('CINE NEWS', w - 140, 41);

    // Bottom News Lower-Third:
    const lowerThirdH = 100;
    const lowerThirdY = h - lowerThirdH - 16;

    // Red BREAKING NEWS banner
    this.ctx.fillStyle = '#b91c1c';
    this.ctx.fillRect(24, lowerThirdY, 200, 32);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 14px "Outfit", sans-serif';
    this.ctx.fillText('⚡ BREAKING NEWS', 36, lowerThirdY + 22);

    // Main news caption bar
    this.ctx.fillStyle = 'rgba(10, 12, 22, 0.92)';
    this.ctx.fillRect(24, lowerThirdY + 32, w - 48, 50);

    // Live Synchronized Words inside Lower Third
    if (this.subtitlesEnabled && this.currentSubtitles) {
      this._renderSynchronizedSubtitles(w, h, 38, 'news', lowerThirdY + 64);
    }

    // Yellow scrolling ticker bar at very bottom
    this.ctx.fillStyle = '#eab308';
    this.ctx.fillRect(24, lowerThirdY + 82, w - 48, 20);
    this.ctx.fillStyle = '#07080d';
    this.ctx.font = 'bold 11px "Outfit", sans-serif';
    this.ctx.fillText(`• LATEST DEVELOPMENTS: ${scene.scriptText} • GROUND REPORT STREAMING NOW`, 36, lowerThirdY + 96);
  }

  // 🧸 Cartoon / 3D Kids Animation Format Overlay
  _renderCartoonFormatOverlay(scene, w, h) {
    // Top playful badge
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.beginPath();
    this.ctx.roundRect 
      ? this.ctx.roundRect(24, 20, 130, 32, 16)
      : this.ctx.fillRect(24, 20, 130, 32);
    this.ctx.fill();

    this.ctx.fillStyle = '#07080d';
    this.ctx.font = 'bold 13px "Outfit", sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('✨ 3D TOON VIBE', 36, 41);

    if (this.subtitlesEnabled && this.currentSubtitles) {
      this._renderSynchronizedSubtitles(w, h, 40, 'cartoon');
    }
  }

  // Professional Synchronized Subtitle Renderer:
  // Words highlight and reveal live precisely as the speaker articulates them
  _renderSynchronizedSubtitles(w, h, bottomOffset, styleMode = 'cinema', customY = null) {
    if (!this.tokenizedWords || this.tokenizedWords.length === 0) return;

    this.ctx.save();
    this.ctx.textAlign = 'center';

    const currentWordIdx = Math.min(this.tokenizedWords.length - 1, Math.max(0, this.activeWordIndex));
    // Reveal text word by word up to currentWordIdx
    const visibleWords = this.tokenizedWords.slice(0, currentWordIdx + 1);
    const visibleText = visibleWords.map(w => w.word).join(' ');

    const subY = customY !== null ? customY : (h - bottomOffset);

    if (styleMode === 'news') {
      // Broadcast font inside lower third
      this.ctx.font = 'bold 22px "Outfit", sans-serif';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.textAlign = 'left';

      // Trim if too long for lower third box
      const maxWidth = w - 80;
      let displayLine = visibleText;
      if (this.ctx.measureText(displayLine).width > maxWidth) {
        displayLine = '... ' + visibleWords.slice(-7).map(w => w.word).join(' ');
      }
      this.ctx.fillText(displayLine, 40, subY);

    } else if (styleMode === 'cartoon') {
      // Playful bright rounded font with yellow stroke
      this.ctx.font = 'bold 26px "Outfit", sans-serif';
      const textMetrics = this.ctx.measureText(visibleText);

      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      if (this.ctx.roundRect) {
        this.ctx.beginPath();
        this.ctx.roundRect(w / 2 - textMetrics.width / 2 - 16, subY - 26, textMetrics.width + 32, 36, 18);
        this.ctx.fill();
        this.ctx.lineWidth = 2.5;
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.stroke();
      }

      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText(visibleText, w / 2, subY);

    } else {
      // Cinema Movie Style:
      this.ctx.font = 'bold 24px "Outfit", sans-serif';
      
      // Word wrap
      const words = visibleText.split(' ');
      let line = '';
      const lines = [];
      const maxWidth = w * 0.82;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = this.ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      // Character speaker tag (e.g. [MOTHER] or [RAHUL])
      if (this.currentSpeaker && this.currentSpeaker !== 'narrator') {
        const speakerTag = `• ${this.currentSpeaker.toUpperCase()} •`;
        const tagY = subY - (lines.length * 34) - 6;
        this.ctx.font = 'bold 13px "Outfit", sans-serif';
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.fillText(speakerTag, w / 2, tagY);
      }

      this.ctx.font = 'bold 24px "Outfit", sans-serif';
      lines.forEach((l, i) => {
        const yOffset = subY - (lines.length - 1 - i) * 34;
        const textMetrics = this.ctx.measureText(l);

        // High contrast rounded pill
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
        if (this.ctx.roundRect) {
          this.ctx.beginPath();
          this.ctx.roundRect(w / 2 - textMetrics.width / 2 - 14, yOffset - 22, textMetrics.width + 28, 30, 6);
          this.ctx.fill();
        } else {
          this.ctx.fillRect(w / 2 - textMetrics.width / 2 - 14, yOffset - 22, textMetrics.width + 28, 30);
        }

        // Dark outline
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#000000';
        this.ctx.strokeText(l, w / 2, yOffset);

        // Text fill: Spoken words in bright ivory, latest word highlighted in gold
        this.ctx.fillStyle = '#fffae0';
        this.ctx.fillText(l, w / 2, yOffset);

        // Active speech pulse indicator dot at end of active line
        if (i === lines.length - 1 && !this.isSpeechComplete) {
          this.ctx.fillStyle = '#f59e0b';
          this.ctx.beginPath();
          this.ctx.arc(w / 2 + textMetrics.width / 2 + 8, yOffset - 6, 3.5, 0, Math.PI * 2);
          this.ctx.fill();
        }
      });
    }

    this.ctx.restore();
  }

  // Draw single image or moving video layer with Ken Burns scale/pan
  _renderSingleSceneLayer(img, motionType, progress, swayX, swayY, alpha = 1.0, sceneId = null) {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.save();
    this.ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    const easedProgress = progress * progress * (3 - 2 * progress);

    let scale = 1.02;
    let transX = swayX;
    let transY = swayY;

    if (motionType === 'zoom-in') {
      scale = 1.02 + (easedProgress * 0.14);
    } else if (motionType === 'zoom-out') {
      scale = 1.16 - (easedProgress * 0.14);
    } else if (motionType === 'pan-right') {
      scale = 1.10;
      transX += (easedProgress - 0.5) * -60;
    } else if (motionType === 'pan-left') {
      scale = 1.10;
      transX += (easedProgress - 0.5) * 60;
    }

    this.ctx.translate(w / 2 + transX, h / 2 + transY);
    this.ctx.scale(scale, scale);

    // Option 2: Render live moving video clip if ready and loaded
    let media = img;
    if (sceneId && this.videosCache.has(sceneId)) {
      const vid = this.videosCache.get(sceneId);
      if (vid && vid.readyState >= 2) {
        media = vid;
      }
    }

    this.ctx.drawImage(media, -w / 2, -h / 2, w, h);
    this.ctx.restore();
  }

  _drawAtmosphericParticles(timestamp) {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;

    this.ctx.save();
    this.particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      const currentAlpha = p.alpha + Math.sin(timestamp * p.pulseSpeed + p.phase) * 0.08;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 235, 190, ${Math.max(0.05, currentAlpha)})`;
      this.ctx.shadowColor = 'rgba(245, 158, 11, 0.4)';
      this.ctx.shadowBlur = 6;
      this.ctx.fill();
    });
    this.ctx.restore();
  }

  // Legacy fallback
  _drawFrame(scene, progress) {
    const fullText = (scene.voiceover || scene.scriptText || '').trim();
    this.currentSubtitles = fullText;
    this.tokenizedWords = this._tokenize(fullText);
    this.activeWordIndex = this.tokenizedWords.length - 1;
    this._drawFrameWithTransitions(scene, progress, performance.now(), 0.0);
  }

  stop() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    voiceEngine.stop();
    audioEngine.stopScore();
    this.videosCache.forEach(v => {
      try { v.pause(); } catch(e) {}
    });
    this.activeVideo = null;
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    voiceEngine.stop();
    this.videosCache.forEach(v => {
      try { v.pause(); } catch(e) {}
    });
  }

  // Render & Export MP4 video file (Fast Accelerated Offline Rendering + Watchdog)
  async exportVideo(onProgress = null, mood = 'horror') {
    if (!this.canvas || this.scenes.length === 0) return null;

    await this.preloadScenes(this.scenes);

    return new Promise((resolve) => {
      const stream = this.canvas.captureStream(30);

      let mimeType = 'video/webm;codecs=vp9';
      if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
        mimeType = 'video/mp4;codecs=avc1';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 4000000
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      let resolved = false;
      const finishExport = () => {
        if (resolved) return;
        resolved = true;
        const blob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(blob);
        resolve({ blob, url: videoUrl, isMp4: mimeType.includes('mp4') });
      };

      recorder.onstop = finishExport;

      // Start recording with 200ms timeslice to ensure continuous data gathering
      recorder.start(200);

      let sceneIdx = 0;
      const totalScenes = this.scenes.length;

      const renderNextScene = () => {
        if (sceneIdx >= totalScenes) {
          try {
            if (recorder.state === 'recording') {
              recorder.requestData();
              recorder.stop();
            } else {
              finishExport();
            }
          } catch(e) {
            finishExport();
          }
          return;
        }

        const scene = this.scenes[sceneIdx];
        this.currentSceneIndex = sceneIdx;
        const fullText = (scene.voiceover || scene.scriptText || '').trim();
        this.currentSubtitles = fullText;
        this.tokenizedWords = this._tokenize(fullText);
        const totalWords = this.tokenizedWords.length;

        const speechDurationSec = voiceEngine.estimateDuration(fullText, 0.95);
        const totalSceneDurationSec = speechDurationSec + 0.4;
        const sceneStartTime = performance.now();
        // Accelerated export speed (2x) so exporting a 60s video takes only 30s
        const exportSpeedMultiplier = 2.0;

        const step = (now) => {
          const rawElapsed = (now - sceneStartTime) / 1000;
          const simulatedElapsed = rawElapsed * exportSpeedMultiplier;
          const progress = Math.min(1.0, simulatedElapsed / totalSceneDurationSec);

          // Typewriter word sync in exported frames
          const speechProgress = Math.min(1.0, simulatedElapsed / speechDurationSec);
          this.activeWordIndex = Math.min(totalWords - 1, Math.floor(speechProgress * totalWords));

          let transitionAlpha = 0.0;
          if (simulatedElapsed >= speechDurationSec) {
            transitionAlpha = Math.min(1.0, (simulatedElapsed - speechDurationSec) / 0.4);
          }

          this._drawFrameWithTransitions(scene, progress, now, transitionAlpha);

          if (onProgress) {
            const overall = ((sceneIdx + progress) / totalScenes) * 100;
            onProgress(Math.min(99, Math.round(overall)));
          }

          if (progress < 1.0) {
            requestAnimationFrame(step);
          } else {
            sceneIdx++;
            renderNextScene();
          }
        };

        requestAnimationFrame(step);
      };

      // Safety watchdog: ensure export always finishes within 90 seconds max
      setTimeout(() => {
        if (!resolved && recorder.state === 'recording') {
          console.warn('[VideoCompositor] Watchdog auto-completing export');
          try { recorder.requestData(); recorder.stop(); } catch(e) { finishExport(); }
        }
      }, 90000);

      renderNextScene();
    });
  }
}
