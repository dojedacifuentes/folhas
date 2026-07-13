/**
 * Gramática de ilustración del herbario.
 * Curvas imperfectas, máximo tres tonos por objeto, sombras separadas de la figura.
 * Todos los dibujos son originales y locales.
 */

/** Gato amarillo: intuición, curiosidad, cola como signo de interrogación. */
export function catSVG(extraClass = ""): string {
  return `
<svg class="fig fig-cat ${extraClass}" viewBox="0 0 150 122" role="img" aria-label="Gatito amarillo con la cola curvada como un signo de interrogación" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow" cx="72" cy="112" rx="46" ry="7" fill="var(--shadow)"/>
  <g class="cat-tail-group">
    <path class="cat-tail" d="M108 82 C130 76 137 52 121 43 C111 37 100 44 104 53"
      fill="none" stroke="var(--yellow)" stroke-width="8.5" stroke-linecap="round"/>
    <circle cx="103" cy="64" r="4.4" fill="var(--yellow)"/>
  </g>
  <path class="cat-body" d="M40 108 C30 88 39 63 66 58 C93 53 109 68 105 88 C102 102 85 109 62 109 C53 109 44 111 40 108 Z"
    fill="var(--yellow)"/>
  <ellipse class="cat-paw" cx="52" cy="106" rx="10" ry="5" fill="var(--yellow-soft)"/>
  <g class="cat-head">
    <path class="cat-ear cat-ear--left" d="M30 34 L25 13 L45 25 Z" fill="var(--yellow)"/>
    <path class="cat-ear cat-ear--right" d="M56 24 L70 9 L72 30 Z" fill="var(--yellow)" transform="rotate(13 64 20)"/>
    <path d="M26 52 C21 33 36 20 52 22 C68 24 75 40 68 55 C61 68 32 68 26 52 Z" fill="var(--yellow-soft)"/>
    <path class="cat-eye" d="M39 44 q3.4 3.2 6.6 0" stroke="var(--ink)" fill="none" stroke-width="1.7" stroke-linecap="round"/>
    <circle class="cat-eye" cx="57" cy="43" r="1.8" fill="var(--ink)"/>
    <path d="M47 51 l3 2.4 -3.2 2.2" stroke="var(--ink)" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 50 l-9 -1.4 M25 55 l-8 2.2" stroke="var(--ink)" fill="none" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
    <path d="M69 49 l9 -1.8 M68 54 l8 2.6" stroke="var(--ink)" fill="none" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
  </g>
</svg>`;
}

/** Akita turquesa: constancia, estructura, seriedad levemente absurda. */
export function akitaSVG(extraClass = ""): string {
  return `
<svg class="fig fig-akita ${extraClass}" viewBox="0 0 160 138" role="img" aria-label="Criatura akita turquesa, sentada con seriedad concentrada" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow" cx="80" cy="128" rx="50" ry="7.5" fill="var(--shadow)"/>
  <path class="akita-tail" d="M112 82 C134 74 140 50 120 46 C106 43 102 58 112 62"
    fill="none" stroke="var(--turquoise-dark)" stroke-width="11" stroke-linecap="round"/>
  <path class="akita-body" d="M44 124 C38 96 46 70 80 66 C112 62 126 82 122 104 C119 120 102 126 78 126 C64 126 50 128 44 124 Z"
    fill="var(--turquoise)"/>
  <path class="akita-chest" d="M62 124 C58 104 64 88 80 86 C94 84 100 96 98 110 C96 121 84 125 74 125 Z"
    fill="var(--paper-light)" opacity="0.85"/>
  <rect class="akita-leg" x="58" y="100" width="9" height="26" rx="4.5" fill="var(--turquoise-dark)"/>
  <rect class="akita-leg" x="88" y="100" width="9" height="26" rx="4.5" fill="var(--turquoise-dark)"/>
  <g class="akita-head">
    <path class="akita-ear akita-ear--left" d="M50 29 L49 9 L66 22 Z" fill="var(--turquoise-dark)"/>
    <path class="akita-ear akita-ear--right" d="M82 20 L94 6 L96 25 Z" fill="var(--turquoise-dark)"/>
    <path d="M40 48 C36 26 54 14 74 16 C94 18 102 36 94 54 C86 70 46 68 40 48 Z" fill="var(--turquoise)"/>
    <path class="akita-muzzle" d="M58 46 C58 38 66 34 74 36 C82 38 84 46 80 52 C76 58 60 56 58 46 Z"
      fill="var(--paper-light)" opacity="0.9"/>
    <path d="M67 42 l6 0 M67 46 l0 0" stroke="none"/>
    <circle cx="70" cy="43" r="2.2" fill="var(--ink)"/>
    <path d="M52 36 l8 0" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M82 34 l8 0" stroke="var(--ink)" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M50 30 l7 -2 M84 28 l7 2" stroke="var(--ink)" stroke-width="1.1" stroke-linecap="round" opacity="0.65"/>
  </g>
</svg>`;
}

