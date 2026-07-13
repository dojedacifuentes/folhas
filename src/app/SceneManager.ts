import type { ExperienceState, SceneId } from "./state";
import type { Soundscape } from "../audio/Soundscape";

export type SceneContext = {
  state: ExperienceState;
  save: () => void;
  goTo: (id: SceneId) => boolean;
  audio: Soundscape;
  reducedMotion: () => boolean;
  announce: (message: string) => void;
  onFirstInteraction: () => void;
};

export interface Scene {
  readonly id: SceneId;
  /** construye y devuelve el elemento raiz de la escena */
  mount(ctx: SceneContext): HTMLElement;
  destroy(): void;
}

export type SceneFactory = (id: SceneId) => Scene;

export type ShowSceneOptions = {
  /** Cancela cualquier transicion pendiente. Reservado para reiniciar. */
  force?: boolean;
};

const TRANSITION_MS = 750;

/**
 * Monta una sola escena activa. La escena saliente deja de recibir eventos y
 * de pertenecer al arbol accesible en cuanto comienza la transicion.
 */
export class SceneManager {
  private stage: HTMLElement;
  private factory: SceneFactory;
  private ctx: SceneContext;
  private current: { scene: Scene; el: HTMLElement } | null = null;
  private transitioning = false;
  private transitionVersion = 0;
  private timers = new Set<number>();

  constructor(stage: HTMLElement, factory: SceneFactory, ctx: SceneContext) {
    this.stage = stage;
    this.factory = factory;
    this.ctx = ctx;
  }

  /**
   * Devuelve true solo cuando la solicitud fue aceptada. El llamador puede
   * comprometer currentScene despues de recibir esa confirmacion.
   */
  show(id: SceneId, options: ShowSceneOptions = {}): boolean {
    if (options.force) {
      this.cancelPendingTransition();
    } else if (
      this.transitioning ||
      (this.current !== null && this.current.scene.id === id)
    ) {
      return false;
    }

    this.transitioning = true;
    const version = ++this.transitionVersion;
    const reduced = this.ctx.reducedMotion();
    const outgoing = this.current;

    const mountNext = () => {
      if (version !== this.transitionVersion) return;

      const scene = this.factory(id);
      const el = scene.mount(this.ctx);
      el.inert = false;
      el.removeAttribute("aria-hidden");
      el.classList.add("scene-enter");
      this.stage.appendChild(el);
      this.current = { scene, el };
      this.updateAccessibleContext(el, id);

      // Forzar layout para que la transicion ocurra.
      void el.offsetWidth;
      el.classList.remove("scene-enter");
      // Desde aquí la sala ya es la única activa. Su fundido visual puede
      // continuar sin bloquear una acción rápida ni un reinicio.
      this.transitioning = false;
    };

    if (outgoing) {
      this.current = null;
      outgoing.el.inert = true;
      outgoing.el.setAttribute("aria-hidden", "true");
      outgoing.el.classList.add("scene-leave");
      // Destruir ahora corta de inmediato los recursos que expone la escena.
      outgoing.scene.destroy();

      this.schedule(
        version,
        () => {
          outgoing.el.remove();
          mountNext();
        },
        reduced ? 40 : TRANSITION_MS - 120
      );
    } else {
      mountNext();
    }

    return true;
  }

  private schedule(version: number, callback: () => void, delay: number): void {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      if (version === this.transitionVersion) callback();
    }, delay);
    this.timers.add(timer);
  }

  private cancelPendingTransition(): void {
    this.transitionVersion++;
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();

    if (this.current) {
      this.current.el.inert = true;
      this.current.el.setAttribute("aria-hidden", "true");
      this.current.scene.destroy();
      this.current = null;
    }

    // Tambien retira una escena saliente ya destruida que esperaba su fundido.
    this.stage.replaceChildren();
    this.transitioning = false;
  }

  private updateAccessibleContext(el: HTMLElement, id: SceneId): void {
    this.stage.setAttribute("aria-label", el.getAttribute("aria-label") ?? id);

    const focusTarget = el.querySelector<HTMLElement>("h1, h2") ?? el;
    focusTarget.tabIndex = -1;
    focusTarget.focus({ preventScroll: true });
  }
}
