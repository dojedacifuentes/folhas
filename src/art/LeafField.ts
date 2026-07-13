/**
 * Pinta la capa procedural de hojas secas sobre un Canvas.
 * Determinista: la misma semilla produce la misma composición.
 */

const PALETTE = {
  base: "#8a6247",
  baseDark: "#6d4c39",
  leafDry: "#986a4c",
  leafDark: "#63483a",
  sage: "#7d8b72",
  sageDark: "#66735d",
  branch: "#4d3a30",
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

type LeafDrawFn = (ctx: CanvasRenderingContext2D) => void;

/** Seis siluetas de hoja, dibujadas alrededor del origen, tamaño ~1. */
const LEAF_SHAPES: LeafDrawFn[] = [
  (c) => {
    c.beginPath();
    c.moveTo(0, -0.5);
    c.bezierCurveTo(0.34, -0.28, 0.4, 0.18, 0.16, 0.48);
    c.bezierCurveTo(0.08, 0.56, -0.08, 0.56, -0.16, 0.48);
    c.bezierCurveTo(-0.4, 0.18, -0.34, -0.28, 0, -0.5);
    c.closePath();
  },
  (c) => {
    c.beginPath();
    c.moveTo(0, -0.46);
    c.bezierCurveTo(-0.42, -0.34, -0.5, 0.1, -0.3, 0.36);
    c.bezierCurveTo(-0.16, 0.52, 0.16, 0.52, 0.3, 0.36);
    c.bezierCurveTo(0.5, 0.1, 0.42, -0.34, 0, -0.46);
    c.closePath();
  },
  (c) => {
    c.beginPath();
    c.moveTo(-0.32, 0.5);
    c.bezierCurveTo(-0.28, 0.1, -0.06, -0.3, 0.34, -0.52);
    c.bezierCurveTo(0.3, -0.1, 0.1, 0.3, -0.2, 0.54);
    c.closePath();
  },
  (c) => {
    c.beginPath();
    c.moveTo(0, -0.48);
    c.bezierCurveTo(0.4, -0.4, 0.5, 0.05, 0.36, 0.3);
    c.bezierCurveTo(0.26, 0.46, 0.1, 0.52, 0, 0.5);
    c.lineTo(0.07, 0.36);
    c.lineTo(-0.07, 0.4);
    c.closePath();
  },
  (c) => {
    c.beginPath();
    c.moveTo(0, 0.5);
    c.bezierCurveTo(-0.06, 0.24, -0.24, 0.16, -0.42, 0.14);
    c.bezierCurveTo(-0.3, -0.04, -0.14, -0.06, 0, -0.02);
    c.bezierCurveTo(-0.06, -0.24, -0.18, -0.32, -0.3, -0.36);
    c.bezierCurveTo(-0.1, -0.5, 0.12, -0.44, 0.2, -0.26);
    c.bezierCurveTo(0.34, -0.34, 0.46, -0.28, 0.5, -0.14);
    c.bezierCurveTo(0.34, -0.06, 0.2, -0.06, 0.1, 0.06);
    c.bezierCurveTo(0.24, 0.14, 0.3, 0.3, 0.26, 0.46);
    c.closePath();
  },
  (c) => {
    c.beginPath();
    c.moveTo(-0.4, 0.4);
    c.bezierCurveTo(-0.46, 0.05, -0.24, -0.3, 0.12, -0.46);
    c.bezierCurveTo(0.4, -0.56, 0.52, -0.44, 0.48, -0.36);
    c.bezierCurveTo(0.26, -0.34, 0.05, -0.2, -0.05, 0.02);
    c.bezierCurveTo(-0.15, 0.22, -0.2, 0.32, -0.24, 0.46);
    c.closePath();
  },
];

const LEAF_COLORS = [
  PALETTE.leafDry,
  PALETTE.leafDark,
  PALETTE.sage,
  PALETTE.leafDry,
  PALETTE.sageDark,
  PALETTE.leafDark,
];

/**
 * Rellena por completo el canvas (en coordenadas lógicas w×h)
 * con tierra y hojas secas. Sin transparencia inicial.
 */
export function paintLeafField(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  seed = 20260713
): void {
  const rnd = mulberry32(seed);

  // fondo totalmente opaco: mantillo
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, PALETTE.base);
  grad.addColorStop(1, PALETTE.baseDark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // ramas finas por debajo
  ctx.strokeStyle = PALETTE.branch;
  ctx.lineCap = "round";
  const branches = Math.round((w * h) / 60000) + 3;
  for (let i = 0; i < branches; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const len = 60 + rnd() * 160;
    const ang = rnd() * Math.PI * 2;
    ctx.lineWidth = 1.2 + rnd() * 1.6;
    ctx.globalAlpha = 0.5 + rnd() * 0.3;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(ang + 0.5) * len * 0.5,
      y + Math.sin(ang + 0.5) * len * 0.5,
      x + Math.cos(ang) * len,
      y + Math.sin(ang) * len
    );
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // hojas: densidad irregular (más densas hacia los bordes)
  const count = Math.max(90, Math.round((w * h) / 2600));
  for (let i = 0; i < count; i++) {
    let x = rnd() * w;
    let y = rnd() * h;
    // sesgo suave hacia los bordes para densidad irregular
    if (rnd() < 0.35) {
      x = rnd() < 0.5 ? x * 0.35 : w - x * 0.35;
    }
    const size = 26 + rnd() * 54;
    const shape = Math.floor(rnd() * LEAF_SHAPES.length);
    const rot = rnd() * Math.PI * 2;
    const color = LEAF_COLORS[Math.floor(rnd() * LEAF_COLORS.length)];

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(size, size * (0.85 + rnd() * 0.3));

    // sombra separada de la figura
    ctx.save();
    ctx.translate(0.06, 0.08);
    LEAF_SHAPES[shape](ctx);
    ctx.fillStyle = "rgba(30, 22, 16, 0.28)";
    ctx.fill();
    ctx.restore();

    LEAF_SHAPES[shape](ctx);
    ctx.fillStyle = color;
    ctx.fill();

    // nervio central
    ctx.beginPath();
    ctx.moveTo(0, -0.34);
    ctx.quadraticCurveTo(0.03, 0, 0, 0.38);
    ctx.lineWidth = 0.03;
    ctx.strokeStyle = "rgba(36, 35, 31, 0.35)";
    ctx.stroke();
    ctx.restore();
  }
}
