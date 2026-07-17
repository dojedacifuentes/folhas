import type { ColorGrid, SpriteDef } from "./engine";
import { PixelGrid } from "./draw";
import { PIX } from "./palette";

/** Planta con cara en la maceta + sol. Estados de crecimiento y de exceso. */

const PW = 40;
const PH = 50;

// una hoja en forma de lágrima: eje inclinado, ancho que se afina hacia la
// punta, nervio central y contorno propio.
function leaf(
  g: PixelGrid,
  baseX: number,
  baseY: number,
  dir: number,
  color: string,
  dark: string,
  len = 9
): void {
  // eje: sube y se abre hacia «dir». perpendicular para el ancho.
  const ax = dir * 0.62;
  const ay = -0.78;
  const px = -ay;
  const py = ax;
  const tip: Array<[number, number]> = [];
  for (let i = 0; i <= len; i++) {
    const cxp = baseX + ax * i;
    const cyp = baseY + ay * i;
    const w = Math.round(2.4 * Math.sin((Math.PI * i) / len));
    for (let s = -w; s <= w; s++) {
      g.set(cxp + px * s, cyp + py * s, color);
    }
    tip.push([cxp, cyp]);
  }
  // nervio central
  for (const [x, y] of tip) g.set(x, y, dark);
  // contorno local de la hoja
  for (let i = 0; i <= len; i++) {
    const cxp = baseX + ax * i;
    const cyp = baseY + ay * i;
    const w = Math.round(2.4 * Math.sin((Math.PI * i) / len));
    if (w >= 1) {
      g.setBelow(cxp + px * (w + 1), cyp + py * (w + 1), PIX.ink);
      g.setBelow(cxp - px * (w + 1), cyp - py * (w + 1), PIX.ink);
    }
  }
}

function pot(g: PixelGrid): void {
  // cuerpo trapezoidal
  for (let y = 33; y <= 46; y++) {
    const t = (y - 33) / 13;
    const half = 12 - t * 4;
    g.rect(Math.round(20 - half), y, Math.round(half * 2), 1, PIX.pot);
  }
  // sombra derecha
  for (let y = 34; y <= 45; y++) {
    const t = (y - 33) / 13;
    const half = 12 - t * 4;
    g.rect(Math.round(20 + half - 3), y, 3, 1, PIX.potD);
  }
  // borde
  g.rect(7, 31, 26, 3, PIX.pot);
  g.rect(7, 31, 26, 1, PIX.clay);
  g.rect(7, 33, 26, 1, PIX.potD);
  // tierra
  g.ellipse(20, 32, 12, 2, PIX.soil);
  g.outline(PIX.ink);
  // cara de la maceta
  g.disc(15, 39, 1, PIX.ink);
  g.disc(25, 39, 1, PIX.ink);
  g.set(21, 41, PIX.ink);
  g.set(19, 41, PIX.ink);
  g.set(18, 42, PIX.ink);
  g.set(22, 42, PIX.ink);
  g.set(20, 42, PIX.ink);
  g.disc(13, 41, 1, PIX.cheek);
  g.disc(27, 41, 1, PIX.cheek);
}

