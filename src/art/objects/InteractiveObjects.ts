import { leafSVG } from "../svgLibrary";
import { pixelPlaceholder } from "../pixel/engine";
import "../../styles/objects.css";

export const INTERACTIVE_OBJECT_STATES = [
  "idle",
  "hovered",
  "active",
  "completed",
  "disabled",
] as const;

export type InteractiveObjectState =
  (typeof INTERACTIVE_OBJECT_STATES)[number];

export const INTERACTIVE_OBJECT_KINDS = [
  "seed",
  "thimble",
  "watering-cup",
  "drop",
  "sun",
  "umbrella",
  "dry-leaves",
  "wind",
] as const;

export type InteractiveObjectKind =
  (typeof INTERACTIVE_OBJECT_KINDS)[number];

export interface InteractiveObjectOptions {
  state?: InteractiveObjectState;
  label?: string;
  className?: string;
  id?: string;
  interactive?: boolean;
  decorative?: boolean;
  leafCount?: number;
  variant?: number;
}

const DEFAULT_LABELS: Record<InteractiveObjectKind, string> = {
  seed: "Semilla cuadrada",
  thimble: "Dedal con agua",
  "watering-cup": "Regadera pequeña",
  drop: "Gota de agua",
  sun: "Sol tibio",
  umbrella: "Paraguas",
  "dry-leaves": "Montón de hojas secas",
  wind: "Soplo suave",
};

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function safeClassNames(value = ""): string {
  return value
    .split(/\s+/)
    .filter((token) => /^[a-zA-Z_][\w-]*$/.test(token))
    .join(" ");
}

function wateringCupArt(): string {
  return `
<svg class="object-art object-art--watering-cup" viewBox="0 0 112 88"
  aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="object-art__ground" cx="56" cy="80" rx="30" ry="4"
    fill="var(--shadow-soft)"/>
  <g class="watering-cup__body">
    <path d="M35 31 C35 23 42 18 54 18 H74 C82 18 86 23 85 31 L81 67
      C80 73 74 76 64 76 H49 C40 76 36 72 36 65 Z"
      fill="var(--diego-turquoise, #4d918b)"/>
    <path d="M85 35 C100 35 106 45 103 56 C101 64 94 68 84 67"
      fill="none" stroke="var(--diego-shadow, #316a68)" stroke-width="7"
      stroke-linecap="round"/>
    <path d="M37 38 L17 29 L10 35 L35 50 Z"
      fill="var(--diego-shadow, #316a68)"/>
    <path d="M9 32 L18 27" stroke="var(--night, #233039)" stroke-width="3"
      stroke-linecap="round"/>
    <path d="M45 25 C54 22 67 23 75 25" fill="none"
      stroke="var(--paper-light, #f8f1e5)" stroke-width="2"
      stroke-linecap="round" opacity="0.38"/>
    <path d="M42 44 V64" fill="none" stroke="var(--paper-light, #f8f1e5)"
      stroke-width="2" stroke-linecap="round" opacity="0.24"/>
  </g>
  <path class="watering-cup__held-drop"
    d="M13 42 C8 49 8 54 13 56 C18 54 18 49 13 42 Z"
    fill="var(--rain, #708a99)"/>
</svg>`;
}

function dropArt(): string {
  return `
<svg class="object-art object-art--drop" viewBox="0 0 64 80"
  aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="object-art__ground" cx="32" cy="72" rx="16" ry="3"
    fill="var(--shadow-soft)"/>
  <path class="drop__body" d="M32 6 C25 20 14 31 14 46 C14 58 22 67 32 67
    C42 67 50 58 50 46 C50 31 39 20 32 6 Z"
    fill="var(--rain, #708a99)"/>
  <path class="drop__glint" d="M25 28 C21 34 20 40 21 45"
    fill="none" stroke="var(--paper-light, #f8f1e5)" stroke-width="3"
    stroke-linecap="round" opacity="0.68"/>
</svg>`;
}

function sunArt(): string {
  return `
<svg class="object-art object-art--sun" viewBox="0 0 96 96"
  aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
  <g class="sun__rays" fill="none" stroke="var(--sun, #e4b957)" stroke-width="4"
    stroke-linecap="round">
    <path d="M48 7 V19 M48 77 V89 M7 48 H19 M77 48 H89"/>
    <path d="M19 19 L27 27 M69 69 L77 77 M77 19 L69 27 M27 69 L19 77"/>
  </g>
  <circle class="sun__disc" cx="48" cy="48" r="24"
    fill="var(--sun, #e4b957)"/>
  <circle class="sun__wash" cx="40" cy="39" r="9"
    fill="var(--paper-light, #f8f1e5)" opacity="0.28"/>
</svg>`;
}

