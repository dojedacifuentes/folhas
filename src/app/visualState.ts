import {
  DANI_STATES,
  type DaniState,
} from "../art/characters/DaniCharacter";
import {
  DIEGO_STATES,
  type DiegoState,
} from "../art/characters/DiegoCharacter";
import {
  setPlantCharacterState,
  type PlantState,
} from "../art/PlantCharacter";

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
  dani?: SVGSVGElement | null;
  diego?: SVGSVGElement | null;
  plant?: SVGSVGElement | null;
  instruction?: HTMLElement | null;
}
function replaceCharacterState(
  character: SVGSVGElement,
  prefix: "dani" | "diego",
  states: readonly string[],
  state: string,
): void {
  for (const knownState of states) {
    character.classList.remove(
      `${prefix}--${knownState}`,
      `character--state-${knownState}`,
    );
  }

  character.classList.add(
    `${prefix}--${state}`,
    `character--state-${state}`,
  );
  character.dataset.state = state;
}

function findTargets(
  root: HTMLElement,
  supplied: SceneVisualTargets,
): Required<SceneVisualTargets> {
  return {
    dani:
      supplied.dani ??
      root.querySelector<SVGSVGElement>('svg[data-character="dani"]'),
    diego:
      supplied.diego ??
      root.querySelector<SVGSVGElement>('svg[data-character="diego"]'),
    plant:
      supplied.plant ??
      root.querySelector<SVGSVGElement>('svg[data-character="plant"]'),
    instruction:
      supplied.instruction ??
      root.querySelector<HTMLElement>(".scene-instruction"),
  };
}

/**
 * Cambia las clases de estado sobre los mismos nodos SVG. Así las partes
 * anatómicas pueden interpolar en CSS sin sustituir el dibujo completo.
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

  if (targets.dani) {
    replaceCharacterState(targets.dani, "dani", DANI_STATES, state.daniState);
  }
  if (targets.diego) {
    replaceCharacterState(targets.diego, "diego", DIEGO_STATES, state.diegoState);
  }
  if (targets.plant) {
    setPlantCharacterState(targets.plant, state.plantState);
  }
  if (targets.instruction) {
    targets.instruction.textContent = state.instruction;
    targets.instruction.closest<HTMLElement>(".scene-foot")?.classList.toggle(
      "is-resolved",
      state.completed || state.instruction.length === 0,
    );
  }
}