/**
 * Planta compartida. El estado se controla con clases en el contenedor:
 * .plant--dormant  .plant--sprout  .plant--full
 */
export function plantSVG(extraClass = ""): string {
  return `
<svg class="fig fig-plant ${extraClass}" viewBox="0 0 170 190" role="img" aria-label="Planta pequeña en una maceta azul noche" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow" cx="85" cy="182" rx="44" ry="6" fill="var(--shadow)"/>
  <g class="plant-leaves">
    <g class="plant-leaf plant-leaf--yellow">
      <path d="M84 96 C62 88 46 66 52 46 C74 50 88 72 86 94 Z" fill="var(--yellow)"/>
      <path d="M84 94 C74 82 64 66 58 52" stroke="var(--leaf-dark)" stroke-width="1.2" fill="none" opacity="0.5"/>
    </g>
    <g class="plant-leaf plant-leaf--turquoise">
      <path d="M88 96 C110 90 128 68 122 47 C99 51 84 74 86 94 Z" fill="var(--turquoise)"/>
      <path d="M88 94 C98 82 108 66 116 53" stroke="var(--night)" stroke-width="1.2" fill="none" opacity="0.5"/>
    </g>
    <g class="plant-leaf plant-leaf--green">
      <path d="M85 92 C74 74 76 48 86 34 C97 47 99 74 87 92 Z" fill="var(--green-new)"/>
      <path d="M86 88 C85 72 85 56 86 42" stroke="var(--leaf-dark)" stroke-width="1.2" fill="none" opacity="0.55"/>
    </g>
    <path class="plant-stem" d="M85 118 C84 108 84 100 85 92" stroke="var(--green-new)" stroke-width="4" stroke-linecap="round" fill="none"/>
    <g class="plant-sprout">
      <path d="M85 118 C85 112 85 108 85 104" stroke="var(--green-new)" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M85 105 C79 101 76 93 79 87 C86 90 89 98 86 104 Z" fill="var(--green-new)"/>
    </g>
  </g>
  <ellipse class="plant-soil" cx="85" cy="121" rx="30" ry="7" fill="var(--leaf-dark)"/>
  <path class="plant-pot" d="M52 120 L118 120 L112 172 C111 178 105 181 96 181 L74 181 C65 181 59 178 58 172 Z" fill="var(--night)"/>
  <path d="M52 120 L118 120 L116.5 131 L53.5 131 Z" fill="var(--night)" opacity="0.8"/>
  <path d="M60 134 L64 168" stroke="var(--paper-light)" stroke-width="1.4" opacity="0.18"/>
</svg>`;
}

