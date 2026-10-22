// Procedural Web Audio API Cinematic Film Score & Ambient Soundscape Generator
// Zero external API cost, runs natively on desktop and mobile browsers.

class CinematicAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.bgmGain = null;
    this.activeNodes = [];
    this.currentMood = 'horror';
    this.loopTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Duck BGM volume when voiceover speaks
  duck(ducking = true) {
    if (!this.ctx || !this.bgmGain) return;
    const now = this.ctx.currentTime;
    const target = ducking ? 0.12 : 0.38;
    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.linearRampToValueAtTime(target, now + 0.4);
  }

  setVolume(vol = 0.5) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  // Play continuous ambient procedural cinema score
  playScore(mood = 'horror') {
    this.init();
    this.stopScore();
    this.isPlaying = true;
    this.currentMood = mood;

    switch (mood) {
      case 'horror':
        this._playHorrorScore();
        break;
      case 'romance':
        this._playRomanceScore();
        break;
      case 'ancient':
        this._playAncientScore();
        break;
      case 'action':
        this._playActionScore();
        break;
      case 'cyber':
        this._playCyberScore();
        break;
      default:
        this._playHorrorScore();
    }
  }

  stopScore() {
    this.isPlaying = false;
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.activeNodes = [];
  }

  // Horror: Deep sub drone + dissonant eerie chords + slow heartbeat
  _playHorrorScore() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub-bass drone (40Hz - 55Hz)
    const droneOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    const droneFilter = this.ctx.createBiquadFilter();

    droneOsc.type = 'sawtooth';
    droneOsc.frequency.setValueAtTime(45, now);
    
    // LFO for creepy pitch wobble
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.15, now);
    lfoGain.gain.setValueAtTime(2.5, now);
    lfo.connect(droneOsc.frequency);
    lfo.start(now);

    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(140, now);

    droneGain.gain.setValueAtTime(0.25, now);

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.bgmGain);

    droneOsc.start(now);
    this.activeNodes.push(droneOsc, droneGain, droneFilter, lfo, lfoGain);

    // Eerie high cluster tone (dissonant tritones)
    const highOsc = this.ctx.createOscillator();
    const highGain = this.ctx.createGain();
    highOsc.type = 'sine';
    highOsc.frequency.setValueAtTime(440 * Math.pow(2, 6/12), now); // tritone
    highGain.gain.setValueAtTime(0.04, now);

    highOsc.connect(highGain);
    highGain.connect(this.bgmGain);
    highOsc.start(now);
    this.activeNodes.push(highOsc, highGain);

    // Periodic heartbeat pulse
    this.loopTimer = setInterval(() => {
      if (!this.isPlaying) return;
      this._triggerHeartbeat();
    }, 2400);
  }

  _triggerHeartbeat() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const kick = this.ctx.createOscillator();
    const kickGain = this.ctx.createGain();

    kick.frequency.setValueAtTime(90, t);
    kick.frequency.exponentialRampToValueAtTime(30, t + 0.15);

    kickGain.gain.setValueAtTime(0.3, t);
    kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    kick.connect(kickGain);
    kickGain.connect(this.bgmGain);

    kick.start(t);
    kick.stop(t + 0.26);

    // Second beat of heart
    setTimeout(() => {
      if (!this.isPlaying || !this.ctx) return;
      const t2 = this.ctx.currentTime;
      const kick2 = this.ctx.createOscillator();
      const kickGain2 = this.ctx.createGain();

      kick2.frequency.setValueAtTime(80, t2);
      kick2.frequency.exponentialRampToValueAtTime(28, t2 + 0.18);

      kickGain2.gain.setValueAtTime(0.2, t2);
      kickGain2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.25);

      kick2.connect(kickGain2);
      kickGain2.connect(this.bgmGain);

      kick2.start(t2);
      kick2.stop(t2 + 0.26);
    }, 320);
  }

  // Romance: Warm gentle harmonic chords with slow filter sweep
  _playRomanceScore() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [130.81, 164.81, 196.00, 261.63]; // C-E-G-C major chord

    notes.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      gain.gain.setValueAtTime(0.06, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      this.activeNodes.push(osc, gain, filter);
    });
  }

  // Ancient Temple: Tanpura root drone + bell resonance
  _playAncientScore() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const rootNotes = [110, 165, 220]; // A drone

    rootNotes.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.05, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      this.activeNodes.push(osc, gain, filter);
    });

    // Temple Bell ring loop
    this.loopTimer = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const bell = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();

      bell.type = 'sine';
      bell.frequency.setValueAtTime(880, t); // High A
      bellGain.gain.setValueAtTime(0.12, t);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);

      bell.connect(bellGain);
      bellGain.connect(this.bgmGain);

      bell.start(t);
      bell.stop(t + 2.6);
    }, 4500);
  }

  // Action / Thriller
  _playActionScore() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bass = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bass.type = 'sawtooth';
    bass.frequency.setValueAtTime(55, now);
    bassGain.gain.setValueAtTime(0.15, now);

    bass.connect(bassGain);
    bassGain.connect(this.bgmGain);
    bass.start(now);
    this.activeNodes.push(bass, bassGain);

    // Fast cinematic pulse
    this.loopTimer = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const t = this.ctx.currentTime;
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'square';
      click.frequency.setValueAtTime(120, t);
      clickGain.gain.setValueAtTime(0.08, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      click.connect(clickGain);
      clickGain.connect(this.bgmGain);
      click.start(t);
      click.stop(t + 0.09);
    }, 400);
  }

  // Cyberpunk Sci-Fi
  _playCyberScore() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const saw = this.ctx.createOscillator();
    const sawGain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    saw.type = 'sawtooth';
    saw.frequency.setValueAtTime(65.41, now); // C2

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);

    sawGain.gain.setValueAtTime(0.14, now);

    saw.connect(filter);
    filter.connect(sawGain);
    sawGain.connect(this.bgmGain);
    saw.start(now);
    this.activeNodes.push(saw, filter, sawGain);
  }
}

export const audioEngine = new CinematicAudioEngine();
