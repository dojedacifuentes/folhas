import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { leafSVG, seedCubeSVG } from "../art/svgLibrary";
import { createBotanicalShadows } from "../art/BotanicalShadows";

export class CoverScene implements Scene {
  readonly id = "cover" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private opened = false;
  private activeId: number | null = null;
  private startX = 0;
  private startY = 0;
  private whisperShown = false;

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
    const c = content.cover;
    const el = document.createElement("section");
    el.className = "scene scene--cover";
    el.setAttribute("aria-label", c.title);
    el.innerHTML = `
      <div class="cover-cube" aria-hidden="true">${seedCubeSVG()}</div>
      <header class="cover-titles">
        <h1 class="cover-title">${c.title}</h1>
        <p class="cover-subtitle">${c.subtitle}</p>
      </header>
      <div class="cover-leaf-area">
        <p class="cover-whisper" aria-hidden="true">${c.whisper}</p>
        <button class="cover-leaf" type="button" aria-label="${c.leafLabel}">
          ${leafSVG(1, "cover-leaf-svg")}
        </button>
      </div>
      <p class="scene-instruction">${c.instruction}</p>
    `;
    el.prepend(createBotanicalShadows("shadow-layer--cover"));
    this.el = el;

    const leaf = el.querySelector<HTMLButtonElement>(".cover-leaf")!;
    leaf.addEventListener("pointerdown", this.onDown);
    leaf.addEventListener("pointermove", this.onMove);
    leaf.addEventListener("pointerup", this.onUp);
    leaf.addEventListener("pointercancel", this.onUp);
    leaf.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.open(true);
      }
    });
    return el;
  }

  private travel(): number {
    // recorrido de referencia: 42% del ancho de la escena, mínimo 180px
    const w = this.el?.getBoundingClientRect().width ?? 600;
    return Math.max(180, w * 0.42);
  }

  private onDown = (e: PointerEvent): void => {
    if (this.opened || this.activeId !== null) return;
    this.activeId = e.pointerId;
    this.startX = e.clientX;
    this.startY = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  private onMove = (e: PointerEvent): void => {
    if (this.opened || e.pointerId !== this.activeId || !this.el) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const leaf = this.el.querySelector<HTMLElement>(".cover-leaf")!;
    leaf.style.transform = `translate(${dx}px, ${dy * 0.5}px) rotate(${dx * 0.06}deg)`;

    if (!this.whisperShown && Math.hypot(dx, dy) > 8) {
      this.whisperShown = true;
      this.el.querySelector(".cover-whisper")!.classList.add("is-visible");
    }
    if (Math.abs(dx) > this.travel() * 0.35) {
      this.open(false, dx > 0 ? 1 : -1);
    }
  };

  private onUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.activeId) return;
    this.activeId = null;
    if (this.opened || !this.el) return;
    const leaf = this.el.querySelector<HTMLElement>(".cover-leaf")!;
    leaf.classList.add("is-returning");
    leaf.style.transform = "translate(0px, 0px) rotate(0deg)";
    window.setTimeout(() => leaf.classList.remove("is-returning"), 600);
  };

  private open(fromKeyboard: boolean, dir = 1): void {
    if (this.opened || !this.el) return;
    this.opened = true;
    this.activeId = null;
    this.ctx.onFirstInteraction();
    this.ctx.audio.rustle(1);

    const leaf = this.el.querySelector<HTMLElement>(".cover-leaf")!;
    leaf.classList.add("is-flying");
    leaf.style.transform = `translate(${dir * this.travel() * 1.9}px, ${-60 - Math.random() * 40}px) rotate(${dir * 50}deg)`;
    if (fromKeyboard) leaf.blur();

    // la cubierta se abre como una página; las sombras cambian de dirección
    this.el.classList.add("cover--open");

    this.ctx.state.coverOpened = true;
    this.ctx.save();
    const delay = this.ctx.reducedMotion() ? 150 : 780;
    window.setTimeout(() => this.ctx.goTo("clear-space"), delay);
  }

  destroy(): void {
    this.el = null;
  }
}
