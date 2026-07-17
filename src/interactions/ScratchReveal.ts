import { paintLeafField } from "../art/LeafField";

export type ScratchRevealOptions = {
  canvas: HTMLCanvasElement;
  container: HTMLElement;
  threshold?: number; // fracción despejada para revelar (0..1)
  brushSize?: number; // radio lógico del pincel en px
  /** si se define, borra en celdas cuadradas de este tamaño (mordidas pixel) */
  pixelCell?: number;
  onProgress?: (progress: number) => void;
  onReveal?: () => void;
  /** callback por trazo (coordenadas lógicas), para partículas y sonido */
  onStroke?: (x: number, y: number) => void;
};

type Stroke = { nx: number; ny: number; nr: number }; // normalizados 0..1

/**
 * Capa raspable de hojas secas.
 * - Pointer Events con captura e interpolación de trazo.
 * - destination-out con pincel de borde suave.
 * - Progreso por muestreo parcial del canal alfa, con throttle.
 * - El progreso sobrevive al resize reproduciendo los trazos normalizados.
 */
export class ScratchReveal {
  private opts: Required<Pick<ScratchRevealOptions, "threshold" | "brushSize">> &
    ScratchRevealOptions;
  private ctx: CanvasRenderingContext2D;
  private ro: ResizeObserver | null = null;
  private strokes: Stroke[] = [];
  private last: { x: number; y: number } | null = null;
  private activeId: number | null = null;
  private revealed = false;
  private lastSample = 0;
  private lastStrokeCb = 0;
  private w = 0;
  private h = 0;
  private dpr = 1;
  private initialTabIndex: string | null;
  private initialAriaHidden: string | null;
  private initiallyInert: boolean;

