import { content } from "../app/content";
import type { Scene, SceneContext } from "../app/SceneManager";
import { pickLine } from "../app/speech";
import { setSceneVisualState } from "../app/visualState";
import { renderDani } from "../art/characters/DaniCharacter";
import { renderDiego } from "../art/characters/DiegoCharacter";
import {
  renderSeed,
  setInteractiveObjectState,
} from "../art/objects/InteractiveObjects";
import { renderPlantCharacter } from "../art/PlantCharacter";
import { renderShadowSystem } from "../art/ShadowSystem";
import { leafSVG } from "../art/svgLibrary";
import { pixelPlaceholder, createPixelSprite } from "../art/pixel/engine";
import { sunflowerSprite } from "../art/pixel/world";
import { createEmote, type EmoteKind } from "../art/pixel/emote";
import { LivingPlant } from "../art/pixel/LivingPlant";

export class FinalScene implements Scene {
  readonly id = "final" as const;
  private el: HTMLElement | null = null;
  private ctx!: SceneContext;
  private timers: number[] = [];
  private living: LivingPlant | null = null;

  mount(ctx: SceneContext): HTMLElement {
    this.ctx = ctx;
    const c = content.final;

    // la etiqueta usa lo que de verdad pasó en esta partida
    const mem = ctx.state.memory;
    const found = new Date(ctx.state.startedAt);
    const foundDate = `${String(found.getDate()).padStart(2, "0")}.${String(
      found.getMonth() + 1
    ).padStart(2, "0")}.${found.getFullYear()}`;
    const labelLines = [
      `${c.label.foundPrefix}${foundDate}`,
      mem.flooded ? c.label.waterIncidents : c.label.waterOk,
      mem.burned ? c.label.lightIncidents : c.label.lightOk,
      ...(mem.gusted ? [c.label.windIncidents] : []),
      ...(mem.wrongSeeds > 0 ? [c.label.seedIncidents] : []),
      c.label.status,
      c.label.signature,
    ];
    const memoryLine = mem.burned
      ? c.closingMemoryLines.burned
      : mem.flooded
        ? c.closingMemoryLines.flooded
        : c.closingMemoryLines.clean;
    const closing = Math.random() < 0.5 ? memoryLine : pickLine(c.closingLines);

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
          ${renderShadowSystem({
            mode: "final",
            className: "final-shadow-system",
            progress: 1,
            shelter: 1,
            intensity: 0.7,
            length: 0.82,
            angle: 3,
          })}
          <div class="final-glow" aria-hidden="true"></div>
          <div class="final-garden" aria-hidden="true"></div>
          <div class="final-drifting-leaf" aria-hidden="true">${leafSVG(3)}</div>
          <button class="final-cat final-tap" type="button" aria-label="${c.daniLabel}">
            ${renderDani({
              state: "sleeping",
              angle: "three-quarter-right",
              facing: "right",
              reducedMotion: ctx.reducedMotion(),
            })}
            <p class="thought thought--cat">${c.catThought}</p>
          </button>
          <div class="final-plant-wrap">
            <button class="final-plant plant-wrap" type="button" aria-label="${c.plantLabel}">
              ${renderPlantCharacter({ state: "healthy", decorative: true })}
            </button>
            ${pixelPlaceholder("sunflower", "idle", { decorative: true, className: "final-sunflower" })}
            <div class="final-mantita" aria-hidden="true"></div>
          </div>
          <button class="final-akita final-tap" type="button" aria-label="${c.diegoLabel}">
            ${renderDiego({
              state: "protecting",
              angle: "three-quarter-left",
              facing: "left",
              reducedMotion: ctx.reducedMotion(),
            })}
            <p class="thought thought--akita">${c.akitaThought}</p>
          </button>
          ${renderSeed({ label: c.cubeLabel, className: "final-cube" })}
          <div class="final-lamp" aria-hidden="true">
            ${pixelPlaceholder("lamp", "idle", { decorative: true })}
          </div>
          <div class="final-label" aria-label="Etiqueta botánica del ejemplar">
            <p class="final-label__species">${c.label.species}</p>
            <p class="final-label__line final-label__keeper">${c.label.keeper}</p>
            ${labelLines.map((line) => `<p class="final-label__line">${line}</p>`).join("")}
            <p class="final-label__ainda" lang="pt">${c.label.ainda}</p>
            ${pixelPlaceholder("paw", "idle", { decorative: true, className: "final-paw" })}
          </div>
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
          <p class="final-line final-line--closing" style="--i:${c.lines.length + c.dedication.length + 2}">${closing}</p>
        </div>
      </div>
    `;
    this.el = el;

    setSceneVisualState(el, {
      daniState: "sleeping",
      diegoState: "protecting",
      plantState: "healthy",
      instruction: "",
      interactionEnabled: true,
      completed: true,
    });
    window.requestAnimationFrame(() => {
      if (!this.el) return;
      setSceneVisualState(this.el, {
        daniState: "sleeping",
        diegoState: "protecting",
        plantState: "flowering",
        instruction: "",
        interactionEnabled: true,
        completed: true,
      });
    });

    if (!ctx.state.finalReached) ctx.state.finalReached = true;
    ctx.state.currentScene = "final";
    ctx.save();
    ctx.audio.startBreath();

    if (ctx.reducedMotion()) el.classList.add("text-shown");
    else this.timers.push(window.setTimeout(() => el.classList.add("text-shown"), 400));

    // la planta cobra vida (habla y reacciona al cursor)
    const plantCanvas = el.querySelector<HTMLElement>(
      '.final-plant canvas[data-character="plant"]'
    );
    const plantWrap = el.querySelector<HTMLElement>(".final-plant-wrap");
    if (plantCanvas && plantWrap) {
      this.living = new LivingPlant({
        plant: plantCanvas,
        container: plantWrap,
        reducedMotion: ctx.reducedMotion(),
        minDelay: 5000,
        maxDelay: 9000,
      });
      this.living.start();
    }

    // pensamientos tardíos
    this.timers.push(
      window.setTimeout(() => this.showThought(".thought--cat"), 11000),
      window.setTimeout(() => this.showThought(".thought--akita"), 18000)
    );

    // secuencia de cierre: girasol → muchos → juntos → mantita
    const bloomDelay = ctx.reducedMotion() ? 200 : 3200;
    this.timers.push(window.setTimeout(() => this.bloomFinale(), bloomDelay));

    this.wireInteractions(el);
    return el;
  }

  private bloomFinale(): void {
    if (!this.el) return;
    const stage = this.el.querySelector<HTMLElement>(".final-stage")!;
    stage.classList.add("is-blooming");
    this.ctx.audio.sprout();
    this.ctx.announce(content.final.bloomAnnouncement);

    // muchos girasoles brotan por el jardín, escalonados
    const garden = this.el.querySelector<HTMLElement>(".final-garden")!;
    const spots = [8, 20, 30, 44, 58, 70, 82, 92];
    spots.forEach((left, i) => {
      const t = window.setTimeout(
        () => {
          if (!garden.isConnected) return;
          const holder = document.createElement("div");
          holder.className = "garden-flower";
          holder.style.left = `${left}%`;
          holder.style.setProperty("--gh", `${60 + (i % 3) * 14}%`);
          holder.appendChild(
            createPixelSprite(sunflowerSprite(true), { decorative: true })
          );
          garden.appendChild(holder);
        },
        this.ctx.reducedMotion() ? 0 : 500 + i * 260
      );
      this.timers.push(t);
    });

    // Dani y Diego se juntan, con un corazón entre ambos
    const togetherDelay = this.ctx.reducedMotion() ? 60 : 1400;
    this.timers.push(
      window.setTimeout(() => {
        if (!this.el) return;
        stage.classList.add("together");
        this.emoteAt(50, 46, "heart");
        this.ctx.announce(content.final.abrazo);
      }, togetherDelay)
    );

    // y una mantita pequeña les llega al regazo, sin tapar a nadie
    const mantitaDelay = this.ctx.reducedMotion() ? 120 : 6200;
    this.timers.push(
      window.setTimeout(() => {
        if (!this.el) return;
        stage.classList.add("tucked");
        this.emoteAt(50, 70, "cold");
        this.ctx.audio.rustle(0.5);
        this.timers.push(
          window.setTimeout(() => this.emoteAt(50, 66, "heart"), 1200)
        );
      }, mantitaDelay)
    );
  }

  private wireInteractions(el: HTMLElement): void {
    // Dani: arrullo (nanai)
    const cat = el.querySelector<HTMLButtonElement>(".final-cat")!;
    cat.addEventListener("click", () => {
      this.emoteAt(22, 52, "sleep");
      this.ctx.audio.rustle(0.35);
    });

    // Diego: abrazo (se juntan)
    const akita = el.querySelector<HTMLButtonElement>(".final-akita")!;
    akita.addEventListener("click", () => {
      el.querySelector(".final-stage")?.classList.add("together");
      this.emoteAt(50, 46, "heart");
      this.ctx.audio.woodTap();
    });

    // cubo que gira
    const cube = el.querySelector<HTMLButtonElement>(".final-cube")!;
    cube.addEventListener("click", () => {
      if (cube.classList.contains("is-spinning")) return;
      cube.classList.add("is-spinning");
      setInteractiveObjectState(cube, "active");
      this.ctx.audio.woodTap();
      this.timers.push(
        window.setTimeout(() => {
          cube.classList.remove("is-spinning");
          setInteractiveObjectState(cube, "idle");
        }, 900)
      );
    });

    // planta: se inclina hacia el toque
    const plant = el.querySelector<HTMLButtonElement>(".final-plant")!;
    plant.addEventListener("click", (e) => {
      const r = plant.getBoundingClientRect();
      const side = e.clientX - r.left < r.width / 2 ? "lean-left" : "lean-right";
      plant.classList.add(side);
      this.ctx.audio.rustle(0.5);
      this.timers.push(
        window.setTimeout(() => plant.classList.remove("lean-left", "lean-right"), 1500)
      );
    });
  }

  /** Muestra un emoticón flotante en (x%, y%) del escenario final. */
  private emoteAt(xPct: number, yPct: number, kind: EmoteKind): void {
    const stage = this.el?.querySelector<HTMLElement>(".final-stage");
    if (!stage) return;
    const holder = document.createElement("div");
    holder.className = "float-emote";
    holder.style.left = `${xPct}%`;
    holder.style.top = `${yPct}%`;
    holder.appendChild(createEmote(kind, { className: "float-emote__art" }));
    stage.appendChild(holder);
    holder.addEventListener("animationend", () => holder.remove(), { once: true });
    this.timers.push(window.setTimeout(() => holder.isConnected && holder.remove(), 2200));
  }

  private showThought(selector: string): void {
    const t = this.el?.querySelector<HTMLElement>(selector);
    if (!t) return;
    t.classList.add("is-visible");
    this.timers.push(window.setTimeout(() => t.classList.remove("is-visible"), 6000));
  }

  destroy(): void {
    this.ctx.audio.stopBreath();
    this.living?.destroy();
    this.living = null;
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
    this.el = null;
  }
}
