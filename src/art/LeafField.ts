/**
 * Capa raspable de hojas secas, en pixel art.
 * Cinco siluetas con mini-personalidad (amarilla quebradiza, rojiza moteada,
 * salvia con agujeritos, redondita, alargada curvada), dibujadas píxel a
 * píxel en sellos diminutos y estampadas con vecino-más-cercano, sin
 * rotaciones (solo espejos) para conservar la rejilla.
 * Determinista: la misma semilla produce la misma composición.
 */

const INK = "#2b2620";
const SHADOW = "rgba(30, 22, 16, 0.3)";

const MULCH = {
  base: "#7c5a3d",
  dark: "#6a4b32",
  light: "#8d6947",
  branch: "#4d3a30",
};

type LeafPalette = { l: string; m: string; d: string; v: string };

const PALETTES: Record<string, LeafPalette> = {
  yellow: { l: "#dcb658", m: "#c49a3a", d: "#9a7526", v: "#7e5c1a" },
  red: { l: "#c47a42", m: "#a85a2c", d: "#7e3f1e", v: "#5e2f16" },
  sage: { l: "#a8b273", m: "#8f9c5c", d: "#6f7c44", v: "#55603a" },
  round: { l: "#c9924e", m: "#ab7233", d: "#835222", v: "#66401c" },
  long: { l: "#a67a4a", m: "#8a5f36", d: "#6b4526", v: "#503418" },
};

/** PRNG mulberry32: pequeño y determinista. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mini-rejilla local para dibujar un sello y contornearlo. */
class StampGrid {
  readonly w: number;
  readonly h: number;
  readonly cells: (string | null)[];

  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.cells = new Array(w * h).fill(null);
  }

  set(x: number, y: number, color: string | null): void {
    const xi = Math.round(x);
    const yi = Math.round(y);
    if (xi < 0 || yi < 0 || xi >= this.w || yi >= this.h) return;
    this.cells[yi * this.w + xi] = color;
  }

  get(x: number, y: number): string | null {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return null;
    return this.cells[y * this.w + x];
  }

  outline(color: string): void {
    const marks: number[] = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.get(x, y) !== null) continue;
        if (
          this.get(x - 1, y) !== null ||
          this.get(x + 1, y) !== null ||
          this.get(x, y - 1) !== null ||
          this.get(x, y + 1) !== null
        ) {
          marks.push(y * this.w + x);
        }
      }
    }
    for (const i of marks) this.cells[i] = color;
  }

  /** Vuelca la rejilla a un canvas 1:1 (o su silueta en un solo color). */
  toCanvas(silhouette?: string): HTMLCanvasElement {
    const c = document.createElement("canvas");
    c.width = this.w;
    c.height = this.h;
    const ctx = c.getContext("2d")!;
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        const color = this.get(x, y);
        if (!color) continue;
        ctx.fillStyle = silhouette ?? color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }
}

type StampKind = "yellow" | "red" | "sage" | "round" | "long";

function buildStamp(kind: StampKind): StampGrid {
  const pal = PALETTES[kind];
  const long = kind === "long";
  const round = kind === "round";
  const w = long ? 9 : round ? 11 : 13;
  const h = long ? 20 : round ? 12 : 17;
  const g = new StampGrid(w, h);
  const cx = Math.floor(w / 2);
  const tip = 1;
  const base = h - 3;
  const len = base - tip;
  const maxW = round ? 4.6 : long ? 2.6 : 4.4;
  const profile = round ? 0.55 : 0.85;

  for (let i = 0; i <= len; i++) {
    const y = tip + i;
    const t = i / len;
    let wid = maxW * Math.sin(Math.PI * Math.pow(t, profile));
    // quebradiza: borde dentado determinista
    if (kind === "yellow") wid += (i % 3 === 0 ? 1 : 0) - (i % 4 === 0 ? 1 : 0);
    const curve = long ? Math.round(Math.sin(t * Math.PI) * 2.2) : 0;
    const wl = Math.max(0, Math.round(wid));
    const wr = Math.max(0, Math.round(wid * (long ? 1 : 0.9)));
    for (let x = cx + curve - wl; x <= cx + curve + wr; x++) {
      const rel = (x - (cx + curve - wl)) / Math.max(1, wl + wr);
      g.set(x, y, rel < 0.32 ? pal.l : rel > 0.7 ? pal.d : pal.m);
    }
    // nervadura central
    if (i > 0 && i < len) g.set(cx + curve, y, pal.v);
  }

  // nervaduras secundarias cortas
  for (let i = 4; i <= len - 3; i += 4) {
    const y = tip + i;
    g.set(cx - 2, y - 1, pal.v);
    g.set(cx + 2, y - 1, pal.v);
  }

  // personalidad por especie
  if (kind === "red") {
    g.set(cx - 2, tip + 4, pal.d);
    g.set(cx + 2, tip + 7, pal.d);
    g.set(cx - 1, tip + 10, pal.d);
  }
  if (kind === "sage") {
    // agujeritos: se perfora y el contorno los rodeará
    g.set(cx - 2, tip + 5, null);
    g.set(cx + 2, tip + 9, null);
  }

  // tallo corto
  g.set(cx, base + 1, pal.d);
  g.set(cx, base + 2, pal.v);

  g.outline(INK);
  return g;
}

