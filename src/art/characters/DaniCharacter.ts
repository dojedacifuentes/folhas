import { renderDaniArt } from "./DaniArt";
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
  const requestedState = props.state ?? "idle";
  const state = resolveDaniState(requestedState);
  const legacyClass = requestedState !== state ? `dani--${requestedState}` : undefined;
  const angle = requestedState === "profile" && props.angle === undefined ? "profile" : (props.angle ?? "front");
  const interactive = props.interactive ?? Boolean(props.onInteraction);

  return renderDaniArt({
    className: joinCharacterClasses(
      `dani--${state}`,
      `character--state-${state}`,
      legacyClass,
      props.className,
    ),
    state,
    angle,
    facing: props.facing ?? "front",
    size: props.size,
    reducedMotion: props.reducedMotion,
    interactive,
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
