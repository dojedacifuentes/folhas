import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { ScratchReveal } from "../interactions/ScratchReveal";
import { spawnLeafParticle } from "../art/particles";
import {
  akitaSVG,
  catSVG,
  leafButtonSVG,
  plantSVG,
  seedCubeSVG,
  thimbleSVG,
} from "../art/svgLibrary";

export class ClearSpaceScene implements Scene {
  readonly id = "clear-space" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private scratch: ScratchReveal | null = null;
  private timers: number[] = [];

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
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
        <div class="scratch-stage">
          <div class="tableau plant-wrap plant--dormant" aria-hidden="true">
            <div class="tableau-cat">${catSVG("dani--surprised")}</div>
            <div class="tableau-plant">${plantSVG()}</div>
            <div class="tableau-akita">${akitaSVG("diego--serious")}</div>
            <div class="tableau-thimble">${thimbleSVG()}</div>
            <div class="tableau-cube">${seedCubeSVG()}</div>
          </div>
          <canvas class="scratch-canvas" tabindex="0" aria-label="${c.canvasLabel}"></canvas>
          <div class="particle-layer" aria-hidden="true"></div>
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
        <button class="link-alt" type="button">${c.altReveal}</button>
      </footer>
    `;
    this.el = el;

    const canvas = el.querySelector<HTMLCanvasElement>(".scratch-canvas")!;
    const stage = el.querySelector<HTMLElement>(".scratch-stage")!;
    const particles = el.querySelector<HTMLElement>(".particle-layer")!;

    this.scratch = new ScratchReveal({
      canvas,
      container: stage,
      threshold: 0.58,
      onStroke: (x, y) => {
        spawnLeafParticle(particles, x, y, ctx.reducedMotion());
        ctx.audio.rustle(0.6 + Math.random() * 0.4);
      },
      onReveal: () => this.revealed(),
    });
    // esperar a que la transición asiente el layout antes de medir
    this.timers.push(window.setTimeout(() => this.scratch?.init(), 80));
    if (ctx.state.leavesCleared) {
      this.timers.push(window.setTimeout(() => this.scratch?.reveal(), 120));
    }

    el.querySelector<HTMLButtonElement>(".link-alt")!.addEventListener("click", () => {
      this.scratch?.reveal();
    });
    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("offerings");
    });
    return el;
  }

  private revealed(): void {
    if (!this.el) return;
    const c = content.clearSpace;
    this.ctx.audio.rustle(1);
    this.ctx.audio.woodTap();
    this.el.classList.add("is-revealed");
    this.ctx.state.leavesCleared = true;
    this.ctx.save();
    this.ctx.announce(c.revealedAnnouncement);

    const after = this.el.querySelector<HTMLElement>(".scene-after")!;
    const foot = this.el.querySelector<HTMLElement>(".scene-foot")!;
    const delay = this.ctx.reducedMotion() ? 120 : 950;
    this.timers.push(
      window.setTimeout(() => {
        foot.classList.add("is-hidden");
        foot.inert = true;
        foot.setAttribute("aria-hidden", "true");
        after.hidden = false;
        after.classList.add("is-visible");
        after.querySelector<HTMLButtonElement>(".btn-leaf")?.focus({ preventScroll: true });
      }, delay)
    );
  }

  destroy(): void {
    this.scratch?.destroy();
    this.scratch = null;
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
    this.el = null;
  }
}
