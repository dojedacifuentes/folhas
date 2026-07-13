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

  const done = () => {
    el.remove();
    alive--;
  };
  el.addEventListener("animationend", done, { once: true });
  // red de seguridad por si la animación no dispara
  window.setTimeout(() => {
    if (el.isConnected) done();
  }, 1600);
}
