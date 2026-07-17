import "../styles/plant.css";
import { pixelCharacterMarkup, setPixelSpriteState } from "./pixel/registry";

/**
 * Estados canónicos de la planta.
 *
 * Todos comparten exactamente la misma anatomía SVG. La continuidad se deriva
 * mediante data-plant-state, data-growth-stage y data-condition, de modo que un
 * cambio de estado puede animarse sin sustituir partes del personaje.
 */
export const PLANT_STATES = [
  "seed",
  "sprout",
  "small",
  "hydrated",
  "growing",
  "healthy",
  "drowned",
  "windBent",
  "fallen",
  "overheated",
  "burnt",
  "flowering",
] as const;

export type PlantState = (typeof PLANT_STATES)[number];

export type PlantGrowthStage =
  | "seed"
  | "sprout"
  | "small"
  | "growing"
  | "healthy"
  | "flowering";

export type PlantCondition =
  | "resting"
  | "hydrated"
  | "drowned"
  | "wind"
  | "fallen"
  | "heat"
  | "burnt";

export interface PlantStateProfile {
  readonly growthStage: PlantGrowthStage;
  readonly condition: PlantCondition;
  readonly label: string;
}

export interface PlantCharacterProps {
  /** Estado visual. healthy conserva el aspecto completo usado por la API anterior. */
  state?: PlantState;
  /** Clases adicionales para composición o compatibilidad con escenas existentes. */
  className?: string;
  /** Sustituye la descripción accesible derivada del estado. */
  ariaLabel?: string;
  /** Oculta el SVG del árbol de accesibilidad cuando el contexto ya lo describe. */
  decorative?: boolean;
}

export const PLANT_VIEW_BOX = "0 0 170 190";
export const PLANT_BASELINE = 182;

export const PLANT_STATE_PROFILES: Readonly<
  Record<PlantState, PlantStateProfile>
> = {
  seed: {
    growthStage: "seed",
    condition: "resting",
    label: "Una semilla cuadrada descansa en una maceta de terracota.",
  },
  sprout: {
    growthStage: "sprout",
    condition: "resting",
    label: "Un brote pequeño asoma en una maceta de terracota.",
  },
  small: {
    growthStage: "small",
    condition: "resting",
    label: "Una planta pequeña abre sus primeras hojas.",
  },
  hydrated: {
    growthStage: "small",
    condition: "hydrated",
    label: "La planta pequeña está hidratada y sostiene sus hojas.",
  },
  growing: {
    growthStage: "growing",
    condition: "resting",
    label: "La planta está creciendo con hojas verdes, ocres y turquesas.",
  },
  healthy: {
    growthStage: "healthy",
    condition: "resting",
    label: "La planta está sana, erguida y llena de hojas.",
  },
  drowned: {
    growthStage: "small",
    condition: "drowned",
    label: "La planta recibió demasiada agua y la maceta se desbordó.",
  },
  windBent: {
    growthStage: "growing",
    condition: "wind",
    label: "La planta se inclinó por demasiado viento.",
  },
  fallen: {
    growthStage: "growing",
    condition: "fallen",
    label: "La planta cayó de lado, pero conserva sus raíces.",
  },
  overheated: {
    growthStage: "healthy",
    condition: "heat",
    label: "La planta tiene demasiado calor y sus hojas están caídas.",
  },
  burnt: {
    growthStage: "healthy",
    condition: "burnt",
    label: "La planta se quemó por exceso de calor.",
  },
  flowering: {
    growthStage: "flowering",
    condition: "resting",
    label:
      "La planta floreció con hojas verdes, ocres y turquesas en una maceta de terracota.",
  },
};

const PLANT_STATE_CLASSES: Readonly<Record<PlantState, string>> = {
  seed: "plant-state--seed",
  sprout: "plant-state--sprout",
  small: "plant-state--small",
  hydrated: "plant-state--hydrated",
  growing: "plant-state--growing",
  healthy: "plant-state--healthy",
  drowned: "plant-state--drowned",
  windBent: "plant-state--wind-bent",
  fallen: "plant-state--fallen",
  overheated: "plant-state--overheated",
  burnt: "plant-state--burnt",
  flowering: "plant-state--flowering",
};

function escapeAttribute(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function classNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function isPlantState(value: string): value is PlantState {
  return (PLANT_STATES as readonly string[]).includes(value);
}

export function getPlantStateProfile(state: PlantState): PlantStateProfile {
  return PLANT_STATE_PROFILES[state];
}

/**
 * Renderiza la anatomía completa como texto SVG.
 * Ningún estado elimina nodos: CSS revela, transforma o recupera las mismas capas.
 */
export function renderPlantCharacter(
  props: PlantCharacterProps = {}
): string {
  const { state = "healthy", className, ariaLabel, decorative = false } = props;
  const profile = getPlantStateProfile(state);
  return pixelCharacterMarkup("plant", state, {
    className,
    label: decorative ? undefined : (ariaLabel ?? profile.label),
    decorative,
  });
}

/** Crea un nodo SVG listo para insertarse sin depender de una librería de UI. */
export function createPlantCharacter(
  props: PlantCharacterProps = {}
): SVGSVGElement {
  const template = document.createElement("template");
  template.innerHTML = renderPlantCharacter(props).trim();
  const element = template.content.firstElementChild;

  if (!(element instanceof SVGSVGElement)) {
    throw new Error("No se pudo crear el SVG canónico de la planta.");
  }

  return element;
}

/**
 * Cambia el estado de un nodo existente y conserva su anatomía, requisito para
 * que las transiciones entre crecimiento, cuidado y recuperación sean fluidas.
 */
export function setPlantCharacterState(
  element: HTMLCanvasElement,
  state: PlantState,
  ariaLabel?: string
): void {
  const profile = getPlantStateProfile(state);
  element.dataset.plantState = state;
  element.dataset.growthStage = profile.growthStage;
  element.dataset.condition = profile.condition;
  if (element.getAttribute("aria-hidden") !== "true") {
    element.setAttribute("aria-label", ariaLabel ?? profile.label);
  }
  setPixelSpriteState(element, state);
}
