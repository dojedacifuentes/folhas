import { createPixelSprite, type PixelRenderOptions, type SpriteDef } from "./engine";
import { PixelGrid } from "./draw";
import { PIX } from "./palette";

/**
 * Emoticones en pixel art para que la planta (y las criaturas) reaccionen y
 * "hablen": corazón, sed, sueño (nanai), frío, chispa, hambre, nota.
 */

export type EmoteKind =
  | "heart"
  | "drop"
  | "sleep"
  | "cold"
  | "spark"
  | "hungry"
  | "note"
  | "sun";

const S = 16;

function buildEmote(kind: EmoteKind): PixelGrid {
  const g = new PixelGrid(S, S);
  switch (kind) {
    case "heart":
      g.disc(6, 6, 3, PIX.berry);
      g.disc(10, 6, 3, PIX.berry);
      g.triangle(3, 7, 13, 7, 8, 14, PIX.berry);
      g.disc(6, 6, 3, PIX.coral);
      g.disc(10, 6, 2, PIX.coral);
      g.triangle(4, 7, 12, 7, 8, 13, PIX.coral);
      g.set(6, 5, PIX.white);
      g.outline(PIX.ink);
      break;
    case "drop":
      g.triangle(8, 2, 4, 9, 12, 9, PIX.water);
      g.disc(8, 11, 4, PIX.water);
      g.disc(6, 10, 2, PIX.waterL);
      g.outline(PIX.ink);
      break;
    case "sleep": {
      // tres "z" en diagonal, crecientes
      const z = (x: number, y: number, s: number, c: string) => {
        g.line(x, y, x + s, y, c);
        g.line(x + s, y, x, y + s, c);
        g.line(x, y + s, x + s, y + s, c);
      };
      z(3, 10, 2, PIX.plum);
      z(6, 6, 3, PIX.plum);
      z(10, 1, 4, PIX.plum);
      break;
    }
    case "cold": {
      // copo de nieve
      const c = PIX.skyDeep;
      g.line(8, 2, 8, 14, c);
      g.line(2, 8, 14, 8, c);
      g.line(4, 4, 12, 12, c);
      g.line(12, 4, 4, 12, c);
      g.set(8, 8, PIX.snow);
      g.set(8, 4, c); g.set(8, 12, c); g.set(4, 8, c); g.set(12, 8, c);
      break;
    }
    case "spark":
      g.line(8, 1, 8, 15, PIX.sun);
      g.line(1, 8, 15, 8, PIX.sun);
      g.line(4, 4, 12, 12, PIX.bloom);
      g.line(12, 4, 4, 12, PIX.bloom);
      g.disc(8, 8, 2, PIX.white);
      g.outline(PIX.ink);
      break;
    case "hungry":
      // baya en una hojita (merienda de planta)
      g.disc(8, 9, 3, PIX.berry);
      g.disc(7, 8, 1, PIX.coral);
      g.set(8, 5, PIX.stem);
      g.triangle(8, 5, 12, 3, 12, 6, PIX.leafG);
      g.outline(PIX.ink);
      break;
    case "note":
      g.disc(5, 12, 2, PIX.plum);
      g.disc(11, 10, 2, PIX.plum);
      g.rect(6, 4, 1, 8, PIX.plum);
      g.rect(12, 2, 1, 8, PIX.plum);
      g.line(6, 4, 12, 2, PIX.plum);
      g.outline(PIX.ink);
      break;
    case "sun":
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        g.set(8 + Math.cos(a) * 6, 8 + Math.sin(a) * 6, PIX.sun);
      }
      g.disc(8, 8, 3, PIX.sun);
      g.disc(7, 7, 1, PIX.bloom);
      g.outline(PIX.ink);
      break;
  }
  return g;
}

export function emoteSprite(kind: EmoteKind): SpriteDef {
  return { width: S, height: S, frames: [buildEmote(kind).grid()] };
}

export function createEmote(
  kind: EmoteKind,
  options: PixelRenderOptions = {}
): HTMLCanvasElement {
  return createPixelSprite(emoteSprite(kind), { decorative: true, ...options });
}
