import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { createBotanicalShadows } from "../art/BotanicalShadows";
import {
  akitaSVG,
  catSVG,
  leafButtonSVG,
  plantSVG,
  umbrellaSVG,
} from "../art/svgLibrary";

type CarePhase = "rain" | "wind" | "sun";

/**
 * Tres gestos breves dentro de una sola sala. La escena no puntúa: comunica
 * la medida con postura, clima y consecuencias, y reinicia únicamente el
 * momento que recibió demasiado cuidado.
 */
export class CareScene implements Scene {
  readonly id = "care" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private phase: CarePhase = "rain";
  private raf: number | null = null;
  private lastFrame = 0;
  private timers: number[] = [];
  private cleanups: Array<() => void> = [];
  private settled = false;

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
          <button class="btn-leaf" type="button">${leafButtonSVG()}<span>${c.next}</span></button>
        </div>
      </div>
      <footer class="scene-foot care-foot">
        <p class="scene-instruction"></p>
        <button class="link-alt care-alternative" type="button"></button>
      </footer>
    `;
    el.prepend(createBotanicalShadows("shadow-layer--care"));
    this.el = el;

    el.querySelector<HTMLButtonElement>(".btn-leaf")!.addEventListener("click", () => {
      ctx.goTo("light");
    });

    const phase = this.nextIncomplete();
    if (phase) this.renderPhase(phase);
    else this.renderComplete();
    return el;
  }

  private nextIncomplete(): CarePhase | null {
    if (!this.ctx.state.rainBalanced) return "rain";
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
    const instruction = foot.querySelector<HTMLElement>(".scene-instruction")!;
    const alternative = foot.querySelector<HTMLButtonElement>(".care-alternative")!;
    const after = this.el.querySelector<HTMLElement>(".care-after")!;
    const copy = content.care[phase];

    stage.className = `care-stage care-stage--${phase}`;
    stage.removeAttribute("style");
    foot.classList.remove("is-hidden");
    foot.inert = false;
    foot.removeAttribute("aria-hidden");
    instruction.textContent = copy.instruction;
    alternative.textContent = copy.alternative;
    alternative.hidden = false;
    after.hidden = true;
    after.classList.remove("is-visible");

    if (phase === "rain") this.mountRain(stage, alternative);
    if (phase === "wind") this.mountWind(stage, alternative);
    if (phase === "sun") this.mountSun(stage, alternative);
  }

  private commonTableau(
    daniState: string,
    diegoState: string,
    plantState = "plant--sprout"
  ): string {
    return `
      <div class="care-character care-dani" aria-hidden="true">${catSVG(daniState)}</div>
      <div class="care-plant plant-wrap ${plantState}" aria-hidden="true">${plantSVG()}</div>
      <div class="care-character care-diego" aria-hidden="true">${akitaSVG(diegoState)}</div>
      <p class="weather-reaction" aria-hidden="true"></p>
    `;
  }

  private mountRain(stage: HTMLElement, alternative: HTMLButtonElement): void {
    const c = content.care.rain;
    stage.innerHTML = `
      <div class="rain-field" aria-hidden="true">
        ${Array.from({ length: 16 }, (_, i) => `<i style="--i:${i}"></i>`).join("")}
      </div>
      ${this.commonTableau("dani--curious", "diego--protecting")}
      <div class="care-umbrella" aria-hidden="true">${umbrellaSVG()}</div>
      <div class="rain-puddle" aria-hidden="true"><span class="rain-fish">⌁</span></div>
      <label class="weather-slider-label">
        <span class="sr-only">${c.controlLabel}</span>
        <input class="weather-range rain-range" type="range" min="0" max="100" value="50"
          aria-label="${c.controlLabel}">
      </label>
    `;

    const range = stage.querySelector<HTMLInputElement>(".rain-range")!;
    let good = 0;
    let flood = 0;
    let covered = 0;
    let hinted = false;

    const updatePosition = () => {
      const position = Number(range.value);
      const coverage = Math.max(0, 1 - Math.abs(position - 50) / 45);
      stage.style.setProperty("--weather-control", String(position / 100));
      stage.style.setProperty("--rain-coverage", coverage.toFixed(3));
    };
    const onInput = () => updatePosition();
    range.addEventListener("input", onInput);
    this.cleanups.push(() => range.removeEventListener("input", onInput));
    this.bindRangeControl(range, updatePosition);
    updatePosition();

    const onAlternative = () => this.completePhase(c.announcement);
    alternative.addEventListener("click", onAlternative);
    this.cleanups.push(() => alternative.removeEventListener("click", onAlternative));

    this.startFrame((dt) => {
      const position = Number(range.value);
      const coverage = Math.max(0, 1 - Math.abs(position - 50) / 45);
      const balanced = coverage >= 0.3 && coverage <= 0.7;

      good = balanced ? good + dt : Math.max(0, good - dt * 0.14);
      flood = coverage < 0.22 ? flood + dt : Math.max(0, flood - dt * 0.3);
      covered = coverage > 0.84 ? covered + dt : 0;
      stage.style.setProperty(
        "--moisture",
        Math.min(1, flood / 2100 + good / 3000).toFixed(3)
      );

      if (!hinted && covered > 1800) {
        hinted = true;
        this.showHint(c.hint);
      }
      if (flood >= 2100) this.failPhase(c.failure, "is-flooded");
      else if (good >= 1450) this.completePhase(c.announcement);
    });
  }

  private mountWind(stage: HTMLElement, alternative: HTMLButtonElement): void {
    const c = content.care.wind;
    stage.innerHTML = `
      <div class="wind-lines" aria-hidden="true"><i></i><i></i><i></i></div>
      ${this.commonTableau("dani--curious", "diego--serious")}
      <div class="wind-leaves" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="diego-glasses-flight" aria-hidden="true"></div>
      <button class="wind-pad" type="button" aria-label="${c.controlLabel}">
        <span aria-hidden="true">≈</span>
      </button>
    `;
    const pad = stage.querySelector<HTMLButtonElement>(".wind-pad")!;
    let strength = 0;
    let pressing = false;
    let pointerId: number | null = null;

    const start = (event?: PointerEvent) => {
      if (this.settled || pressing) return;
      pressing = true;
      pad.classList.add("is-pressing");
      if (event) {
        pointerId = event.pointerId;
        pad.setPointerCapture(event.pointerId);
      }
    };
    const judge = () => {
      if (!pressing || this.settled) return;
      pressing = false;
      pointerId = null;
      pad.classList.remove("is-pressing");
      if (strength >= 0.34 && strength <= 0.72) {
        this.completePhase(c.announcement);
      } else if (strength > 0.78) {
        this.failPhase(c.failure, "is-wind-failed");
      } else {
        strength *= 0.55;
        stage.style.setProperty("--wind", strength.toFixed(3));
        this.showHint(c.hint);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      event.preventDefault();
      start(event);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (pointerId !== null && event.pointerId !== pointerId) return;
      judge();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      start();
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key !== " " && event.key !== "Enter") return;
      event.preventDefault();
      judge();
    };
    pad.addEventListener("pointerdown", onPointerDown);
    pad.addEventListener("pointerup", onPointerUp);
    pad.addEventListener("pointercancel", onPointerUp);
    pad.addEventListener("keydown", onKeyDown);
    pad.addEventListener("keyup", onKeyUp);
    this.cleanups.push(() => {
      pad.removeEventListener("pointerdown", onPointerDown);
      pad.removeEventListener("pointerup", onPointerUp);
      pad.removeEventListener("pointercancel", onPointerUp);
      pad.removeEventListener("keydown", onKeyDown);
      pad.removeEventListener("keyup", onKeyUp);
    });

    const onAlternative = () => this.completePhase(c.announcement);
    alternative.addEventListener("click", onAlternative);
    this.cleanups.push(() => alternative.removeEventListener("click", onAlternative));

    this.startFrame((dt) => {
      if (!pressing) return;
      strength = Math.min(1.05, strength + dt / 2100);
      stage.style.setProperty("--wind", strength.toFixed(3));
      if (strength >= 1) this.failPhase(c.failure, "is-wind-failed");
    });
  }

  private mountSun(stage: HTMLElement, alternative: HTMLButtonElement): void {
    const c = content.care.sun;
    stage.innerHTML = `
      ${this.commonTableau("dani--worried", "diego--serious")}
      <div class="care-sun" aria-hidden="true"><span></span></div>
      <div class="sun-smoke" aria-hidden="true">?</div>
      <div class="diego-manual" aria-hidden="true"></div>
      <label class="weather-slider-label">
        <span class="sr-only">${c.controlLabel}</span>
        <input class="weather-range sun-range" type="range" min="0" max="100" value="18"
          aria-label="${c.controlLabel}">
      </label>
    `;
    const range = stage.querySelector<HTMLInputElement>(".sun-range")!;
    let good = 0;
    let burn = 0;
    let cool = 0;
    let hinted = false;

    const updateLevel = () => {
      stage.style.setProperty("--sun-level", String(Number(range.value) / 100));
    };
    const onInput = () => updateLevel();
    range.addEventListener("input", onInput);
    this.cleanups.push(() => range.removeEventListener("input", onInput));
    this.bindRangeControl(range, updateLevel);
    updateLevel();

    const onAlternative = () => this.completePhase(c.announcement);
    alternative.addEventListener("click", onAlternative);
    this.cleanups.push(() => alternative.removeEventListener("click", onAlternative));

    this.startFrame((dt) => {
      const level = Number(range.value) / 100;
      const balanced = level >= 0.36 && level <= 0.64;
      good = balanced ? good + dt : Math.max(0, good - dt * 0.16);
      burn = level > 0.8 ? burn + dt : Math.max(0, burn - dt * 0.35);
      cool = level < 0.3 ? cool + dt : 0;
      stage.style.setProperty("--heat", Math.min(1, burn / 1850).toFixed(3));

      if (!hinted && cool > 1800) {
        hinted = true;
        this.showHint(c.hint);
      }
      if (burn >= 1850) this.failPhase(c.failure, "is-sun-failed");
      else if (good >= 1500) this.completePhase(c.announcement);
    });
  }

  private showHint(message: string): void {
    if (!this.el || this.settled) return;
    const reaction = this.el.querySelector<HTMLElement>(".weather-reaction")!;
    reaction.textContent = message;
    reaction.classList.add("is-visible");
    this.timers.push(
      window.setTimeout(() => reaction.classList.remove("is-visible"), 1400)
    );
  }

  /**
   * Hace que toda la superficie del clima sea una pista tolerante. Conserva el
   * input range nativo para lectores de pantalla y añade arrastre/teclado
   * deterministas, incluso cuando el pulgar visual es el paraguas o el sol.
   */
  private bindRangeControl(
    range: HTMLInputElement,
    update: () => void
  ): void {
    let pointerId: number | null = null;
    const setFromPointer = (event: PointerEvent) => {
      const rect = range.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      range.value = String(Math.round(ratio * 100));
      update();
    };
    const onPointerDown = (event: PointerEvent) => {
      pointerId = event.pointerId;
      range.setPointerCapture(event.pointerId);
      setFromPointer(event);
      event.preventDefault();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      setFromPointer(event);
      event.preventDefault();
    };
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId !== pointerId) return;
      pointerId = null;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const current = Number(range.value);
      let next = current;
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") next -= 4;
      else if (event.key === "ArrowRight" || event.key === "ArrowUp") next += 4;
      else if (event.key === "PageDown") next -= 10;
      else if (event.key === "PageUp") next += 10;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = 100;
      else return;
      event.preventDefault();
      range.value = String(Math.max(0, Math.min(100, next)));
      update();
    };

    range.addEventListener("pointerdown", onPointerDown);
    range.addEventListener("pointermove", onPointerMove);
    range.addEventListener("pointerup", onPointerUp);
    range.addEventListener("pointercancel", onPointerUp);
    range.addEventListener("keydown", onKeyDown);
    this.cleanups.push(() => {
      range.removeEventListener("pointerdown", onPointerDown);
      range.removeEventListener("pointermove", onPointerMove);
      range.removeEventListener("pointerup", onPointerUp);
      range.removeEventListener("pointercancel", onPointerUp);
      range.removeEventListener("keydown", onKeyDown);
    });
  }

  private failPhase(message: string, className: string): void {
    if (!this.el || this.settled) return;
    this.settled = true;
    this.cancelFrame();
    const stage = this.el.querySelector<HTMLElement>(".care-stage")!;
    const reaction = stage.querySelector<HTMLElement>(".weather-reaction")!;
    stage.classList.add("is-failure", className);
    reaction.textContent = message;
    reaction.classList.add("is-visible");
    stage
      .querySelectorAll<HTMLInputElement | HTMLButtonElement>("input, button")
      .forEach((control) => (control.disabled = true));
    this.ctx.announce(message);
    this.timers.push(
      window.setTimeout(
        () => this.renderPhase(this.phase),
        this.ctx.reducedMotion() ? 500 : 2100
      )
    );
  }

  private completePhase(announcement: string): void {
    if (!this.el || this.settled) return;
    this.settled = true;
    this.cancelFrame();
    const stage = this.el.querySelector<HTMLElement>(".care-stage")!;
    const foot = this.el.querySelector<HTMLElement>(".care-foot")!;
    stage.classList.add("is-balanced");
    foot.classList.add("is-hidden");
    foot.inert = true;
    foot.setAttribute("aria-hidden", "true");
    this.ctx.announce(announcement);

    if (this.phase === "rain") this.ctx.state.rainBalanced = true;
    if (this.phase === "wind") this.ctx.state.windBalanced = true;
    if (this.phase === "sun") this.ctx.state.sunBalanced = true;
    this.ctx.save();

    this.timers.push(
      window.setTimeout(() => {
        const next = this.nextIncomplete();
        if (next) this.renderPhase(next);
        else this.renderComplete();
      }, this.ctx.reducedMotion() ? 260 : 1050)
    );
  }

  private renderComplete(): void {
    if (!this.el) return;
    this.stopPhase();
    this.settled = true;
    const stage = this.el.querySelector<HTMLElement>(".care-stage")!;
    const foot = this.el.querySelector<HTMLElement>(".care-foot")!;
    const after = this.el.querySelector<HTMLElement>(".care-after")!;
    this.el.dataset.carePhase = "complete";
    stage.className = "care-stage care-stage--complete";
    stage.removeAttribute("style");
    stage.innerHTML = `
      <div class="weather-shelter" aria-hidden="true"></div>
      ${this.commonTableau("dani--curious", "diego--protecting", "plant--full")}
      <div class="stored-umbrella" aria-hidden="true">${umbrellaSVG("umbrella--stored")}</div>
    `;
    foot.classList.add("is-hidden");
    foot.inert = true;
    foot.setAttribute("aria-hidden", "true");
    after.hidden = false;
    requestAnimationFrame(() => {
      after.classList.add("is-visible");
      after.querySelector<HTMLButtonElement>(".btn-leaf")?.focus({ preventScroll: true });
    });
  }

  private startFrame(update: (delta: number) => void): void {
    this.lastFrame = performance.now();
    const frame = (now: number) => {
      if (this.settled) return;
      const delta = document.hidden ? 0 : Math.min(48, now - this.lastFrame);
      this.lastFrame = now;
      update(delta);
      if (!this.settled) this.raf = requestAnimationFrame(frame);
    };
    this.raf = requestAnimationFrame(frame);
  }

  private cancelFrame(): void {
    if (this.raf !== null) cancelAnimationFrame(this.raf);
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
    this.timers = [];
    this.el = null;
  }
}
