// Web Audio API ambient synthesizer and celebratory chimes

class SoundController {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private noiseNode: AudioBufferSourceNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Play a gentle bell/chime when selecting trails or clicking steps
  playChime(freq = 587.33) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.6);
    } catch {
      // Audio not permitted or supported
    }
  }

  // Play triumphant summit fanfare when "YES!" is clicked
  playVictory() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 1.2);
        }, idx * 140);
      });
    } catch {
      // Audio not permitted
    }
  }

  // Toggle ambient gentle alpine breeze sound
  toggleAmbient(): boolean {
    try {
      this.initCtx();
      if (!this.ctx) return false;

      if (this.isAmbientPlaying) {
        if (this.noiseNode) {
          this.noiseNode.stop();
          this.noiseNode.disconnect();
          this.noiseNode = null;
        }
        this.isAmbientPlaying = false;
        return false;
      }

      // Generate soft pink/brown wind sound
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Low pass filter for wind-like rumble
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      // Filter to simulate distant mountain wind
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.noiseNode.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.noiseNode.start();
      this.isAmbientPlaying = true;
      return true;
    } catch {
      return false;
    }
  }
}

export const sounds = new SoundController();
