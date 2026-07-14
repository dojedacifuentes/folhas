import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { createBotanicalShadows } from "../art/BotanicalShadows";
import { renderSeed } from "../art/objects/InteractiveObjects";
import { leafSVG } from "../art/svgLibrary";

export class CoverScene implements Scene {
  readonly id = "cover" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private opened = false;
  private whisperShown = false;
  private timers: number[] = [];

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
    this.opened = false;
    this.whisperShown = false;
    const c = content.cover;
    const el = document.createElement("section");
    el.className = "scene scene--cover";
    el.setAttribute("aria-label", c.title);
    el.innerHTML = `
      ${renderSeed({
        interactive: false,
        decorative: true,
        className: "cover-cube",
      })}
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

    el.querySelector<HTMLButtonElement>(".cover-leaf")!.addEventListener(
      "click",
      () => this.open()
    );
    return el;
  }

  private open(): void {
    if (this.opened || !this.el) return;
    this.opened = true;
    this.ctx.onFirstInteraction();
    this.ctx.audio.rustle(1);

    const leaf = this.el.querySelector<HTMLButtonElement>(".cover-leaf")!;
    leaf.disabled = true;
    leaf.classList.add("is-flying");
    if (!this.whisperShown) {
      this.whisperShown = true;
      this.el.querySelector(".cover-whisper")!.classList.add("is-visible");
    }

    // La cubierta se abre como una página; las sombras cambian de dirección.
    this.el.classList.add("cover--open");
    this.ctx.state.coverOpened = true;
    this.ctx.save();

    const delay = this.ctx.reducedMotion() ? 150 : 780;
    this.timers.push(window.setTimeout(() => this.ctx.goTo("clear-space"), delay));
  }

  destroy(): void {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers = [];
    this.el = null;
  }
}