function buildPlant(state: string): PixelGrid {
  const g = new PixelGrid(PW, PH);

  if (state === "seed") {
    pot(g);
    // cubo turquesa medio enterrado
    g.rect(16, 27, 8, 6, PIX.turD);
    g.rect(16, 27, 8, 3, PIX.tur);
    g.line(16, 27, 24, 27, PIX.turL);
    g.set(16, 27, PIX.ink); g.set(23, 27, PIX.ink);
    g.set(16, 32, PIX.ink); g.set(23, 32, PIX.ink);
    return g;
  }

  if (state === "burnt") {
    pot(g);
    g.line(20, 32, 20, 22, PIX.burnt);
    leaf(g, 20, 24, -1, PIX.burnt, PIX.ink);
    leaf(g, 20, 26, 1, PIX.burnt, PIX.ink);
    g.disc(20, 20, 2, PIX.burnt);
    // humo
    g.disc(17, 16, 2, PIX.smoke);
    g.disc(22, 12, 2, PIX.smoke);
    g.disc(19, 8, 1, PIX.smoke);
    return g;
  }

  if (state === "drowned") {
    pot(g);
    // agua desbordada
    g.rect(8, 30, 24, 2, PIX.water);
    g.ellipse(20, 31, 12, 1, PIX.waterL);
    // tallo caído
    g.quad(20, 32, 26, 28, 30, 30, PIX.stem, 2);
    leaf(g, 30, 30, 1, PIX.leafG, PIX.leafGD);
    g.disc(15, 28, 1, PIX.waterL);
    g.disc(24, 26, 1, PIX.waterL);
    return g;
  }

  if (state === "windBent") {
    pot(g);
    g.quad(20, 32, 24, 24, 30, 22, PIX.stem, 2);
    leaf(g, 30, 22, 1, PIX.leafG, PIX.leafGD);
    leaf(g, 26, 26, 1, PIX.leafT, PIX.turD);
    return g;
  }

  // crecimiento normal: tallo + hojas según altura
  let stemTop = 24;
  if (state === "sprout") stemTop = 28;
  else if (state === "small") stemTop = 25;
  else if (state === "hydrated") stemTop = 23;
  else if (state === "growing") stemTop = 19;
  else if (state === "healthy" || state === "flowering" || state === "overheated") stemTop = 15;

  pot(g);
  g.rect(19, stemTop, 2, 32 - stemTop, PIX.stem);
  g.set(19, stemTop, PIX.leafGD);

  if (state === "sprout") {
    leaf(g, 20, 29, 1, PIX.leafG, PIX.leafGD);
  } else if (state === "small" || state === "hydrated") {
    leaf(g, 20, 27, -1, PIX.leafG, PIX.leafGD);
    leaf(g, 20, 25, 1, PIX.leafG, PIX.leafGD);
    if (state === "hydrated") {
      g.disc(16, 30, 1, PIX.waterL);
      g.disc(24, 30, 1, PIX.waterL);
    }
  } else if (state === "growing") {
    leaf(g, 20, 27, -1, PIX.leafY, PIX.yelD);
    leaf(g, 20, 24, 1, PIX.leafT, PIX.turD);
    leaf(g, 20, 21, -1, PIX.leafG, PIX.leafGD);
  } else if (state === "healthy" || state === "flowering") {
    leaf(g, 20, 28, -1, PIX.leafY, PIX.yelD);
    leaf(g, 20, 25, 1, PIX.leafT, PIX.turD);
    leaf(g, 20, 22, -1, PIX.leafG, PIX.leafGD);
    leaf(g, 20, 19, 1, PIX.leafY, PIX.yelD);
    leaf(g, 20, 17, -1, PIX.leafT, PIX.turD);
    if (state === "flowering") {
      g.disc(20, 14, 3, PIX.bloom);
      g.disc(20, 14, 1, PIX.bloomC);
      g.set(20, 11, PIX.bloom); g.set(23, 14, PIX.bloom);
      g.set(20, 17, PIX.bloom); g.set(17, 14, PIX.bloom);
      g.disc(20, 14, 3, PIX.bloom);
    }
  } else if (state === "overheated") {
    // hojas mustias (caídas)
    leaf(g, 20, 26, -1, PIX.leafGD, PIX.ink);
    leaf(g, 22, 24, 1, PIX.leafGD, PIX.ink);
    g.disc(18, 20, 1, PIX.smoke);
    g.disc(22, 18, 1, PIX.smoke);
  }

  return g;
}

export function plantSprite(state: string): SpriteDef {
  const g = buildPlant(state);
  // respiración muy leve solo en estados sanos
  const gentle = ["healthy", "flowering", "growing", "small", "hydrated"].includes(state);
  if (!gentle) return { width: PW, height: PH, frames: [g.grid()] };
  const rows = g.grid();
  const bob: ColorGrid = [rows[0].map(() => null), ...rows.slice(0, rows.length - 1)];
  return { width: PW, height: PH, frames: [rows, bob], fps: 1.4 };
}

// ============================ SOL ============================

function buildSun(rayPhase: number): PixelGrid {
  const g = new PixelGrid(34, 34);
  const cx = 17;
  const cy = 17;
  // rayos
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + rayPhase;
    const x1 = cx + Math.cos(a) * 11;
    const y1 = cy + Math.sin(a) * 11;
    const x2 = cx + Math.cos(a) * 15;
    const y2 = cy + Math.sin(a) * 15;
    g.line(x1, y1, x2, y2, PIX.sunRay);
  }
  g.disc(cx, cy, 10, PIX.sunD);
  g.disc(cx, cy, 9, PIX.sun);
  g.disc(cx - 2, cy - 3, 5, PIX.sunL);
  g.outline(PIX.ink);
  // carita del sol
  g.disc(14, 16, 1, PIX.ink);
  g.disc(20, 16, 1, PIX.ink);
  g.line(15, 20, 17, 21, PIX.ink);
  g.line(17, 21, 19, 20, PIX.ink);
  g.disc(12, 19, 1, PIX.bloomC);
  g.disc(22, 19, 1, PIX.bloomC);
  return g;
}

