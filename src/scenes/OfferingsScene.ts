import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { DraggableOffering } from "../interactions/DraggableOffering";
import { createBotanicalShadows } from "../art/BotanicalShadows";
import {
  akitaSVG,
  catSVG,
  leafButtonSVG,
  plantSVG,
  seedCubeSVG,
  thimbleSVG,
  umbrellaSVG,
} from "../art/svgLibrary";

/** Vertidos extra que la planta tolera antes de ahogarse (con humor). */
const POURS_BEFORE_FLOOD = 3;

export class OfferingsScene implements Scene {
  readonly id = "offerings" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private water: DraggableOffering | null = null;
  private seed: DraggableOffering | null = null;
  private timers: number[] = [];
  private extraPours = 0;
  private flooding = false;
  private poursLocked = false;

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
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
          <div class="offer-cat" aria-hidden="true">${catSVG()}
            <p class="thought thought--cat">${c.catThought}</p>
          </div>
          <div class="offer-plant plant-wrap plant--dormant">
            <div class="drop-halo" aria-hidden="true"></div>
            <div class="water-drop" aria-hidden="true"></div>
            ${plantSVG()}
          </div>
          <div class="offer-akita" aria-hidden="true">${akitaSVG()}
            <div class="akita-umbrella">${umbrellaSVG()}</div>
            <p class="thought thought--akita">${c.akitaThought}</p>
            <p class="thought thought--umbrella">${c.umbrellaThought}</p>
          </div>
          <button class="offering offering--water" type="button" aria-label="${c.waterLabel}">
            ${thimbleSVG()}
          </button>
          <button class="offering offering--seed" type="button" aria-label="${c.seedLabel}">
            ${seedCubeSVG()}
          </button>
        </div>
        <div class="scene-after" hidden>
          <p class="after-main">${c.afterMain}</p>
          ${c.afterNotes.map((n) => `<p class="editorial">${n}</p>`).join("")}
          <button class="btn-leaf" type="button">${leafButtonSVG()}<span>${c.next}</span></button>
        </div>
      </div>
      <footer class="scene-foot">
        <p class="scene-instruction">${c.instruction}</p>
        <p class="gag" hidden></p>
      </footer>
    `;
    el.prepend(createBotanicalShadows("shadow-layer--edges"));
    this.el = el;

    const stage = el.querySelector<HTMLElement>(".offer-stage")!;
    const plant = el.querySelector<HTMLElement>(".offer-plant")!;
    const waterEl = el.querySelector<HTMLElement>(".offering--water")!;

    this.water = new DraggableOffering({
      el: waterEl,
      target: plant,
      surface: stage,
      magnetRadius: 130,
      onPlaced: () => this.waterPlaced(),
    });
    this.seed = new DraggableOffering({
      el: el.querySelector<HTMLElement>(".offering--seed")!,
      target: plant,
      surface: stage,
      magnetRadius: 130,
      onPlaced: () => this.seedPlaced(),
    });

    // vertidos extra: el dedal descansa junto a la maceta y se puede tocar
    waterEl.addEventListener("click", () => this.pourAgain());

    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("light");
    });

    // reanudación: si ya estaban colocados, restaurar
    if (ctx.state.waterPlaced) this.water.place();
    if (ctx.state.seedPlaced) this.seed.place();
    return el;
  }

  private waterPlaced(): void {
    if (!this.el) return;
    const c = content.offerings;
    this.el.classList.add("water-done");
    this.dropOnce();
    this.setSoak(1);
    this.ctx.audio.drop();
    this.ctx.announce(c.waterAnnouncement);
    this.showThought(".thought--cat");

    // el dedal se queda cerca, por si acaso
    const waterEl = this.el.querySelector<HTMLElement>(".offering--water")!;
    this.water?.nudge(-58, 26);
    waterEl.classList.add("is-resting");
    waterEl.removeAttribute("aria-disabled");
    waterEl.tabIndex = 0;
    waterEl.setAttribute("aria-label", c.pourAgainLabel);

    if (!this.ctx.state.waterPlaced) {
      this.ctx.state.waterPlaced = true;
      this.ctx.save();
    }
    this.checkBoth();
  }

  private seedPlaced(): void {
    if (!this.el) return;
    const c = content.offerings;
    this.el.classList.add("seed-done");
    this.ctx.audio.woodTap();
    this.ctx.announce(c.seedAnnouncement);
    this.showThought(".thought--akita");
    if (!this.ctx.state.seedPlaced) {
      this.ctx.state.seedPlaced = true;
      this.ctx.save();
    }
    this.checkBoth();
  }

  /** Relanza la gota (retrigger de la animación CSS). */
  private dropOnce(): void {
    const drop = this.el?.querySelector<HTMLElement>(".water-drop");
    if (!drop) return;
    drop.classList.remove("drip");
    void drop.offsetWidth;
    drop.classList.add("drip");
  }

  private setSoak(level: number): void {
    const plant = this.el?.querySelector<HTMLElement>(".offer-plant");
    if (!plant) return;
    plant.classList.remove("soak-1", "soak-2", "soak-3");
    if (level > 0) plant.classList.add(`soak-${Math.min(level, 3)}`);
  }

  /** Humor: verter de más ahoga a la planta y reinicia el gesto del agua. */
  private pourAgain(): void {
    if (
      !this.el ||
      this.flooding ||
      this.poursLocked ||
      !this.water?.isPlaced ||
      !this.el.querySelector(".offering--water.is-resting")
    ) {
      return;
    }
    this.extraPours++;
    const waterEl = this.el.querySelector<HTMLElement>(".offering--water")!;
    waterEl.classList.remove("is-pouring");
    void waterEl.offsetWidth;
    waterEl.classList.add("is-pouring");
    this.dropOnce();
    this.setSoak(1 + this.extraPours);
    this.ctx.audio.drop();

    if (this.extraPours >= POURS_BEFORE_FLOOD) {
      this.flood();
    }
  }

  private flood(): void {
    if (!this.el || this.flooding) return;
    this.flooding = true;
    const c = content.offerings;
    const el = this.el;
    el.classList.add("is-flooded");
    this.ctx.audio.drop();
    this.ctx.audio.rustle(1.2);
    this.showGag(c.floodGag, c.floodEditorial);
    this.showThought(".thought--umbrella");
    this.ctx.announce(c.floodAnnouncement);

    // el agua se reinicia; la semilla, paciente, se queda
    this.timers.push(
      window.setTimeout(
        () => {
          if (!this.el) return;
          el.classList.remove("is-flooded", "water-done");
          const waterEl = el.querySelector<HTMLElement>(".offering--water")!;
          waterEl.classList.remove("is-resting", "is-pouring");
          waterEl.setAttribute("aria-label", c.waterLabel);
          this.water?.reset();
          this.extraPours = 0;
          this.setSoak(0);
          this.hideGag();
          this.flooding = false;
          this.ctx.state.waterPlaced = false;
          this.ctx.save();
        },
        this.ctx.reducedMotion() ? 1600 : 3000
      )
    );
  }

  private showGag(gag: string, editorial: string): void {
    const foot = this.el?.querySelector<HTMLElement>(".scene-foot");
    const gagEl = this.el?.querySelector<HTMLElement>(".gag");
    if (!foot || !gagEl) return;
    foot.classList.add("is-gagging");
    gagEl.innerHTML = `<em>${gag}</em> ${editorial}`;
    gagEl.hidden = false;
  }

  private hideGag(): void {
    const foot = this.el?.querySelector<HTMLElement>(".scene-foot");
    const gagEl = this.el?.querySelector<HTMLElement>(".gag");
    if (!foot || !gagEl) return;
    foot.classList.remove("is-gagging");
    gagEl.hidden = true;
  }

  private showThought(selector: string): void {
    const t = this.el?.querySelector<HTMLElement>(selector);
    if (!t) return;
    t.classList.add("is-visible");
    this.timers.push(
      window.setTimeout(() => t.classList.remove("is-visible"), 3200)
    );
  }

  private checkBoth(): void {
    if (!this.el || !this.ctx.state.waterPlaced || !this.ctx.state.seedPlaced) return;
    const c = content.offerings;
    this.poursLocked = true;
    const plant = this.el.querySelector<HTMLElement>(".offer-plant")!;
    const waterEl = this.el.querySelector<HTMLElement>(".offering--water")!;
    waterEl.classList.add("is-done");
    waterEl.tabIndex = -1;
    const delay = this.ctx.reducedMotion() ? 200 : 1100;
    this.timers.push(
      window.setTimeout(() => {
        if (!this.el) return;
        plant.classList.remove("plant--dormant");
        plant.classList.add("plant--sprout");
        this.el.classList.add("sprout-born");
        this.ctx.audio.sprout();
        this.ctx.announce(c.sproutAnnouncement);

        const after = this.el.querySelector<HTMLElement>(".scene-after")!;
        const foot = this.el.querySelector<HTMLElement>(".scene-foot")!;
        this.timers.push(
          window.setTimeout(
            () => {
              foot.classList.add("is-hidden");
              after.hidden = false;
              after.classList.add("is-visible");
            },
            this.ctx.reducedMotion() ? 150 : 1300
          )
        );
      }, delay)
    );
  }

  destroy(): void {
    this.water?.destroy();
    this.seed?.destroy();
    this.water = null;
    this.seed = null;
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
    this.el = null;
  }
}
