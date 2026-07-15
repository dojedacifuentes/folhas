import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { setSceneVisualState } from "../app/visualState";
import { renderDani } from "../art/characters/DaniCharacter";
import { renderDiego } from "../art/characters/DiegoCharacter";
import {
  renderSeed,
  renderThimble,
} from "../art/objects/InteractiveObjects";
import { renderPlantCharacter } from "../art/PlantCharacter";
import { leafButtonSVG } from "../art/svgLibrary";
import { ScratchReveal } from "../interactions/ScratchReveal";
import { spawnLeafParticle } from "../art/particles";

export class ClearSpaceScene implements Scene {
  readonly id = "clear-space" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private revealed = false;
  private scratch: ScratchReveal | null = null;
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
          <canvas class="scratch-canvas" tabindex="0" aria-label="${c.revealLabel}"></canvas>
          <div class="particle-layer" aria-hidden="true"></div>
        </div>
        <div class="scene-after" hidden>
          <p class="speech speech--cat"><span class="speaker">${content.speakers.cat}</span><span lang="pt">${c.catSays}</span></p>
          <p class="speech speech--akita"><span class="speaker">${content.speakers.akita}</span>${c.akitaSays}</p>
          <p class="editorial">${c.editorial}</p>
          <button class="btn-leaf" type="button">${leafButtonSVG()}<span>${c.next}</span></button>
        </div>
      </div>
      <footer class="scene-foot">
        <p class="scene-instruction">${c.instruction}</p>
        <button class="link-alt" type="button" hidden>${c.altReveal}</button>
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

    const stage = el.querySelector<HTMLElement>(".clear-stage")!;
    const canvas = el.querySelector<HTMLCanvasElement>(".scratch-canvas")!;
    const particles = el.querySelector<HTMLElement>(".particle-layer")!;

    this.scratch = new ScratchReveal({
      canvas,
      container: stage,
      threshold: 0.58,
      onStroke: (x, y) => {
        spawnLeafParticle(particles, x, y, ctx.reducedMotion());
        ctx.audio.rustle(0.55 + Math.random() * 0.4);
      },
      onReveal: () => this.reveal(false),
    });

    // la alternativa accesible aparece con calma, no como atajo
    const alt = el.querySelector<HTMLButtonElement>(".link-alt")!;
    this.timers.push(window.setTimeout(() => (alt.hidden = false), 12000));
    alt.addEventListener("click", () => this.scratch?.reveal());

    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("offerings");
    });

    if (ctx.state.leavesCleared) {
      canvas.classList.add("scratch-done");
      canvas.tabIndex = -1;
      canvas.setAttribute("aria-hidden", "true");
      this.reveal(true);
    } else {
      // medir después de que la transición asiente el layout
      this.timers.push(window.setTimeout(() => this.scratch?.init(), 90));
    }
    return el;
  }

  private reveal(restoring: boolean): void {
    if (this.revealed || !this.el) return;
    this.revealed = true;
    const c = content.clearSpace;
    const foot = this.el.querySelector<HTMLElement>(".scene-foot")!;

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
      const delay = this.ctx.reducedMotion() ? 80 : 620;
      this.timers.push(window.setTimeout(showAfter, delay));
    }
  }

  destroy(): void {
    this.scratch?.destroy();
    this.scratch = null;
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers = [];
    this.el = null;
  }
}
