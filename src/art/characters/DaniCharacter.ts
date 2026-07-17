import { pixelCharacterMarkup } from "../pixel/registry";
import {
  bindCharacterInteraction,
  createCharacterElement,
  joinCharacterClasses,
  type CharacterBinding,
  type CharacterInteractionHandler,
  type CharacterProps,
} from "./CharacterTypes";

export const DANI_STATES = [
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
] as const;

export type DaniState = (typeof DANI_STATES)[number];

/** Alias conservados para escenas y la hoja de modelo anteriores. */
export const DANI_LEGACY_STATE_ALIASES = {
  delighted: "happy",
  hiding: "watching",
  observing: "watching",
  profile: "idle",
} as const satisfies Record<string, DaniState>;

export type DaniLegacyState = keyof typeof DANI_LEGACY_STATE_ALIASES;
export type DaniStateInput = DaniState | DaniLegacyState;
export type DaniCharacterProps = CharacterProps<DaniStateInput>;

function isDaniState(state: DaniStateInput): state is DaniState {
  return (DANI_STATES as readonly string[]).includes(state);
}

export function resolveDaniState(state: DaniStateInput = "idle"): DaniState {
  return isDaniState(state) ? state : DANI_LEGACY_STATE_ALIASES[state];
}

export function renderDani(props: DaniCharacterProps = {}): string {
  const state = resolveDaniState(props.state ?? "idle");
  const facing = props.facing ?? "front";
  return pixelCharacterMarkup("dani", state, {
    className: joinCharacterClasses(`facing--${facing}`, props.className),
    decorative: true,
  });
}

export function bindDaniInteraction(
  character: SVGSVGElement,
  onInteraction: CharacterInteractionHandler,
): CharacterBinding {
  if (character.dataset.character !== "dani") {
    throw new Error("bindDaniInteraction esperaba un SVG de Dani.");
  }
  return bindCharacterInteraction(character, onInteraction);
}

/** Crea el nodo y enlaza el callback, algo que el renderer de texto no puede hacer. */
export function createDani(props: DaniCharacterProps = {}): SVGSVGElement {
  const character = createCharacterElement(renderDani(props));
  const interactive = props.interactive ?? Boolean(props.onInteraction);
  if (interactive && props.onInteraction) bindDaniInteraction(character, props.onInteraction);
  return character;
}

export const bindDani = bindDaniInteraction;
