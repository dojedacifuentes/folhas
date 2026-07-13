import type { ExperienceState, SceneId } from "./state";
import type { Soundscape } from "../audio/Soundscape";

export type SceneContext = {
  state: ExperienceState;
  save: () => void;
  goTo: (id: SceneId) => void;
  audio: Soundscape;
  reducedMotion: () => boolean;
  announce: (message: string) => void;
  onFirstInteraction: () => void;
};

export interface Scene {
  readonly id: SceneId;
  /** construye y devuelve el elemento raíz de la escena */
  mount(ctx: SceneContext): HTMLElement;
  destroy(): void;
}

export type SceneFactory = (id: SceneId) => Scene;

const TRANSITION_MS = 750;

/**
 * Monta y desmonta escenas con transiciones de página.
 * Con movimiento reducido, la transición es un fundido corto.
 */
export class SceneManager {
  private stage: HTMLElement;
  private factory: SceneFactory;
  private ctx: SceneContext;
  private current: { scene: Scene; el: HTMLElement } | null = null;
  private transitioning = false;

  constructor(stage: HTMLElement, factory: SceneFactory, ctx: SceneContext) {
    this.stage = stage;
    this.factory = factory;
    this.ctx = ctx;
  }

  show(id: SceneId): void {
    if (this.transitioning) return;
    this.transitioning = true;
    const reduced = this.ctx.reducedMotion();
    const outgoing = this.current;

    const mountNext = () => {
      const scene = this.factory(id);
      const el = scene.mount(this.ctx);
      el.classList.add("scene-enter");
      this.stage.appendChild(el);
      // forzar layout para que la transición ocurra
      void el.offsetWidth;
      el.classList.remove("scene-enter");
      this.current = { scene, el };
      window.setTimeout(
        () => {
          this.transitioning = false;
        },
        reduced ? 60 : TRANSITION_MS
      );
    };

    if (outgoing) {
      outgoing.el.classList.add("scene-leave");
      window.setTimeout(
        () => {
          outgoing.scene.destroy();
          outgoing.el.remove();
          mountNext();
        },
        reduced ? 40 : TRANSITION_MS - 120
      );
    } else {
      mountNext();
    }
  }
}
