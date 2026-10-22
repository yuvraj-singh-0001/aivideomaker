// Neural Human Voice Engine & Web Speech Fallback
// Connects to /api/tts for 100% human-grade Microsoft Edge Cloud Neural Voice
// Supports distinct speakers: Mother (Swara Neural), Hero/Rahul/Narrator (Madhur Neural)

import { audioEngine } from './audioEngine';

class VoiceEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.currentAudio = null;
    this.blobCache = new Map();
    this.wordTimer = null;
    this._loadVoices();
  }

  _loadVoices() {
    if (!this.synth) return;
    const populate = () => {
      this.voices = this.synth.getVoices();
    };
    populate();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = populate;
    }
  }

  getAvailableVoices() {
    if (!this.voices || this.voices.length === 0) {
      this._loadVoices();
    }
    const hindiVoices = this.voices.filter(v => v.lang.startsWith('hi'));
    const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
    return {
      hindi: hindiVoices,
      english: englishVoices,
      all: this.voices
    };
  }

  estimateDuration(text, rate = 0.95) {
    if (!text || !text.trim()) return 3.0;
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const wordsPerSec = Math.max(1.2, 2.1 * rate);
    const durationSec = Math.max(2.8, words / wordsPerSec);
    return durationSec;
  }

  /**
   * Primary speech synthesis method:
   * 1. Attempts to fetch ultra-realistic Microsoft Edge Neural Voice MP3 from /api/tts
   * 2. If backend is offline, falls back gracefully to browser SpeechSynthesis
   */
  async speak(text, options = {}) {
    const cleanText = (text || '').trim();
    if (!cleanText) return Promise.resolve();

    this.stop();

    const {
      lang = 'hi-IN',
      speaker = 'narrator',
      pitch = 0.95,
      rate = 0.95,
      onWord = null
    } = options;

    // Try Backend Neural Voice First (100% human-grade)
    try {
      const audioUrl = await this._fetchNeuralAudio(cleanText, speaker, lang);
      if (audioUrl) {
        return this._playNeuralAudio(audioUrl, cleanText, onWord);
      }
    } catch (err) {
      console.warn('Backend neural voice unavailable, using browser speech fallback:', err.message);
    }

    // Fallback: Web Speech API
    return this._speakBrowserSpeech(cleanText, { lang, speaker, pitch, rate, onWord });
  }

  async _fetchNeuralAudio(text, speaker, lang) {
    const cacheKey = `${speaker}:${lang}:${text}`;
    if (this.blobCache.has(cacheKey)) {
      return this.blobCache.get(cacheKey);
    }

    const res = await fetch('http://localhost:5000/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, speaker, lang })
    });

    if (!res.ok) {
      throw new Error(`TTS server responded with ${res.status}`);
    }

    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    this.blobCache.set(cacheKey, blobUrl);
    return blobUrl;
  }

  _playNeuralAudio(audioUrl, text, onWord) {
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      this.isSpeaking = true;
      audioEngine.duck(true);

      const words = text.split(/\s+/).filter(Boolean);
      const totalWords = words.length;

      // Real-time word progress tracking based on audio playback time
      audio.ontimeupdate = () => {
        if (!this.isSpeaking || !onWord || !audio.duration) return;
        const progress = Math.min(1.0, audio.currentTime / audio.duration);
        const approxCharIndex = Math.floor(progress * text.length);
        onWord(approxCharIndex);
      };

      let isFinished = false;
      const finish = () => {
        if (isFinished) return;
        isFinished = true;
        this.isSpeaking = false;
        audioEngine.duck(false);
        this.currentAudio = null;
        resolve();
      };

      audio.onended = finish;
      audio.onerror = (e) => {
        console.warn('Neural audio playback error:', e);
        finish();
      };

      audio.play().catch(err => {
        console.warn('Audio play autoplay blocked or failed:', err);
        finish();
      });
    });
  }

  _speakBrowserSpeech(text, options) {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      const { lang, speaker, pitch, rate, onWord } = options;
      let effectivePitch = pitch;
      let effectiveRate = rate;

      const speakerLower = (speaker || '').toLowerCase();
      if (speakerLower.includes('mother') || speakerLower.includes('maa') || speakerLower.includes('woman') || speakerLower.includes('female')) {
        effectivePitch = 1.25;
        effectiveRate = 0.90;
      } else if (speakerLower.includes('rahul') || speakerLower.includes('boy')) {
        effectivePitch = 1.12;
        effectiveRate = 0.98;
      } else {
        effectivePitch = 0.92;
        effectiveRate = 0.95;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.pitch = effectivePitch;
      utterance.rate = effectiveRate;

      let isFinished = false;
      const finish = () => {
        if (isFinished) return;
        isFinished = true;
        this.isSpeaking = false;
        audioEngine.duck(false);
        this.currentUtterance = null;
        resolve();
      };

      utterance.onstart = () => {
        this.isSpeaking = true;
        audioEngine.duck(true);
      };

      utterance.onboundary = (e) => {
        if (onWord && e.charIndex !== undefined) {
          onWord(e.charIndex);
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  stop() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.currentAudio = null;
    }

    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }

    this.isSpeaking = false;
    audioEngine.duck(false);
    this.currentUtterance = null;
  }
}

export const voiceEngine = new VoiceEngine();