export function sunSprite(): SpriteDef {
  return {
    width: 34,
    height: 34,
    frames: [buildSun(0).grid(), buildSun(0.4).grid(), buildSun(0.8).grid()],
    fps: 3,
  };
}

// ============================ NUBE ============================

function buildCloud(squeeze: number): PixelGrid {
  const g = new PixelGrid(38, 26);
  const cy = 12 + squeeze * 2;
  // masa esponjosa: varios bultos
  g.disc(12, cy, 6, PIX.sky);
  g.disc(20, cy - 3, 7, PIX.sky);
  g.disc(28, cy, 6, PIX.sky);
  g.rect(9, cy, 22, 6 - squeeze, PIX.sky);
  // sombra inferior
  g.disc(12, cy + 2, 5, PIX.skyDeep);
  g.disc(28, cy + 2, 5, PIX.skyDeep);
  g.rect(9, cy + 3, 22, 3, PIX.skyDeep);
  // luz arriba
  g.disc(20, cy - 5, 4, PIX.snow);
  g.disc(14, cy - 2, 2, PIX.snow);
  g.outline(PIX.ink);
  // carita
  g.disc(16, cy, 1, PIX.ink);
  g.disc(24, cy, 1, PIX.ink);
  if (squeeze > 0) {
    g.set(20, cy + 2, PIX.ink);
    g.set(19, cy + 1, PIX.ink);
    g.set(21, cy + 1, PIX.ink);
  } else {
    g.line(18, cy + 2, 22, cy + 2, PIX.ink);
  }
  g.disc(13, cy + 1, 1, PIX.coral);
  g.disc(27, cy + 1, 1, PIX.coral);
  // gotas al exprimir
  if (squeeze > 0) {
    g.set(14, 22, PIX.water); g.set(14, 24, PIX.waterL);
    g.set(20, 23, PIX.water); g.set(20, 25, PIX.waterL);
    g.set(26, 22, PIX.water); g.set(26, 24, PIX.waterL);
  }
  return g;
}

export function cloudSprite(state = "idle"): SpriteDef {
  if (state === "squeeze") {
    return { width: 38, height: 26, frames: [buildCloud(1).grid(), buildCloud(2).grid()], fps: 6 };
  }
  // idle: flota (dos fotogramas casi iguales)
  const a = buildCloud(0).grid();
  const b: ColorGrid = [a[0].map(() => null), ...a.slice(0, a.length - 1)];
  return { width: 38, height: 26, frames: [a, b], fps: 1.5 };
}

// ============================ GIRASOL ============================

export function sunflowerSprite(small = false): SpriteDef {
  const w = small ? 20 : 30;
  const h = small ? 30 : 46;
  const g = new PixelGrid(w, h);
  const cx = Math.round(w / 2);
  const headY = small ? 8 : 12;
  const headR = small ? 6 : 9;
  // tallo
  g.rect(cx - 1, headY, 2, h - headY - 2, PIX.stem);
  // hojas del tallo
  if (!small) {
    for (let i = 0; i <= 6; i++) {
      g.set(cx - 2 - i * 0.6, 30 - i, PIX.leafG);
      g.set(cx + 2 + i * 0.6, 26 - i, PIX.leafG);
    }
  }
  // pétalos
  const petals = small ? 8 : 12;
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    const px = cx + Math.cos(a) * (headR + 2);
    const py = headY + Math.sin(a) * (headR + 2);
    g.disc(px, py, small ? 1.4 : 2.2, PIX.bloom);
  }
  // centro
  g.disc(cx, headY, headR, PIX.leafDry);
  g.disc(cx, headY, headR - 2, PIX.leafDark);
  g.outline(PIX.ink);
  // carita
  if (!small) {
    g.disc(cx - 3, headY, 1, PIX.ink);
    g.disc(cx + 3, headY, 1, PIX.ink);
    g.line(cx - 2, headY + 3, cx, headY + 4, PIX.ink);
    g.line(cx, headY + 4, cx + 2, headY + 3, PIX.ink);
  }
  return { width: w, height: h, frames: [g.grid()] };
}
