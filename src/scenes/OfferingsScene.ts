import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { pickLine } from "../app/speech";
import { setSceneVisualState } from "../app/visualState";
import { createBotanicalShadows } from "../art/BotanicalShadows";
import { renderDani } from "../art/characters/DaniCharacter";
import { renderDiego } from "../art/characters/DiegoCharacter";
import {
  renderSeed,
  setInteractiveObjectState,
  type InteractiveObjectState,
} from "../art/objects/InteractiveObjects";
import { renderPlantCharacter } from "../art/PlantCharacter";
import { leafButtonSVG } from "../art/svgLibrary";
import { pixelPlaceholder } from "../art/pixel/engine";
import { LivingPlant } from "../art/pixel/LivingPlant";
import { DraggableOffering } from "../interactions/DraggableOffering";

type OfferingPhase =
  | "prepare"
  | "choose"
  | "water"
  | "water-feedback"
  | "seed"
  | "seed-feedback"
  | "complete";

export class OfferingsScene implements Scene {
  readonly id = "offerings" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private phase: OfferingPhase = "water";
  private timers: number[] = [];
  private seedDrag: DraggableOffering | null = null;
  private cloudCleanup: (() => void) | null = null;
  private living: LivingPlant | null = null;
  private drizzleTimer: number | null = null;

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
    this.phase = "water";
    const c = content.offerings;
    const el = document.createElement("section");
    el.className = "scene scene--offerings";
    el.setAttribute("aria-label", `${c.number}. ${c.heading}`);
    el.innerHTML = `
      <header class="scene-head">
        <p class="scene-number" aria-hidden="true">${c.number}</p>
        <h2 class="scene-heading">${c.heading}</h2>
        <p class="scene-lede">${c.lede}</p>
      </header>
      <div class="scene-body">
        <div class="offer-stage">
          <div class="offer-dani" aria-hidden="true">
            ${renderDani({
              state: "watering",
              angle: "three-quarter-right",
              facing: "right",
              reducedMotion: ctx.reducedMotion(),
            })}
            <p class="thought thought--dani" lang="pt">${c.catThought}</p>
          </div>
          <div class="offer-plant">
            <div class="offer-halo" aria-hidden="true"></div>
            <div class="water-drop" aria-hidden="true"></div>
            <div class="offer-plant-art plant-wrap" aria-hidden="true">${renderPlantCharacter({
              state: "seed",
              className: "plant-context--empty",
              decorative: true,
            })}</div>
            <button class="soil-stone soil-stone--1" type="button" aria-label="${c.stoneLabel}" hidden>
              ${pixelPlaceholder("stone", "idle", { decorative: true })}
            </button>
            <button class="soil-stone soil-stone--2" type="button" aria-label="${c.stoneLabel}" hidden>
              ${pixelPlaceholder("stone", "idle", { decorative: true })}
            </button>
            <button class="soil-stone soil-stone--3" type="button" aria-label="${c.stoneLabel}" hidden>
              ${pixelPlaceholder("stone", "idle", { decorative: true })}
            </button>
          </div>
          <div class="seed-tray" role="group" aria-label="${c.trayLabel}" hidden>
            <button class="tray-item tray-item--stone" type="button" aria-label="${c.stoneObjectLabel}">
              ${pixelPlaceholder("stone", "idle", { decorative: true })}
            </button>
            <button class="tray-item tray-item--seed" type="button" aria-label="${c.seedObjectLabel}">
              ${pixelPlaceholder("seed", "idle", { decorative: true })}
            </button>
            <button class="tray-item tray-item--button" type="button" aria-label="${c.buttonObjectLabel}">
              ${pixelPlaceholder("button", "idle", { decorative: true })}
            </button>
          </div>
          <div class="quip-bubble quip-bubble--offer" aria-hidden="true"></div>
          <div class="offer-diego" aria-hidden="true">
            ${renderDiego({
              state: "watching",
              angle: "three-quarter-left",
              facing: "left",
              reducedMotion: ctx.reducedMotion(),
            })}
            <p class="thought thought--diego">${c.akitaThought}</p>
          </div>
          <button class="offer-cloud" type="button" aria-label="${c.waterLabel}" hidden>
            ${pixelPlaceholder("cloud", "idle", { decorative: true, className: "offer-cloud-art" })}
            <span class="cloud-meter" aria-hidden="true"><i></i><i></i><i></i></span>
          </button>
          <div class="offer-rain" aria-hidden="true"></div>
          <div class="offer-drizzle" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          ${renderSeed({
            state: "disabled",
            label: c.seedLabel,
            className: "offer-drag offer-drag--seed",
          })}
        </div>
        <div class="scene-after" hidden>
          <p class="after-main">${c.afterMain}</p>
          ${c.afterNotes.map((note) => `<p class="editorial">${note}</p>`).join("")}
          <button class="btn-leaf" type="button">${leafButtonSVG()}<span>${c.next}</span></button>
        </div>
      </div>
      <footer class="scene-foot">
        <p class="scene-instruction">${c.waterInstruction}</p>
      </footer>
    `;
    el.prepend(createBotanicalShadows("shadow-layer--edges"));
    this.el = el;

    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("care");
    });

    if (ctx.state.waterPlaced && ctx.state.seedPlaced) {
      this.restoreComplete();
    } else if (ctx.state.seedPlaced) {
      // la semilla ya está: retomamos en la lluvia
      el.classList.add("seed-done");
      this.setObjectState(".offer-drag--seed", "completed");
      el.querySelector<HTMLCanvasElement>(
        '.offer-plant canvas[data-character="plant"]'
      )?.classList.remove("plant-context--empty");
      this.activateWater(false);
    } else {
      this.startPrepare();
    }
    return el;
  }

  /** Paso 1 del ritual: la tierra trae piedritas; se retiran a mano. */
  private startPrepare(): void {
    if (!this.el) return;
    this.phase = "prepare";
    const c = content.offerings;
    this.setVisualState("curious", "watching", "seed", c.prepareInstruction, true, false);
    const stones = Array.from(
      this.el.querySelectorAll<HTMLButtonElement>(".soil-stone")
    );
    let removed = 0;
    stones.forEach((stone) => {
      stone.hidden = false;
      const onTap = (): void => {
        if (stone.disabled) return;
        stone.disabled = true;
        removed += 1;
        this.ctx.onFirstInteraction();
        this.ctx.audio.woodTap();
        stone.classList.add("is-flicked");
        this.timers.push(window.setTimeout(() => (stone.hidden = true), 480));
        if (removed === 1) {
          this.showOfferQuip(pickLine(c.potPrepLines));
        }
        if (removed === stones.length) {
          this.ctx.announce(c.prepareDone);
          const delay = this.ctx.reducedMotion() ? 120 : 620;
          this.timers.push(window.setTimeout(() => this.startChoose(), delay));
        }
      };
      stone.addEventListener("click", onTap);
    });
  }

  /** Paso 2: entre los candidatos, solo una es semilla de verdad. */
  private startChoose(): void {
    if (!this.el) return;
    this.phase = "choose";
    const c = content.offerings;
    this.setVisualState("watching", "planting", "seed", c.chooseInstruction, true, false);
    const tray = this.el.querySelector<HTMLElement>(".seed-tray")!;
    tray.hidden = false;

    const wrong = (button: HTMLButtonElement, lines: readonly string[]): void => {
      this.ctx.audio.woodTap();
      this.ctx.state.memory.wrongSeeds += 1;
      this.ctx.save();
      button.classList.remove("is-rejected");
      void button.offsetWidth;
      button.classList.add("is-rejected");
      this.showOfferQuip(pickLine(lines));
    };

    const stoneBtn = tray.querySelector<HTMLButtonElement>(".tray-item--stone")!;
    const buttonBtn = tray.querySelector<HTMLButtonElement>(".tray-item--button")!;
    const seedBtn = tray.querySelector<HTMLButtonElement>(".tray-item--seed")!;
    stoneBtn.addEventListener("click", () => wrong(stoneBtn, c.stoneTryLines));
    buttonBtn.addEventListener("click", () => wrong(buttonBtn, c.buttonTryLines));
    seedBtn.addEventListener(
      "click",
      () => {
        this.ctx.audio.sprout();
        this.showOfferQuip(pickLine(c.seedFoundLines));
        seedBtn.classList.add("is-chosen");
        const delay = this.ctx.reducedMotion() ? 160 : 700;
        this.timers.push(
          window.setTimeout(() => {
            tray.hidden = true;
            this.activateSeed(true);
          }, delay)
        );
      },
      { once: true }
    );
  }

  /** Burbuja de habla del ritual (macetero, piedra, botón, semilla). */
  private showOfferQuip(line: string): void {
    const bubble = this.el?.querySelector<HTMLElement>(".quip-bubble--offer");
    if (!bubble || !line) return;
    bubble.textContent = line;
    bubble.classList.remove("is-visible");
    void bubble.offsetWidth;
    bubble.classList.add("is-visible");
    this.timers.push(
      window.setTimeout(() => bubble.classList.remove("is-visible"), 2400)
    );
  }

  private stageParts(): {
    stage: HTMLElement;
    plant: HTMLElement;
    seed: HTMLElement;
  } | null {
    if (!this.el) return null;
    return {
      stage: this.el.querySelector<HTMLElement>(".offer-stage")!,
      plant: this.el.querySelector<HTMLElement>(".offer-plant")!,
      seed: this.el.querySelector<HTMLElement>(".offer-drag--seed")!,
    };
  }

  private hideCloud(): void {
    const cloud = this.el?.querySelector<HTMLElement>(".offer-cloud");
    if (cloud) cloud.hidden = true;
  }

  private activateWater(focus: boolean): void {
    if (!this.el) return;
    this.phase = "water";
    this.setVisualState(
      "watering",
      "proud",
      "seed",
      content.offerings.waterInstruction,
      true,
      false
    );
    const cloud = this.el.querySelector<HTMLButtonElement>(".offer-cloud")!;
    cloud.hidden = false;
    let squeezes = 0;
    const rainOnce = (): void => {
      if (this.phase !== "water") return;
      squeezes += 1;
      cloud.dataset.squeezes = String(squeezes);
      cloud.classList.remove("is-squeezing");
      void cloud.offsetWidth;
      cloud.classList.add("is-squeezing");
      this.spawnRain();
      this.pulseDrizzle();
      this.ctx.onFirstInteraction();
      this.ctx.audio.drop();
      // la planta agradece cada chorrito
      if (squeezes >= 3) this.placeWater();
    };
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      rainOnce();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        rainOnce();
      }
    };
    cloud.addEventListener("pointerdown", onDown);
    cloud.addEventListener("keydown", onKey);
    this.cloudCleanup = () => {
      cloud.removeEventListener("pointerdown", onDown);
      cloud.removeEventListener("keydown", onKey);
    };
    if (focus) cloud.focus({ preventScroll: true });
  }

  /** Llovizna breve por todo el escenario mientras la nube trabaja. */
  private pulseDrizzle(): void {
    const stage = this.el?.querySelector<HTMLElement>(".offer-stage");
    if (!stage || this.ctx.reducedMotion()) return;
    stage.classList.add("is-raining");
    if (this.drizzleTimer !== null) window.clearTimeout(this.drizzleTimer);
    this.drizzleTimer = window.setTimeout(() => {
      stage.classList.remove("is-raining");
      this.drizzleTimer = null;
    }, 950);
  }

  /** La gota que permanece en el borde de la maceta tras la lluvia. */
  private leaveLingeringDrop(): void {
    const plantEl = this.el?.querySelector<HTMLElement>(".offer-plant");
    if (!plantEl || plantEl.querySelector(".lingering-drop")) return;
    const drop = document.createElement("i");
    drop.className = "lingering-drop";
    drop.setAttribute("aria-hidden", "true");
    plantEl.appendChild(drop);
  }

  private spawnRain(): void {
    const rain = this.el?.querySelector<HTMLElement>(".offer-rain");
    if (!rain || this.ctx.reducedMotion()) return;
    for (let i = 0; i < 4; i++) {
      const drop = document.createElement("i");
      drop.style.setProperty("--rx", `${(Math.random() * 60 - 30).toFixed(0)}px`);
      drop.style.setProperty("--rd", `${(120 + Math.random() * 80).toFixed(0)}ms`);
      rain.appendChild(drop);
      drop.addEventListener("animationend", () => drop.remove(), { once: true });
      window.setTimeout(() => drop.isConnected && drop.remove(), 900);
    }
  }

  private placeWater(): void {
    if (!this.el || this.phase !== "water") return;
    this.phase = "water-feedback";
    this.ctx.onFirstInteraction();
    this.cloudCleanup?.();
    this.cloudCleanup = null;
    this.hideCloud();
    this.el.classList.add("water-done", "water-feedback");
    this.setVisualState("happy", "proud", "seed", "", false, false);
    this.ctx.audio.drop();
    this.ctx.announce(content.offerings.waterAnnouncement);
    this.showThought(".thought--dani");
    this.leaveLingeringDrop();

    if (!this.ctx.state.waterPlaced) {
      this.ctx.state.waterPlaced = true;
      this.ctx.save();
    }

    // la lluvia sobre la semilla despierta el brote
    const delay = this.ctx.reducedMotion() ? 60 : 460;
    this.timers.push(window.setTimeout(() => this.growPlant(true), delay));
  }

  private activateSeed(focus: boolean): void {
    const parts = this.stageParts();
    if (!parts) return;
    this.phase = "seed";
    this.setVisualState(
      "watching",
      "planting",
      "seed",
      content.offerings.seedInstruction,
      true,
      false
    );
    this.setObjectState(".offer-drag--seed", "idle");
    parts.seed.tabIndex = 0;
    parts.seed.removeAttribute("aria-hidden");

    this.seedDrag?.destroy();
    this.seedDrag = new DraggableOffering({
      el: parts.seed,
      target: parts.plant,
      surface: parts.stage,
      magnetRadius: 130,
      onNear: (near) => this.setObjectState(".offer-drag--seed", near ? "active" : "idle"),
      onPlaced: () => this.placeSeed(),
    });
    if (focus) parts.seed.focus({ preventScroll: true });
  }

  private placeSeed(): void {
    if (!this.el || this.phase !== "seed") return;
    this.phase = "seed-feedback";
    this.setObjectState(".offer-drag--seed", "completed");
    this.hideInstruction();
    this.el.classList.add("seed-done", "seed-feedback");
    this.el
      .querySelector<HTMLCanvasElement>(".offer-plant canvas[data-character=\"plant\"]")
      ?.classList.remove("plant-context--empty");
    this.setVisualState("curious", "proud", "seed", "", false, false);
    this.ctx.audio.woodTap();
    this.ctx.announce(content.offerings.seedAnnouncement);
    this.showThought(".thought--diego");

    if (!this.ctx.state.seedPlaced) {
      this.ctx.state.seedPlaced = true;
      this.ctx.save();
    }

    // consecuencia visible primero; después llega la nube de Dani
    const delay = this.ctx.reducedMotion() ? 60 : 620;
    this.timers.push(window.setTimeout(() => this.activateWater(true), delay));
  }

  private growPlant(announce: boolean): void {
    if (!this.el || this.phase === "complete") return;
    this.phase = "complete";
    this.hideInstruction();
    // la gota persistente se absorbe justo cuando nace el brote
    this.el
      .querySelector<HTMLElement>(".lingering-drop")
      ?.classList.add("is-absorbed");
    this.el.classList.add("seed-done", "sprout-born");
    this.setVisualState("happy", "proud", "sprout", "", false, true);

    if (announce) {
      this.ctx.audio.sprout();
      this.ctx.announce(content.offerings.sproutAnnouncement);
    }

    this.startLivingPlant();
    const delay = this.ctx.reducedMotion() ? 80 : 320;
    this.timers.push(window.setTimeout(() => this.showAfter(true), delay));
  }

  private restoreComplete(): void {
    if (!this.el) return;
    this.phase = "complete";
    this.el.classList.add("water-done", "seed-done", "sprout-born", "is-restored");
    this.hideCloud();
    this.setObjectState(".offer-drag--seed", "completed");
    this.el
      .querySelector<HTMLCanvasElement>(".offer-plant canvas[data-character=\"plant\"]")
      ?.classList.remove("plant-context--empty");
    this.setVisualState("happy", "proud", "sprout", "", false, true);
    this.hideInstruction();
    this.startLivingPlant();
    this.showAfter(false);
  }

  private startLivingPlant(): void {
    if (this.living || !this.el) return;
    const canvas = this.el.querySelector<HTMLElement>(
      '.offer-plant canvas[data-character="plant"]'
    );
    const container = this.el.querySelector<HTMLElement>(".offer-plant");
    if (!canvas || !container) return;
    this.living = new LivingPlant({
      plant: canvas,
      container,
      reducedMotion: this.ctx.reducedMotion(),
    });
    this.living.start();
  }

  private hideInstruction(): void {
    const foot = this.el?.querySelector<HTMLElement>(".scene-foot");
    if (!foot) return;
    foot.classList.add("is-hidden");
    foot.inert = true;
    foot.setAttribute("aria-hidden", "true");
  }

  private setVisualState(
    daniState: "watering" | "watching" | "happy" | "curious",
    diegoState: "watching" | "planting" | "proud",
    plantState: "seed" | "sprout",
    instruction: string,
    interactionEnabled: boolean,
    completed: boolean
  ): void {
    if (!this.el) return;
    setSceneVisualState(this.el, {
      daniState,
      diegoState,
      plantState,
      instruction,
      interactionEnabled,
      completed,
    });
  }

  private setObjectState(
    selector: string,
    state: InteractiveObjectState
  ): void {
    const object = this.el?.querySelector<HTMLElement>(selector);
    if (object) setInteractiveObjectState(object, state);
  }

  private showThought(selector: string): void {
    const thought = this.el?.querySelector<HTMLElement>(selector);
    if (!thought) return;
    thought.classList.add("is-visible");
    this.timers.push(
      window.setTimeout(() => thought.classList.remove("is-visible"), 2000)
    );
  }

  private showAfter(focus: boolean): void {
    if (!this.el) return;
    const after = this.el.querySelector<HTMLElement>(".scene-after")!;
    after.hidden = false;
    after.classList.add("is-visible");
    if (focus) {
      after
        .querySelector<HTMLButtonElement>(".btn-leaf")
        ?.focus({ preventScroll: true });
    }
  }

  destroy(): void {
    if (this.drizzleTimer !== null) window.clearTimeout(this.drizzleTimer);
    this.drizzleTimer = null;
    this.cloudCleanup?.();
    this.cloudCleanup = null;
    this.living?.destroy();
    this.living = null;
    this.seedDrag?.destroy();
    this.seedDrag = null;
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers = [];
    this.el = null;
  }
}
