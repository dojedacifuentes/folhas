export type LightAlignerOptions = {
  lamp: HTMLElement; // control de la luz (button)
  stage: HTMLElement; // escenario de coordenadas
  /** posición objetivo en fracciones del escenario (0..1) */
  targetX?: number;
  targetY?: number;
  /** radio de influencia en fracción de la diagonal */
  radius?: number;
  onUpdate: (alignment: number, x: number, y: number) => void;
  onAligned: () => void;
};

/**
 * Fuente de luz móvil. La alineación es una zona amplia, no un punto exacto.
 * Alternativas: flechas del teclado y align() directo.
 */
export class LightAligner {
  private opts: Required<
    Pick<LightAlignerOptions, "targetX" | "targetY" | "radius">
  > &
    LightAlignerOptions;
  private x = 0.5;
  private y = 0.72;
  private aligned = false;
  private activeId: number | null = null;

  private onDown = (e: PointerEvent) => this.pointerDown(e);
  private onMove = (e: PointerEvent) => this.pointerMove(e);
  private onUp = (e: PointerEvent) => this.pointerUp(e);
  private onKey = (e: KeyboardEvent) => this.keyMove(e);

  constructor(options: LightAlignerOptions) {
    this.opts = { targetX: 0.52, targetY: 0.26, radius: 0.34, ...options };
    const lamp = options.lamp;
    lamp.addEventListener("pointerdown", this.onDown);
    lamp.addEventListener("pointermove", this.onMove);
    lamp.addEventListener("pointerup", this.onUp);
    lamp.addEventListener("pointercancel", this.onUp);
    lamp.addEventListener("keydown", this.onKey);
    this.apply();
  }

  private pointerDown(e: PointerEvent): void {
    if (this.aligned || this.activeId !== null) return;
    this.activeId = e.pointerId;
    this.opts.lamp.setPointerCapture(e.pointerId);
    this.opts.lamp.classList.add("is-held");
  }

  private pointerMove(e: PointerEvent): void {
    if (this.aligned || e.pointerId !== this.activeId) return;
    const r = this.opts.stage.getBoundingClientRect();
    this.x = Math.min(0.96, Math.max(0.04, (e.clientX - r.left) / r.width));
    this.y = Math.min(0.9, Math.max(0.06, (e.clientY - r.top) / r.height));
    this.apply();
  }

  private pointerUp(e: PointerEvent): void {
    if (e.pointerId !== this.activeId) return;
    this.activeId = null;
    this.opts.lamp.classList.remove("is-held");
    if (!this.aligned && this.alignment() >= 0.86) this.settle();
  }

  private keyMove(e: KeyboardEvent): void {
    if (this.aligned) return;
    const step = 0.035;
    let handled = true;
    switch (e.key) {
      case "ArrowLeft":
        this.x = Math.max(0.04, this.x - step);
        break;
      case "ArrowRight":
        this.x = Math.min(0.96, this.x + step);
        break;
      case "ArrowUp":
        this.y = Math.max(0.06, this.y - step);
        break;
      case "ArrowDown":
        this.y = Math.min(0.9, this.y + step);
        break;
      case "Enter":
      case " ":
        if (this.alignment() >= 0.7) this.settle();
        else handled = false;
        break;
      default:
        handled = false;
    }
    if (handled) {
      e.preventDefault();
      this.apply();
      if (this.alignment() >= 0.92) this.settle();
    }
  }

  private alignment(): number {
    const dx = this.x - this.opts.targetX;
    const dy = this.y - this.opts.targetY;
    const d = Math.hypot(dx, dy);
    return Math.max(0, Math.min(1, 1 - d / this.opts.radius));
  }

  private apply(): void {
    this.opts.onUpdate(this.alignment(), this.x, this.y);
    if (!this.aligned && this.activeId !== null && this.alignment() >= 0.94) {
      this.settle();
    }
  }

  /** La luz se estabiliza en la zona objetivo. */
  private settle(): void {
    if (this.aligned) return;
    this.aligned = true;
    if (this.activeId !== null) {
      this.activeId = null;
      this.opts.lamp.classList.remove("is-held");
    }
    // deslizamiento suave hasta el objetivo
    const steps = 18;
    let i = 0;
    const x0 = this.x;
    const y0 = this.y;
    const animate = () => {
      i++;
      const t = i / steps;
      const ease = 1 - Math.pow(1 - t, 3);
      this.x = x0 + (this.opts.targetX - x0) * ease;
      this.y = y0 + (this.opts.targetY - y0) * ease;
      this.opts.onUpdate(this.alignment(), this.x, this.y);
      if (i < steps) requestAnimationFrame(animate);
      else this.opts.onAligned();
    };
    requestAnimationFrame(animate);
  }

  /** Alternativa accesible: encontrar la luz directamente. */
  align(): void {
    this.settle();
  }

  destroy(): void {
    const lamp = this.opts.lamp;
    lamp.removeEventListener("pointerdown", this.onDown);
    lamp.removeEventListener("pointermove", this.onMove);
    lamp.removeEventListener("pointerup", this.onUp);
    lamp.removeEventListener("pointercancel", this.onUp);
    lamp.removeEventListener("keydown", this.onKey);
  }
}
