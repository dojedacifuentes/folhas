/**
 * Atmósfera global: la página se inclina apenas hacia el cursor (como un
 * papel sobre la mesa) y unas motas de polvo flotan en la luz. Todo es
 * decorativo, lento y se apaga con `prefers-reduced-motion` o con la
 * pestaña oculta.
 */

const SCENE_SEQUENCE = ["cover", "clear", "offerings", "care", "final"];

export function initAtmosphere(): void {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  // --- polvo ambiental sobre la mesa ---
  const dust = document.createElement("div");
  dust.id = "ambient-dust";
  dust.setAttribute("aria-hidden", "true");
  dust.innerHTML = "<i></i>".repeat(7);
  document.body.appendChild(dust);

  // --- progreso discreto: cinco puntitos, uno por lámina ---
  const progress = document.createElement("div");
  progress.id = "scene-progress";
  progress.setAttribute("aria-hidden", "true");
  progress.innerHTML = "<i></i>".repeat(SCENE_SEQUENCE.length);
  document.body.appendChild(progress);

  const dots = Array.from(progress.querySelectorAll("i"));
  const syncProgress = (): void => {
    const scene = document.querySelector<HTMLElement>(".scene");
    if (!scene) return;
    const idx = SCENE_SEQUENCE.findIndex((k) =>
      scene.classList.contains(`scene--${k}`)
    );
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === idx);
      dot.classList.toggle("is-done", idx >= 0 && i < idx);
    });
  };
  const app = document.querySelector("#app");
  if (app) {
    new MutationObserver(syncProgress).observe(app, {
      childList: true,
      subtree: true,
      attributeFilter: ["class"],
    });
  }
  syncProgress();

  // --- inclinación de página: lerp suave hacia el cursor ---
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  let raf: number | null = null;
  const root = document.documentElement;

  const step = (): void => {
    curX += (targetX - curX) * 0.055;
    curY += (targetY - curY) * 0.055;
    root.style.setProperty("--tilt-x", `${curX.toFixed(3)}deg`);
    root.style.setProperty("--tilt-y", `${curY.toFixed(3)}deg`);
    if (Math.abs(targetX - curX) + Math.abs(targetY - curY) > 0.002) {
      raf = window.requestAnimationFrame(step);
    } else {
      raf = null;
    }
  };

  const onMove = (e: PointerEvent): void => {
    if (reduced.matches || document.hidden) return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    // giro máximo ±0.55deg: presencia física, nunca efecto 3D llamativo
    targetX = nx * 1.1;
    targetY = ny * -0.9;
    if (raf === null) raf = window.requestAnimationFrame(step);
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && raf !== null) {
      window.cancelAnimationFrame(raf);
      raf = null;
    }
  });
}
