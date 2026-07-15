export type PointerPoint = { x: number; y: number };

export type PointerTrackerOptions = {
  el: HTMLElement;
  onStart?: (p: PointerPoint, e: PointerEvent) => void;
  onMove?: (p: PointerPoint, e: PointerEvent) => void;
  onEnd?: (p: PointerPoint, e: PointerEvent) => void;
};

/**
 * Seguimiento de puntero unificado (mouse, touch, stylus) con captura,
 * coordenadas relativas al elemento y limpieza completa.
 */
export class PointerTracker {
  private opts: PointerTrackerOptions;
  private activeId: number | null = null;
  private down = (e: PointerEvent) => this.handleDown(e);
  private move = (e: PointerEvent) => this.handleMove(e);
  private up = (e: PointerEvent) => this.handleUp(e);

  constructor(opts: PointerTrackerOptions) {
    this.opts = opts;
    const el = opts.el;
    el.addEventListener("pointerdown", this.down);
    el.addEventListener("pointermove", this.move);
    el.addEventListener("pointerup", this.up);
    el.addEventListener("pointercancel", this.up);
  }

  private local(e: PointerEvent): PointerPoint {
    const rect = this.opts.el.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  private handleDown(e: PointerEvent): void {
    if (this.activeId !== null) return;
    this.activeId = e.pointerId;
    this.opts.el.setPointerCapture(e.pointerId);
    this.opts.onStart?.(this.local(e), e);
  }

  private handleMove(e: PointerEvent): void {
    if (e.pointerId !== this.activeId) return;
    this.opts.onMove?.(this.local(e), e);
  }

  private handleUp(e: PointerEvent): void {
    if (e.pointerId !== this.activeId) return;
    this.activeId = null;
    this.opts.onEnd?.(this.local(e), e);
  }

  destroy(): void {
    const el = this.opts.el;
    el.removeEventListener("pointerdown", this.down);
    el.removeEventListener("pointermove", this.move);
    el.removeEventListener("pointerup", this.up);
    el.removeEventListener("pointercancel", this.up);
    if (this.activeId !== null) {
      try {
        if (el.hasPointerCapture(this.activeId)) el.releasePointerCapture(this.activeId);
      } catch {
        // la captura pudo liberarse al terminar el gesto
      }
    }
    this.activeId = null;
  }
}
