import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/characters.css";
import "../styles/plant.css";
import "../styles/objects.css";
import "../styles/shadows.css";
import "./art-reference.css";

import {
  CHARACTER_ANGLES,
  type CharacterAngle,
  type CharacterFacing,
} from "../art/characters/CharacterTypes";
import {
  DANI_STATES,
  renderDani,
} from "../art/characters/DaniCharacter";
import {
  DIEGO_STATES,
  renderDiego,
} from "../art/characters/DiegoCharacter";
import {
  PLANT_STATES,
  getPlantStateProfile,
  renderPlantCharacter,
} from "../art/PlantCharacter";
import {
  INTERACTIVE_OBJECT_KINDS,
  INTERACTIVE_OBJECT_STATES,
  renderInteractiveObject,
} from "../art/objects/InteractiveObjects";
import {
  renderShadowSystem,
  type ShadowSystemOptions,
} from "../art/ShadowSystem";

const artDirectionReference = new URL(
  "../../references/folhas-art-direction.png",
  import.meta.url
).href;
const characterGuideReference = new URL(
  "../../references/folhas-character-guide.png",
  import.meta.url
).href;

const COLOR_TOKENS = [
  "--paper",
  "--paper-light",
  "--paper-shadow",
  "--ink",
  "--ink-soft",
  "--night",
  "--night-deep",
  "--dani-yellow",
  "--dani-light",
  "--dani-shadow",
  "--diego-turquoise",
  "--diego-light",
  "--diego-shadow",
  "--leaf-dry",
  "--leaf-dark",
  "--sage",
  "--green-moss",
  "--green-new",
  "--rain",
  "--sun",
  "--burnt",
  "--soil-dry",
  "--soil-wet",
  "--terracotta",
] as const;

const SYSTEM_TOKENS = [
  "--font-display",
  "--font-interface",
  "--dur-micro",
  "--dur-object",
  "--dur-page",
  "--hit-target",
  "--hit-target-hero",
] as const;

const LABELS: Readonly<Record<string, string>> = {
  front: "frontal",
  "three-quarter-left": "tres cuartos izquierda",
  "three-quarter-right": "tres cuartos derecha",
  profile: "perfil",
  back: "espalda",
  idle: "reposo",
  curious: "curiosa",
  happy: "alegre",
  surprised: "sorprendida",
  worried: "preocupada",
  proud: "orgullosa",
  sleeping: "durmiendo",
  watering: "regando",
  watching: "observando",
  reactingToRain: "reacción a lluvia",
  reactingToWind: "reacción a viento",
  reactingToHeat: "reacción a calor",
  focused: "concentrado",
  concerned: "preocupado",
  protecting: "protegiendo",
  planting: "plantando",
  recoveringGlasses: "recuperando lentes",
  seed: "semilla",
  sprout: "brote",
  small: "pequeña",
  hydrated: "hidratada",
  growing: "creciendo",
  healthy: "sana",
  drowned: "inundada",
  windBent: "doblada por viento",
  fallen: "caída",
  overheated: "acalorada",
  burnt: "quemada",
  flowering: "florecida",
  thimble: "dedal",
  "watering-cup": "regadera",
  drop: "gota",
  sun: "sol",
  umbrella: "paraguas",
  "dry-leaves": "hojas secas",
  wind: "viento",
  hovered: "hover / foco",
  active: "activo",
  completed: "completado",
  disabled: "deshabilitado",
};

function labelFor(value: string): string {
  return (
    LABELS[value] ??
    value
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replaceAll("-", " ")
      .toLowerCase()
  );
}

function facingForAngle(angle: CharacterAngle): CharacterFacing {
  if (angle === "three-quarter-left") return "left";
  if (angle === "three-quarter-right" || angle === "profile") return "right";
  return "front";
}

function specimenCard(
  label: string,
  art: string,
  className = ""
): string {
  return `
    <figure class="art-ref-card ${className}">
      <div class="art-ref-card__canvas">${art}</div>
      <figcaption>${label}</figcaption>
    </figure>`;
}

