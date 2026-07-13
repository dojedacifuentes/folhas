export type DraggableOfferingOptions = {
  el: HTMLElement; // objeto arrastrable (button)
  target: HTMLElement; // zona de destino
  surface: HTMLElement; // superficie de coordenadas
  magnetRadius?: number; // distancia a la que "encaja"
  onNear?: (near: boolean) => void;
  onPlaced: () => void;
  onReturned?: () => void;
};

/**
 * Objeto arrastrable con atracción magnética suave y sin estado de fracaso.
 * Alternativa accesible: Enter o Espacio lo colocan directamente.
 */
export class DraggableOffering {
  private opts: Required<Pick<DraggableOfferingOptions, "magnetRadius">> &
    DraggableOfferingOptions;
  private placed = false;
  private dragging = false;
  private activeId: number | null = null;
  private startX = 0;
  private startY = 0;
  private dx = 0;
  private dy = 0;
  private wasNear = false;
  private destroyed = false;
  private resizeObserver: ResizeObserver | null = null;
  private returnTimer: number | null = null;
  private alignTimer: number | null = null;
  private placeTimer: number | null = null;

  private onDown = (e: PointerEvent) => this.pointerDown(e);
  private onMove = (e: PointerEvent) => this.pointerMove(e);
  private onUp = (e: PointerEvent) => this.pointerUp(e);
  private onKey = (e: KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !this.placed) {
      e.preventDefault();
      this.place();
    }
  };

  constructor(options: DraggableOfferingOptions) {
    this.opts = { magnetRadius: 120, ...options };
    const el = options.el;
    el.classList.add("offering-draggable");
    el.addEventListener("pointerdown", this.onDown);
    el.addEventListener("pointermove", this.onMove);
    el.addEventListener("pointerup", this.onUp);
    el.addEventListener("pointercancel", this.onUp);
    el.addEventListener("keydown", this.onKey);
    this.resizeObserver = new ResizeObserver(() => {
      if (this.placed && !this.destroyed) this.alignToTarget();
    });
    this.resizeObserver.observe(options.surface);
    this.resizeObserver.observe(options.target);
  }

  private center(el: HTMLElement): { x: number; y: number } {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  private distToTarget(): number {
    const a = this.center(this.opts.el);
    const b = this.center(this.opts.target);
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  /** Traslación que el navegador muestra, incluso durante una transición. */
  private renderedTranslation(): { x: number; y: number } {
    const transform = window.getComputedStyle(this.opts.el).transform;
    if (!transform || transform === "none") return { x: 0, y: 0 };
    const values = transform
      .slice(transform.indexOf("(") + 1, -1)
      .split(",")
      .map((value) => Number.parseFloat(value));
    if (transform.startsWith("matrix3d(") && values.length === 16) {
      return { x: values[12] || 0, y: values[13] || 0 };
    }
    if (transform.startsWith("matrix(") && values.length === 6) {
      return { x: values[4] || 0, y: values[5] || 0 };
    }
    if (transform.startsWith("translate")) {
      return { x: values[0] || 0, y: values[1] || 0 };
    }
    return { x: 0, y: 0 };
  }

  /** Recalcula el destino desde la geometría sin transformar; no cambia el progreso. */
  private alignToTarget(): void {
    const el = this.opts.el;
    if (
      this.destroyed ||
      !this.placed ||
      !el.isConnected ||
      !this.opts.target.isConnected
    ) {
      return;
    }
    const current = this.center(el);
    const rendered = this.renderedTranslation();
    const base = { x: current.x - rendered.x, y: current.y - rendered.y };
    const target = this.center(this.opts.target);
    this.dx = target.x - base.x;
    this.dy = target.y - base.y;
    el.style.transform = `translate(${this.dx}px, ${this.dy}px)`;
  }

  private pointerDown(e: PointerEvent): void {
    if (this.destroyed || this.placed || this.activeId !== null) return;
    this.activeId = e.pointerId;
    this.dragging = true;
    this.startX = e.clientX - this.dx;
    this.startY = e.clientY - this.dy;
    this.opts.el.setPointerCapture(e.pointerId);
    this.opts.el.classList.add("is-dragging");
  }

  private pointerMove(e: PointerEvent): void {
    if (this.destroyed || !this.dragging || e.pointerId !== this.activeId) return;
    this.dx = e.clientX - this.startX;
    this.dy = e.clientY - this.startY;
    this.opts.el.style.transform = `translate(${this.dx}px, ${this.dy}px)`;
    const near = this.distToTarget() < this.opts.magnetRadius;
    if (near !== this.wasNear) {
      this.wasNear = near;
      this.opts.onNear?.(near);
      this.opts.target.classList.toggle("is-inviting", near);
    }
  }

  private pointerUp(e: PointerEvent): void {
    if (this.destroyed || e.pointerId !== this.activeId) return;
    this.activeId = null;
    if (!this.dragging || this.placed) return;
    this.dragging = false;
    this.opts.el.classList.remove("is-dragging");
    if (this.distToTarget() < this.opts.magnetRadius) {
      this.place();
    } else {
      this.returnHome();
    }
  }

  /** Vuelve despacio a su sitio. Nadie lo regaña. */
  private returnHome(): void {
    if (this.destroyed) return;
    const el = this.opts.el;
    if (this.returnTimer !== null) window.clearTimeout(this.returnTimer);
    el.classList.add("is-returning");
    this.dx = 0;
    this.dy = 0;
    el.style.transform = "translate(0px, 0px)";
    this.returnTimer = window.setTimeout(() => {
      this.returnTimer = null;
      if (!this.destroyed) el.classList.remove("is-returning");
    }, 620);
    this.opts.onReturned?.();
  }

  /** Encaja en el destino con atracción suave. */
  place(): void {
    if (this.destroyed || this.placed) return;
    this.placed = true;
    this.dragging = false;
    const el = this.opts.el;
    if (this.returnTimer !== null) {
      window.clearTimeout(this.returnTimer);
      this.returnTimer = null;
    }
    el.classList.remove("is-returning");
    el.classList.remove("is-dragging");
    el.classList.add("is-placing");
    this.alignToTarget();
    // Al reanudar una escena, place() puede ejecutarse antes de insertar su DOM.
    this.alignTimer = window.setTimeout(() => {
      this.alignTimer = null;
      if (!this.destroyed) this.alignToTarget();
    }, 0);
    el.setAttribute("aria-disabled", "true");
    el.tabIndex = -1;
    this.opts.target.classList.remove("is-inviting");
    this.placeTimer = window.setTimeout(() => {
      this.placeTimer = null;
      if (this.destroyed) return;
      this.alignToTarget();
      el.classList.add("is-placed");
      this.opts.onPlaced();
    }, 420);
  }

  get isPlaced(): boolean {
    return this.placed;
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this.returnTimer !== null) window.clearTimeout(this.returnTimer);
    if (this.alignTimer !== null) window.clearTimeout(this.alignTimer);
    if (this.placeTimer !== null) window.clearTimeout(this.placeTimer);
    this.returnTimer = null;
    this.alignTimer = null;
    this.placeTimer = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    const el = this.opts.el;
    if (this.activeId !== null) {
      try {
        if (el.hasPointerCapture(this.activeId)) el.releasePointerCapture(this.activeId);
      } catch {
        // La captura puede haberse liberado al desmontar la escena.
      }
    }
    this.activeId = null;
    this.dragging = false;
    this.opts.target.classList.remove("is-inviting");
    el.removeEventListener("pointerdown", this.onDown);
    el.removeEventListener("pointermove", this.onMove);
    el.removeEventListener("pointerup", this.onUp);
    el.removeEventListener("pointercancel", this.onUp);
    el.removeEventListener("keydown", this.onKey);
  }
}
