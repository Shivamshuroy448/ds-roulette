/**
 * Native Web Audio Synthesizer
 * Produces crisp mechanical ticker clicks, whooshes, and celebratory victory chimes.
 * Requires 0 external audio files, works instantly in any browser.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = typeof window !== 'undefined' && localStorage.getItem('ds_roulette_muted') === 'true';
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('ds_roulette_muted', this.muted);
    }
    return this.muted;
  }

  /**
   * Crisp mechanical ticker click
   */
  playTick(pitchModifier = 1.0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600 * pitchModifier, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.025);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.028);
    } catch (_) {}
  }

  /**
   * Soft whoosh upon launch
   */
  playWhoosh() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(450, t + 0.2);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.5);

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.6);
    } catch (_) {}
  }

  /**
   * Celebratory chord chime on landing
   */
  playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const t = this.ctx.currentTime;

      freqs.forEach((f, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t + idx * 0.06);

        gain.gain.setValueAtTime(0.001, t + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.18, t + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + idx * 0.06);
        osc.stop(t + idx * 0.06 + 0.85);
      });
    } catch (_) {}
  }
}

export const sound = new SoundEngine();
