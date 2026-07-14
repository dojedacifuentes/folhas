/**
 * Fachada compatible para las escenas existentes.
 *
 * El arte canónico vive en ../PlantCharacter. Esta capa traduce las clases del
 * vocabulario anterior a PlantState sin obligar a cambiar artDirection ni las
 * escenas durante la migración.
 */
import {
  PLANT_BASELINE,
  PLANT_STATE_PROFILES,
  PLANT_STATES,
  PLANT_VIEW_BOX,
  createPlantCharacter,
  getPlantStateProfile,
  isPlantState,
  renderPlantCharacter,
  setPlantCharacterState,
  type PlantCharacterProps,
  type PlantCondition,
  type PlantGrowthStage,
  type PlantState,
  type PlantStateProfile,
} from "../PlantCharacter";

const LEGACY_STATE_RULES: ReadonlyArray<readonly [string, PlantState]> = [
  ["plant--soaked", "drowned"],
  ["plant--windblown", "windBent"],
  ["plant--burnt", "burnt"],
  ["plant--recovering", "growing"],
  ["plant--grown", "flowering"],
  ["plant--full", "flowering"],
  ["plant--balanced", "healthy"],
  ["plant--hydrated", "hydrated"],
  ["plant--sprout", "small"],
  ["plant--awakened", "sprout"],
  ["plant--dormant", "seed"],
];

const CANONICAL_STATE_CLASSES: Readonly<Record<PlantState, string>> = {
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

export function inferPlantStateFromClasses(extraClass = ""): PlantState {
  const classes = new Set(extraClass.split(/\s+/).filter(Boolean));

  for (const [legacyClass, state] of LEGACY_STATE_RULES) {
    if (classes.has(legacyClass)) return state;
  }

  for (const state of PLANT_STATES) {
    if (
      classes.has("plant--" + state) ||
      classes.has(CANONICAL_STATE_CLASSES[state])
    ) {
      return state;
    }
  }

  return "healthy";
}

/**
 * Firma histórica: renderPlantArt(extraClass).
 * El segundo argumento opcional permite elegir un estado canónico explícito.
 */
export function renderPlantArt(
  extraClass = "",
  state?: PlantState
): string {
  return renderPlantCharacter({
    state: state ?? inferPlantStateFromClasses(extraClass),
    className: extraClass,
  });
}

/** Equivalente DOM de renderPlantArt, útil para conservar nodos entre estados. */
export function createPlantArt(
  extraClass = "",
  state?: PlantState
): SVGSVGElement {
  return createPlantCharacter({
    state: state ?? inferPlantStateFromClasses(extraClass),
    className: extraClass,
  });
}

export {
  PLANT_BASELINE,
  PLANT_STATE_PROFILES,
  PLANT_STATES,
  PLANT_VIEW_BOX,
  createPlantCharacter,
  getPlantStateProfile,
  isPlantState,
  renderPlantCharacter,
  setPlantCharacterState,
};

export type {
  PlantCharacterProps,
  PlantCondition,
  PlantGrowthStage,
  PlantState,
  PlantStateProfile,
};
