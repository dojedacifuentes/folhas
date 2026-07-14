import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { setSceneVisualState } from "../app/visualState";
import { renderDani } from "../art/characters/DaniCharacter";
import { renderDiego } from "../art/characters/DiegoCharacter";
import {
  renderDryLeaves,
  renderSeed,
  renderThimble,
  setInteractiveObjectState,
} from "../art/objects/InteractiveObjects";
import { renderPlantCharacter } from "../art/PlantCharacter";
import { leafButtonSVG } from "../art/svgLibrary";

export class ClearSpaceScene implements Scene {
  readonly id = "clear-space" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private revealed = false;
  private timers: number[] = [];

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
    this.revealed = false;
    const c = content.clearSpace;
    const el = document.createElement("section");
    el.className = "scene scene--clear";
    el.setAttribute("aria-label", `${c.number}. ${c.heading}`);
    el.innerHTML = `
      <header class="scene-head">
        <p class="scene-number" aria-hidden="true">${c.number}</p>
        <h2 class="scene-heading">${c.heading}</h2>
        <p class="scene-lede">${c.lede}</p>
      </header>
      <div class="scene-body">
        <div class="clear-stage">
          <div class="clear-tableau" aria-hidden="true">
            <div class="clear-dani">${renderDani({
              state: "surprised",
              angle: "front",
              facing: "front",
              reducedMotion: ctx.reducedMotion(),
            })}</div>
            <div class="clear-plant plant-wrap">${renderPlantCharacter({
              state: "seed",
              className: "plant-context--empty",
              decorative: true,
            })}</div>
            <div class="clear-diego">${renderDiego({
              state: "focused",
              angle: "front",
              facing: "front",
              reducedMotion: ctx.reducedMotion(),
            })}</div>
            ${renderThimble({ interactive: false, decorative: true, className: "clear-thimble" })}
            ${renderSeed({ interactive: false, decorative: true, className: "clear-cube" })}
          </div>
          ${renderDryLeaves({
            label: c.revealLabel,
            className: "scene-action clear-leaf-button",
            leafCount: 6,
          })}
        </div>
        <div class="scene-after" hidden>
          <p class="speech speech--cat"><span class="speaker">${content.speakers.cat}</span>${c.catSays}</p>
          <p class="speech speech--akita"><span class="speaker">${content.speakers.akita}</span>${c.akitaSays}</p>
          <p class="editorial">${c.editorial}</p>
          <button class="btn-leaf" type="button">${leafButtonSVG()}<span>${c.next}</span></button>
        </div>
      </div>
      <footer class="scene-foot">
        <p class="scene-instruction">${c.instruction}</p>
      </footer>
    `;
    this.el = el;
    setSceneVisualState(el, {
      daniState: "surprised",
      diegoState: "focused",
      plantState: "seed",
      instruction: c.instruction,
      interactionEnabled: true,
      completed: false,
    });

    el.querySelector<HTMLButtonElement>(".clear-leaf-button")!.addEventListener(
      "click",
      () => this.reveal(false)
    );
    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("offerings");
    });

    if (ctx.state.leavesCleared) this.reveal(true);
    return el;
  }

  private reveal(restoring: boolean): void {
    if (this.revealed || !this.el) return;
    this.revealed = true;
    const c = content.clearSpace;
    const leafButton = this.el.querySelector<HTMLButtonElement>(".clear-leaf-button")!;
    const foot = this.el.querySelector<HTMLElement>(".scene-foot")!;

    setInteractiveObjectState(leafButton, "completed");
    leafButton.disabled = true;
    if (restoring) this.el.classList.add("is-restored");
    this.el.classList.add("is-revealed");
    setSceneVisualState(this.el, {
      daniState: "curious",
      diegoState: "proud",
      plantState: "seed",
      instruction: "",
      interactionEnabled: false,
      completed: true,
    });
    foot.classList.add("is-hidden");
    foot.inert = true;
    foot.setAttribute("aria-hidden", "true");

    if (!restoring) {
      this.ctx.onFirstInteraction();
      this.ctx.audio.rustle(1);
      this.ctx.audio.woodTap();
      this.ctx.state.leavesCleared = true;
      this.ctx.save();
      this.ctx.announce(c.revealedAnnouncement);
    }

    const showAfter = (): void => {
      if (!this.el) return;
      const after = this.el.querySelector<HTMLElement>(".scene-after")!;
      after.hidden = false;
      after.classList.add("is-visible");
      if (!restoring) {
        after
          .querySelector<HTMLButtonElement>(".btn-leaf")
          ?.focus({ preventScroll: true });
      }
    };

    if (restoring) {
      showAfter();
    } else {
      const delay = this.ctx.reducedMotion() ? 80 : 480;
      this.timers.push(window.setTimeout(showAfter, delay));
    }
  }

  destroy(): void {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers = [];
    this.el = null;
  }
}