function renderReferenceSection(): string {
  return `
    <section class="art-ref-section" aria-labelledby="references-title">
      <div class="art-ref-section__head">
        <p class="art-ref-kicker">consulta visual</p>
        <h2 id="references-title">Láminas de referencia</h2>
        <p>Se muestran únicamente para comparar. No forman parte del arte de producción.</p>
      </div>
      <div class="art-ref-reference-grid">
        <figure class="art-ref-reference">
          <a href="${artDirectionReference}" target="_blank" rel="noreferrer">
            <img src="${artDirectionReference}" alt="Lámina completa de dirección artística de Folhas" />
          </a>
          <figcaption>Dirección artística · abrir a tamaño completo</figcaption>
        </figure>
        <figure class="art-ref-reference">
          <a href="${characterGuideReference}" target="_blank" rel="noreferrer">
            <img src="${characterGuideReference}" alt="Guía completa de personajes, estados y escenas de Folhas" />
          </a>
          <figcaption>Guía de personajes · abrir a tamaño completo</figcaption>
        </figure>
      </div>
    </section>`;
}

function renderTokenSection(): string {
  return `
    <section class="art-ref-section" aria-labelledby="tokens-title">
      <div class="art-ref-section__head">
        <p class="art-ref-kicker">sistema</p>
        <h2 id="tokens-title">Paleta y tokens</h2>
        <p>Valores computados desde <code>tokens.css</code>, no muestras duplicadas.</p>
      </div>
      <div class="art-ref-token-grid" role="list" aria-label="Paleta de color">
        ${COLOR_TOKENS.map(
          (token) => `
            <article class="art-ref-token" role="listitem" data-token="${token}">
              <span class="art-ref-token__swatch" style="background:var(${token})" aria-hidden="true"></span>
              <code>${token}</code>
              <span class="art-ref-token__value">—</span>
            </article>`
        ).join("")}
      </div>
      <dl class="art-ref-system-tokens">
        ${SYSTEM_TOKENS.map(
          (token) => `
            <div data-token="${token}">
              <dt><code>${token}</code></dt>
              <dd class="art-ref-token__value">—</dd>
            </div>`
        ).join("")}
      </dl>
    </section>`;
}

function renderCharacterAngles(): string {
  const daniAngles = CHARACTER_ANGLES.map((angle) =>
    specimenCard(
      labelFor(angle),
      renderDani({
        state: "idle",
        angle,
        facing: facingForAngle(angle),
        size: "medium",
      }),
      "art-ref-card--character"
    )
  ).join("");
  const diegoAngles = CHARACTER_ANGLES.map((angle) =>
    specimenCard(
      labelFor(angle),
      renderDiego({
        state: "idle",
        angle,
        facing: facingForAngle(angle),
        size: "medium",
      }),
      "art-ref-card--character"
    )
  ).join("");

  return `
    <section class="art-ref-section" aria-labelledby="angles-title">
      <div class="art-ref-section__head">
        <p class="art-ref-kicker">hoja de modelo</p>
        <h2 id="angles-title">Cinco ángulos</h2>
        <p>Cada vista usa geometría propia; no se refleja el SVG completo.</p>
      </div>
      <article class="art-ref-subsection" aria-labelledby="dani-angles-title">
        <h3 id="dani-angles-title">Dani</h3>
        <div class="art-ref-grid art-ref-grid--angles">${daniAngles}</div>
      </article>
      <article class="art-ref-subsection" aria-labelledby="diego-angles-title">
        <h3 id="diego-angles-title">Diego</h3>
        <div class="art-ref-grid art-ref-grid--angles">${diegoAngles}</div>
      </article>
    </section>`;
}

