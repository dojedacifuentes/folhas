import "../styles/plant.css";

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
  const {
    state = "healthy",
    className,
    ariaLabel,
    decorative = false,
  } = props;
  const profile = getPlantStateProfile(state);
  const svgClass = classNames(
    "fig",
    "fig-plant",
    "plant-character",
    PLANT_STATE_CLASSES[state],
    `plant--${state}`,
    className
  );
  const accessibility = decorative
    ? 'aria-hidden="true" focusable="false"'
    : `role="img" aria-label="${escapeAttribute(
        ariaLabel ?? profile.label
      )}" focusable="false"`;

  return `
<svg class="${escapeAttribute(svgClass)}" viewBox="${PLANT_VIEW_BOX}"
  data-character="plant" data-plant-state="${state}"
  data-growth-stage="${profile.growthStage}" data-condition="${profile.condition}"
  data-baseline="${PLANT_BASELINE}" ${accessibility}
  xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow plant-ground-shadow" data-part="ground-shadow"
    cx="85" cy="182" rx="44" ry="6" fill="var(--shadow)"/>

  <g class="plant-character__water plant-water-layer" data-layer="water" data-part="water"
    aria-hidden="true">
    <ellipse class="plant-water-puddle" cx="85" cy="177" rx="52" ry="8"
      fill="var(--plant-water, var(--rain, #6c9696))"/>
    <g class="plant-waterline" data-part="waterline">
      <path d="M51 126 C69 119 101 132 119 124 L116 142
        C98 146 72 139 55 143 Z"
        fill="var(--plant-water, var(--rain, #6c9696))"/>
    </g>
    <g class="plant-water-drops" data-part="water-drops">
      <path class="plant-water-drop plant-water-drop--left"
        d="M46 119 C46 113 51 108 51 104 C56 111 58 116 55 121
          C52 125 46 123 46 119 Z"/>
      <path class="plant-water-drop plant-water-drop--right"
        d="M119 111 C119 106 123 102 124 98 C129 105 130 109 128 113
          C126 117 120 115 119 111 Z"/>
    </g>
    <circle class="plant-bubble plant-bubble--a" cx="61" cy="116" r="4"/>
    <circle class="plant-bubble plant-bubble--b" cx="111" cy="109" r="3"/>
  </g>

  <g class="plant-character__pot plant-pot-group" data-layer="pot" data-part="pot">
    <path class="plant-pot" data-silhouette="true"
      d="M51 120 C69 117 101 119 119 120 L113 171
        C112 178 105 181 96 181 L74 181 C64 181 58 177 57 170 Z"
      fill="var(--plant-pot-body, #ad6237)"/>
    <path class="plant-pot-shade" data-detail="ink"
      d="M105 129 L116 127 L112 170 C111 176 105 179 97 180
        C104 166 106 147 105 129 Z"
      fill="var(--plant-pot-shadow, #814526)" opacity="0.56"/>
    <path class="plant-pot-rim" data-part="pot-rim" data-detail="ink"
      d="M49 118 C69 114 102 116 121 119 L118 132
        C98 136 71 134 52 131 Z"
      fill="var(--plant-pot-rim, #c77b4b)"/>
    <path class="plant-pot-rim-shadow" data-detail="ink"
      d="M53 127 C72 130 99 132 118 127 L117 133
        C98 136 71 134 52 131 Z"
      fill="var(--plant-pot-shadow, #814526)" opacity="0.42"/>
    <path class="plant-pot-glint" data-detail="micro"
      d="M63 137 C63 148 64 159 67 168"
      stroke="var(--plant-pot-highlight, #df9b68)" stroke-width="2"
      stroke-linecap="round" fill="none" opacity="0.58"/>
    <path class="plant-square-mark" data-part="square-mark" data-detail="micro"
      d="M94 147 L101 147 L101 154 L94 154 Z"
      fill="none" stroke="var(--paper-light)" stroke-width="1" opacity="0.25"/>
  </g>

  <g class="plant-character__soil plant-soil-layer" data-layer="soil" data-part="soil">
    <ellipse class="plant-soil" cx="85" cy="121" rx="33" ry="7.5"
      fill="var(--plant-soil, var(--soil-dry, #765038))"/>
    <path class="plant-soil-texture" data-detail="micro"
      d="M63 121 C68 118 72 124 77 121 M91 119 C96 123 101 118 107 121"
      stroke="var(--plant-soil-dark, #4d3528)" stroke-width="1.3"
      stroke-linecap="round" fill="none" opacity="0.54"/>
  </g>

  <g class="plant-character__seed plant-seed" data-layer="seed" data-part="seed">
    <path class="plant-seed-shell" data-silhouette="true"
      d="M78 111 L89 108 L96 115 L91 124 L80 124 L75 117 Z"
      fill="var(--diego-turquoise, #3f776f)"/>
    <path class="plant-seed-glint" data-detail="micro"
      d="M81 113 L88 112 L91 115"
      stroke="var(--paper-light)" stroke-width="1.2" fill="none"
      stroke-linecap="round" opacity="0.55"/>
  </g>

  <g class="plant-character__sprout plant-sprout" data-layer="stem" data-part="sprout">
    <path class="plant-sprout-stem plant-stem" data-silhouette="true"
      d="M85 121 C84 113 85 105 86 98"
      stroke="var(--plant-stem-color, var(--green-new, #657c45))"
      stroke-width="3.2" stroke-linecap="round" fill="none"/>
    <g class="plant-sprout-leaf plant-sprout-leaf--left plant-leaf plant-leaf--green"
      data-part="sprout-leaf-left">
      <path class="plant-leaf-shape" data-silhouette="true"
        d="M85 105 C75 104 70 96 73 88 C83 89 89 97 87 104 Z"
        fill="var(--plant-leaf-green, var(--green-new, #657c45))"/>
    </g>
    <g class="plant-sprout-leaf plant-sprout-leaf--right plant-leaf plant-leaf--turquoise"
      data-part="sprout-leaf-right">
      <path class="plant-leaf-shape" data-silhouette="true"
        d="M86 109 C93 103 102 105 105 112 C98 118 90 116 86 111 Z"
        fill="var(--plant-leaf-turquoise, var(--diego-turquoise, #3f776f))"/>
    </g>
  </g>

  <g class="plant-character__growth plant-growth" data-part="growth">
    <g class="plant-character__stems plant-stem-layer" data-layer="stem" data-part="stem">
      <path class="plant-stem plant-stem--main" data-silhouette="true"
        d="M85 121 C83 104 88 84 85 63 C84 51 86 41 87 30"
        stroke="var(--plant-stem-color, var(--green-new, #657c45))"
        stroke-width="4" stroke-linecap="round" fill="none"/>
      <path class="plant-stem plant-stem--left" data-silhouette="true"
        d="M85 102 C77 93 68 85 59 77 M85 80 C75 72 66 64 59 56"
        stroke="var(--plant-stem-color, var(--green-new, #657c45))"
        stroke-width="3" stroke-linecap="round" fill="none"/>
      <path class="plant-stem plant-stem--right" data-silhouette="true"
        d="M86 96 C96 87 106 79 114 69 M86 70 C96 62 105 56 113 48"
        stroke="var(--plant-stem-color, var(--green-new, #657c45))"
        stroke-width="3" stroke-linecap="round" fill="none"/>
    </g>

    <g class="plant-character__leaves plant-leaves" data-layer="leaves" data-part="leaves">
      <g class="plant-leaf plant-leaf--yellow plant-leaf--lower-left"
        data-part="leaf-ochre-lower">
        <path class="plant-leaf-shape" data-silhouette="true"
          d="M83 105 C70 105 56 97 53 84 C68 80 82 89 86 102 Z"
          fill="var(--plant-leaf-ochre, var(--dani-yellow, #d99d29))"/>
        <path class="plant-vein" data-detail="ink"
          d="M80 101 C70 94 62 89 56 86 M69 94 L65 88"
          stroke="var(--plant-leaf-ink, #4e5437)" stroke-width="1.15"
          fill="none" stroke-linecap="round" opacity="0.52"/>
      </g>

      <g class="plant-leaf plant-leaf--turquoise plant-leaf--lower-right"
        data-part="leaf-turquoise-lower">
        <path class="plant-leaf-shape" data-silhouette="true"
          d="M88 99 C101 96 115 87 118 74 C103 72 89 83 85 96 Z"
          fill="var(--plant-leaf-turquoise, var(--diego-turquoise, #3f776f))"/>
        <path class="plant-vein" data-detail="ink"
          d="M91 95 C101 88 109 81 115 76 M103 87 L108 82"
          stroke="var(--plant-leaf-ink, #314943)" stroke-width="1.15"
          fill="none" stroke-linecap="round" opacity="0.5"/>
      </g>

      <g class="plant-leaf plant-leaf--green plant-leaf--middle-left"
        data-part="leaf-green-middle">
        <path class="plant-leaf-shape" data-silhouette="true"
          d="M83 82 C70 79 57 68 56 54 C72 53 85 66 87 79 Z"
          fill="var(--plant-leaf-green, var(--green-moss, #56643a))"/>
        <path class="plant-vein" data-detail="ink"
          d="M81 78 C72 69 64 61 59 57 M70 68 L65 62"
          stroke="var(--plant-leaf-ink, #37412b)" stroke-width="1.1"
          fill="none" stroke-linecap="round" opacity="0.5"/>
      </g>

      <g class="plant-leaf plant-leaf--yellow plant-leaf--middle-right"
        data-part="leaf-ochre-middle">
        <path class="plant-leaf-shape" data-silhouette="true"
          d="M89 74 C101 68 113 58 114 44 C98 45 87 58 85 71 Z"
          fill="var(--plant-leaf-ochre, var(--dani-yellow, #d99d29))"/>
        <path class="plant-vein" data-detail="ink"
          d="M91 69 C100 61 107 53 111 48 M102 59 L108 54"
          stroke="var(--plant-leaf-ink, #5c522d)" stroke-width="1.1"
          fill="none" stroke-linecap="round" opacity="0.5"/>
      </g>

      <g class="plant-leaf plant-leaf--turquoise plant-leaf--upper-left"
        data-part="leaf-turquoise-upper">
        <path class="plant-leaf-shape" data-silhouette="true"
          d="M85 63 C75 56 68 44 70 33 C82 37 90 48 88 61 Z"
          fill="var(--plant-leaf-turquoise, var(--diego-turquoise, #3f776f))"/>
        <path class="plant-vein" data-detail="ink"
          d="M84 59 C79 50 75 42 73 36"
          stroke="var(--plant-leaf-ink, #314943)" stroke-width="1.05"
          fill="none" stroke-linecap="round" opacity="0.48"/>
      </g>

      <g class="plant-leaf plant-leaf--green plant-leaf--crown"
        data-part="leaf-green-crown">
        <path class="plant-leaf-shape" data-silhouette="true"
          d="M87 48 C80 37 81 22 88 13 C96 24 96 39 89 49 Z"
          fill="var(--plant-leaf-green, var(--green-new, #657c45))"/>
        <path class="plant-vein" data-detail="ink"
          d="M88 44 C88 34 88 24 88 17 M88 30 L84 25 M88 36 L92 30"
          stroke="var(--plant-leaf-ink, #37412b)" stroke-width="1.05"
          fill="none" stroke-linecap="round" opacity="0.52"/>
      </g>
    </g>

    <g class="plant-character__flowers plant-flowers" data-layer="flowers"
      data-part="flowers" aria-hidden="true">
      <g class="plant-flower plant-flower--primary" data-part="flower-primary">
        <circle cx="87" cy="20" r="6.2" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="80.5" cy="24.5" r="5.8" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="83" cy="32" r="5.7" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="91" cy="32" r="5.7" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="94" cy="24.5" r="5.8" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="87" cy="26" r="4.8" fill="var(--plant-flower-center, #d99d29)"/>
      </g>
      <g class="plant-flower plant-flower--left" data-part="flower-left">
        <circle cx="58" cy="53" r="4.3" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="53.5" cy="57" r="4" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="58" cy="61" r="4" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="62.5" cy="57" r="4" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="58" cy="57" r="3.2" fill="var(--plant-flower-center, #d99d29)"/>
      </g>
      <g class="plant-flower plant-flower--right" data-part="flower-right">
        <circle cx="114" cy="45" r="4.3" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="109.5" cy="49" r="4" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="114" cy="53" r="4" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="118.5" cy="49" r="4" fill="var(--plant-flower-petal, #f1dfad)"/>
        <circle cx="114" cy="49" r="3.2" fill="var(--plant-flower-center, #3f776f)"/>
      </g>
    </g>
  </g>

  <g class="plant-character__face plant-face plant-state-face" data-layer="face"
    data-part="face" aria-hidden="true">
    <g class="plant-face__eyes plant-face__eyes--normal">
      <circle cx="78" cy="151" r="2.1" fill="var(--paper-light)"/>
      <circle cx="92" cy="151" r="2.1" fill="var(--paper-light)"/>
    </g>
    <g class="plant-face__eyes plant-face__eyes--dizzy">
      <path d="M75 148 L81 154 M81 148 L75 154
        M89 148 L95 154 M95 148 L89 154"
        stroke="var(--paper-light)" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <path class="plant-face__mouth plant-face__mouth--calm"
      d="M82 159 C84 160 86 160 88 159"
      stroke="var(--paper-light)" stroke-width="1.4" fill="none"
      stroke-linecap="round"/>
    <path class="plant-face__mouth plant-face__mouth--happy"
      d="M81 158 C84 163 88 163 91 158"
      stroke="var(--paper-light)" stroke-width="1.4" fill="none"
      stroke-linecap="round"/>
    <path class="plant-face__mouth plant-face__mouth--sad"
      d="M81 162 C84 157 88 157 91 162"
      stroke="var(--paper-light)" stroke-width="1.4" fill="none"
      stroke-linecap="round"/>
  </g>

  <g class="plant-character__stress plant-stress-details" data-part="state-details"
    aria-hidden="true">
    <g class="plant-heat-lines" data-part="heat-lines">
      <path d="M48 77 C42 70 51 64 46 56 M123 73 C117 65 127 59 122 50"
        stroke="var(--sun, #e6b748)" stroke-width="2" fill="none"
        stroke-linecap="round"/>
    </g>
    <g class="plant-smoke" data-part="smoke">
      <path d="M76 31 C68 22 82 18 75 8 M91 29 C84 19 99 16 93 6"
        stroke="var(--burnt, #39362b)" stroke-width="3" fill="none"
        stroke-linecap="round"/>
    </g>
    <g class="plant-fallen-leaf" data-part="fallen-leaf">
      <path d="M125 164 C136 158 146 162 149 172 C138 177 128 174 123 167 Z"
        fill="var(--plant-leaf-ochre, var(--dani-yellow, #d99d29))"/>
      <path d="M126 166 C134 167 141 169 146 171"
        stroke="var(--plant-leaf-ink, #5c522d)" stroke-width="1.1"
        fill="none" stroke-linecap="round"/>
    </g>
    <path class="plant-recovery-mark" data-part="recovery-mark"
      d="M106 43 C116 36 126 40 130 49"
      stroke="var(--paper-light)" stroke-width="1.4"
      fill="none" stroke-linecap="round" opacity="0.72"/>
  </g>
</svg>`;
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
  element: SVGSVGElement,
  state: PlantState,
  ariaLabel?: string
): void {
  const profile = getPlantStateProfile(state);

  for (const stateClass of Object.values(PLANT_STATE_CLASSES)) {
    element.classList.remove(stateClass);
  }

  for (const plantState of PLANT_STATES) {
    element.classList.remove(`plant--${plantState}`);
  }

  element.classList.add(PLANT_STATE_CLASSES[state], `plant--${state}`);
  element.dataset.plantState = state;
  element.dataset.growthStage = profile.growthStage;
  element.dataset.condition = profile.condition;

  if (element.getAttribute("aria-hidden") !== "true") {
    element.setAttribute("aria-label", ariaLabel ?? profile.label);
  }
}
