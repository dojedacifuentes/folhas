import type { ColorGrid, SpriteDef } from "./engine";
import { PixelGrid } from "./draw";
import { PIX } from "./palette";

/**
 * Dani (gata atigrada dorada, lentes redondos, cola en signo de
 * interrogación) y Diego (akita turquesa, lentes rectangulares, cola
 * enroscada). v7: volumen en cuatro tonos con sombra ciruela, tramado de
 * pelaje, tufos en las mejillas, rayas de atigrada / urajiro de akita,
 * doble brillo en los ojos, rubor y almohadillas. Cada detalle tiene
 * intención: que den ganas de cuidarlos.
 */

const W = 40;
const H = 46;

type Expression = "neutral" | "happy" | "proud" | "surprised" | "worried" | "sleeping";

function mapDani(state: string): Expression {
  if (state === "happy" || state === "delighted") return "happy";
  if (state === "proud") return "proud";
  if (state === "surprised") return "surprised";
  if (state === "sleeping") return "sleeping";
  if (
    state === "worried" ||
    state === "reactingToRain" ||
    state === "reactingToWind" ||
    state === "reactingToHeat"
  )
    return "worried";
  return "neutral";
}

function buildDani(expr: Expression, blink: boolean): PixelGrid {
  const g = new PixelGrid(W, H);

  // --- cola (signo de interrogación), detrás del cuerpo ---
  g.quad(28, 40, 41, 36, 37, 24, PIX.yelDD, 4);
  g.quad(37, 24, 33, 17, 27, 19, PIX.yelDD, 4);
  g.quad(28, 39, 40, 35, 36, 24, PIX.yel, 3);
  g.quad(36, 24, 32, 18, 28, 19, PIX.yel, 3);
  // anillos de atigrada en la cola + punta crema
  g.line(36, 30, 39, 29, PIX.yelDD);
  g.line(33, 20, 35, 23, PIX.yelDD);
  g.disc(27, 20, 2, PIX.cream);

  // --- cuerpo: cuatro tonos de volumen ---
  g.ellipse(20, 38, 12, 8, PIX.yelDD);
  g.ellipse(20, 37, 12, 9, PIX.yelD);
  g.ellipse(20, 36, 12, 9, PIX.yel);
  g.ellipse(17, 33, 7, 5, PIX.yelL);

  // rayas de atigrada en el lomo
  g.line(28, 32, 31, 34, PIX.stripe);
  g.line(27, 36, 30, 38, PIX.stripe);

  // patas con almohadillas
  g.ellipse(13, 44, 4, 3, PIX.yel);
  g.ellipse(26, 44, 4, 3, PIX.yel);
  g.ellipse(13, 44, 3, 2, PIX.cream);
  g.ellipse(26, 44, 3, 2, PIX.cream);

  // vientre
  g.ellipse(20, 39, 7, 6, PIX.cream);

  // --- cabeza: cuatro tonos ---
  g.ellipse(20, 19, 13, 11, PIX.yelDD);
  g.ellipse(20, 18, 13, 11, PIX.yelD);
  g.ellipse(20, 17, 13, 11, PIX.yel);
  g.ellipse(16, 14, 9, 7, PIX.yelL);

  // rayas de la frente (marca de atigrada)
  g.line(17, 7, 17, 10, PIX.stripe);
  g.line(20, 6, 20, 9, PIX.stripe);
  g.line(23, 7, 23, 10, PIX.stripe);

  // tufos de pelaje en las mejillas (la silueta se vuelve peludita)
  g.triangle(7, 20, 4, 22, 7, 23, PIX.yel);
  g.triangle(7, 24, 4, 26, 7, 27, PIX.yel);
  g.triangle(33, 20, 36, 22, 33, 23, PIX.yel);
  g.triangle(33, 24, 36, 26, 33, 27, PIX.yel);

  // --- orejas con interior rosado ---
  g.triangle(6, 11, 9, 0, 16, 9, PIX.yelD);
  g.triangle(34, 11, 31, 0, 24, 9, PIX.yelD);
  g.triangle(7, 10, 10, 2, 15, 9, PIX.yel);
  g.triangle(33, 10, 30, 2, 25, 9, PIX.yel);
  g.triangle(9, 8, 10, 4, 13, 8, PIX.blushL);
  g.triangle(31, 8, 30, 4, 27, 8, PIX.blushL);

  // hocico crema
  g.ellipse(20, 23, 7, 5, PIX.cream);

  // pelaje: tramado suave donde la luz toca el pelo
  g.ditherOver(PIX.yelL, PIX.yel, 1);

  // contorno de toda la silueta
  g.outline(PIX.ink);

  // almohadillas: deditos marcados
  g.set(12, 45, PIX.ink);
  g.set(14, 45, PIX.ink);
  g.set(25, 45, PIX.ink);
  g.set(27, 45, PIX.ink);

  // --- lentes redondos ---
  g.disc(13, 19, 4, PIX.lens);
  g.disc(27, 19, 4, PIX.lens);
  g.ring(13, 19, 5, PIX.ink);
  g.ring(27, 19, 5, PIX.ink);
  g.line(18, 18, 22, 18, PIX.ink); // puente
  g.line(4, 18, 8, 19, PIX.ink); // patilla izq
  g.line(32, 19, 36, 18, PIX.ink); // patilla der

  // --- ojos con doble brillo ---
  if (blink || expr === "sleeping") {
    g.line(11, 20, 15, 20, PIX.ink);
    g.line(25, 20, 29, 20, PIX.ink);
    if (expr === "sleeping") {
      // pestañitas de sueño
      g.set(15, 21, PIX.ink);
      g.set(29, 21, PIX.ink);
    }
  } else if (expr === "happy" || expr === "proud") {
    // ojos felices (arco hacia arriba)
    g.line(11, 21, 15, 21, PIX.ink);
    g.line(11, 21, 12, 20, PIX.ink);
    g.line(14, 20, 15, 21, PIX.ink);
    g.line(25, 21, 29, 21, PIX.ink);
    g.line(25, 21, 26, 20, PIX.ink);
    g.line(28, 20, 29, 21, PIX.ink);
  } else {
    const eyeY = expr === "surprised" ? 19 : 20;
    g.disc(13, eyeY, 2, PIX.ink);
    g.disc(27, eyeY, 2, PIX.ink);
    g.set(12, eyeY - 1, PIX.white);
    g.set(26, eyeY - 1, PIX.white);
    g.set(14, eyeY + 1, PIX.lens);
    g.set(28, eyeY + 1, PIX.lens);
  }

  // cejas de preocupación
  if (expr === "worried") {
    g.line(9, 14, 12, 15, PIX.ink);
    g.line(31, 14, 28, 15, PIX.ink);
  }

  // --- nariz y boca ---
  g.triangle(18, 23, 22, 23, 20, 26, PIX.nose);
  g.set(19, 23, PIX.blushL); // brillo de la nariz
  if (expr === "happy" || expr === "proud") {
    g.line(20, 26, 17, 28, PIX.ink);
    g.line(20, 26, 23, 28, PIX.ink);
    g.line(17, 28, 18, 29, PIX.ink);
    g.line(23, 28, 22, 29, PIX.ink);
  } else if (expr === "surprised") {
    g.disc(20, 28, 1, PIX.ink);
  } else {
    g.line(20, 26, 18, 27, PIX.ink);
    g.line(20, 26, 22, 27, PIX.ink);
  }

  // rubor
  g.ellipse(9, 24, 2, 1, PIX.blushL);
  g.ellipse(31, 24, 2, 1, PIX.blushL);

  // --- bigotes (tres por lado, con caída suave) ---
  g.line(7, 22, 1, 21, PIX.inkSoft);
  g.line(7, 24, 1, 24, PIX.inkSoft);
  g.line(7, 26, 2, 27, PIX.inkSoft);
  g.line(33, 22, 39, 21, PIX.inkSoft);
  g.line(33, 24, 39, 24, PIX.inkSoft);
  g.line(33, 26, 38, 27, PIX.inkSoft);

  // --- lazo coral al cuello, con luz y nudo ---
  g.triangle(20, 31, 14, 28, 14, 34, PIX.clayD);
  g.triangle(20, 31, 26, 28, 26, 34, PIX.clayD);
  g.triangle(20, 31, 15, 29, 15, 33, PIX.clay);
  g.triangle(20, 31, 25, 29, 25, 33, PIX.clay);
  g.set(16, 30, PIX.clayLight);
  g.set(24, 30, PIX.clayLight);
  g.disc(20, 31, 1, PIX.clayD);
  g.set(19, 30, PIX.clayLight);

  return g;
}

