/**
 * Paisaje sonoro generado con Web Audio API.
 * Nunca suena solo: se activa mediante el control de sonido.
 */
export class Soundscape {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private breathNodes: { stop: () => void } | null = null;
  private _enabled = false;

  get enabled(): boolean {
    return this._enabled;
  }

  setEnabled(on: boolean): void {
    this._enabled = on;
    if (on) {
      this.ensureContext();
    } else {
      this.stopBreath();
      if (this.ctx && this.ctx.state === "running") {
        void this.ctx.suspend();
      }
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.ctx) {
      const Ctor = window.AudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
      document.addEventListener("visibilitychange", () => {
        if (!this.ctx) return;
        if (document.hidden) void this.ctx.suspend();
        else if (this._enabled) void this.ctx.resume();
      });
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  private noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  /** Roce breve de hojas secas. */
  rustle(intensity = 1): void {
    if (!this._enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx, 0.14);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 2400 + Math.random() * 1400;
    filter.Q.value = 0.8;
    const gain = ctx.createGain();
    const g = 0.05 * intensity;
    gain.gain.setValueAtTime(g, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
  }

  /** Pequeño golpe de madera o papel. */
  woodTap(): void {
    if (!this._enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.09);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.11);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  /** Gota suave. */
  drop(): void {
    if (!this._enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(640, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(290, ctx.currentTime + 0.14);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  /** Tono corto y tímido cuando aparece el brote. */
  sprout(): void {
    if (!this._enabled) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const notes = [392, 523.25];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.16;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.05, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain).connect(this.master!);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }

  /** Respiración casi imperceptible para la escena final. */
  startBreath(): void {
    if (!this._enabled || this.breathNodes) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(ctx, 2);
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    const gain = ctx.createGain();
    gain.gain.value = 0.012;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.14;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.008;
    lfo.connect(lfoGain).connect(gain.gain);
    src.connect(filter).connect(gain).connect(this.master);
    src.start();
    lfo.start();
    this.breathNodes = {
      stop: () => {
        try {
          src.stop();
          lfo.stop();
        } catch {
          /* ya detenido */
        }
      },
    };
  }

  stopBreath(): void {
    if (this.breathNodes) {
      this.breathNodes.stop();
      this.breathNodes = null;
    }
  }
}