type Stamp = { art: HTMLCanvasElement; shadow: HTMLCanvasElement };

let stampCache: Record<StampKind, Stamp> | null = null;

function stamps(): Record<StampKind, Stamp> {
  if (!stampCache) {
    const kinds: StampKind[] = ["yellow", "red", "sage", "round", "long"];
    stampCache = Object.fromEntries(
      kinds.map((kind) => {
        const grid = buildStamp(kind);
        return [kind, { art: grid.toCanvas(), shadow: grid.toCanvas(SHADOW) }];
      })
    ) as Record<StampKind, Stamp>;
  }
  return stampCache;
}

/**
 * Rellena por completo el canvas (en coordenadas lógicas w×h)
 * con mantillo y hojas pixel. Sin transparencia inicial.
 */
export function paintLeafField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed = 20260713
): void {
  const rnd = mulberry32(seed);
  ctx.imageSmoothingEnabled = false;

  // mantillo plano con tramado de celdas
  const CELL = 6;
  ctx.fillStyle = MULCH.base;
  ctx.fillRect(0, 0, w, h);
  for (let cy = 0; cy < h; cy += CELL) {
    for (let cx = 0; cx < w; cx += CELL) {
      const r = rnd();
      if (r < 0.13) {
        ctx.fillStyle = MULCH.dark;
        ctx.fillRect(cx, cy, CELL, CELL);
      } else if (r < 0.19) {
        ctx.fillStyle = MULCH.light;
        ctx.fillRect(cx, cy, CELL, CELL);
      }
    }
  }

  // ramitas: corridas de celdas oscuras con algún quiebre
  const branches = Math.round((w * h) / 70000) + 3;
  ctx.fillStyle = MULCH.branch;
  for (let i = 0; i < branches; i++) {
    let bx = Math.floor((rnd() * w) / CELL) * CELL;
    let by = Math.floor((rnd() * h) / CELL) * CELL;
    const horizontal = rnd() < 0.5;
    const steps = 6 + Math.floor(rnd() * 10);
    for (let s = 0; s < steps; s++) {
      ctx.fillRect(bx, by, CELL, CELL);
      if (horizontal) bx += CELL;
      else by += CELL;
      if (rnd() < 0.25) {
        if (horizontal) by += rnd() < 0.5 ? CELL : -CELL;
        else bx += rnd() < 0.5 ? CELL : -CELL;
      }
    }
  }

  // hojas pixel: siluetas distintas, espejos sin rotación, sombra dura
  const all = stamps();
  const kinds: StampKind[] = ["yellow", "red", "sage", "round", "long"];
  const count = Math.max(60, Math.round((w * h) / 3800));
  for (let i = 0; i < count; i++) {
    let x = rnd() * w;
    let y = rnd() * h;
    if (rnd() < 0.35) x = rnd() < 0.5 ? x * 0.35 : w - x * 0.35;
    const kind = kinds[Math.floor(rnd() * kinds.length)];
    const stamp = all[kind];
    const scale = 3 + Math.floor(rnd() * 3); // 3..5, siempre entero
    const dw = stamp.art.width * scale;
    const dh = stamp.art.height * scale;
    const flipH = rnd() < 0.5;
    const flipV = rnd() < 0.16;
    const px = Math.round((x - dw / 2) / 2) * 2;
    const py = Math.round((y - dh / 2) / 2) * 2;

    ctx.save();
    ctx.translate(px + dw / 2, py + dh / 2);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.globalAlpha = 0.55;
    ctx.drawImage(stamp.shadow, -dw / 2 + scale, -dh / 2 + scale, dw, dh);
    ctx.globalAlpha = 1;
    ctx.drawImage(stamp.art, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  }
}