function renderCharacterStates(): string {
  const daniStates = DANI_STATES.map((state) =>
    specimenCard(
      labelFor(state),
      renderDani({ state, angle: "front", size: "medium" }),
      "art-ref-card--character"
    )
  ).join("");
  const diegoStates = DIEGO_STATES.map((state) =>
    specimenCard(
      labelFor(state),
      renderDiego({ state, angle: "front", size: "medium" }),
      "art-ref-card--character"
    )
  ).join("");

  return `
    <section class="art-ref-section" aria-labelledby="character-states-title">
      <div class="art-ref-section__head">
        <p class="art-ref-kicker">expresión</p>
        <h2 id="character-states-title">Estados de Dani y Diego</h2>
        <p>Inventario canónico completo exportado por cada personaje.</p>
      </div>
      <article class="art-ref-subsection" aria-labelledby="dani-states-title">
        <h3 id="dani-states-title">Dani · ${DANI_STATES.length} estados</h3>
        <div class="art-ref-grid art-ref-grid--states">${daniStates}</div>
      </article>
      <article class="art-ref-subsection" aria-labelledby="diego-states-title">
        <h3 id="diego-states-title">Diego · ${DIEGO_STATES.length} estados</h3>
        <div class="art-ref-grid art-ref-grid--states">${diegoStates}</div>
      </article>
    </section>`;
}

function renderCharacterSizes(): string {
  return `
    <section class="art-ref-section" aria-labelledby="sizes-title">
      <div class="art-ref-section__head">
        <p class="art-ref-kicker">escala</p>
        <h2 id="sizes-title">Tamaño pequeño y grande</h2>
        <p>Comprobación de silueta, rostro y lentes en los extremos previstos.</p>
      </div>
      <div class="art-ref-grid art-ref-grid--sizes">
        ${specimenCard(
          "Dani · pequeña",
          renderDani({ state: "curious", size: "small" }),
          "art-ref-card--size"
        )}
        ${specimenCard(
          "Dani · grande",
          renderDani({ state: "curious", size: "large" }),
          "art-ref-card--size"
        )}
        ${specimenCard(
          "Diego · pequeño",
          renderDiego({ state: "focused", size: "small" }),
          "art-ref-card--size"
        )}
        ${specimenCard(
          "Diego · grande",
          renderDiego({ state: "focused", size: "large" }),
          "art-ref-card--size"
        )}
      </div>
    </section>`;
}

function renderPlantStates(): string {
  const states = PLANT_STATES.map((state) => {
    const profile = getPlantStateProfile(state);
    return `
      <figure class="art-ref-card art-ref-card--plant">
        <div class="art-ref-card__canvas">
          ${renderPlantCharacter({ state, decorative: true })}
        </div>
        <figcaption>
          <strong>${labelFor(state)}</strong>
          <span>${profile.label}</span>
        </figcaption>
      </figure>`;
  }).join("");

  return `
    <section class="art-ref-section" aria-labelledby="plant-title">
      <div class="art-ref-section__head">
        <p class="art-ref-kicker">continuidad</p>
        <h2 id="plant-title">PlantCharacter · ${PLANT_STATES.length} estados</h2>
        <p>Una sola anatomía SVG desde la semilla hasta la floración y los excesos.</p>
      </div>
      <div class="art-ref-grid art-ref-grid--plants">${states}</div>
    </section>`;
}

function renderObjectStates(): string {
  const objectGroups = INTERACTIVE_OBJECT_KINDS.map((kind) => `
    <article class="art-ref-object-group" aria-labelledby="object-${kind}-title">
      <h3 id="object-${kind}-title">${labelFor(kind)}</h3>
      <div class="art-ref-object-states">
        ${INTERACTIVE_OBJECT_STATES.map((state) =>
          specimenCard(
            labelFor(state),
            renderInteractiveObject(kind, {
              state,
              interactive: false,
              label: `${labelFor(kind)}, estado ${labelFor(state)}`,
            }),
            "art-ref-card--object"
          )
        ).join("")}
      </div>
    </article>`).join("");

  return `
    <section class="art-ref-section" aria-labelledby="objects-title">
      <div class="art-ref-section__head">
        <p class="art-ref-kicker">microinteracción</p>
        <h2 id="objects-title">Ocho objetos y cinco estados</h2>
        <p>Los wrappers conservan <code>data-state</code> y un hitbox mínimo de 44 px.</p>
      </div>
      <div class="art-ref-object-groups">${objectGroups}</div>
    </section>`;
}

interface ShadowVariant {
  key: string;
  label: string;
  description: string;
  options: ShadowSystemOptions;
}

