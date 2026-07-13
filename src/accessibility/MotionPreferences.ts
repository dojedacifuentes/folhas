export class MotionPreferences {
  private mq: MediaQueryList;
  private listeners: Array<(reduced: boolean) => void> = [];

  constructor() {
    this.mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.mq.addEventListener("change", () => {
      document.documentElement.classList.toggle("reduced-motion", this.reduced);
      this.listeners.forEach((cb) => cb(this.reduced));
    });
    document.documentElement.classList.toggle("reduced-motion", this.reduced);
  }

  get reduced(): boolean {
    return this.mq.matches;
  }

  onChange(cb: (reduced: boolean) => void): void {
    this.listeners.push(cb);
  }
}
