import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { LightAligner } from "../interactions/LightAligner";
import {
  akitaSVG,
  branchShadowSVG,
  catSVG,
  leafButtonSVG,
  plantSVG,
  shadowShelterSVG,
} from "../art/svgLibrary";

export class LightScene implements Scene {
  readonly id = "light" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private aligner: LightAligner | null = null;
  private timers: number[] = [];
  private leafStep = 0;
  private completed = false;

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
    const c = content.light;
    const el = document.createElement("section");
    el.className = "scene scene--light";
    el.setAttribute("aria-label", `${c.number}. ${c.heading}`);
    el.innerHTML = `
      <header class="scene-head">
        <p class="scene-number" aria-hidden="true">${c.number}</p>
        <h2 class="scene-heading">${c.heading}</h2>
        <p class="scene-lede">${c.lede}</p>
      </header>
      <div class="scene-body">
        <div class="light-stage">
          <div class="light-glow" aria-hidden="true"></div>
          <div class="light-branches" aria-hidden="true">
            <div class="light-branch light-branch--l">${branchShadowSVG(2)}</div>
            <div class="light-branch light-branch--r">${branchShadowSVG(1)}</div>
          </div>
          <div class="light-cat" aria-hidden="true">
            <div class="cast-shadow cast-shadow--cat"></div>
            ${catSVG("dani--worried")}
          </div>
          <div class="light-plant plant-wrap plant--sprout" aria-hidden="true">
            ${plantSVG()}
          </div>
          <div class="light-akita" aria-hidden="true">
            <div class="cast-shadow cast-shadow--akita"></div>
            ${akitaSVG("diego--protecting")}
          </div>
          <div class="shelter-union" aria-hidden="true">${shadowShelterSVG()}</div>
          <button class="lamp" type="button" aria-label="${c.lampLabel}">
            <span class="lamp-core" aria-hidden="true"></span>
          </button>
        </div>
        <div class="scene-after" hidden>
          <p class="after-main">${c.afterMain}</p>
          <p class="speech speech--cat"><span class="speaker">${content.speakers.cat}</span>${c.catSays}</p>
          <p class="speech speech--akita"><span class="speaker">${content.speakers.akita}</span>${c.akitaSays}</p>
          <button class="btn-leaf" type="button">${leafButtonSVG()}<span>${c.next}</span></button>
        </div>
      </div>
      <footer class="scene-foot">
        <p class="scene-instruction">${c.instruction}</p>
        <button class="link-alt" type="button">${c.altAlign}</button>
      </footer>
    `;
    this.el = el;

    const stage = el.querySelector<HTMLElement>(".light-stage")!;
    this.aligner = new LightAligner({
      lamp: el.querySelector<HTMLElement>(".lamp")!,
      stage,
      targetX: 0.52,
      targetY: 0.24,
      radius: 0.36,
      onUpdate: (a, x, y) => this.update(a, x, y),
      onAligned: () => this.aligned(),
    });
    // posición inicial: descentrada, cerca del gato, para invitar al gesto
    this.update(0, 0.28, 0.74);

    el.querySelector<HTMLButtonElement>(".link-alt")!.addEventListener("click", () => {
      this.aligner?.align();
    });
    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("final");
    });
    if (ctx.state.lightAligned) {
      this.timers.push(window.setTimeout(() => this.aligner?.align(), 80));
    }
    return el;
  }

  private update(a: number, x: number, y: number): void {
    if (!this.el) return;
    const stage = this.el.querySelector<HTMLElement>(".light-stage")!;
    stage.style.setProperty("--lx", `${(x * 100).toFixed(2)}%`);
    stage.style.setProperty("--ly", `${(y * 100).toFixed(2)}%`);
    stage.style.setProperty("--align", a.toFixed(3));

    // dirección de las sombras: se alejan de la luz
    const catDir = 0.22 - x; // gato a la izquierda (~22%)
    const akitaDir = 0.78 - x; // akita a la derecha (~78%)
    const lengthBoost = 0.8 + (1 - y) * 0.9;
    stage.style.setProperty("--cat-skew", `${(catDir * -60).toFixed(1)}deg`);
    stage.style.setProperty("--akita-skew", `${(akitaDir * -60).toFixed(1)}deg`);
    stage.style.setProperty("--shadow-len", lengthBoost.toFixed(2));

    // hojas que aparecen progresivamente
    const plant = this.el.querySelector<HTMLElement>(".light-plant")!;
    if (a > 0.45 && this.leafStep < 1) {
      this.leafStep = 1;
      plant.classList.add("show-yellow");
    }
    if (a > 0.68 && this.leafStep < 2) {
      this.leafStep = 2;
      plant.classList.add("show-turquoise");
    }
  }

  private aligned(): void {
    if (!this.el || this.completed) return;
    this.completed = true;
    const c = content.light;
    this.el.classList.add("is-aligned");
    const plant = this.el.querySelector<HTMLElement>(".light-plant")!;
    plant.classList.add("show-yellow", "show-turquoise");
    plant.classList.remove("plant--sprout");
    plant.classList.add("plant--full");
    this.ctx.audio.sprout();
    this.ctx.announce(c.alignedAnnouncement);
    this.ctx.state.lightAligned = true;
    this.ctx.save();

    const after = this.el.querySelector<HTMLElement>(".scene-after")!;
    const foot = this.el.querySelector<HTMLElement>(".scene-foot")!;
    this.timers.push(
      window.setTimeout(
        () => {
          foot.classList.add("is-hidden");
          foot.inert = true;
          foot.setAttribute("aria-hidden", "true");
          after.hidden = false;
          after.classList.add("is-visible");
          after.querySelector<HTMLButtonElement>(".btn-leaf")?.focus({ preventScroll: true });
        },
        this.ctx.reducedMotion() ? 150 : 1400
      )
    );
  }

  destroy(): void {
    this.aligner?.destroy();
    this.aligner = null;
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
    this.el = null;
  }
}
