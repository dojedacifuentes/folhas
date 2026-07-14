import { renderDani } from "./characters/DaniCharacter";
import { renderDiego } from "./characters/DiegoCharacter";
import { renderPlantArt } from "./characters/PlantArt";

export {
  bindDani,
  bindDaniInteraction,
  createDani,
  DANI_LEGACY_STATE_ALIASES,
  DANI_STATES,
  renderDani,
  resolveDaniState,
} from "./characters/DaniCharacter";
export type {
  DaniCharacterProps,
  DaniLegacyState,
  DaniState,
  DaniStateInput,
} from "./characters/DaniCharacter";
export {
  bindDiego,
  bindDiegoInteraction,
  createDiego,
  DIEGO_LEGACY_STATE_ALIASES,
  DIEGO_STATES,
  renderDiego,
  resolveDiegoState,
} from "./characters/DiegoCharacter";
export type {
  DiegoCharacterProps,
  DiegoLegacyState,
  DiegoState,
  DiegoStateInput,
} from "./characters/DiegoCharacter";
export {
  bindCharacterInteraction,
  CHARACTER_ANGLES,
  CHARACTER_FACINGS,
} from "./characters/CharacterTypes";
export type {
  CharacterAngle,
  CharacterBinding,
  CharacterFacing,
  CharacterInteractionEvent,
  CharacterInteractionHandler,
  CharacterProps,
  CharacterSize,
} from "./characters/CharacterTypes";

export const DANI_POSES = [
  "idle",
  "curious",
  "happy",
  "surprised",
  "worried",
  "proud",
  "sleeping",
  "watering",
  "watching",
  "reactingToRain",
  "reactingToWind",
  "reactingToHeat",
  "delighted",
  "observing",
  "hiding",
  "profile",
] as const;

export type DaniPose = (typeof DANI_POSES)[number];

export const DIEGO_POSES = [
  "idle",
  "focused",
  "concerned",
  "happy",
  "surprised",
  "proud",
  "protecting",
  "planting",
  "watching",
  "recoveringGlasses",
  "reactingToRain",
  "reactingToWind",
  "reactingToHeat",
  "serious",
  "embarrassed",
  "recovering-glasses",
  "profile",
] as const;

export type DiegoPose = (typeof DIEGO_POSES)[number];

export const PLANT_VISUAL_STATES = [
  "dormant",
  "awakened",
  "sprout",
  "hydrated",
  "balanced",
  "grown",
  "soaked",
  "windblown",
  "burnt",
  "recovering",
] as const;

export type PlantVisualState = (typeof PLANT_VISUAL_STATES)[number];

const DANI_POSE_CLASSES: Record<DaniPose, string> = {
  idle: "dani--idle",
  curious: "dani--curious",
  happy: "dani--happy",
  surprised: "dani--surprised",
  worried: "dani--worried",
  proud: "dani--proud",
  sleeping: "dani--sleeping",
  watering: "dani--watering",
  watching: "dani--watching",
  reactingToRain: "dani--reactingToRain",
  reactingToWind: "dani--reactingToWind",
  reactingToHeat: "dani--reactingToHeat",
  delighted: "dani--delighted",
  observing: "dani--observing",
  hiding: "dani--hiding",
  profile: "dani--profile",
};

const DIEGO_POSE_CLASSES: Record<DiegoPose, string> = {
  idle: "diego--idle",
  focused: "diego--focused",
  concerned: "diego--concerned",
  happy: "diego--happy",
  surprised: "diego--surprised",
  proud: "diego--proud",
  protecting: "diego--protecting",
  planting: "diego--planting",
  watching: "diego--watching",
  recoveringGlasses: "diego--recoveringGlasses",
  reactingToRain: "diego--reactingToRain",
  reactingToWind: "diego--reactingToWind",
  reactingToHeat: "diego--reactingToHeat",
  serious: "diego--serious",
  embarrassed: "diego--embarrassed",
  "recovering-glasses": "diego--recovering-glasses",
  profile: "diego--profile",
};

const PLANT_STATE_CLASSES: Record<PlantVisualState, string> = {
  dormant: "plant--dormant",
  awakened: "plant--awakened",
  sprout: "plant--sprout",
  hydrated: "plant--hydrated",
  balanced: "plant--balanced",
  grown: "plant--grown",
  soaked: "plant--soaked",
  windblown: "plant--windblown plant--balanced",
  burnt: "plant--burnt plant--full",
  recovering: "plant--recovering",
};

function classNames(...values: Array<string | undefined>): string {
  return values.filter(Boolean).join(" ");
}

export function daniPoseClasses(pose: DaniPose): string {
  return DANI_POSE_CLASSES[pose];
}

export function diegoPoseClasses(pose: DiegoPose): string {
  return DIEGO_POSE_CLASSES[pose];
}

export function plantStateClasses(state: PlantVisualState): string {
  return PLANT_STATE_CLASSES[state];
}

export function daniArt(pose: DaniPose, extraClass?: string): string {
  return renderDani({
    state: pose,
    angle: pose === "profile" ? "profile" : "front",
    facing: pose === "profile" ? "left" : "front",
    className: extraClass,
  });
}

export function diegoArt(pose: DiegoPose, extraClass?: string): string {
  return renderDiego({
    state: pose,
    angle: pose === "profile" ? "profile" : "front",
    facing: pose === "profile" ? "left" : "front",
    className: extraClass,
  });
}

export function plantArt(state: PlantVisualState, extraClass?: string): string {
  return renderPlantArt(classNames(plantStateClasses(state), extraClass));
}