  private onDown = (e: PointerEvent) => this.pointerDown(e);
  private onMove = (e: PointerEvent) => this.pointerMove(e);
  private onUp = (e: PointerEvent) => this.pointerUp(e);
  private onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.reveal();
    }
  };

  constructor(options: ScratchRevealOptions) {
    this.opts = { threshold: 0.58, brushSize: 34, ...options };
    this.initialTabIndex = options.canvas.getAttribute("tabindex");
    this.initialAriaHidden = options.canvas.getAttribute("aria-hidden");
    this.initiallyInert = options.canvas.hasAttribute("inert");
    const ctx = options.canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D no disponible");
    this.ctx = ctx;
  }

  init(): void {
    const c = this.opts.canvas;
    c.style.touchAction = "none";
    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.opts.container);
    c.addEventListener("pointerdown", this.onDown);
    c.addEventListener("pointermove", this.onMove);
    c.addEventListener("pointerup", this.onUp);
    c.addEventListener("pointercancel", this.onUp);
    c.addEventListener("keydown", this.onKey);
  }

  private resize(): void {
    const rect = this.opts.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.w = rect.width;
    this.h = rect.height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const c = this.opts.canvas;
    c.width = Math.round(this.w * this.dpr);
    c.height = Math.round(this.h * this.dpr);
    c.style.width = `${this.w}px`;
    c.style.height = `${this.h}px`;
    this.repaint();
  }

  private repaint(): void {
    const { ctx } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    paintLeafField(ctx, this.w, this.h);
    // reproducir trazos previos para conservar el progreso tras resize
    for (const s of this.strokes) {
      this.stamp(s.nx * this.w, s.ny * this.h, s.nr * Math.min(this.w, this.h), false);
    }
  }

  private stamp(x: number, y: number, r: number, record = true): void {
    const { ctx } = this;
    ctx.globalCompositeOperation = "destination-out";
    const cell = this.opts.pixelCell;
    if (cell && cell > 0) {
      // mordidas pixel: celdas cuadradas dentro del radio, con borde
      // irregular determinista (mismo resultado al reproducir trazos)
      ctx.fillStyle = "rgba(0,0,0,1)";
      const c0x = Math.floor((x - r) / cell);
      const c1x = Math.floor((x + r) / cell);
      const c0y = Math.floor((y - r) / cell);
      const c1y = Math.floor((y + r) / cell);
      for (let cy = c0y; cy <= c1y; cy++) {
        for (let cx = c0x; cx <= c1x; cx++) {
          const centerX = cx * cell + cell / 2;
          const centerY = cy * cell + cell / 2;
          const dist = Math.hypot(centerX - x, centerY - y);
          if (dist > r) continue;
          if (dist > r * 0.72) {
            // borde mordido: algunas celdas del perímetro quedan
            const hash = ((cx * 73856093) ^ (cy * 19349663)) >>> 0;
            if (hash % 10 < 3) continue;
          }
          ctx.fillRect(cx * cell, cy * cell, cell, cell);
        }
      }
    } else {
      const grad = ctx.createRadialGradient(x, y, r * 0.25, x, y, r);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(0.75, "rgba(0,0,0,0.75)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    if (record) {
      this.strokes.push({
        nx: x / this.w,
        ny: y / this.h,
        nr: r / Math.min(this.w, this.h),
      });
    }
  }

  private local(e: PointerEvent): { x: number; y: number } {
    const rect = this.opts.canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private pointerDown(e: PointerEvent): void {
    if (this.revealed || this.activeId !== null) return;
    this.activeId = e.pointerId;
    this.opts.canvas.setPointerCapture(e.pointerId);
    const p = this.local(e);
    this.last = p;
    this.drawSegment(p.x, p.y, p.x, p.y);
  }

  private pointerMove(e: PointerEvent): void {
    if (this.revealed || e.pointerId !== this.activeId || !this.last) return;
    const p = this.local(e);
    this.drawSegment(this.last.x, this.last.y, p.x, p.y);
    this.last = p;

    const now = performance.now();
    if (now - this.lastStrokeCb > 140) {
      this.lastStrokeCb = now;
      this.opts.onStroke?.(p.x, p.y);
    }
    if (now - this.lastSample > 260) {
      this.lastSample = now;
      this.checkProgress();
    }
  }

  private pointerUp(e: PointerEvent): void {
    if (e.pointerId !== this.activeId) return;
    this.activeId = null;
    this.last = null;
    if (!this.revealed) this.checkProgress();
  }

  /** Interpola el trazo para que no queden huecos entre eventos. */
  private drawSegment(x0: number, y0: number, x1: number, y1: number): void {
    const base = this.opts.brushSize;
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(dist / (base * 0.45)));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x0 + (x1 - x0) * t;
      const y = y0 + (y1 - y0) * t;
      // pequeña variación orgánica del radio
      const r = base * (0.9 + 0.2 * Math.sin(x * 0.05 + y * 0.06));
      this.stamp(x, y, r);
    }
  }

  /** Muestreo parcial del canal alfa (stride amplio, con throttle desde fuera). */
  private checkProgress(): void {
    if (this.revealed) return;
    const { ctx } = this;
    const cw = this.opts.canvas.width;
    const ch = this.opts.canvas.height;
    if (cw === 0 || ch === 0) return;
    const data = ctx.getImageData(0, 0, cw, ch).data;
    const stride = 4 * 41; // muestrea ~1 de cada 41 píxeles
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += stride) {
      total++;
      if (data[i] < 40) clear++;
    }
    const progress = total > 0 ? clear / total : 0;
    this.opts.onProgress?.(progress);
    if (progress >= this.opts.threshold) {
      this.reveal();
    }
  }

  /** Una corriente de aire retira el resto. Se ejecuta una sola vez. */
  reveal(): void {
    if (this.revealed) return;
    this.revealed = true;
    const canvas = this.opts.canvas;
    if (this.activeId !== null) {
      try {
        if (canvas.hasPointerCapture(this.activeId)) {
          canvas.releasePointerCapture(this.activeId);
        }
      } catch {
        // La captura puede haberse liberado al terminar el gesto.
      }
    }
    this.activeId = null;
    this.last = null;
    if (document.activeElement === canvas) canvas.blur();
    canvas.tabIndex = -1;
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("inert", "");
    canvas.classList.add("scratch-done");
    this.opts.onReveal?.();
  }

  reset(): void {
    this.revealed = false;
    this.strokes = [];
    this.activeId = null;
    this.last = null;
    const canvas = this.opts.canvas;
    canvas.classList.remove("scratch-done");
    if (this.initialTabIndex === null) canvas.removeAttribute("tabindex");
    else canvas.setAttribute("tabindex", this.initialTabIndex);
    if (this.initialAriaHidden === null) canvas.removeAttribute("aria-hidden");
    else canvas.setAttribute("aria-hidden", this.initialAriaHidden);
    if (!this.initiallyInert) canvas.removeAttribute("inert");
    this.repaint();
  }

  destroy(): void {
    const c = this.opts.canvas;
    c.removeEventListener("pointerdown", this.onDown);
    c.removeEventListener("pointermove", this.onMove);
    c.removeEventListener("pointerup", this.onUp);
    c.removeEventListener("pointercancel", this.onUp);
    c.removeEventListener("keydown", this.onKey);
    if (this.activeId !== null) {
      try {
        if (c.hasPointerCapture(this.activeId)) c.releasePointerCapture(this.activeId);
      } catch {
        // la captura pudo liberarse al terminar el gesto
      }
      this.activeId = null;
    }
    this.last = null;
    this.ro?.disconnect();
    this.ro = null;
  }
}
