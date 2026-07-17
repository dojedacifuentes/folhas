import type { DaniState } from "../art/characters/DaniCharacter";
import type { DiegoState } from "../art/characters/DiegoCharacter";
import type { PlantState } from "../art/PlantCharacter";
import { setPixelSpriteState } from "../art/pixel/registry";

/**
 * Contrato visual compartido por las escenas.
 *
 * La narrativa decide este estado; los SVG solo lo representan. Mantener la
 * instrucción y el bloqueo de interacción aquí evita que aparezcan acciones
 * de momentos futuros antes de tiempo.
 */
export type SceneVisualState = {
  daniState: DaniState;
  diegoState: DiegoState;
  plantState: PlantState;
  instruction: string;
  interactionEnabled: boolean;
  completed: boolean;
};

export interface SceneVisualTargets {
  dani?: HTMLCanvasElement | null;
  diego?: HTMLCanvasElement | null;
  plant?: HTMLCanvasElement | null;
  instruction?: HTMLElement | null;
}

function findTargets(
  root: HTMLElement,
  supplied: SceneVisualTargets,
): Required<SceneVisualTargets> {
  return {
    dani:
      supplied.dani ??
      root.querySelector<HTMLCanvasElement>('canvas[data-character="dani"]'),
    diego:
      supplied.diego ??
      root.querySelector<HTMLCanvasElement>('canvas[data-character="diego"]'),
    plant:
      supplied.plant ??
      root.querySelector<HTMLCanvasElement>('canvas[data-character="plant"]'),
    instruction:
      supplied.instruction ??
      root.querySelector<HTMLElement>(".scene-instruction"),
  };
}

/**
 * La narrativa decide el estado; aquí se repintan los sprites de pixel art de
 * Dani, Diego y la planta, y se actualiza la instrucción y el bloqueo.
 */
export function setSceneVisualState(
  root: HTMLElement,
  state: SceneVisualState,
  suppliedTargets: SceneVisualTargets = {},
): void {
  const targets = findTargets(root, suppliedTargets);

  root.dataset.daniState = state.daniState;
  root.dataset.diegoState = state.diegoState;
  root.dataset.plantState = state.plantState;
  root.dataset.interactionEnabled = String(state.interactionEnabled);
  root.dataset.completed = String(state.completed);

  if (targets.dani) setPixelSpriteState(targets.dani, state.daniState);
  if (targets.diego) setPixelSpriteState(targets.diego, state.diegoState);
  if (targets.plant) setPixelSpriteState(targets.plant, state.plantState);
  if (targets.instruction) {
    targets.instruction.textContent = state.instruction;
    targets.instruction.closest<HTMLElement>(".scene-foot")?.classList.toggle(
      "is-resolved",
      state.completed || state.instruction.length === 0,
    );
  }
}
