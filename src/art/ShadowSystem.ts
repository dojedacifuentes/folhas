import {
  branchShadowSVG,
  characterShadowSVG,
  shadowShelterSVG,
} from "./svgLibrary";
import "../styles/shadows.css";

export const SHADOW_LAYERS = [
  "scene",
  "botanical",
  "dani",
  "diego",
  "plant",
  "interactive",
] as const;

export type ShadowLayer = (typeof SHADOW_LAYERS)[number];

export const SHADOW_MODES = ["scene", "final"] as const;
export type ShadowMode = (typeof SHADOW_MODES)[number];

export interface ShadowLightProps {
  /** Posición horizontal de la luz, expresada de 0 a 100. */
  x: number;
  /** Posición vertical de la luz, expresada de 0 a 100. */
  y: number;
  /** Fuerza visual de las sombras, de 0 a 1. */
  intensity: number;
  /** Longitud relativa de las sombras proyectadas. */
  length: number;
  /** Ángulo de proyección en grados. */
  angle: number;
  /** Grado en que las sombras se encuentran y forman refugio, de 0 a 1. */
  shelter: number;
}

export interface ShadowSystemOptions extends Partial<ShadowLightProps> {
  mode?: ShadowMode;
  progress?: number;
  className?: string;
}

export interface ResolvedShadowSystemProps extends ShadowLightProps {
  mode: ShadowMode;
  progress: number;
}

export const DEFAULT_SHADOW_LIGHT: Readonly<ShadowLightProps> = Object.freeze({
  x: 50,
  y: 18,
  intensity: 0.64,
  length: 1,
  angle: 0,
  shelter: 0,
});

export const SHADOW_CSS_VARIABLES = {
  x: "--shadow-light-x",
  y: "--shadow-light-y",
  intensity: "--shadow-light-intensity",
  length: "--shadow-cast-length",
  angle: "--shadow-cast-angle",
  shelter: "--shadow-shelter",
  progress: "--shadow-progress",
  skew: "--shadow-cast-skew",
  driftX: "--shadow-drift-x",
  driftY: "--shadow-drift-y",
  castOpacity: "--shadow-cast-opacity",
  softOpacity: "--shadow-soft-opacity",
  interactiveOpacity: "--shadow-interactive-opacity",
  shelterOpacity: "--shadow-shelter-opacity",
  shelterScale: "--shadow-shelter-scale",
  daniShift: "--shadow-dani-shift",
  diegoShift: "--shadow-diego-shift",
  objectShiftA: "--shadow-object-shift-a",
  objectShiftB: "--shadow-object-shift-b",
  objectDrop: "--shadow-object-drop",
  objectScale: "--shadow-object-scale",
} as const;

export type ShadowCSSVariable =
  (typeof SHADOW_CSS_VARIABLES)[keyof typeof SHADOW_CSS_VARIABLES];
export type ShadowCSSVariableMap = Record<ShadowCSSVariable, string>;

