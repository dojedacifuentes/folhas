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
      // dos tonos: el borde inferior de la hoja queda en sombra
      const shade = s * dir > w * 0.34 ? dark : color;
      g.set(cxp + px * s, cyp + py * s, shade);
    }
    tip.push([cxp, cyp]);
  }
  // nervio central
  for (const [x, y] of tip) g.set(x, y, dark);
  // brillo en la punta: la hoja mira a la luz
  const [tx, ty] = tip[tip.length - 1];
  g.set(tx, ty, color);
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
  // cuerpo trapezoidal: cuatro tonos de barro (luz izquierda, sombra derecha)
  for (let y = 33; y <= 46; y++) {
    const t = (y - 33) / 13;
    const half = 12 - t * 4;
    const x0 = Math.round(20 - half);
    const w = Math.round(half * 2);
    g.rect(x0, y, w, 1, PIX.pot);
    // columna de luz
    g.rect(x0 + 1, y, 2, 1, PIX.potL);
    // sombra derecha en dos pasos
    g.rect(x0 + w - 3, y, 3, 1, PIX.potD);
    g.rect(x0 + w - 1, y, 1, 1, PIX.potDD);
  }
  // base más oscura (asienta en el suelo)
  g.rect(12, 46, 16, 1, PIX.potDD);
  // borde con canto iluminado
  g.rect(7, 31, 26, 3, PIX.pot);
  g.rect(7, 31, 26, 1, PIX.clayLight);
  g.rect(7, 33, 26, 1, PIX.potD);
  g.set(32, 32, PIX.potDD);
  // textura de barro: tramado suave donde la luz toca
  g.ditherOver(PIX.potL, PIX.pot, 1);
  // tierra con motitas (vivida, no plana)
  g.ellipse(20, 32, 12, 2, PIX.soil);
  g.set(14, 31, PIX.soilSpeck);
  g.set(22, 32, PIX.soilSpeck);
  g.set(27, 31, PIX.soilSpeck);
  g.set(18, 32, PIX.soilWet);
  g.outline(PIX.ink);
  // cara de la maceta: neutra y tierna (ojos punto, boca mínima)
  g.set(16, 39, PIX.ink);
  g.set(24, 39, PIX.ink);
  g.set(19, 42, PIX.ink);
  g.set(20, 42, PIX.ink);
  g.set(21, 42, PIX.ink);
  // corazoncito estampado en el barro, casi escondido
  g.set(19, 44, PIX.potDD);
  g.set(21, 44, PIX.potDD);
  g.set(19, 45, PIX.potDD);
  g.set(20, 45, PIX.potDD);
  g.set(21, 45, PIX.potDD);
  g.set(20, 46, PIX.potDD);
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
  // rayos alternos (largos con puntito, cortos suaves) que giran despacio
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2 + rayPhase;
    const long = i % 2 === 0;
    const r1 = 11;
    const r2 = long ? 15 : 13;
    const x2 = cx + Math.cos(a) * r2;
    const y2 = cy + Math.sin(a) * r2;
    g.line(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1, x2, y2, PIX.sunRay);
    if (long) g.set(x2, y2, PIX.sunL);
  }
  // disco en cuatro tonos con textura cálida
  g.disc(cx, cy, 10, PIX.sunD);
  g.disc(cx, cy, 9, PIX.sun);
  g.disc(cx - 2, cy - 3, 5, PIX.sunL);
  g.ditherOver(PIX.sunL, PIX.sun, 1);
  g.outline(PIX.ink);
  // carita del sol: ojos con brillo, sonrisa, mofletes calientes
  g.disc(14, 16, 1, PIX.ink);
  g.disc(20, 16, 1, PIX.ink);
  g.set(13, 15, PIX.sunL);
  g.set(19, 15, PIX.sunL);
  g.line(15, 20, 17, 21, PIX.ink);
  g.line(17, 21, 19, 20, PIX.ink);
  g.ellipse(12, 19, 2, 1, PIX.bloomC);
  g.ellipse(22, 19, 2, 1, PIX.bloomC);
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
  // masa esponjosa casi blanca: cuatro bultos desiguales
  g.disc(10, cy, 5, PIX.sky);
  g.disc(17, cy - 4, 7, PIX.sky);
  g.disc(25, cy - 2, 6, PIX.sky);
  g.disc(31, cy + 1, 4, PIX.sky);
  g.rect(7, cy, 26, 6 - squeeze, PIX.sky);
  // sombra inferior en dos pasos (azul lluvia)
  g.disc(10, cy + 2, 4, PIX.skyDeep);
  g.disc(25, cy + 2, 5, PIX.skyDeep);
  g.rect(7, cy + 3, 26, 3, PIX.skyDeep);
  g.rect(9, cy + 5 - squeeze, 22, 1, PIX.skyShadow);
  // luz arriba (nieve al sol)
  g.disc(17, cy - 6, 4, PIX.snow);
  g.disc(12, cy - 3, 2, PIX.snow);
  g.disc(24, cy - 5, 2, PIX.snow);
  // esponjado: tramado entre sombra y cuerpo
  g.ditherOver(PIX.skyDeep, PIX.sky, 0);
  g.outline(PIX.ink);
  // carita: ojos con pestañita, mofletes, boca según ánimo
  g.disc(15, cy, 1, PIX.ink);
  g.disc(23, cy, 1, PIX.ink);
  g.set(14, cy - 1, PIX.snow);
  g.set(22, cy - 1, PIX.snow);
  g.set(16, cy - 1, PIX.ink);
  g.set(24, cy - 1, PIX.ink);
  if (squeeze > 0) {
    // esfuerzo tierno al exprimirse
    g.set(19, cy + 2, PIX.ink);
    g.set(18, cy + 1, PIX.ink);
    g.set(20, cy + 1, PIX.ink);
  } else {
    g.line(17, cy + 2, 21, cy + 2, PIX.ink);
    g.set(21, cy + 1, PIX.ink);
  }
  g.ellipse(12, cy + 1, 2, 1, PIX.blushL);
  g.ellipse(26, cy + 1, 2, 1, PIX.blushL);
  // gotas al exprimir: lágrimas de lluvia con brillo
  if (squeeze > 0) {
    g.set(13, 21, PIX.waterL); g.set(13, 22, PIX.water); g.set(13, 23, PIX.waterD);
    g.set(19, 22, PIX.waterL); g.set(19, 23, PIX.water); g.set(19, 24, PIX.waterD);
    g.set(26, 21, PIX.waterL); g.set(26, 22, PIX.water); g.set(26, 23, PIX.waterD);
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