function windArt(variant: number): string {
  return `
<span class="wind__currents">
  <svg class="object-art object-art--wind" viewBox="0 0 112 72"
    aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <g class="wind__lines" fill="none" stroke="var(--rain, #708a99)"
      stroke-width="3.2" stroke-linecap="round">
      <path d="M8 21 H68 C82 21 83 8 72 8 C65 8 62 12 62 15"/>
      <path d="M5 36 H91 C105 36 106 51 94 53 C87 54 83 49 84 45"/>
      <path d="M17 53 H61"/>
    </g>
  </svg>
</span>
<span class="wind__leaf">${leafSVG(variant, "wind__leaf-svg")}</span>`;
}

function dryLeavesArt(count: number): string {
  const safeCount = Math.min(6, Math.max(3, Math.round(count)));
  return Array.from(
    { length: safeCount },
    (_, index) =>
      `<span class="dry-leaves__leaf dry-leaves__leaf--${index + 1}">${leafSVG(index + 1)}</span>`
  ).join("");
}

function visualFor(
  kind: InteractiveObjectKind,
  options: InteractiveObjectOptions
): string {
  // el sol es su propia familia de sprite; el resto usa la familia = kind
  const family = kind === "sun" ? "sun" : kind;
  const state = options.state ?? "idle";
  return pixelPlaceholder(family, state, {
    className: `interactive-object__source interactive-object__source--${kind}`,
    decorative: true,
  });
}

export function renderInteractiveObject(
  kind: InteractiveObjectKind,
  options: InteractiveObjectOptions = {}
): string {
  const state = options.state ?? "idle";
  const interactive = options.interactive ?? true;
  const disabled = state === "disabled";
  const label = options.label ?? DEFAULT_LABELS[kind];
  const extraClass = safeClassNames(options.className);
  const id = options.id ? ` id="${escapeAttribute(options.id)}"` : "";
  const tag = interactive ? "button" : "span";
  const semantics = interactive
    ? ` type="button"${disabled ? ' disabled aria-disabled="true"' : ""}`
    : options.decorative
      ? ' aria-hidden="true"'
      : ` role="img"${disabled ? ' aria-disabled="true"' : ""}`;
  const accessibleName =
    interactive || !options.decorative
      ? ` aria-label="${escapeAttribute(label)}"`
      : "";

  return `
<${tag}${id} class="interactive-object interactive-object--${kind}${extraClass ? ` ${extraClass}` : ""}"
  data-object="${kind}" data-state="${state}" data-interactive="${interactive}"
  ${semantics}${accessibleName}>
  <span class="interactive-object__visual" aria-hidden="true">
    ${visualFor(kind, options)}
  </span>
  <span class="interactive-object__feedback" aria-hidden="true"></span>
</${tag}>`;
}

export function renderSeed(options: InteractiveObjectOptions = {}): string {
  return renderInteractiveObject("seed", options);
}

export function renderThimble(options: InteractiveObjectOptions = {}): string {
  return renderInteractiveObject("thimble", options);
}

export function renderWateringCup(
  options: InteractiveObjectOptions = {}
): string {
  return renderInteractiveObject("watering-cup", options);
}

export function renderDrop(options: InteractiveObjectOptions = {}): string {
  return renderInteractiveObject("drop", options);
}

export function renderSun(options: InteractiveObjectOptions = {}): string {
  return renderInteractiveObject("sun", options);
}

export function renderUmbrella(options: InteractiveObjectOptions = {}): string {
  return renderInteractiveObject("umbrella", options);
}

export function renderDryLeaves(
  options: InteractiveObjectOptions = {}
): string {
  return renderInteractiveObject("dry-leaves", options);
}

export function renderWind(options: InteractiveObjectOptions = {}): string {
  return renderInteractiveObject("wind", options);
}

export function createInteractiveObject(
  kind: InteractiveObjectKind,
  options: InteractiveObjectOptions = {}
): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = renderInteractiveObject(kind, options).trim();
  const element = template.content.firstElementChild;
  if (!(element instanceof HTMLElement)) {
    throw new Error(`No se pudo crear el objeto interactivo: ${kind}`);
  }
  return element;
}

export function setInteractiveObjectState(
  element: HTMLElement,
  state: InteractiveObjectState
): void {
  element.dataset.state = state;
  const disabled = state === "disabled";

  if (element instanceof HTMLButtonElement) element.disabled = disabled;
  if (disabled) {
    element.setAttribute("aria-disabled", "true");
  } else {
    element.removeAttribute("aria-disabled");
  }
}

export function isInteractiveObjectState(
  value: string
): value is InteractiveObjectState {
  return (INTERACTIVE_OBJECT_STATES as readonly string[]).includes(value);
}
