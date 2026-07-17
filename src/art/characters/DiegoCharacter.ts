import { pixelCharacterMarkup } from "../pixel/registry";
import {
  bindCharacterInteraction,
  createCharacterElement,
  joinCharacterClasses,
  type CharacterBinding,
  type CharacterInteractionHandler,
  type CharacterProps,
} from "./CharacterTypes";

export const DIEGO_STATES = [
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
] as const;

export type DiegoState = (typeof DIEGO_STATES)[number];

/** Alias conservados para escenas y estilos previos. */
export const DIEGO_LEGACY_STATE_ALIASES = {
  serious: "focused",
  embarrassed: "concerned",
  "recovering-glasses": "recoveringGlasses",
  profile: "idle",
} as const satisfies Record<string, DiegoState>;

export type DiegoLegacyState = keyof typeof DIEGO_LEGACY_STATE_ALIASES;
export type DiegoStateInput = DiegoState | DiegoLegacyState;
export type DiegoCharacterProps = CharacterProps<DiegoStateInput>;

function isDiegoState(state: DiegoStateInput): state is DiegoState {
  return (DIEGO_STATES as readonly string[]).includes(state);
}

export function resolveDiegoState(state: DiegoStateInput = "idle"): DiegoState {
  return isDiegoState(state) ? state : DIEGO_LEGACY_STATE_ALIASES[state];
}

export function renderDiego(props: DiegoCharacterProps = {}): string {
  const state = resolveDiegoState(props.state ?? "idle");
  const facing = props.facing ?? "front";
  return pixelCharacterMarkup("diego", state, {
    className: joinCharacterClasses(`facing--${facing}`, props.className),
    decorative: true,
  });
}

export function bindDiegoInteraction(
  character: SVGSVGElement,
  onInteraction: CharacterInteractionHandler,
): CharacterBinding {
  if (character.dataset.character !== "diego") {
    throw new Error("bindDiegoInteraction esperaba un SVG de Diego.");
  }
  return bindCharacterInteraction(character, onInteraction);
}

/** Crea el nodo y enlaza el callback, algo que el renderer de texto no puede hacer. */
export function createDiego(props: DiegoCharacterProps = {}): SVGSVGElement {
  const character = createCharacterElement(renderDiego(props));
  const interactive = props.interactive ?? Boolean(props.onInteraction);
  if (interactive && props.onInteraction) bindDiegoInteraction(character, props.onInteraction);
  return character;
}

export const bindDiego = bindDiegoInteraction;
