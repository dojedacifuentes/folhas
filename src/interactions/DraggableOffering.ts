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

  private pointerDown(e: PointerEvent): void {
    if (this.placed || this.activeId !== null) return;
    this.activeId = e.pointerId;
    this.dragging = true;
    this.startX = e.clientX - this.dx;
    this.startY = e.clientY - this.dy;
    this.opts.el.setPointerCapture(e.pointerId);
    this.opts.el.classList.add("is-dragging");
  }

  private pointerMove(e: PointerEvent): void {
    if (!this.dragging || e.pointerId !== this.activeId) return;
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
    if (e.pointerId !== this.activeId) return;
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
    const el = this.opts.el;
    el.classList.add("is-returning");
    this.dx = 0;
    this.dy = 0;
    el.style.transform = "translate(0px, 0px)";
    window.setTimeout(() => el.classList.remove("is-returning"), 620);
    this.opts.onReturned?.();
  }

  /** Encaja en el destino con atracción suave. */
  place(): void {
    if (this.placed) return;
    this.placed = true;
    this.dragging = false;
    const el = this.opts.el;
    const a = this.center(el);
    const b = this.center(this.opts.target);
    this.dx += b.x - a.x;
    this.dy += b.y - a.y;
    el.classList.remove("is-dragging");
    el.classList.add("is-placing");
    el.style.transform = `translate(${this.dx}px, ${this.dy}px)`;
    el.setAttribute("aria-disabled", "true");
    el.tabIndex = -1;
    this.opts.target.classList.remove("is-inviting");
    window.setTimeout(() => {
      el.classList.add("is-placed");
      this.opts.onPlaced();
    }, 420);
  }

  get isPlaced(): boolean {
    return this.placed;
  }

  destroy(): void {
    const el = this.opts.el;
    el.removeEventListener("pointerdown", this.onDown);
    el.removeEventListener("pointermove", this.onMove);
    el.removeEventListener("pointerup", this.onUp);
    el.removeEventListener("pointercancel", this.onUp);
    el.removeEventListener("keydown", this.onKey);
  }
}
