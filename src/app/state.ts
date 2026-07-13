export type SceneId =
  | "cover"
  | "clear-space"
  | "offerings"
  | "light"
  | "final";

export type ExperienceState = {
  currentScene: SceneId;
  coverOpened: boolean;
  leavesCleared: boolean;
  waterPlaced: boolean;
  seedPlaced: boolean;
  lightAligned: boolean;
  finalReached: boolean;
  audioEnabled: boolean;
};

export const SCENE_ORDER: SceneId[] = [
  "cover",
  "clear-space",
  "offerings",
  "light",
  "final",
];

export function defaultState(): ExperienceState {
  return {
    currentScene: "cover",
    coverOpened: false,
    leavesCleared: false,
    waterPlaced: false,
    seedPlaced: false,
    lightAligned: false,
    finalReached: false,
    audioEnabled: false,
  };
}