function clamp(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function safeClassNames(value = ""): string {
  return value
    .split(/\s+/)
    .filter((token) => /^[a-zA-Z_][\w-]*$/.test(token))
    .join(" ");
}

export function resolveShadowSystemProps(
  options: ShadowSystemOptions = {}
): ResolvedShadowSystemProps {
  const mode = options.mode ?? "scene";
  const shelterDefault = mode === "final" ? 1 : DEFAULT_SHADOW_LIGHT.shelter;

  return {
    mode,
    x: round(clamp(options.x ?? DEFAULT_SHADOW_LIGHT.x, 0, 100)),
    y: round(clamp(options.y ?? DEFAULT_SHADOW_LIGHT.y, 0, 100)),
    intensity: round(
      clamp(options.intensity ?? DEFAULT_SHADOW_LIGHT.intensity, 0, 1)
    ),
    length: round(clamp(options.length ?? DEFAULT_SHADOW_LIGHT.length, 0.45, 2.2)),
    angle: round(clamp(options.angle ?? DEFAULT_SHADOW_LIGHT.angle, -45, 45)),
    shelter: round(clamp(options.shelter ?? shelterDefault, 0, 1)),
    progress: round(clamp(options.progress ?? 0, 0, 1)),
  };
}

export function shadowCSSVariables(
  props: ResolvedShadowSystemProps
): ShadowCSSVariableMap {
  const shelterOpacity = clamp(props.shelter * 0.86 + props.progress * 0.14, 0, 1);
  const castOpacity = clamp(props.intensity * (1 - props.shelter * 0.22), 0, 1);
  const softOpacity = clamp(props.intensity * (0.52 + props.progress * 0.2), 0, 1);
  const interactiveOpacity = clamp(
    props.intensity * (0.42 + props.progress * 0.46),
    0,
    1
  );

  return {
    [SHADOW_CSS_VARIABLES.x]: `${props.x}%`,
    [SHADOW_CSS_VARIABLES.y]: `${props.y}%`,
    [SHADOW_CSS_VARIABLES.intensity]: `${props.intensity}`,
    [SHADOW_CSS_VARIABLES.length]: `${props.length}`,
    [SHADOW_CSS_VARIABLES.angle]: `${props.angle}deg`,
    [SHADOW_CSS_VARIABLES.shelter]: `${props.shelter}`,
    [SHADOW_CSS_VARIABLES.progress]: `${props.progress}`,
    [SHADOW_CSS_VARIABLES.skew]: `${round(props.angle * 0.22)}deg`,
    [SHADOW_CSS_VARIABLES.driftX]: `${round((50 - props.x) * 0.16)}%`,
    [SHADOW_CSS_VARIABLES.driftY]: `${round((36 - props.y) * 0.08)}%`,
    [SHADOW_CSS_VARIABLES.castOpacity]: `${round(castOpacity)}`,
    [SHADOW_CSS_VARIABLES.softOpacity]: `${round(softOpacity)}`,
    [SHADOW_CSS_VARIABLES.interactiveOpacity]: `${round(interactiveOpacity)}`,
    [SHADOW_CSS_VARIABLES.shelterOpacity]: `${round(shelterOpacity)}`,
    [SHADOW_CSS_VARIABLES.shelterScale]: `${round(0.84 + props.shelter * 0.16)}`,
    [SHADOW_CSS_VARIABLES.daniShift]: `${round(props.shelter * 14)}%`,
    [SHADOW_CSS_VARIABLES.diegoShift]: `${round(props.shelter * 14)}%`,
    [SHADOW_CSS_VARIABLES.objectShiftA]: `${round(props.progress * 56)}px`,
    [SHADOW_CSS_VARIABLES.objectShiftB]: `${round(props.progress * -56)}px`,
    [SHADOW_CSS_VARIABLES.objectDrop]: `${round(props.progress * 8)}px`,
    [SHADOW_CSS_VARIABLES.objectScale]: `${round(1 - props.progress * 0.18)}`,
  };
}

function plantShadowArt(): string {
  return `
<svg class="shadow-system__plant-svg" viewBox="0 0 180 190" aria-hidden="true"
  xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--shadow-deep)">
    <path d="M55 186 L61 126 C72 123 108 123 119 126 L125 186 Z"/>
    <path d="M87 127 C83 104 84 82 90 61 C96 82 96 106 92 127 Z"/>
    <path d="M88 91 C67 87 51 70 52 49 C72 51 88 68 91 88 Z"/>
    <path d="M93 94 C112 88 128 70 128 49 C108 50 92 70 90 90 Z"/>
    <path d="M90 68 C80 55 81 35 91 19 C103 36 102 56 92 70 Z"/>
  </g>
</svg>`;
}

function interactiveShadowArt(): string {
  return `
<svg class="shadow-system__interactive-svg" viewBox="0 0 320 100"
  aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="shadow-system__object-cast shadow-system__object-cast--a"
    cx="82" cy="67" rx="48" ry="12" fill="var(--shadow-medium)"/>
  <ellipse class="shadow-system__object-cast shadow-system__object-cast--b"
    cx="238" cy="62" rx="36" ry="10" fill="var(--shadow-soft)"/>
  <path class="shadow-system__square-cast" d="M153 51 L176 45 L188 64 L164 71 Z"
    fill="var(--shadow-medium)"/>
</svg>`;
}

function renderLayer(layer: ShadowLayer, contents: string): string {
  return `
  <div class="shadow-system__layer shadow-system__layer--${layer}"
    data-shadow-layer="${layer}">${contents}</div>`;
}

export function renderShadowSystem(options: ShadowSystemOptions = {}): string {
  const props = resolveShadowSystemProps(options);
  const variables = shadowCSSVariables(props);
  const style = Object.entries(variables)
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
  const extraClass = safeClassNames(options.className);

  const sceneLayer = renderLayer(
    "scene",
    `
      <span class="shadow-system__ground-cast"></span>
      <span class="shadow-system__shelter">${shadowShelterSVG(
        "shadow-system__shelter-svg"
      )}</span>`
  );
  const botanicalLayer = renderLayer(
    "botanical",
    `
      <span class="shadow-system__branch shadow-system__branch--a">${branchShadowSVG(
        1,
        "shadow-system__branch-svg"
      )}</span>
      <span class="shadow-system__branch shadow-system__branch--b">${branchShadowSVG(
        2,
        "shadow-system__branch-svg"
      )}</span>`
  );
  const daniLayer = renderLayer(
    "dani",
    `<span class="shadow-system__character shadow-system__character--dani">${characterShadowSVG(
      "dani",
      "shadow-system__character-svg"
    )}</span>`
  );
  const diegoLayer = renderLayer(
    "diego",
    `<span class="shadow-system__character shadow-system__character--diego">${characterShadowSVG(
      "diego",
      "shadow-system__character-svg"
    )}</span>`
  );
  const plantLayer = renderLayer(
    "plant",
    `<span class="shadow-system__plant">${plantShadowArt()}</span>`
  );
  const interactiveLayer = renderLayer(
    "interactive",
    `<span class="shadow-system__interactive">${interactiveShadowArt()}</span>`
  );

  return `
<div class="shadow-system shadow-system--${props.mode}${extraClass ? ` ${extraClass}` : ""}"
  data-shadow-system data-shadow-mode="${props.mode}"
  data-shadow-x="${props.x}" data-shadow-y="${props.y}"
  data-shadow-intensity="${props.intensity}" data-shadow-length="${props.length}"
  data-shadow-angle="${props.angle}" data-shadow-shelter="${props.shelter}"
  data-shadow-progress="${props.progress}" style="${style}" aria-hidden="true">
  ${sceneLayer}
  ${botanicalLayer}
  ${daniLayer}
  ${diegoLayer}
  ${plantLayer}
  ${interactiveLayer}
</div>`;
}

export function createShadowSystem(
  options: ShadowSystemOptions = {}
): HTMLElement {
  const template = document.createElement("template");
  template.innerHTML = renderShadowSystem(options).trim();
  const element = template.content.firstElementChild;
  if (!(element instanceof HTMLElement)) {
    throw new Error("No se pudo crear el sistema de sombras");
  }
  return element;
}

function datasetNumber(element: HTMLElement, key: keyof DOMStringMap): number | undefined {
  const value = element.dataset[key];
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function currentOptions(element: HTMLElement): ShadowSystemOptions {
  const mode = element.dataset.shadowMode;
  return {
    mode: mode === "final" ? "final" : "scene",
    x: datasetNumber(element, "shadowX"),
    y: datasetNumber(element, "shadowY"),
    intensity: datasetNumber(element, "shadowIntensity"),
    length: datasetNumber(element, "shadowLength"),
    angle: datasetNumber(element, "shadowAngle"),
    shelter: datasetNumber(element, "shadowShelter"),
    progress: datasetNumber(element, "shadowProgress"),
  };
}

function applyResolvedProps(
  element: HTMLElement,
  props: ResolvedShadowSystemProps
): void {
  const variables = shadowCSSVariables(props);
  Object.entries(variables).forEach(([name, value]) => {
    element.style.setProperty(name, value);
  });

  element.dataset.shadowMode = props.mode;
  element.dataset.shadowX = `${props.x}`;
  element.dataset.shadowY = `${props.y}`;
  element.dataset.shadowIntensity = `${props.intensity}`;
  element.dataset.shadowLength = `${props.length}`;
  element.dataset.shadowAngle = `${props.angle}`;
  element.dataset.shadowShelter = `${props.shelter}`;
  element.dataset.shadowProgress = `${props.progress}`;
  element.classList.toggle("shadow-system--scene", props.mode === "scene");
  element.classList.toggle("shadow-system--final", props.mode === "final");
}

export function updateShadowSystem(
  element: HTMLElement,
  options: ShadowSystemOptions
): ResolvedShadowSystemProps {
  const merged: ShadowSystemOptions = { ...currentOptions(element), ...options };
  if (options.mode === "final" && options.shelter === undefined) merged.shelter = 1;
  const props = resolveShadowSystemProps(merged);
  applyResolvedProps(element, props);
  return props;
}

export function setShadowLight(
  element: HTMLElement,
  light: Partial<ShadowLightProps>
): ResolvedShadowSystemProps {
  return updateShadowSystem(element, light);
}

export function setShadowProgress(
  element: HTMLElement,
  progress: number,
  shelter?: number
): ResolvedShadowSystemProps {
  return updateShadowSystem(element, { progress, shelter });
}
