export type SceneId =
  | "cover"
  | "clear-space"
  | "offerings"
  | "care"
  | "final";

/** Memoria narrativa: incidentes que el mundo recuerda y comenta después. */
export type ExperienceMemory = {
  flooded: boolean; // hubo exceso de agua en los cuidados
  gusted: boolean; // hubo viento con currículum
  burned: boolean; // la planta llegó a quemarse
  wrongSeeds: number; // objetos que no eran la semilla
};

export type ExperienceState = {
  currentScene: SceneId;
  coverOpened: boolean;
  leavesCleared: boolean;
  waterPlaced: boolean;
  seedPlaced: boolean;
  potCaught: boolean;
  waterBalanced: boolean;
  windBalanced: boolean;
  sunBalanced: boolean;
  finalReached: boolean;
  audioEnabled: boolean;
  memory: ExperienceMemory;
};

export const SCENE_ORDER: readonly SceneId[] = [
  "cover",
  "clear-space",
  "offerings",
  "care",
  "final",
];

const SCENE_IDS = new Set<string>(SCENE_ORDER);

export function defaultState(): ExperienceState {
  return {
    currentScene: "cover",
    coverOpened: false,
    leavesCleared: false,
    waterPlaced: false,
    seedPlaced: false,
    potCaught: false,
    waterBalanced: false,
    windBalanced: false,
    sunBalanced: false,
    finalReached: false,
    audioEnabled: false,
    memory: { flooded: false, gusted: false, burned: false, wrongSeeds: 0 },
  };
}

export function isSceneId(value: unknown): value is SceneId {
  return typeof value === "string" && SCENE_IDS.has(value);
}

/**
 * Indica si una sala esta desbloqueada por los hitos ya completados.
 * No autoriza saltos: para eso se usa canAdvanceTo().
 */
export function isSceneUnlocked(
  state: ExperienceState,
  scene: SceneId
): boolean {
  switch (scene) {
    case "cover":
      return true;
    case "clear-space":
      return state.coverOpened;
    case "offerings":
      return state.coverOpened && state.leavesCleared;
    case "care":
      return (
        state.coverOpened &&
        state.leavesCleared &&
        state.waterPlaced &&
        state.seedPlaced
      );
    case "final":
      return (
        state.coverOpened &&
        state.leavesCleared &&
        state.waterPlaced &&
        state.seedPlaced &&
        state.waterBalanced &&
        state.windBalanced &&
        state.sunBalanced
      );
  }
}

/** Solo permite pasar a la sala inmediatamente siguiente y ya desbloqueada. */
export function canAdvanceTo(
  state: ExperienceState,
  target: SceneId
): boolean {
  const currentIndex = SCENE_ORDER.indexOf(state.currentScene);
  const targetIndex = SCENE_ORDER.indexOf(target);
  return (
    currentIndex >= 0 &&
    targetIndex === currentIndex + 1 &&
    isSceneUnlocked(state, target)
  );
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTrue(record: UnknownRecord, key: string): boolean {
  return record[key] === true;
}

/**
 * Convierte datos persistidos no confiables en un estado coherente. Ademas de
 * validar tipos, impide hitos de salas futuras y corrige una escena bloqueada
 * a la sala desbloqueada mas avanzada.
 */
export function sanitizeState(value: unknown): ExperienceState {
  if (!isRecord(value)) return defaultState();

  // `light` pertenecía al flujo de seis salas. En el flujo actual, haber
  // llegado allí equivale a haber terminado los cuidados y poder ver el final.
  const requestedScene: SceneId =
    value.currentScene === "light"
      ? "final"
      : isSceneId(value.currentScene)
        ? value.currentScene
        : "cover";
  const requestedIndex = SCENE_ORDER.indexOf(requestedScene);

  const state = defaultState();
  state.audioEnabled = isTrue(value, "audioEnabled");

  // La memoria narrativa es anecdótica: se restaura con tolerancia y sin
  // poder desbloquear nada (solo cambia comentarios y la etiqueta final).
  if (isRecord(value.memory)) {
    state.memory.flooded = value.memory.flooded === true;
    state.memory.gusted = value.memory.gusted === true;
    state.memory.burned = value.memory.burned === true;
    const wrong = value.memory.wrongSeeds;
    state.memory.wrongSeeds =
      typeof wrong === "number" && Number.isFinite(wrong)
        ? Math.max(0, Math.min(9, Math.floor(wrong)))
        : 0;
  }

  // Cada hito solo puede existir en su propia sala o en una posterior.
  state.coverOpened = isTrue(value, "coverOpened");
  state.leavesCleared =
    requestedIndex >= 1 &&
    state.coverOpened &&
    isTrue(value, "leavesCleared");
  state.waterPlaced =
    requestedIndex >= 2 &&
    state.leavesCleared &&
    isTrue(value, "waterPlaced");
  state.seedPlaced =
    requestedIndex >= 2 &&
    state.leavesCleared &&
    isTrue(value, "seedPlaced");

  const offeringsComplete = state.waterPlaced && state.seedPlaced;
  state.potCaught =
    requestedIndex >= 3 && offeringsComplete && isTrue(value, "potCaught");
  state.waterBalanced =
    requestedIndex >= 3 &&
    offeringsComplete &&
    (isTrue(value, "waterBalanced") || isTrue(value, "rainBalanced"));
  state.windBalanced =
    requestedIndex >= 3 &&
    state.waterBalanced &&
    isTrue(value, "windBalanced");
  state.sunBalanced =
    requestedIndex >= 3 &&
    state.windBalanced &&
    isTrue(value, "sunBalanced");

  state.finalReached =
    requestedIndex >= 4 &&
    state.waterBalanced &&
    state.windBalanced &&
    state.sunBalanced &&
    isTrue(value, "finalReached");

  state.currentScene = requestedScene;
  if (!isSceneUnlocked(state, requestedScene)) {
    state.currentScene = [...SCENE_ORDER]
      .reverse()
      .find((scene) => isSceneUnlocked(state, scene)) ?? "cover";
  }

  // Una escena corregida hacia atras no conserva logros de escenas futuras.
  const currentIndex = SCENE_ORDER.indexOf(state.currentScene);
  if (currentIndex < 4) state.finalReached = false;
  if (currentIndex < 3) {
    state.potCaught = false;
    state.waterBalanced = false;
    state.windBalanced = false;
    state.sunBalanced = false;
  }
  if (currentIndex < 2) {
    state.waterPlaced = false;
    state.seedPlaced = false;
  }
  if (currentIndex < 1) state.leavesCleared = false;

  return state;
}
