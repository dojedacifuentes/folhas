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

  // arrastre de la hoja
  private activeId: number | null = null;
  private startX = 0;
  private startY = 0;
  private moved = false;
  private suppressClick = false;

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
        <p class="cover-whisper" aria-hidden="true" lang="pt">${c.whisper}</p>
        <button class="cover-leaf" type="button" aria-label="${c.leafLabel}">
          ${leafSVG(1, "cover-leaf-svg")}
        </button>
      </div>
      <p class="scene-instruction">${c.instruction}</p>
    `;
    el.prepend(createBotanicalShadows("shadow-layer--cover"));
    this.el = el;

    const leaf = el.querySelector<HTMLButtonElement>(".cover-leaf")!;
    leaf.style.touchAction = "none";
    leaf.addEventListener("pointerdown", this.onDown);
    leaf.addEventListener("pointermove", this.onMove);
    leaf.addEventListener("pointerup", this.onUp);
    leaf.addEventListener("pointercancel", this.onUp);
    leaf.addEventListener("click", this.onClick);
    return el;
  }

  // toque limpio o Enter/Espacio: abrir sin exigir el gesto
  private onClick = (): void => {
    if (this.suppressClick) {
      this.suppressClick = false;
      return;
    }
    this.open(1);
  };

  private travel(): number {
    const w = this.el?.getBoundingClientRect().width ?? 600;
    return Math.max(160, w * 0.4);
  }

  private onDown = (e: PointerEvent): void => {
    if (this.opened || this.activeId !== null) return;
    this.activeId = e.pointerId;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.moved = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  private onMove = (e: PointerEvent): void => {
    if (this.opened || e.pointerId !== this.activeId || !this.el) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;
    const leaf = this.el.querySelector<HTMLElement>(".cover-leaf")!;
    leaf.style.transform = `translate(${dx}px, ${dy * 0.5}px) rotate(${dx * 0.06}deg)`;

    if (!this.moved && Math.hypot(dx, dy) > 8) {
      this.moved = true;
      this.showWhisper();
    }
    if (Math.abs(dx) > this.travel() * 0.35) {
      this.suppressClick = true;
      this.open(dx > 0 ? 1 : -1);
    }
  };

  private onUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.activeId) return;
    this.activeId = null;
    if (this.opened || !this.el) return;
    if (this.moved) {
      // gesto incompleto: la hoja vuelve, sin abrir todavía
      this.suppressClick = true;
      const leaf = this.el.querySelector<HTMLElement>(".cover-leaf")!;
      leaf.classList.add("is-returning");
      leaf.style.transform = "translate(0px, 0px) rotate(0deg)";
      this.timers.push(
        window.setTimeout(() => leaf.classList.remove("is-returning"), 600)
      );
    }
  };

  private showWhisper(): void {
    if (this.whisperShown || !this.el) return;
    this.whisperShown = true;
    this.el.querySelector(".cover-whisper")!.classList.add("is-visible");
  }

  private open(dir: number): void {
    if (this.opened || !this.el) return;
    this.opened = true;
    this.activeId = null;
    this.ctx.onFirstInteraction();
    this.ctx.audio.rustle(1);

    const leaf = this.el.querySelector<HTMLButtonElement>(".cover-leaf")!;
    leaf.disabled = true;
    leaf.classList.add("is-flying");
    leaf.style.transform = `translate(${dir * this.travel() * 1.9}px, -70px) rotate(${dir * 50}deg)`;
    this.showWhisper();

    // La cubierta se abre como una página; las sombras cambian de dirección.
    this.el.classList.add("cover--open");
    this.ctx.state.coverOpened = true;
    this.ctx.save();

    const delay = this.ctx.reducedMotion() ? 150 : 780;
    this.timers.push(window.setTimeout(() => this.ctx.goTo("clear-space"), delay));
  }

  destroy(): void {
    const leaf = this.el?.querySelector<HTMLButtonElement>(".cover-leaf");
    if (leaf) {
      leaf.removeEventListener("pointerdown", this.onDown);
      leaf.removeEventListener("pointermove", this.onMove);
      leaf.removeEventListener("pointerup", this.onUp);
      leaf.removeEventListener("pointercancel", this.onUp);
      leaf.removeEventListener("click", this.onClick);
      if (this.activeId !== null && leaf.hasPointerCapture(this.activeId)) {
        try {
          leaf.releasePointerCapture(this.activeId);
        } catch {
          // la captura pudo liberarse al terminar el gesto
        }
      }
    }
    this.activeId = null;
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers = [];
    this.el = null;
  }
}
