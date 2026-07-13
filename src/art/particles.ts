import { leafSVG } from "./svgLibrary";

const MAX_PARTICLES = 12;
let alive = 0;

/**
 * Suelta una pequeña hoja que se desprende cerca del punto (x, y)
 * dentro del contenedor. Nunca hay más de 12 vivas a la vez.
 */
export function spawnLeafParticle(
  container: HTMLElement,
  x: number,
  y: number,
  reducedMotion: boolean
): void {
  if (reducedMotion || alive >= MAX_PARTICLES) return;
  alive++;

  const el = document.createElement("div");
  el.className = "leaf-particle";
  el.innerHTML = leafSVG(1 + Math.floor(Math.random() * 6));
  const drift = (Math.random() - 0.5) * 120;
  const fall = 80 + Math.random() * 120;
  const spin = (Math.random() - 0.5) * 240;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.setProperty("--pdx", `${drift}px`);
  el.style.setProperty("--pdy", `${fall}px`);
  el.style.setProperty("--pspin", `${spin}deg`);
  container.appendChild(el);

  let finished = false;
  let fallbackTimer: number | null = null;
  const done = () => {
    if (finished) return;
    finished = true;
    if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
    el.removeEventListener("animationend", done);
    el.remove();
    alive = Math.max(0, alive - 1);
  };
  el.addEventListener("animationend", done, { once: true });
  // red de seguridad por si la animación no dispara o desmontan el contenedor
  fallbackTimer = window.setTimeout(done, 1600);
}
