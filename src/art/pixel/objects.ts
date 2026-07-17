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
  // hoja-emblema: lámina botánica en verdes, asimétrica, con borde
  // ligeramente irregular, nervaduras, una muesca y una gota de rocío
  const g = new PixelGrid(36, 46);
  const cx = 17;
  const tipY = 3;
  const baseY = 38;
  const len = baseY - tipY;
  for (let i = 0; i <= len; i++) {
    const y = tipY + i;
    const t = i / len;
    const wBase = 10.5 * Math.sin(Math.PI * Math.pow(t, 0.82));
    // borde irregular determinista (sin aleatoriedad)
    const jitter = (i % 5 === 0 ? 1 : 0) - (i % 7 === 0 ? 1 : 0);
    const wl = Math.max(0, Math.round(wBase + jitter));
    const wr = Math.max(0, Math.round(wBase * 0.86 - jitter));
    for (let x = cx - wl; x <= cx + wr; x++) {
      // muesca distintiva en el borde derecho
      if (y >= tipY + 13 && y <= tipY + 15 && x >= cx + wr - 2) continue;
      const rel = (x - (cx - wl)) / Math.max(1, wl + wr);
      const shade = rel < 0.3 ? PIX.sage : rel > 0.72 ? PIX.leafGD : PIX.moss;
      g.set(x, y, shade);
    }
  }
  // nervadura central con leve curva + secundarias
  for (let i = 2; i <= len - 2; i++) {
    const y = tipY + i;
    const curve = Math.round(Math.sin((i / len) * Math.PI) * 1.4);
    g.set(cx - 1 + curve, y, PIX.olive);
  }
  for (let i = 8; i <= len - 6; i += 6) {
    const y = tipY + i;
    g.line(cx, y, cx - 5, y - 4, PIX.olive);
    g.line(cx, y, cx + 4, y - 3, PIX.olive);
  }
  // gota de rocío turquesa cerca de la base
  g.disc(cx + 5, baseY - 8, 1, PIX.tur);
  g.set(cx + 4, baseY - 9, PIX.lens);
  // tallo corto
  g.rect(cx - 1, baseY, 2, 5, PIX.leafDry);
  g.outline(PIX.ink);
  return g;
}

function leafSmall(): PixelGrid {
  // hojita secundaria de la lámina (adorno de borde)
  const g = new PixelGrid(18, 22);
  const cx = 9;
  const tipY = 2;
  const baseY = 17;
  const len = baseY - tipY;
  for (let i = 0; i <= len; i++) {
    const y = tipY + i;
    const t = i / len;
    const w = Math.max(0, Math.round(4.6 * Math.sin(Math.PI * Math.pow(t, 0.85))));
    for (let x = cx - w; x <= cx + w; x++) {
      const rel = (x - (cx - w)) / Math.max(1, w * 2);
      g.set(x, y, rel > 0.65 ? PIX.leafGD : rel < 0.3 ? PIX.sage : PIX.moss);
    }
  }
  for (let i = 2; i <= len - 2; i++) g.set(cx, tipY + i, PIX.olive);
  g.rect(cx, baseY, 1, 3, PIX.leafDry);
  g.outline(PIX.ink);
  return g;
}

function stonePebble(): PixelGrid {
  // piedrita digna: gris cálido con una veta y luz arriba
  const g = new PixelGrid(16, 12);
  g.ellipse(8, 7, 6, 4, "#8d8578");
  g.ellipse(7, 6, 4, 2, "#a49b8b");
  g.ellipse(10, 8, 3, 2, "#6f685d");
  g.line(5, 8, 11, 6, "#6f685d");
  g.set(5, 4, "#bfb6a4");
  g.outline(PIX.ink);
  return g;
}

function sewingButton(): PixelGrid {
  // botón de hueso con sus agujeros delatores
  const g = new PixelGrid(14, 14);
  g.disc(7, 7, 5, "#d9c9a8");
  g.disc(6, 6, 3, "#e8dcc0");
  for (let a = 0; a < 8; a++) {
    const ang = (a / 8) * Math.PI * 2;
    g.set(7 + Math.cos(ang) * 5, 7 + Math.sin(ang) * 5, "#b3a180");
  }
  g.set(5, 6, PIX.ink);
  g.set(9, 6, PIX.ink);
  g.set(5, 9, PIX.ink);
  g.set(9, 9, PIX.ink);
  g.outline(PIX.ink);
  return g;
}

function botanicalTag(): PixelGrid {
  // etiqueta de herbario: papel con ojal, cordel y líneas de escritura
  const g = new PixelGrid(30, 20);
  g.rect(6, 3, 22, 14, PIX.white);
  g.rect(6, 3, 22, 2, PIX.cream);
  g.rect(6, 15, 22, 2, PIX.cream);
  // ojal
  g.disc(9, 10, 2, PIX.cream);
  g.disc(9, 10, 1, PIX.inkSoft);
  // cordel hacia la izquierda
  g.quad(8, 10, 4, 12, 1, 9, PIX.leafDry, 1);
  // líneas de escritura + un punto girasol
  g.line(13, 8, 24, 8, PIX.inkSoft);
  g.line(13, 11, 22, 11, PIX.inkSoft);
  g.disc(24, 13, 1, PIX.sun);
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
  "leaf-small": leafSmall,
  tag: botanicalTag,
  stone: stonePebble,
  button: sewingButton,
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
  leaf: [36, 46],
  "leaf-small": [18, 22],
  tag: [30, 20],
  stone: [16, 12],
  button: [14, 14],
};

export function objectSprite(kind: string, _state = "idle"): SpriteDef {
  const build = BUILDERS[kind];
  const [w, h] = SIZES[kind] ?? [24, 24];
  if (!build) return { width: w, height: h, frames: [[[]]] };
  return { width: w, height: h, frames: [build().grid()] };
}
