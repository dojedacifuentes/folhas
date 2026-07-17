import { paintPixelSprite, type SpriteDef } from "./engine";
import { daniSprite, diegoSprite } from "./characters";
import { plantSprite, sunSprite } from "./world";
import { objectSprite } from "./objects";

/** Resuelve familia + estado a una definición de sprite. */
export function pixelSpriteFor(family: string, state: string): SpriteDef {
  switch (family) {
    case "dani":
      return daniSprite(state);
    case "diego":
      return diegoSprite(state);
    case "plant":
      return plantSprite(state);
    case "sun":
      return sunSprite();
    default:
      return objectSprite(family, state);
  }
}

/** Marcado de un sprite de personaje/planta para innerHTML. */
export function pixelCharacterMarkup(
  family: "dani" | "diego" | "plant",
  state: string,
  options: { className?: string; label?: string; decorative?: boolean } = {}
): string {
  const base = family === "plant" ? "plant-character" : "character";
  const cls = `${base} pixel-sprite pixel-sprite--${family}${
    options.className ? ` ${options.className}` : ""
  }`;
  const a11y =
    options.decorative || !options.label
      ? ' aria-hidden="true"'
      : ` role="img" aria-label="${options.label.replaceAll('"', "&quot;")}"`;
  return `<canvas class="${cls}" data-character="${family}" data-pixel="${family}" data-pixel-state="${state}"${a11y}></canvas>`;
}

export function prefersReduced(): boolean {
  return (
    document.documentElement.classList.contains("reduced-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Dibuja todos los placeholders `canvas[data-pixel]` que aún no se pintaron. */
export function hydratePixelSprites(root: ParentNode): void {
  const reduced = prefersReduced();
  root.querySelectorAll<HTMLCanvasElement>("canvas[data-pixel]").forEach((canvas) => {
    if (canvas.dataset.pixelGen) return; // ya hidratado
    const family = canvas.dataset.pixel ?? "";
    const state = canvas.dataset.pixelState ?? "idle";
    paintPixelSprite(canvas, pixelSpriteFor(family, state), { reducedMotion: reduced });
  });
}

/** Repinta un sprite ya montado con un nuevo estado. */
export function setPixelSpriteState(
  canvas: HTMLCanvasElement,
  state: string
): void {
  if (canvas.dataset.pixelState === state && canvas.dataset.pixelGen) return;
  canvas.dataset.pixelState = state;
  const family = canvas.dataset.pixel ?? "";
  paintPixelSprite(canvas, pixelSpriteFor(family, state), {
    reducedMotion: prefersReduced(),
  });
}