function renderShadowVariants(): string {
  const variants: readonly ShadowVariant[] = [
    {
      key: "left",
      label: "Luz desde la izquierda",
      description: "Proyección larga, cálida y oblicua.",
      options: {
        x: 18,
        y: 16,
        intensity: 0.56,
        length: 1.28,
        angle: 11,
        progress: 0.2,
      },
    },
    {
      key: "right",
      label: "Luz desde la derecha",
      description: "La dirección cambia sin alterar las siluetas.",
      options: {
        x: 82,
        y: 22,
        intensity: 0.68,
        length: 1.12,
        angle: -12,
        progress: 0.45,
      },
    },
    {
      key: "progress",
      label: "Cuidado en progreso",
      description: "Objetos y personajes se acercan a la planta.",
      options: {
        x: 52,
        y: 15,
        intensity: 0.76,
        length: 0.92,
        angle: 1,
        progress: 1,
        shelter: 0.38,
      },
    },
    {
      key: "final",
      label: "Refugio final",
      description: "Las sombras forman una copa protectora, no un corazón literal.",
      options: {
        mode: "final",
        x: 50,
        y: 12,
        intensity: 0.82,
        length: 0.9,
        angle: 0,
        progress: 1,
        shelter: 1,
      },
    },
  ];

  return `
    <section class="art-ref-section" aria-labelledby="shadows-title">
      <div class="art-ref-section__head">
        <p class="art-ref-kicker">profundidad</p>
        <h2 id="shadows-title">ShadowSystem</h2>
        <p>Seis capas respondiendo a posición, intensidad, longitud, ángulo y progreso.</p>
      </div>
      <div class="art-ref-shadow-grid">
        ${variants.map(
          (variant) => `
            <figure class="art-ref-shadow art-ref-shadow--${variant.key}">
              <div class="art-ref-shadow__stage">
                ${renderShadowSystem(variant.options)}
                <span class="art-ref-shadow__anchor" aria-hidden="true"></span>
              </div>
              <figcaption>
                <strong>${variant.label}</strong>
                <span>${variant.description}</span>
              </figcaption>
            </figure>`
        ).join("")}
      </div>
    </section>`;
}

function hydrateComputedTokens(root: HTMLElement): void {
  const styles = getComputedStyle(document.documentElement);
  root.querySelectorAll<HTMLElement>("[data-token]").forEach((item) => {
    const token = item.dataset.token;
    const valueNode = item.querySelector<HTMLElement>(".art-ref-token__value");
    if (!token || !valueNode) return;
    valueNode.textContent = styles.getPropertyValue(token).trim() || "sin definir";
  });
}

const root = document.querySelector<HTMLElement>("#art-reference-root");

if (root) {
  root.innerHTML = `
    <main id="art-reference-main" class="art-reference">
      <header class="art-ref-hero">
        <div>
          <p class="art-ref-kicker">herramienta interna · sólo desarrollo</p>
          <h1>Referencia de arte</h1>
          <p class="art-ref-hero__lede">
            Comparación de las fuentes visuales canónicas de Folhas. Esta página no está
            enlazada desde la experiencia principal.
          </p>
        </div>
        <dl class="art-ref-summary" aria-label="Contenido del inventario">
          <div><dt>Ángulos</dt><dd>${CHARACTER_ANGLES.length} por personaje</dd></div>
          <div><dt>Estados</dt><dd>${DANI_STATES.length} Dani · ${DIEGO_STATES.length} Diego</dd></div>
          <div><dt>Planta</dt><dd>${PLANT_STATES.length} estados</dd></div>
          <div><dt>Objetos</dt><dd>${INTERACTIVE_OBJECT_KINDS.length} × ${INTERACTIVE_OBJECT_STATES.length}</dd></div>
        </dl>
      </header>
      ${renderReferenceSection()}
      ${renderTokenSection()}
      ${renderCharacterAngles()}
      ${renderCharacterStates()}
      ${renderCharacterSizes()}
      ${renderPlantStates()}
      ${renderObjectStates()}
      ${renderShadowVariants()}
      <footer class="art-ref-footer">
        <p>Entrada interna: <code>/dev/art-reference/</code></p>
      </footer>
    </main>`;
  hydrateComputedTokens(root);
}
