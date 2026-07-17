import type { SpriteDef } from "./engine";
import { PixelGrid } from "./draw";
import { PIX } from "./palette";

/** Objetos interactivos en pixel art. Estado se usa para tintes de feedback. */

function seedCube(): PixelGrid {
  const g = new PixelGrid(22, 22);
  // cara superior (rombo)
  g.triangle(11, 3, 18, 7, 11, 11, PIX.turL);
  g.triangle(11, 3, 4, 7, 11, 11, PIX.turL);
  // cara izquierda
  g.triangle(4, 7, 11, 11, 11, 19, PIX.tur);
  g.triangle(4, 7, 4, 15, 11, 19, PIX.tur);
  // cara derecha (sombra)
  g.triangle(18, 7, 11, 11, 11, 19, PIX.turD);
  g.triangle(18, 7, 18, 15, 11, 19, PIX.turD);
  g.outline(PIX.ink);
  // brillo
  g.line(6, 8, 9, 6, PIX.lens);
  return g;
}

function thimble(): PixelGrid {
  const g = new PixelGrid(20, 24);
  // cuerpo (dedal)
  for (let y = 6; y <= 20; y++) {
    const t = (y - 6) / 14;
    const half = 6 - t * 2;
    g.rect(Math.round(10 - half), y, Math.round(half * 2), 1, PIX.sage);
  }
  g.disc(10, 6, 6, PIX.sage);
  g.rect(4, 6, 12, 1, PIX.soil);
  // agua dentro
  g.ellipse(10, 7, 4, 1, PIX.water);
  // hoyuelos del dedal
  g.set(8, 10, PIX.soil); g.set(12, 11, PIX.soil); g.set(9, 13, PIX.soil);
  g.outline(PIX.ink);
  return g;
}

function drop(): PixelGrid {
  const g = new PixelGrid(14, 18);
  g.triangle(7, 1, 4, 7, 10, 7, PIX.water);
  g.disc(7, 10, 4, PIX.water);
  g.disc(5, 9, 2, PIX.waterL);
  g.outline(PIX.ink);
  return g;
}

function umbrella(): PixelGrid {
  const g = new PixelGrid(30, 32);
  // cúpula
  g.ellipse(15, 12, 13, 9, PIX.turD);
  g.rect(0, 12, 30, 10, null); // recorta la mitad inferior de la elipse
  g.ellipse(15, 12, 13, 9, PIX.turD);
  for (let x = 2; x <= 28; x++) {
    const t = (x - 15) / 13;
    if (Math.abs(t) > 1) continue;
    const yb = 12 + 9 * Math.sqrt(1 - t * t);
    if (x < 15) g.rect(x, 12, 1, Math.round(yb - 12), PIX.tur);
  }
  // festón inferior
  for (let x = 2; x <= 28; x += 6) g.triangle(x, 20, x + 3, 24, x + 6, 20, PIX.turD);
  g.outline(PIX.ink);
  // mango
  g.rect(14, 12, 2, 16, PIX.soil);
  g.quad(14, 28, 12, 31, 16, 30, PIX.soil, 1);
  g.set(15, 4, PIX.ink);
  return g;
}

function dryLeaves(): PixelGrid {
  const g = new PixelGrid(30, 20);
  const spot = (x: number, y: number, dir: number, col: string, dk: string) => {
    for (let i = 0; i <= 6; i++) {
      const cx = x + dir * i * 0.7;
      const cy = y - i * 0.4;
      const w = Math.round(2 * Math.sin((Math.PI * i) / 6));
      for (let s = -w; s <= w; s++) g.set(cx, cy + s, col);
    }
    g.line(x, y, x + dir * 4, y - 2, dk);
  };
  spot(7, 14, 1, PIX.leafDry, PIX.leafDark);
  spot(20, 15, -1, PIX.sage, PIX.leafDark);
  spot(14, 11, 1, PIX.leafDark, PIX.ink);
  spot(24, 13, 1, PIX.leafDry, PIX.leafDark);
  g.outline(PIX.ink);
  return g;
}

function wind(): PixelGrid {
  const g = new PixelGrid(30, 20);
  g.quad(3, 7, 22, 3, 20, 8, PIX.water, 2);
  g.quad(20, 8, 24, 10, 20, 11, PIX.water, 2);
  g.quad(2, 13, 18, 10, 16, 15, PIX.waterL, 2);
  g.quad(16, 15, 20, 16, 16, 17, PIX.waterL, 2);
  g.outline(PIX.ink);
  return g;
}

function leafObject(): PixelGrid {
  const g = new PixelGrid(30, 34);
  // hoja seca grande en forma de lágrima con nervadura
  const baseX = 15;
  const baseY = 31;
  const ax = 0;
  const ay = -1;
  const px = 1;
  const py = 0;
  const len = 26;
  for (let i = 0; i <= len; i++) {
    const cx = baseX + ax * i;
    const cy = baseY + ay * i;
    const w = Math.round(6 * Math.sin((Math.PI * i) / len));
    for (let s = -w; s <= w; s++) {
      const shade = s < -w * 0.3 ? PIX.leafDry : s > w * 0.4 ? PIX.leafDark : PIX.clay;
      g.set(cx + px * s, cy + py * s, shade);
    }
  }
  // nervio central + laterales
  for (let i = 2; i <= len - 2; i++) g.set(baseX, baseY - i, PIX.leafDark);
  for (let i = 6; i <= len - 4; i += 4) {
    g.line(baseX, baseY - i, baseX - 4, baseY - i - 3, PIX.leafDark);
    g.line(baseX, baseY - i, baseX + 4, baseY - i - 3, PIX.leafDark);
  }
  g.outline(PIX.ink);
  return g;
}

function wateringCup(): PixelGrid {
  const g = new PixelGrid(28, 22);
  g.ellipse(14, 14, 7, 6, PIX.turD);
  g.ellipse(14, 13, 7, 6, PIX.tur);
  g.rect(3, 8, 8, 2, PIX.turD); // pitorro
  g.line(3, 8, 0, 10, PIX.turD);
  g.rect(20, 8, 6, 3, PIX.turD); // asa
  g.rect(11, 6, 8, 2, PIX.turD); // boca
  g.ellipse(11, 11, 4, 2, PIX.turL);
  g.outline(PIX.ink);
  // gotas
  g.set(1, 12, PIX.water); g.set(1, 14, PIX.waterL);
  return g;
}

const BUILDERS: Record<string, () => PixelGrid> = {
  seed: seedCube,
  thimble,
  drop,
  umbrella,
  "dry-leaves": dryLeaves,
  dryLeaves,
  wind,
  "watering-cup": wateringCup,
  wateringCup,
  leaf: leafObject,
};

const SIZES: Record<string, [number, number]> = {
  seed: [22, 22],
  thimble: [20, 24],
  drop: [14, 18],
  umbrella: [30, 32],
  "dry-leaves": [30, 20],
  dryLeaves: [30, 20],
  wind: [30, 20],
  "watering-cup": [28, 22],
  wateringCup: [28, 22],
  leaf: [30, 34],
};

export function objectSprite(kind: string, _state = "idle"): SpriteDef {
  const build = BUILDERS[kind];
  const [w, h] = SIZES[kind] ?? [24, 24];
  if (!build) return { width: w, height: h, frames: [[[]]] };
  return { width: w, height: h, frames: [build().grid()] };
}
