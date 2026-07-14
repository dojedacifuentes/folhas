import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import {
  setSceneVisualState,
  type SceneVisualState,
} from "../app/visualState";
import {
  renderDani,
  type DaniState,
} from "../art/characters/DaniCharacter";
import {
  renderDiego,
  type DiegoState,
} from "../art/characters/DiegoCharacter";
import {
  renderSun,
  renderThimble,
  renderUmbrella,
  renderWind,
  setInteractiveObjectState,
  type InteractiveObjectState,
} from "../art/objects/InteractiveObjects";
import {
  renderPlantCharacter,
  type PlantState,
} from "../art/PlantCharacter";
import {
  renderShadowSystem,
  setShadowLight,
  setShadowProgress,
} from "../art/ShadowSystem";
import { leafButtonSVG, leafSVG } from "../art/svgLibrary";

type CarePhase = "water" | "wind" | "sun";

type FailureAppearance = {
  className: string;
  plant: PlantState;
  dani: DaniState;
  diego: DiegoState;
};

/**
 * Tres cuidados distintos, breves y táctiles. Cada momento tiene un único
 * control grande; equivocarse produce una reacción dentro del tableau y
 * reinicia solo ese momento, sin pantallas de error.
 */
export class CareScene implements Scene {
  readonly id = "care" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private phase: CarePhase = "water";
  private timers = new Set<number>();
  private cleanups: Array<() => void> = [];
  private raf: number | null = null;
  private settled = false;
  private visualState: SceneVisualState = {
    daniState: "watching",
    diegoState: "watching",
    plantState: "small",
    instruction: "",
    interactionEnabled: false,
    completed: false,
  };

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
    const c = content.care;
    const el = document.createElement("section");
    el.className = "scene scene--care";
    el.setAttribute("aria-label", `${c.number}. ${c.heading}`);
    el.innerHTML = `
      <header class="scene-head">
        <p class="scene-number" aria-hidden="true">${c.number}</p>
        <h2 class="scene-heading">${c.heading}</h2>
        <p class="scene-lede">${c.lede}</p>
      </header>
      <div class="scene-body">
        <div class="care-stage"></div>
        <div class="scene-after care-after" hidden>
          <p class="after-main">${c.complete}</p>
          <button class="btn-leaf" type="button">
            ${leafButtonSVG()}<span>${c.next}</span>
          </button>
        </div>
      </div>
      <footer class="scene-foot care-foot">
        <p class="scene-instruction"></p>
      </footer>
    `;
    this.el = el;

    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("final");
    });

    const phase = this.nextIncomplete();
    if (phase) this.renderPhase(phase);
    else this.renderComplete();
    return el;
  }

  private nextIncomplete(): CarePhase | null {
    if (!this.ctx.state.waterBalanced) return "water";
    if (!this.ctx.state.windBalanced) return "wind";
    if (!this.ctx.state.sunBalanced) return "sun";
    return null;
  }

  private renderPhase(phase: CarePhase): void {
    if (!this.el) return;
    this.stopPhase();
    this.phase = phase;
    this.settled = false;
    this.el.dataset.carePhase = phase;

    const stage = this.el.querySelector<HTMLElement>(".care-stage")!;
    const foot = this.el.querySelector<HTMLElement>(".care-foot")!;
    const after = this.el.querySelector<HTMLElement>(".care-after")!;
    const instruction = foot.querySelector<HTMLElement>(".scene-instruction")!;

    stage.className = `care-stage care-stage--${phase}`;
    stage.removeAttribute("style");
    foot.classList.remove("is-hidden");
    foot.inert = false;
    foot.removeAttribute("aria-hidden");
    instruction.textContent = content.care[phase].instruction;
    after.hidden = true;
    after.classList.remove("is-visible");

    if (phase === "water") this.mountWater(stage);
    if (phase === "wind") this.mountWind(stage);
    if (phase === "sun") this.mountSun(stage);

    window.requestAnimationFrame(() => {
      stage.querySelector<HTMLButtonElement>(".care-action")?.focus({ preventScroll: true });
    });
  }

  private tableau(
    dani: DaniState,
    diego: DiegoState,
    plant: PlantState,
    shadowProgress: number
  ): string {
    return `
      ${renderShadowSystem({
        className: "care-shadow-system",
        progress: shadowProgress,
        intensity: 0.48,
        length: 1.08,
        angle: -4 + shadowProgress * 8,
      })}
      <div class="care-character care-dani" aria-hidden="true">${renderDani({
        state: dani,
        angle: "three-quarter-right",
        facing: "right",
        reducedMotion: this.ctx.reducedMotion(),
      })}</div>
      <div class="care-plant plant-wrap" aria-hidden="true">${renderPlantCharacter({
        state: plant,
        decorative: true,
      })}</div>
      <div class="care-character care-diego" aria-hidden="true">${renderDiego({
        state: diego,
        angle: "three-quarter-left",
        facing: "left",
        reducedMotion: this.ctx.reducedMotion(),
      })}</div>
      <p class="weather-reaction" aria-hidden="true"></p>
    `;
  }

  private mountWater(stage: HTMLElement): void {
    const c = content.care.water;
    stage.innerHTML = `
      <div class="water-ripples" aria-hidden="true"><i></i><i></i><i></i></div>
      ${this.tableau("watering", "watching", "small", 0.24)}
      ${renderUmbrella({
        interactive: false,
        decorative: true,
        className: "care-umbrella",
      })}
      <div class="care-drops" aria-hidden="true"><i></i><i></i><i></i></div>
      <button class="care-action care-action--water" type="button" aria-label="${c.controlLabel}">
        <span class="care-action-art" aria-hidden="true">${renderThimble({
          interactive: false,
          decorative: true,
          className: "care-object-art",
        })}</span>
        <span class="dose-marks" aria-hidden="true"><i></i><i></i></span>
      </button>
    `;

    this.applyVisualState({
      daniState: "watering",
      diegoState: "watching",
      plantState: "small",
      instruction: c.instruction,
      interactionEnabled: true,
      completed: false,
    });

    const button = stage.querySelector<HTMLButtonElement>(".care-action--water")!;
    let drops = 0;
    let completionTimer: number | null = null;

    const onActivate = () => {
      if (this.settled) return;
      drops += 1;
      stage.dataset.drops = String(drops);
      this.ctx.audio.drop();
      this.setCareObjectState("active");

      if (drops === 1) {
        stage.classList.add("has-one-drop");
        this.applyVisualState({
          daniState: "watering",
          diegoState: "watching",
          plantState: "small",
        });
        this.showReaction(c.firstDrop, true);
        button.setAttribute("aria-label", `${c.controlLabel} ${c.hint}.`);
        return;
      }

      if (drops === 2) {
        stage.classList.remove("has-one-drop");
        void stage.offsetWidth;
        stage.classList.add("has-two-drops");
        this.setCareObjectState("completed");
        this.applyVisualState({
          daniState: "happy",
          diegoState: "proud",
          plantState: "hydrated",
        });
        completionTimer = this.schedule(
          () => this.completePhase(c.announcement, "hydrated"),
          this.ctx.reducedMotion() ? 180 : 760
        );
        return;
      }

      if (completionTimer !== null) this.clearTimer(completionTimer);
      this.failPhase(c.failure, c.retry, {
        className: "is-water-failed",
        plant: "drowned",
        dani: "reactingToRain",
        diego: "reactingToRain",
      });
    };

    button.addEventListener("click", onActivate);
    this.cleanups.push(() => button.removeEventListener("click", onActivate));
  }

  private mountWind(stage: HTMLElement): void {
    const c = content.care.wind;
    stage.innerHTML = `
      <div class="wind-lines" aria-hidden="true"><i></i><i></i><i></i></div>
      ${this.tableau("watching", "protecting", "hydrated", 0.58)}
      <div class="wind-leaves" aria-hidden="true">
        ${leafSVG(2)}${leafSVG(4)}${leafSVG(6)}
      </div>
      <button class="care-action care-action--wind" type="button" aria-label="${c.controlLabel}">
        ${renderWind({
          interactive: false,
          decorative: true,
          className: "care-object-art",
        })}
      </button>
    `;

    this.applyVisualState({
      daniState: "watching",
      diegoState: "protecting",
      plantState: "hydrated",
      instruction: c.instruction,
      interactionEnabled: true,
      completed: false,
    });

    const button = stage.querySelector<HTMLButtonElement>(".care-action--wind")!;
    let gusts = 0;
    let completionTimer: number | null = null;

    const onActivate = () => {
      if (this.settled) return;
      gusts += 1;
      this.ctx.audio.rustle(0.78);
      this.setCareObjectState("active");
      stage.classList.remove("is-gusting");
      void stage.offsetWidth;
      stage.classList.add("is-gusting");

      if (gusts === 1) {
        this.setCareObjectState("completed");
        this.applyVisualState({
          daniState: "happy",
          diegoState: "protecting",
          plantState: "growing",
        });
        completionTimer = this.schedule(
          () => this.completePhase(c.announcement, "growing"),
          this.ctx.reducedMotion() ? 180 : 820
        );
        return;
      }

      if (completionTimer !== null) this.clearTimer(completionTimer);
      this.failPhase(c.failure, c.retry, {
        className: "is-wind-failed",
        plant: "windBent",
        dani: "reactingToWind",
        diego: "recoveringGlasses",
      });
    };

    button.addEventListener("click", onActivate);
    this.cleanups.push(() => button.removeEventListener("click", onActivate));
  }

  private mountSun(stage: HTMLElement): void {
    const c = content.care.sun;
    stage.innerHTML = `
      <div class="sun-wash" aria-hidden="true"></div>
      ${this.tableau("watching", "protecting", "growing", 0.82)}
      <div class="sun-smoke" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="diego-manual" aria-hidden="true"></div>
      <button class="care-action care-action--sun" type="button" aria-label="${c.controlLabel}">
        ${renderSun({
          interactive: false,
          decorative: true,
          className: "care-object-art",
        })}
        <span class="sun-ring" aria-hidden="true"></span>
      </button>
    `;

    this.applyVisualState({
      daniState: "watching",
      diegoState: "protecting",
      plantState: "growing",
      instruction: c.instruction,
      interactionEnabled: true,
      completed: false,
    });

    const button = stage.querySelector<HTMLButtonElement>(".care-action--sun")!;
    let pressing = false;
    let startedAt = 0;
    let pointerId: number | null = null;

    const stopHolding = () => {
      pressing = false;
      pointerId = null;
      this.cancelFrame();
      button.classList.remove("is-pressing");
      stage.classList.remove("is-sun-holding");
    };

    const start = (event?: PointerEvent) => {
      if (this.settled || pressing) return;
      pressing = true;
      startedAt = performance.now();
      button.classList.add("is-pressing");
      stage.classList.add("is-sun-holding");
      this.setCareObjectState("active");
      if (event) {
        pointerId = event.pointerId;
        button.setPointerCapture(event.pointerId);
      }

      const frame = (now: number) => {
        if (!pressing || this.settled) return;
        const elapsed = now - startedAt;
        stage.style.setProperty("--sun-progress", Math.min(1, elapsed / 1900).toFixed(3));
        stage.style.setProperty("--heat", Math.min(1, elapsed / 2100).toFixed(3));
        const lightProgress = Math.min(1, elapsed / 1900);
        this.updateCareLight({
          x: 38 + lightProgress * 24,
          y: 13 + lightProgress * 8,
          intensity: 0.46 + lightProgress * 0.38,
          length: 1.28 - lightProgress * 0.5,
          angle: -13 + lightProgress * 25,
        });
        if (elapsed >= 2100) {
          stopHolding();
          this.failPhase(c.failure, c.retry, {
            className: "is-sun-failed",
            plant: "burnt",
            dani: "reactingToHeat",
            diego: "reactingToHeat",
          });
          return;
        }
        this.raf = window.requestAnimationFrame(frame);
      };
      this.raf = window.requestAnimationFrame(frame);
    };

    const judge = () => {
      if (!pressing || this.settled) return;
      const elapsed = performance.now() - startedAt;
      stopHolding();

      if (elapsed < 480) {
        stage.style.setProperty("--sun-progress", "0");
        stage.style.setProperty("--heat", "0");
        this.setCareObjectState("idle");
        this.showReaction(c.hint, true);
        return;
      }

      if (elapsed <= 1800) {
        this.setCareObjectState("completed");
        this.applyVisualState({
          daniState: "proud",
          diegoState: "proud",
          plantState: "healthy",
        });
        this.completePhase(c.announcement, "healthy");
        return;
      }

      this.failPhase(c.failure, c.retry, {
        className: "is-sun-failed",
        plant: "overheated",
        dani: "reactingToHeat",
        diego: "reactingToHeat",
      });
    };

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      start(event);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (pointerId !== null && event.pointerId !== pointerId) return;
      judge();
    };
    const onPointerCancel = (event: PointerEvent) => {
      if (pointerId !== null && event.pointerId !== pointerId) return;
      stopHolding();
      stage.style.setProperty("--sun-progress", "0");
      stage.style.setProperty("--heat", "0");
      this.setCareObjectState("idle");
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key !== " " && event.key !== "Enter") || event.repeat) return;
      event.preventDefault();
      start();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      judge();
    };

    button.addEventListener("pointerdown", onPointerDown);
    button.addEventListener("pointerup", onPointerUp);
    button.addEventListener("pointercancel", onPointerCancel);
    button.addEventListener("keydown", onKeyDown);
    button.addEventListener("keyup", onKeyUp);
    this.cleanups.push(() => {
      button.removeEventListener("pointerdown", onPointerDown);
      button.removeEventListener("pointerup", onPointerUp);
      button.removeEventListener("pointercancel", onPointerCancel);
      button.removeEventListener("keydown", onKeyDown);
      button.removeEventListener("keyup", onKeyUp);
    });
  }

  private completePhase(
    announcement: string,
    plantState: PlantState
  ): void {
    if (!this.el || this.settled) return;
    this.settled = true;
    this.cancelFrame();
    const stage = this.el.querySelector<HTMLElement>(".care-stage")!;
    const foot = this.el.querySelector<HTMLElement>(".care-foot")!;
    stage.classList.add("is-balanced");
    this.applyVisualState({
      plantState,
      instruction: "",
      interactionEnabled: false,
      completed: true,
    });
    const progress = this.phase === "water" ? 0.45 : this.phase === "wind" ? 0.76 : 1;
    this.updateCareShadowProgress(progress, this.phase === "sun" ? 0.55 : 0);
    foot.classList.add("is-hidden");
    foot.inert = true;
    foot.setAttribute("aria-hidden", "true");
    stage.querySelectorAll<HTMLButtonElement>("button").forEach((control) => {
      control.disabled = true;
    });

    if (this.phase === "water") this.ctx.state.waterBalanced = true;
    if (this.phase === "wind") this.ctx.state.windBalanced = true;
    if (this.phase === "sun") this.ctx.state.sunBalanced = true;
    this.ctx.save();
    this.ctx.announce(announcement);

    this.schedule(
      () => {
        const next = this.nextIncomplete();
        if (next) this.renderPhase(next);
        else this.renderComplete();
      },
      this.ctx.reducedMotion() ? 220 : 1020
    );
  }

  private failPhase(
    message: string,
    retry: string,
    appearance: FailureAppearance
  ): void {
    if (!this.el || this.settled) return;
    this.settled = true;
    this.cancelFrame();
    const stage = this.el.querySelector<HTMLElement>(".care-stage")!;
    const instruction = this.el.querySelector<HTMLElement>(".care-foot .scene-instruction")!;
    stage.classList.add("is-failure", appearance.className);
    this.setCareObjectState("disabled");
    this.applyVisualState({
      daniState: appearance.dani,
      diegoState: appearance.diego,
      plantState: appearance.plant,
      instruction: retry,
      interactionEnabled: false,
      completed: false,
    });
    if (this.phase === "water") {
      this.updateCareLight({ intensity: 0.34, length: 1.42, angle: -10, shelter: 0.42 });
    }
    if (this.phase === "wind") {
      this.updateCareLight({ intensity: 0.58, length: 1.3, angle: 22, shelter: 0 });
    }
    if (this.phase === "sun") {
      this.updateCareLight({ intensity: 0.82, length: 0.68, angle: 14, shelter: 0.18 });
    }
    this.showReaction(message, false);
    instruction.textContent = retry;
    stage.querySelectorAll<HTMLButtonElement>("button").forEach((control) => {
      control.disabled = true;
    });
    this.ctx.announce(`${message}. ${retry}`);

    this.schedule(
      () => this.renderPhase(this.phase),
      this.ctx.reducedMotion() ? 520 : 1750
    );
  }

  private renderComplete(): void {
    if (!this.el) return;
    this.stopPhase();
    this.settled = true;
    this.el.dataset.carePhase = "complete";
    const stage = this.el.querySelector<HTMLElement>(".care-stage")!;
    const foot = this.el.querySelector<HTMLElement>(".care-foot")!;
    const after = this.el.querySelector<HTMLElement>(".care-after")!;

    stage.className = "care-stage care-stage--complete";
    stage.removeAttribute("style");
    stage.innerHTML = `
      <div class="care-complete-glow" aria-hidden="true"></div>
      ${this.tableau("proud", "proud", "healthy", 1)}
      ${renderUmbrella({
        interactive: false,
        decorative: true,
        className: "stored-umbrella umbrella--stored",
      })}
    `;
    this.applyVisualState({
      daniState: "proud",
      diegoState: "proud",
      plantState: "healthy",
      instruction: "",
      interactionEnabled: false,
      completed: true,
    });
    this.updateCareShadowProgress(1, 0.65);
    foot.classList.add("is-hidden");
    foot.inert = true;
    foot.setAttribute("aria-hidden", "true");
    after.hidden = false;
    window.requestAnimationFrame(() => {
      after.classList.add("is-visible");
      after.querySelector<HTMLButtonElement>(".btn-leaf")?.focus({ preventScroll: true });
    });
  }

  private applyVisualState(patch: Partial<SceneVisualState>): void {
    if (!this.el) return;
    this.visualState = { ...this.visualState, ...patch };
    setSceneVisualState(this.el, this.visualState);
  }

  private setCareObjectState(state: InteractiveObjectState): void {
    const object = this.el?.querySelector<HTMLElement>(
      ".care-action .interactive-object"
    );
    if (object) setInteractiveObjectState(object, state);
  }

  private updateCareLight(
    light: Parameters<typeof setShadowLight>[1]
  ): void {
    const shadows = this.el?.querySelector<HTMLElement>("[data-shadow-system]");
    if (shadows) setShadowLight(shadows, light);
  }

  private updateCareShadowProgress(progress: number, shelter = 0): void {
    const shadows = this.el?.querySelector<HTMLElement>("[data-shadow-system]");
    if (shadows) setShadowProgress(shadows, progress, shelter);
  }

  private showReaction(message: string, announce: boolean): void {
    const reaction = this.el?.querySelector<HTMLElement>(".weather-reaction");
    if (!reaction) return;
    reaction.textContent = message;
    reaction.classList.add("is-visible");
    if (announce) this.ctx.announce(message);
    this.schedule(() => reaction.classList.remove("is-visible"), 1050);
  }

  private schedule(callback: () => void, delay: number): number {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, delay);
    this.timers.add(timer);
    return timer;
  }

  private clearTimer(timer: number): void {
    window.clearTimeout(timer);
    this.timers.delete(timer);
  }

  private cancelFrame(): void {
    if (this.raf !== null) window.cancelAnimationFrame(this.raf);
    this.raf = null;
  }

  private stopPhase(): void {
    this.cancelFrame();
    this.cleanups.forEach((cleanup) => cleanup());
    this.cleanups = [];
  }

  destroy(): void {
    this.stopPhase();
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
    this.el = null;
  }
}