/** Semilla cuadrada: un cubo turquesa perfectamente normal. */
export function seedCubeSVG(extraClass = ""): string {
  return `
<svg class="fig fig-cube ${extraClass}" viewBox="0 0 64 64" role="img" aria-label="Semilla cuadrada: un pequeño cubo turquesa" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow" cx="32" cy="58" rx="18" ry="3.4" fill="var(--shadow)"/>
  <g class="cube-solid">
    <path d="M13 24 L32 14 L51 23 L51 44 L32 55 L13 45 Z" fill="var(--turquoise-dark)"/>
    <path d="M13 24 L32 14 L51 23 L32 33 Z" fill="var(--turquoise)"/>
    <path d="M32 33 L51 23 L51 44 L32 55 Z" fill="var(--turquoise-dark)" opacity="0.75"/>
    <path d="M18 27 L29 21" stroke="var(--paper-light)" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/>
  </g>
</svg>`;
}

/** Dedal de agua del gato. */
export function thimbleSVG(extraClass = ""): string {
  return `
<svg class="fig fig-thimble ${extraClass}" viewBox="0 0 60 72" role="img" aria-label="Dedal con una cantidad científicamente suficiente de agua" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow" cx="30" cy="66" rx="15" ry="3" fill="var(--shadow)"/>
  <path d="M17 30 C15 14 24 8 30 8 C36 8 45 14 43 30 L41 56 C40.5 61 36 64 30 64 C24 64 19.5 61 19 56 Z" fill="var(--sage)"/>
  <path d="M16 28 L44 28 L43.4 35 L16.6 35 Z" fill="var(--leaf-dark)" opacity="0.9"/>
  <ellipse cx="30" cy="30" rx="12" ry="4" fill="var(--turquoise)" opacity="0.95"/>
  <circle cx="26" cy="15" r="1.3" fill="var(--ink)" opacity="0.4"/>
  <circle cx="32" cy="13" r="1.3" fill="var(--ink)" opacity="0.4"/>
  <circle cx="29" cy="19" r="1.3" fill="var(--ink)" opacity="0.4"/>
</svg>`;
}

/** Sombra botánica grande (dos variantes) para atmósferas. */
export function branchShadowSVG(variant: 1 | 2, extraClass = ""): string {
  if (variant === 1) {
    return `
<svg class="branch-shadow ${extraClass}" viewBox="0 0 620 420" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--shadow)">
    <path d="M-10 60 C120 40 240 90 340 70 C440 50 540 110 630 90 L630 96 C530 118 430 60 340 80 C240 100 120 52 -10 70 Z"/>
    <path d="M180 76 C170 40 190 14 214 4 C216 30 202 58 188 78 Z"/>
    <path d="M300 74 C316 44 348 34 372 40 C360 66 330 80 306 82 Z"/>
    <path d="M430 68 C420 36 436 10 458 2 C462 28 450 54 438 72 Z"/>
    <path d="M92 62 C74 44 70 18 82 0 C98 16 102 44 98 64 Z"/>
    <path d="M520 92 C540 70 570 66 592 74 C578 96 548 104 524 100 Z"/>
  </g>
</svg>`;
  }
  return `
<svg class="branch-shadow ${extraClass}" viewBox="0 0 520 460" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--shadow)">
    <path d="M40 470 C60 340 120 240 220 160 C300 96 400 60 510 50 L512 58 C406 70 310 106 234 168 C140 246 84 344 66 470 Z"/>
    <path d="M210 170 C180 150 168 116 178 88 C206 102 220 138 218 166 Z"/>
    <path d="M320 108 C306 78 314 44 336 26 C350 54 342 90 328 110 Z"/>
    <path d="M140 260 C108 250 88 222 90 192 C120 200 142 228 146 256 Z"/>
    <path d="M420 74 C428 46 452 28 480 26 C474 56 450 76 426 80 Z"/>
  </g>
</svg>`;
}

