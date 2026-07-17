import { createEmote, type EmoteKind } from "./emote";

/**
 * Da vida a la planta mientras se juega: cada cierto tiempo pide algo con un
 * emoticón pixel y una frase corta, y reacciona al cursor (se inclina hacia él
 * y suelta un corazón si te acercas). Se autolimpia con destroy().
 */

type Need = { emote: EmoteKind; text: string; lang?: string };

const NEEDS: Need[] = [
  { emote: "drop", text: "água?", lang: "pt" },
  { emote: "hungry", text: "nham?" },
  { emote: "sleep", text: "nanai…" },
  { emote: "cold", text: "brr!" },
  { emote: "note", text: "lá lá lá", lang: "pt" },
  { emote: "spark", text: "oi!" },
  { emote: "sun", text: "sol?" },
];

export interface LivingPlantOptions {
  plant: HTMLElement; // canvas o wrapper de la planta
  container: HTMLElement; // dónde colocar la burbuja y escuchar el cursor
  reducedMotion?: boolean;
  minDelay?: number;
  maxDelay?: number;
}

export class LivingPlant {
  private opts: LivingPlantOptions;
  private timers = new Set<number>();
  private bubble: HTMLElement | null = null;
  private leanTimer: number | null = null;
  private lastHeart = 0;
  private destroyed = false;

  private onMove = (e: PointerEvent) => this.pointerMove(e);

  constructor(options: LivingPlantOptions) {
    this.opts = options;
  }

  start(): void {
    this.opts.container.addEventListener("pointermove", this.onMove);
    this.scheduleNeed(this.rand(3500, 6000));
  }

  private rand(a: number, b: number): number {
    // sin Math.random prohibido aquí (es runtime del navegador, permitido)
    return a + Math.random() * (b - a);
  }

  private scheduleNeed(delay: number): void {
    const t = window.setTimeout(() => {
      this.timers.delete(t);
      if (this.destroyed || !this.opts.plant.isConnected) return;
      const need = NEEDS[Math.floor(Math.random() * NEEDS.length)];
      this.showBubble(need.emote, need.text, need.lang);
      this.wiggle();
      this.scheduleNeed(this.rand(this.opts.minDelay ?? 6000, this.opts.maxDelay ?? 11000));
    }, delay);
    this.timers.add(t);
  }

  private ensureBubble(): HTMLElement {
    if (!this.bubble) {
      this.bubble = document.createElement("div");
      this.bubble.className = "plant-bubble";
      this.bubble.setAttribute("aria-hidden", "true");
      this.opts.container.appendChild(this.bubble);
    }
    return this.bubble;
  }

  private showBubble(emote: EmoteKind, text: string, lang?: string): void {
    const b = this.ensureBubble();
    b.innerHTML = "";
    b.appendChild(createEmote(emote, { className: "plant-bubble__emote" }));
    if (text) {
      const span = document.createElement("span");
      span.className = "plant-bubble__text";
      if (lang) span.setAttribute("lang", lang);
      span.textContent = text;
      b.appendChild(span);
    }
    b.classList.remove("is-visible");
    void b.offsetWidth;
    b.classList.add("is-visible");
    const hide = window.setTimeout(() => {
      this.timers.delete(hide);
      b.classList.remove("is-visible");
    }, 2600);
    this.timers.add(hide);
  }

  private wiggle(): void {
    if (this.opts.reducedMotion) return;
    this.opts.plant.classList.remove("is-wiggling");
    void this.opts.plant.offsetWidth;
    this.opts.plant.classList.add("is-wiggling");
  }

  private pointerMove(e: PointerEvent): void {
    if (this.destroyed || this.opts.reducedMotion) return;
    const r = this.opts.plant.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dist = Math.hypot(dx, e.clientY - cy);
    // se inclina levemente hacia el cursor
    const lean = Math.max(-7, Math.min(7, dx / 14));
    this.opts.plant.style.setProperty("--plant-lean", `${lean.toFixed(1)}deg`);
    if (this.leanTimer !== null) window.clearTimeout(this.leanTimer);
    this.leanTimer = window.setTimeout(() => {
      this.opts.plant.style.setProperty("--plant-lean", "0deg");
    }, 600);
    // si te acercas mucho, la planta se alegra (con enfriamiento)
    if (dist < r.width * 0.75) {
      const now = performance.now();
      if (now - this.lastHeart > 4500) {
        this.lastHeart = now;
        this.showBubble("heart", "♥");
      }
    }
  }

  destroy(): void {
    this.destroyed = true;
    this.opts.container.removeEventListener("pointermove", this.onMove);
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers.clear();
    if (this.leanTimer !== null) window.clearTimeout(this.leanTimer);
    this.bubble?.remove();
    this.bubble = null;
  }
}
