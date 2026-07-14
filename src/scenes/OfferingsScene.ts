import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { setSceneVisualState } from "../app/visualState";
import { createBotanicalShadows } from "../art/BotanicalShadows";
import { renderDani } from "../art/characters/DaniCharacter";
import { renderDiego } from "../art/characters/DiegoCharacter";
import {
  renderSeed,
  renderThimble,
  setInteractiveObjectState,
  type InteractiveObjectState,
} from "../art/objects/InteractiveObjects";
import { renderPlantCharacter } from "../art/PlantCharacter";
import { leafButtonSVG } from "../art/svgLibrary";

type OfferingPhase =
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
            <p class="thought thought--dani">${c.catThought}</p>
          </div>
          <div class="offer-plant" aria-hidden="true">
            <div class="water-drop"></div>
            <div class="offer-plant-art plant-wrap">${renderPlantCharacter({
              state: "seed",
              className: "plant-context--empty",
              decorative: true,
            })}</div>
          </div>
          <div class="offer-diego" aria-hidden="true">
            ${renderDiego({
              state: "watching",
              angle: "three-quarter-left",
              facing: "left",
              reducedMotion: ctx.reducedMotion(),
            })}
            <p class="thought thought--diego">${c.akitaThought}</p>
          </div>
          ${renderThimble({
            label: c.waterLabel,
            className: "scene-action offering-action offering-action--water",
          })}
          ${renderSeed({
            state: "disabled",
            label: c.seedLabel,
            className: "scene-action offering-action offering-action--seed",
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

    el.querySelector<HTMLButtonElement>(".offering-action--water")!.addEventListener(
      "click",
      () => this.placeWater()
    );
    el.querySelector<HTMLButtonElement>(".offering-action--seed")!.addEventListener(
      "click",
      () => this.placeSeed()
    );
    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("care");
    });

    if (ctx.state.waterPlaced && ctx.state.seedPlaced) {
      this.restoreComplete();
    } else if (ctx.state.waterPlaced) {
      el.classList.add("water-done");
      this.activateSeed(false);
    } else {
      this.activateWater();
    }
    return el;
  }

  private activateWater(): void {
    if (!this.el) return;
    this.phase = "water";
    this.setVisualState(
      "watering",
      "watching",
      "seed",
      content.offerings.waterInstruction,
      true,
      false
    );
    this.setActionAvailable(".offering-action--water", true);
    this.setActionAvailable(".offering-action--seed", false);
  }

  private placeWater(): void {
    if (!this.el || this.phase !== "water") return;
    this.phase = "water-feedback";
    this.ctx.onFirstInteraction();
    this.setActionAvailable(".offering-action--water", false);
    this.setObjectState(".offering-action--water", "completed");
    this.el.querySelector<HTMLButtonElement>(".offering-action--water")!.disabled = true;
    this.el.classList.add("water-done", "water-feedback");
    this.setVisualState("happy", "watching", "seed", "", false, false);
    this.ctx.audio.drop();
    this.ctx.announce(content.offerings.waterAnnouncement);
    this.showThought(".thought--dani");

    if (!this.ctx.state.waterPlaced) {
      this.ctx.state.waterPlaced = true;
      this.ctx.save();
    }

    const delay = this.ctx.reducedMotion() ? 60 : 260;
    this.timers.push(
      window.setTimeout(() => {
        if (this.ctx.state.seedPlaced) {
          this.growPlant(true);
        } else {
          this.activateSeed(true);
        }
      }, delay)
    );
  }

  private activateSeed(focus: boolean): void {
    if (!this.el) return;
    this.phase = "seed";
    this.setVisualState(
      "watching",
      "planting",
      "seed",
      content.offerings.seedInstruction,
      true,
      false
    );
    this.setActionAvailable(".offering-action--water", false);
    const seed = this.setActionAvailable(".offering-action--seed", true);
    if (focus) seed?.focus({ preventScroll: true });
  }

  private placeSeed(): void {
    if (!this.el || this.phase !== "seed") return;
    this.phase = "seed-feedback";
    this.setActionAvailable(".offering-action--seed", false, false);
    this.setObjectState(".offering-action--seed", "completed");
    this.el.querySelector<HTMLButtonElement>(".offering-action--seed")!.disabled = true;
    this.hideInstruction();
    this.el.classList.add("seed-done", "seed-feedback");
    this.el
      .querySelector<SVGSVGElement>('.offer-plant svg[data-character="plant"]')
      ?.classList.remove("plant-context--empty");
    this.setVisualState("curious", "proud", "seed", "", false, false);
    this.ctx.audio.woodTap();
    this.ctx.announce(content.offerings.seedAnnouncement);
    this.showThought(".thought--diego");

    if (!this.ctx.state.seedPlaced) {
      this.ctx.state.seedPlaced = true;
      this.ctx.save();
    }

    const delay = this.ctx.reducedMotion() ? 60 : 420;
    this.timers.push(window.setTimeout(() => this.growPlant(true), delay));
  }

  private growPlant(announce: boolean): void {
    if (!this.el || this.phase === "complete") return;
    this.phase = "complete";
    this.hideInstruction();
    this.el.classList.add("seed-done", "sprout-born");
    this.setActionAvailable(".offering-action--seed", false);
    this.setVisualState("happy", "proud", "sprout", "", false, true);

    if (announce) {
      this.ctx.audio.sprout();
      this.ctx.announce(content.offerings.sproutAnnouncement);
    }

    const delay = this.ctx.reducedMotion() ? 80 : 280;
    this.timers.push(window.setTimeout(() => this.showAfter(true), delay));
  }

  private restoreComplete(): void {
    if (!this.el) return;
    this.phase = "complete";
    this.el.classList.add("water-done", "seed-done", "sprout-born", "is-restored");
    this.setActionAvailable(".offering-action--water", false);
    this.setActionAvailable(".offering-action--seed", false);
    this.el
      .querySelector<SVGSVGElement>('.offer-plant svg[data-character="plant"]')
      ?.classList.remove("plant-context--empty");
    this.setVisualState("happy", "proud", "sprout", "", false, true);
    this.hideInstruction();
    this.showAfter(false);
  }

  private setActionAvailable(
    selector: string,
    available: boolean,
    hideWhenUnavailable = true
  ): HTMLButtonElement | null {
    const action = this.el?.querySelector<HTMLButtonElement>(selector) ?? null;
    if (!action) return null;
    action.disabled = !available;
    action.tabIndex = available ? 0 : -1;
    setInteractiveObjectState(action, available ? "idle" : "disabled");
    if (available) {
      action.removeAttribute("aria-hidden");
    } else if (hideWhenUnavailable) {
      action.setAttribute("aria-hidden", "true");
    }
    return action;
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
      window.setTimeout(() => thought.classList.remove("is-visible"), 1400)
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
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers = [];
    this.el = null;
  }
}