/** Hojas secas, seis siluetas distintas. */
export function leafSVG(variant: number, extraClass = ""): string {
  const v = ((variant - 1) % 6) + 1;
  const bodies: Record<number, string> = {
    1: `<path d="M40 6 C58 20 66 44 58 62 C52 74 44 76 40 74 C36 76 28 74 22 62 C14 44 22 20 40 6 Z" fill="var(--leaf-dry)"/>
        <path d="M40 12 L40 72" stroke="var(--leaf-dark)" stroke-width="1.4" opacity="0.55"/>
        <path d="M40 30 L28 40 M40 30 L52 40 M40 48 L30 56 M40 48 L50 56" stroke="var(--leaf-dark)" stroke-width="1" opacity="0.4"/>`,
    2: `<path d="M40 8 C22 14 10 32 14 50 C17 62 28 70 40 74 C52 70 63 62 66 50 C70 32 58 14 40 8 Z" fill="var(--leaf-dark)"/>
        <path d="M40 12 L40 70" stroke="var(--leaf-dry)" stroke-width="1.4" opacity="0.6"/>`,
    3: `<path d="M18 70 C20 46 34 20 62 8 C60 36 46 62 24 74 Z" fill="var(--sage)"/>
        <path d="M24 68 C32 48 44 28 58 14" stroke="var(--leaf-dark)" stroke-width="1.2" opacity="0.5"/>`,
    4: `<path d="M40 10 C60 14 70 34 64 52 C60 64 50 72 40 72 L44 60 L36 62 Z" fill="var(--leaf-dry)"/>
        <path d="M40 14 C36 32 36 50 40 66" stroke="var(--leaf-dark)" stroke-width="1.2" opacity="0.5"/>`,
    5: `<path d="M40 74 C38 60 30 54 18 52 C24 40 34 38 40 42 C38 28 32 22 24 18 C36 10 48 14 52 26 C60 22 68 26 70 36 C60 40 52 40 46 48 C54 52 58 60 56 70 Z" fill="var(--leaf-dark)"/>
        <path d="M40 70 C42 54 46 40 52 28" stroke="var(--leaf-dry)" stroke-width="1.2" opacity="0.55"/>`,
    6: `<path d="M20 66 C16 48 26 28 46 18 C64 10 74 16 72 22 C60 22 48 30 42 42 C36 54 32 62 30 70 Z" fill="var(--sage)"/>
        <path d="M28 64 C32 48 42 32 58 22" stroke="var(--leaf-dark)" stroke-width="1.1" opacity="0.5"/>`,
  };
  return `
<svg class="dry-leaf dry-leaf--${v} ${extraClass}" viewBox="0 0 80 80" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  ${bodies[v]}
</svg>`;
}

/** Icono de sonido: una hoja que respira dos arcos. */
export function soundIconSVG(): string {
  return `
<svg viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 22 C6 14 10 7 17 5 C18 13 14 20 8 22 Z" fill="currentColor"/>
  <path class="snd-wave" d="M21 12 C24 14 24 18 21 20" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round"/>
  <path class="snd-wave" d="M24 9 C29 13 29 19 24 23" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round"/>
  <path class="snd-off" d="M6 27 L27 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
</svg>`;
}

/** Pequeña hoja verde usada como control «seguir». */
export function leafButtonSVG(): string {
  return `
<svg viewBox="0 0 40 40" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 32 C8 18 18 8 33 7 C33 22 24 32 10 33 Z" fill="var(--green-new)"/>
  <path d="M12 30 C16 22 22 15 29 11" stroke="var(--paper-light)" stroke-width="1.4" fill="none" opacity="0.7"/>
</svg>`;
}

/** Refugio de sombras: dos copas que se unen como un pequeño techo vegetal. */
export function shadowShelterSVG(extraClass = ""): string {
  return `
<svg class="shadow-shelter ${extraClass}" viewBox="0 0 300 160" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--shadow-deep)">
    <path d="M20 160 C24 110 60 70 118 52 C150 42 150 42 182 52 C240 70 276 110 280 160 L262 160 C254 118 224 86 178 72 C154 64 146 64 122 72 C76 86 46 118 38 160 Z"/>
    <path d="M118 54 C110 40 112 24 124 14 C134 26 132 44 126 56 Z"/>
    <path d="M176 54 C184 40 182 24 170 14 C160 26 162 44 168 56 Z"/>
    <path d="M146 46 C144 30 148 16 150 8 C154 16 156 32 152 46 Z"/>
  </g>
</svg>`;
}