function daniFrames(expr: Expression): ColorGrid[] {
  const base = buildDani(expr, false);
  const blinkG = buildDani(expr, true);
  // respiración: fotograma desplazado 1 px hacia abajo
  const bob = (src: PixelGrid): ColorGrid => {
    const rows = src.grid();
    return [rows[0].map(() => null), ...rows.slice(0, rows.length - 1)];
  };
  return [base.grid(), bob(base), base.grid(), blinkG.grid()];
}

export function daniSprite(state: string): SpriteDef {
  return { width: W, height: H, frames: daniFrames(mapDani(state)), fps: 2.5 };
}

// ============================ DIEGO ============================

type DiegoExpr = "neutral" | "proud" | "protecting" | "concerned" | "recovering" | "worried";

function mapDiego(state: string): DiegoExpr {
  if (state === "proud") return "proud";
  if (state === "protecting" || state === "planting") return "protecting";
  if (state === "concerned" || state === "surprised" || state === "focused") return "concerned";
  if (state === "recoveringGlasses") return "recovering";
  if (
    state === "reactingToRain" ||
    state === "reactingToWind" ||
    state === "reactingToHeat" ||
    state === "worried"
  )
    return "worried";
  return "neutral";
}

function buildDiego(expr: DiegoExpr, blink: boolean): PixelGrid {
  const g = new PixelGrid(W, H);

  // cola enroscada de spitz, con sombra profunda y punta crema
  g.quad(30, 40, 42, 34, 36, 25, PIX.turDD, 5);
  g.quad(36, 25, 30, 20, 26, 24, PIX.turDD, 5);
  g.quad(30, 39, 40, 33, 35, 25, PIX.tur, 4);
  g.quad(35, 25, 30, 21, 27, 24, PIX.tur, 4);
  g.line(37, 30, 40, 29, PIX.turDD);
  g.disc(27, 23, 2, PIX.turCream);

  // cuerpo: cuatro tonos
  g.ellipse(20, 38, 13, 8, PIX.turDD);
  g.ellipse(20, 37, 13, 9, PIX.turD);
  g.ellipse(20, 36, 13, 9, PIX.tur);
  g.ellipse(16, 33, 8, 5, PIX.turL);

  // patas firmes con deditos
  g.rect(11, 41, 5, 5, PIX.turD);
  g.rect(24, 41, 5, 5, PIX.turD);
  g.ellipse(13, 45, 3, 2, PIX.turCream);
  g.ellipse(26, 45, 3, 2, PIX.turCream);

  // pecho crema
  g.ellipse(20, 38, 8, 7, PIX.turCream);

  // cabeza: cuatro tonos
  g.ellipse(20, 19, 13, 11, PIX.turDD);
  g.ellipse(20, 18, 13, 11, PIX.turD);
  g.ellipse(20, 17, 13, 11, PIX.tur);
  g.ellipse(16, 14, 9, 7, PIX.turL);

  // tufos de pelaje en las mejillas (spitz esponjoso)
  g.triangle(7, 19, 4, 21, 7, 22, PIX.tur);
  g.triangle(7, 23, 3, 25, 7, 26, PIX.tur);
  g.triangle(33, 19, 36, 21, 33, 22, PIX.tur);
  g.triangle(33, 23, 37, 25, 33, 26, PIX.tur);

  // orejas triangulares firmes, interior crema y base rosada
  g.triangle(5, 12, 8, 0, 15, 10, PIX.turD);
  g.triangle(35, 12, 32, 0, 25, 10, PIX.turD);
  g.triangle(6, 11, 9, 2, 14, 9, PIX.tur);
  g.triangle(34, 11, 31, 2, 26, 9, PIX.tur);
  g.triangle(8, 9, 9, 4, 12, 9, PIX.turCream);
  g.triangle(32, 9, 31, 4, 28, 9, PIX.turCream);
  g.set(10, 9, PIX.blushL);
  g.set(30, 9, PIX.blushL);

  // hocico crema alargado
  g.ellipse(20, 24, 8, 5, PIX.turCream);

  // urajiro: cejitas crema de akita
  g.disc(12, 13, 1, PIX.turCream);
  g.disc(28, 13, 1, PIX.turCream);

  // pelaje: tramado suave en la luz
  g.ditherOver(PIX.turL, PIX.tur, 1);

  g.outline(PIX.ink);

  // deditos
  g.set(12, 45, PIX.ink);
  g.set(14, 45, PIX.ink);
  g.set(25, 45, PIX.ink);
  g.set(27, 45, PIX.ink);

  // lentes rectangulares
  g.rect(7, 15, 10, 8, PIX.lens);
  g.rect(23, 15, 10, 8, PIX.lens);
  g.rect(7, 15, 10, 1, PIX.ink);
  g.rect(7, 22, 10, 1, PIX.ink);
  g.rect(7, 15, 1, 8, PIX.ink);
  g.rect(16, 15, 1, 8, PIX.ink);
  g.rect(23, 15, 10, 1, PIX.ink);
  g.rect(23, 22, 10, 1, PIX.ink);
  g.rect(23, 15, 1, 8, PIX.ink);
  g.rect(32, 15, 1, 8, PIX.ink);
  g.line(17, 18, 23, 18, PIX.ink); // puente
  g.line(3, 17, 7, 18, PIX.ink);
  g.line(33, 18, 37, 17, PIX.ink);

  // lentes torcidos / caídos al recuperarse
  if (expr === "recovering") {
    g.rect(23, 20, 10, 1, PIX.ink);
    g.rect(23, 27, 10, 1, PIX.ink);
  }

  // ojos con doble brillo
  if (blink) {
    g.line(10, 19, 14, 19, PIX.ink);
    g.line(26, 19, 30, 19, PIX.ink);
  } else if (expr === "proud" || expr === "protecting") {
    g.disc(12, 19, 2, PIX.ink);
    g.disc(28, 19, 2, PIX.ink);
    g.set(11, 18, PIX.white);
    g.set(27, 18, PIX.white);
    g.set(13, 20, PIX.lens);
    g.set(29, 20, PIX.lens);
    // cejas serias
    g.line(9, 13, 15, 13, PIX.ink);
    g.line(25, 13, 31, 13, PIX.ink);
  } else if (expr === "concerned" || expr === "worried") {
    g.disc(12, 20, 2, PIX.ink);
    g.disc(28, 20, 2, PIX.ink);
    g.set(11, 19, PIX.white);
    g.set(27, 19, PIX.white);
    g.line(9, 14, 14, 13, PIX.ink);
    g.line(31, 14, 26, 13, PIX.ink);
  } else {
    g.disc(12, 19, 2, PIX.ink);
    g.disc(28, 19, 2, PIX.ink);
    g.set(11, 18, PIX.white);
    g.set(27, 18, PIX.white);
    g.set(13, 20, PIX.lens);
    g.set(29, 20, PIX.lens);
  }

  // nariz y boca
  g.disc(20, 24, 2, PIX.ink);
  g.set(19, 23, PIX.inkSoft); // brillo de trufa
  if (expr === "proud" || expr === "protecting") {
    g.line(20, 26, 17, 27, PIX.ink);
    g.line(20, 26, 23, 27, PIX.ink);
  } else {
    g.line(20, 26, 20, 28, PIX.ink);
    g.line(20, 28, 18, 29, PIX.ink);
    g.line(20, 28, 22, 29, PIX.ink);
  }

  // rubor discreto (es un akita serio, pero se conmueve)
  g.set(9, 25, PIX.blushL);
  g.set(31, 25, PIX.blushL);

  // pajarita con luz
  g.triangle(20, 31, 15, 28, 15, 34, PIX.clay);
  g.triangle(20, 31, 25, 28, 25, 34, PIX.clay);
  g.set(16, 30, PIX.clayLight);
  g.set(24, 30, PIX.clayLight);
  g.rect(19, 29, 2, 4, PIX.clayD);
  g.set(19, 30, PIX.clayLight);

  return g;
}

function diegoFrames(expr: DiegoExpr): ColorGrid[] {
  const base = buildDiego(expr, false);
  const blinkG = buildDiego(expr, true);
  const bob = (src: PixelGrid): ColorGrid => {
    const rows = src.grid();
    return [rows[0].map(() => null), ...rows.slice(0, rows.length - 1)];
  };
  return [base.grid(), bob(base), base.grid(), blinkG.grid()];
}

export function diegoSprite(state: string): SpriteDef {
  return { width: W, height: H, frames: diegoFrames(mapDiego(state)), fps: 2.5 };
}
