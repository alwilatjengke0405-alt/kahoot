class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  // Ticking sound during question countdown
  public playCountdownTick(isUrgent = false) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isUrgent ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(isUrgent ? 880 : 520, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(isUrgent ? 440 : 260, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(isUrgent ? 0.15 : 0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // AudioContext might be blocked until user interaction
    }
  }

  // Kahoot shape select click
  public playShapeClick(shape: 'triangle' | 'diamond' | 'circle' | 'square') {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs: Record<string, number> = {
      triangle: 659.25, // E5
      diamond: 523.25,  // C5
      circle: 440.0,    // A4
      square: 349.23,   // F4
    };

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[shape] || 440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime((freqs[shape] || 440) * 1.25, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // Ignore
    }
  }

  // Celebratory correct answer sound
  public playCorrectChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.08);

      gain.gain.setValueAtTime(0.18, startTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + idx * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime + idx * 0.08);
      osc.stop(startTime + idx * 0.08 + 0.3);
    });
  }

  // Wrong answer buzzer
  public playWrongBuzzer() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const startTime = this.ctx.currentTime;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, startTime);
      osc.frequency.linearRampToValueAtTime(120, startTime + 0.35);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    } catch {
      // Ignore
    }
  }

  // Streak bonus sound
  public playStreakFanfare() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [
      { f: 587.33, t: 0 },
      { f: 739.99, t: 0.1 },
      { f: 880.0, t: 0.2 },
      { f: 1174.66, t: 0.3 },
    ];
    const now = this.ctx.currentTime;
    chords.forEach(({ f, t }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + t);
      gain.gain.setValueAtTime(0.22, now + t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.4);
    });
  }

  // Victory Fanfare for Podium
  public playPodiumVictory() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.3 },
      { f: 783.99, d: 0.3 },
      { f: 1046.5, d: 0.6 },
    ];

    let accum = 0;
    const now = this.ctx.currentTime;
    notes.forEach(({ f, d }) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + accum);

      gain.gain.setValueAtTime(0.25, now + accum);
      gain.gain.exponentialRampToValueAtTime(0.001, now + accum + d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + accum);
      osc.stop(now + accum + d + 0.05);

      accum += d * 0.9;
    });
  }
}

export const soundService = new SoundEffectsService();
