/**
 * Motor de pixel art local, basado en rejilla de colores.
 *
 * Un fotograma es una rejilla `ColorGrid` (filas de celdas; cada celda es un
 * color concreto o `var(--token)` — resuelto en tiempo de dibujo — o `null`
 * para transparente). Se dibuja a resolución nativa (1 celda = 1 píxel de
 * lienzo) y se amplía por CSS con `image-rendering: pixelated`, de modo que los
 * bordes quedan nítidos a cualquier escala.
 *
 * La animación se autolimpia: el bucle se detiene cuando el canvas se
 * desconecta del DOM o cuando otro repintado (nueva «generación») lo reemplaza.
 */

export type Cell = string | null;
export type ColorGrid = Cell[][];

export interface SpriteDef {
  width: number;
  height: number;
  frames: ColorGrid[];
  /** fotogramas por segundo (por defecto 3) */
  fps?: number;
}

export interface PixelRenderOptions {
  className?: string;
  reducedMotion?: boolean;
  label?: string;
  decorative?: boolean;
}

let rootStyle: CSSStyleDeclaration | null = null;
const colorCache = new Map<string, string>();

/** Resuelve un color que puede ser hex/rgba directo o `var(--token[, fb])`. */
function resolveColor(value: string): string {
  const cached = colorCache.get(value);
  if (cached) return cached;
  let out = value;
  if (value.startsWith("var(")) {
    if (!rootStyle) rootStyle = getComputedStyle(document.documentElement);
    const inner = value.slice(4, -1);
    const comma = inner.indexOf(",");
    const token = (comma === -1 ? inner : inner.slice(0, comma)).trim();
    const fallback = comma === -1 ? "" : inner.slice(comma + 1).trim();
    out = rootStyle.getPropertyValue(token).trim() || fallback || "#000";
  }
  colorCache.set(value, out);
  return out;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  def: SpriteDef,
  frameIndex: number
): void {
  ctx.clearRect(0, 0, def.width, def.height);
  const grid = def.frames[frameIndex] ?? def.frames[0];
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    if (!row) continue;
    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      if (!cell) continue;
      ctx.fillStyle = resolveColor(cell);
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

/**
 * Dibuja un sprite en un canvas existente y (re)inicia su animación. Un token
 * de generación invalida cualquier bucle anterior del mismo canvas.
 */
export function paintPixelSprite(
  canvas: HTMLCanvasElement,
  def: SpriteDef,
  options: PixelRenderOptions = {}
): void {
  canvas.width = def.width;
  canvas.height = def.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;

  const generation = String((Number(canvas.dataset.pixelGen ?? "0") + 1) % 1e9);
  canvas.dataset.pixelGen = generation;

  drawFrame(ctx, def, 0);

  if (def.frames.length <= 1 || options.reducedMotion) return;

  const fps = def.fps ?? 3;
  const step = 1000 / fps;
  let frame = 0;
  let last = 0;
  const loop = (now: number): void => {
    if (!canvas.isConnected || canvas.dataset.pixelGen !== generation) return;
    if (document.hidden) {
      window.requestAnimationFrame(loop);
      return;
    }
    if (now - last >= step) {
      last = now;
      frame = (frame + 1) % def.frames.length;
      drawFrame(ctx, def, frame);
    }
    window.requestAnimationFrame(loop);
  };
  window.requestAnimationFrame(loop);
}

export function createPixelSprite(
  def: SpriteDef,
  options: PixelRenderOptions = {}
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.className = `pixel-sprite${options.className ? ` ${options.className}` : ""}`;
  if (options.decorative) {
    canvas.setAttribute("aria-hidden", "true");
  } else if (options.label) {
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", options.label);
  }
  paintPixelSprite(canvas, def, options);
  return canvas;
}

/** Placeholder en cadena para innerHTML; se hidrata con la familia + estado. */
export function pixelPlaceholder(
  family: string,
  state: string,
  options: { className?: string; label?: string; decorative?: boolean } = {}
): string {
  const cls = `pixel-sprite pixel-sprite--${family}${
    options.className ? ` ${options.className}` : ""
  }`;
  const a11y = options.decorative
    ? ' aria-hidden="true"'
    : options.label
      ? ` role="img" aria-label="${options.label.replaceAll('"', "&quot;")}"`
      : "";
  return `<canvas class="${cls}" data-pixel="${family}" data-pixel-state="${state}"${a11y}></canvas>`;
}
