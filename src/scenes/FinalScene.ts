import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import {
  akitaSVG,
  branchShadowSVG,
  catSVG,
  leafSVG,
  plantSVG,
  seedCubeSVG,
  thimbleSVG,
} from "../art/svgLibrary";

export class FinalScene implements Scene {
  readonly id = "final" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private timers: number[] = [];

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
    const c = content.final;
    const el = document.createElement("section");
    el.className = "scene scene--final";
    el.setAttribute("aria-label", `${c.number}. ${c.heading}`);
    el.innerHTML = `
      <header class="scene-head">
        <p class="scene-number" aria-hidden="true">${c.number}</p>
        <h2 class="scene-heading">${c.heading}</h2>
      </header>
      <div class="scene-body">
        <div class="final-stage">
          <div class="final-glow" aria-hidden="true"></div>
          <div class="final-branch final-branch--a" aria-hidden="true">${branchShadowSVG(1)}</div>
          <div class="final-branch final-branch--b" aria-hidden="true">${branchShadowSVG(2)}</div>
          <div class="final-drifting-leaf" aria-hidden="true">${leafSVG(3)}</div>
          <div class="final-cat" aria-hidden="true">
            ${catSVG("cat--sleeping")}
            <p class="thought thought--cat">${c.catThought}</p>
          </div>
          <button class="final-plant plant-wrap plant--full" type="button" aria-label="${c.plantLabel}">
            ${plantSVG()}
          </button>
          <div class="final-akita" aria-hidden="true">
            ${akitaSVG("akita--guard")}
            <p class="thought thought--akita">${c.akitaThought}</p>
          </div>
          <button class="final-cube" type="button" aria-label="${c.cubeLabel}">
            ${seedCubeSVG()}
          </button>
          <div class="final-thimble" aria-hidden="true">${thimbleSVG()}</div>
        </div>
        <div class="final-text">
          ${c.lines.map((l, i) => `<p class="final-line" style="--i:${i}">${l}</p>`).join("")}
          <div class="final-dedication">
            ${c.dedication
              .map(
                (l, i) =>
                  `<p class="final-line final-line--dedication" style="--i:${c.lines.length + i}">${l}</p>`
              )
              .join("")}
          </div>
          <p class="final-line final-line--pt" style="--i:${c.lines.length + c.dedication.length}" lang="pt">${c.portuguese}</p>
          <p class="final-line final-line--signature" style="--i:${c.lines.length + c.dedication.length + 1}">${c.signature}</p>
        </div>
      </div>
    `;
    this.el = el;

    if (!ctx.state.finalReached) {
      ctx.state.finalReached = true;
    }
    ctx.state.currentScene = "final";
    ctx.save();
    ctx.audio.startBreath();

    if (ctx.reducedMotion()) {
      el.classList.add("text-shown");
    } else {
      this.timers.push(window.setTimeout(() => el.classList.add("text-shown"), 400));
    }

    // pensamientos tardíos, una sola vez
    this.timers.push(
      window.setTimeout(() => this.showThought(".thought--cat"), 9000),
      window.setTimeout(() => this.showThought(".thought--akita"), 16000)
    );

    // easter egg: el cubo gira una vez y el akita lo recoloca
    const cube = el.querySelector<HTMLButtonElement>(".final-cube")!;
    cube.addEventListener("click", () => {
      if (cube.classList.contains("is-spinning")) return;
      cube.classList.add("is-spinning");
      ctx.audio.woodTap();
      const akita = el.querySelector<HTMLElement>(".final-akita")!;
      this.timers.push(
        window.setTimeout(() => {
          akita.classList.add("is-fixing");
          this.timers.push(
            window.setTimeout(() => {
              cube.classList.remove("is-spinning");
              akita.classList.remove("is-fixing");
            }, 900)
          );
        }, 700)
      );
    });

    // easter egg: las hojas se inclinan hacia el punto de contacto
    const plant = el.querySelector<HTMLButtonElement>(".final-plant")!;
    plant.addEventListener("click", (e) => {
      const r = plant.getBoundingClientRect();
      const side = e.clientX - r.left < r.width / 2 ? "lean-left" : "lean-right";
      plant.classList.add(side);
      ctx.audio.rustle(0.5);
      this.timers.push(
        window.setTimeout(() => plant.classList.remove("lean-left", "lean-right"), 1500)
      );
    });

    return el;
  }

  private showThought(selector: string): void {
    const t = this.el?.querySelector<HTMLElement>(selector);
    if (!t) return;
    t.classList.add("is-visible");
    this.timers.push(window.setTimeout(() => t.classList.remove("is-visible"), 6000));
  }

  destroy(): void {
    this.ctx.audio.stopBreath();
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
    this.el = null;
  }
}
