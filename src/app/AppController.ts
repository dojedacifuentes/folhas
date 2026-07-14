import { content } from "./content";
import {
  canAdvanceTo,
  defaultState,
  sanitizeState,
  type ExperienceState,
  type SceneId,
} from "./state";
import { SceneManager, type Scene, type SceneContext } from "./SceneManager";
import { StorageManager } from "../storage/StorageManager";
import { Soundscape } from "../audio/Soundscape";
import { MotionPreferences } from "../accessibility/MotionPreferences";
import { soundIconSVG } from "../art/svgLibrary";
import { CoverScene } from "../scenes/CoverScene";
import { ClearSpaceScene } from "../scenes/ClearSpaceScene";
import { OfferingsScene } from "../scenes/OfferingsScene";
import { CareScene } from "../scenes/CareScene";
import { FinalScene } from "../scenes/FinalScene";

export class AppController {
  private root: HTMLElement;
  private storage = new StorageManager();
  private state: ExperienceState;
  private audio = new Soundscape();
  private motion = new MotionPreferences();
  private manager!: SceneManager;
  private liveRegion!: HTMLElement;
  private chrome!: HTMLElement;
  private soundBtn!: HTMLButtonElement;
  private chromeShown = false;
  private announceTimer: number | null = null;

  constructor(root: HTMLElement) {
    this.root = root;
    this.state = this.storage.load();
    this.audio.setEnabled(this.state.audioEnabled);
  }

  start(): void {
    this.root.innerHTML = `
      <main id="stage" class="stage" aria-label="${content.cover.title}"></main>
      <div class="sr-live" aria-live="polite"></div>
      <div class="chrome" hidden>
        <button class="chrome-restart" type="button" aria-label="${content.chrome.restartLabel}">
          ${content.chrome.restart}
        </button>
        <button class="chrome-sound" type="button" aria-pressed="${this.state.audioEnabled}"
          aria-label="${content.chrome.soundLabel}">${soundIconSVG()}</button>
      </div>
    `;
    const stage = this.root.querySelector<HTMLElement>("#stage")!;
    this.liveRegion = this.root.querySelector<HTMLElement>(".sr-live")!;
    this.chrome = this.root.querySelector<HTMLElement>(".chrome")!;
    this.soundBtn = this.root.querySelector<HTMLButtonElement>(".chrome-sound")!;
    this.soundBtn.classList.toggle("is-on", this.state.audioEnabled);

    this.soundBtn.addEventListener("click", () => {
      this.state.audioEnabled = !this.state.audioEnabled;
      this.audio.setEnabled(this.state.audioEnabled);
      this.soundBtn.setAttribute("aria-pressed", String(this.state.audioEnabled));
      this.soundBtn.classList.toggle("is-on", this.state.audioEnabled);
      this.announce(
        this.state.audioEnabled ? content.chrome.soundOn : content.chrome.soundOff
      );
      if (this.state.audioEnabled) this.audio.rustle(0.7);
      this.save();
    });

    this.root
      .querySelector<HTMLButtonElement>(".chrome-restart")!
      .addEventListener("click", () => this.restart());

    const ctx: SceneContext = {
      state: this.state,
      save: () => this.save(),
      goTo: (id) => this.goTo(id),
      audio: this.audio,
      reducedMotion: () => this.motion.reduced,
      announce: (message) => this.announce(message),
      onFirstInteraction: () => this.showChrome(),
    };

    this.manager = new SceneManager(stage, (id) => this.makeScene(id), ctx);

    // StorageManager ya valido la escena reanudada y todos sus hitos.
    const initial: SceneId = this.state.currentScene;
    if (initial !== "cover") this.showChrome();
    this.applySceneAppearance(initial);
    this.manager.show(initial);
  }

  private makeScene(id: SceneId): Scene {
    switch (id) {
      case "cover":
        return new CoverScene();
      case "clear-space":
        return new ClearSpaceScene();
      case "offerings":
        return new OfferingsScene();
      case "care":
        return new CareScene();
      case "final":
        return new FinalScene();
    }
  }

  private goTo(id: SceneId): boolean {
    if (!canAdvanceTo(this.state, id)) return false;

    const accepted = this.manager.show(id);
    if (!accepted) return false;

    // Persistir solo despues de que SceneManager acepte la transicion evita
    // que el estado avance mientras la interfaz permanece en otra sala.
    this.state.currentScene = id;
    this.save();
    this.applySceneAppearance(id);
    return true;
  }

  private showChrome(): void {
    if (this.chromeShown) return;
    this.chromeShown = true;
    this.chrome.hidden = false;
  }

  private restart(): void {
    const audio = this.state.audioEnabled;
    const accepted = this.manager.show("cover", { force: true });
    if (!accepted) return;

    this.storage.clear();
    Object.assign(this.state, defaultState());
    this.state.audioEnabled = audio; // la preferencia de sonido se respeta
    this.save();
    this.audio.stopBreath();
    this.applySceneAppearance("cover");

    this.chromeShown = false;
    this.chrome.hidden = true;
    if (this.announceTimer !== null) {
      window.clearTimeout(this.announceTimer);
      this.announceTimer = null;
    }
    this.liveRegion.textContent = "";
  }

  private save(): void {
    Object.assign(this.state, sanitizeState(this.state));
    this.storage.save(this.state);
  }

  private applySceneAppearance(id: SceneId): void {
    // Las salas de interacción conservan el papel claro; el final es nocturno.
    this.root.classList.toggle("on-dark", id === "final");
  }

  private announce(message: string): void {
    if (this.announceTimer !== null) {
      window.clearTimeout(this.announceTimer);
    }
    this.liveRegion.textContent = "";
    this.announceTimer = window.setTimeout(() => {
      this.liveRegion.textContent = message;
      this.announceTimer = null;
    }, 60);
  }
}
