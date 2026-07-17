import type { Cell, ColorGrid } from "./engine";

/**
 * Constructor de pixel art por primitivas. Se dibuja sobre una rejilla de
 * colores y luego se puede aplicar un contorno automático que envuelve la
 * silueta. Pensado para componer personajes con volumen (elipses de cuerpo,
 * triángulos de orejas, líneas de bigotes) en vez de teclear píxel a píxel.
 */
export class PixelGrid {
  readonly w: number;
  readonly h: number;
  private cells: Cell[];

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.cells = new Array(w * h).fill(null);
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < this.w && y >= 0 && y < this.h;
  }

  set(x: number, y: number, color: Cell | undefined): void {
    x = Math.round(x);
    y = Math.round(y);
    if (this.inBounds(x, y)) this.cells[y * this.w + x] = color ?? null;
  }

  get(x: number, y: number): Cell {
    if (!this.inBounds(x, y)) return null;
    return this.cells[y * this.w + x];
  }

  /**
   * Tramado a cuadros sobre un tono ya pintado: donde la celda es `target`
   * y (x+y) tiene la paridad pedida, pinta `paint`. Da textura (pelaje,
   * barro, esponjado) sin romper la silueta.
   */
  ditherOver(target: Cell, paint: Cell, parity: 0 | 1 = 0): void {
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.cells[y * this.w + x] === target && ((x + y) & 1) === parity) {
          this.cells[y * this.w + x] = paint;
        }
      }
    }
  }

  /** Pinta solo si la celda está vacía (para no tapar detalles ya puestos). */
  setBelow(x: number, y: number, color: Cell): void {
    x = Math.round(x);
    y = Math.round(y);
    if (this.inBounds(x, y) && this.cells[y * this.w + x] === null) {
      this.cells[y * this.w + x] = color;
    }
  }

  rect(x: number, y: number, w: number, h: number, color: Cell): void {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, color);
  }

  line(x0: number, y0: number, x1: number, y1: number, color: Cell): void {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, color);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }

  /** Elipse rellena (o solo borde si fill=false). */
  ellipse(cx: number, cy: number, rx: number, ry: number, color: Cell, fill = true): void {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      const t = (y - cy) / ry;
      if (Math.abs(t) > 1) continue;
      const half = rx * Math.sqrt(1 - t * t);
      const xL = Math.round(cx - half);
      const xR = Math.round(cx + half);
      if (fill) {
        for (let x = xL; x <= xR; x++) this.set(x, y, color);
      } else {
        this.set(xL, y, color);
        this.set(xR, y, color);
      }
    }
    if (!fill) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const t = (x - cx) / rx;
        if (Math.abs(t) > 1) continue;
        const half = ry * Math.sqrt(1 - t * t);
        this.set(x, Math.round(cy - half), color);
        this.set(x, Math.round(cy + half), color);
      }
    }
  }

  disc(cx: number, cy: number, r: number, color: Cell): void {
    this.ellipse(cx, cy, r, r, color, true);
  }

  ring(cx: number, cy: number, r: number, color: Cell): void {
    this.ellipse(cx, cy, r, r, color, false);
  }

  /** Triángulo relleno por prueba de punto (regla de signos). */
  triangle(
    x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, color: Cell
  ): void {
    const minX = Math.floor(Math.min(x0, x1, x2));
    const maxX = Math.ceil(Math.max(x0, x1, x2));
    const minY = Math.floor(Math.min(y0, y1, y2));
    const maxY = Math.ceil(Math.max(y0, y1, y2));
    const sign = (ax: number, ay: number, bx: number, by: number, px: number, py: number) =>
      (px - bx) * (ay - by) - (ax - bx) * (py - by);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const d1 = sign(x0, y0, x1, y1, x + 0.5, y + 0.5);
        const d2 = sign(x1, y1, x2, y2, x + 0.5, y + 0.5);
        const d3 = sign(x2, y2, x0, y0, x + 0.5, y + 0.5);
        const neg = d1 < 0 || d2 < 0 || d3 < 0;
        const pos = d1 > 0 || d2 > 0 || d3 > 0;
        if (!(neg && pos)) this.set(x, y, color);
      }
    }
  }

  /** Curva cuadrática muestreada (para colas). */
  quad(
    x0: number, y0: number, cx: number, cy: number, x1: number, y1: number,
    color: Cell, thickness = 1
  ): void {
    const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) + Math.hypot(cx - x0, cy - y0)) * 2;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const mt = 1 - t;
      const x = mt * mt * x0 + 2 * mt * t * cx + t * t * x1;
      const y = mt * mt * y0 + 2 * mt * t * cy + t * t * y1;
      if (thickness <= 1) {
        this.set(x, y, color);
      } else {
        this.disc(x, y, thickness / 2, color);
      }
    }
  }

  /** Añade un contorno de un píxel alrededor de toda la silueta pintada. */
  outline(color: Cell, diagonal = true): void {
    const add: Array<[number, number]> = [];
    const n4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const n8 = [...n4, [1, 1], [1, -1], [-1, 1], [-1, -1]];
    const neigh = diagonal ? n8 : n4;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.cells[y * this.w + x] !== null) continue;
        let touch = false;
        for (const [dx, dy] of neigh) {
          if (this.get(x + dx, y + dy) !== null) { touch = true; break; }
        }
        if (touch) add.push([x, y]);
      }
    }
    for (const [x, y] of add) this.set(x, y, color);
  }

  /** Copia profunda de la rejilla como fotograma. */
  grid(): ColorGrid {
    const out: ColorGrid = [];
    for (let y = 0; y < this.h; y++) {
      out.push(this.cells.slice(y * this.w, y * this.w + this.w));
    }
    return out;
  }

  clone(): PixelGrid {
    const g = new PixelGrid(this.w, this.h);
    g.cells = this.cells.slice();
    return g;
  }
}
