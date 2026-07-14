export const CHARACTER_ANGLES = [
  "front",
  "three-quarter-left",
  "three-quarter-right",
  "profile",
  "back",
] as const;

export type CharacterAngle = (typeof CHARACTER_ANGLES)[number];

export const CHARACTER_FACINGS = ["left", "right", "front"] as const;

export type CharacterFacing = (typeof CHARACTER_FACINGS)[number];

export type CharacterSize = "small" | "medium" | "large" | number;

export type CharacterInteractionEvent = MouseEvent | KeyboardEvent;

export type CharacterInteractionHandler = (
  event: CharacterInteractionEvent,
  character: SVGSVGElement,
) => void;

/**
 * Contrato compartido por los dos personajes.
 *
 * `renderDani` y `renderDiego` devuelven SVG como texto, por lo que no intentan
 * serializar `onInteraction`. Para un callback real se debe usar `create*` o
 * enlazar un SVG ya montado con `bind*Interaction`.
 */
export interface CharacterProps<State extends string> {
  state?: State;
  facing?: CharacterFacing;
  angle?: CharacterAngle;
  size?: CharacterSize;
  reducedMotion?: boolean;
  interactive?: boolean;
  onInteraction?: CharacterInteractionHandler;
  className?: string;
}

export interface CharacterBinding {
  destroy(): void;
}

export function characterSizeClass(size: CharacterSize | undefined): string | undefined {
  return typeof size === "string" ? `character--size-${size}` : undefined;
}

export function characterSizeStyle(size: CharacterSize | undefined): string | undefined {
  if (typeof size !== "number" || !Number.isFinite(size)) return undefined;
  const safeSize = Math.min(640, Math.max(24, Math.round(size)));
  return `width:${safeSize}px;height:auto`;
}

export function joinCharacterClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter((value): value is string => Boolean(value)).join(" ");
}

export function escapeCharacterAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export function createCharacterElement(markup: string): SVGSVGElement {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  const element = template.content.firstElementChild;

  if (element?.namespaceURI !== "http://www.w3.org/2000/svg" || element.localName !== "svg") {
    throw new Error("El renderer de personaje no produjo un SVG válido.");
  }

  return element as SVGSVGElement;
}

/** Enlaza click, Enter y Espacio sin insertar JavaScript dentro del SVG. */
export function bindCharacterInteraction(
  character: SVGSVGElement,
  onInteraction: CharacterInteractionHandler,
): CharacterBinding {
  character.dataset.interactive = "true";
  character.classList.add("character--interactive");
  character.setAttribute("role", "button");
  character.setAttribute("tabindex", "0");

  const handleClick = (event: MouseEvent): void => {
    onInteraction(event, character);
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onInteraction(event, character);
  };

  character.addEventListener("click", handleClick);
  character.addEventListener("keydown", handleKeydown);

  return {
    destroy(): void {
      character.removeEventListener("click", handleClick);
      character.removeEventListener("keydown", handleKeydown);
    },
  };
}
