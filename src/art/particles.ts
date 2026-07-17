const MAX_PARTICLES = 14;
let alive = 0;

/** Colores otoñales de las hojas pixel de la capa rascable. */
const PIXEL_COLORS = [
  "#dcb658",
  "#c49a3a",
  "#a85a2c",
  "#8f9c5c",
  "#a67a4a",
  "#7e3f1e",
];

/**
 * Suelta una motita pixel (cuadrada) que se desprende cerca del punto (x, y)
 * dentro del contenedor. Nunca hay más de 14 vivas a la vez.
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
  el.className = "leaf-particle leaf-particle--pixel";
  const size = 4 + Math.floor(Math.random() * 4) * 2; // 4..10, pares
  const drift = (Math.random() - 0.5) * 110;
  const fall = 70 + Math.random() * 110;
  const spin = (Math.random() - 0.5) * 160;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.background =
    PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)];
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
