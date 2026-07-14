/**
 * Gramática de ilustración del herbario — segunda iteración.
 * Siluetas limpias, máximo tres tonos por figura + arcilla como acento,
 * sombras separadas de la figura, expresividad por postura y proporción.
 * Dani (gatita amarilla) y Diego (akita turquesa) llevan anteojos.
 */

/** Dani: gatita amarilla de anteojos redondos. Curiosidad y calma. */
export function catSVG(extraClass = ""): string {
  return `
<svg class="fig fig-cat ${extraClass}" viewBox="0 0 160 140" role="img" aria-label="Dani, gatita amarilla con anteojos redondos y cola en signo de interrogación" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow" cx="78" cy="130" rx="46" ry="6" fill="var(--shadow)"/>
  <g class="cat-tail-group">
    <path class="cat-tail" d="M112 100 C138 96 146 68 127 59 C114 53 103 63 110 72"
      fill="none" stroke="var(--yellow)" stroke-width="9" stroke-linecap="round"/>
    <circle cx="108" cy="86" r="4.6" fill="var(--yellow)"/>
  </g>
  <path class="cat-body" d="M48 128 C38 102 46 72 76 64 C102 57 118 74 116 100 C114 118 97 128 72 128 Z"
    fill="var(--yellow)"/>
  <path class="cat-chest" d="M64 126 C60 108 66 94 79 92 C90 90 96 100 94 112 C92 122 82 126 74 126 Z"
    fill="var(--yellow-soft)" opacity="0.92"/>
  <path d="M72 128 l0 -9" stroke="var(--yellow)" stroke-width="0" fill="none"/>
  <g class="cat-head">
    <path class="cat-ear cat-ear--left" d="M40 32 L38 8 L60 21 Z" fill="var(--yellow)"/>
    <path d="M44 26 L43.4 15 L53 21 Z" fill="var(--clay)" opacity="0.55"/>
    <g transform="rotate(11 79 16)">
      <path class="cat-ear cat-ear--right" d="M70 21 L86 6 L88 27 Z" fill="var(--yellow)"/>
      <path d="M75 20 L83 13 L84 23 Z" fill="var(--clay)" opacity="0.55"/>
    </g>
    <path d="M34 58 C28 34 46 18 68 20 C89 22 100 41 91 59 C82 76 42 77 34 58 Z" fill="var(--yellow-soft)"/>
    <g class="cat-glasses">
      <line x1="41" y1="45" x2="34.5" y2="43" stroke="var(--ink)" stroke-width="1.6"/>
      <circle cx="53" cy="46" r="8.6" fill="var(--paper-light)" fill-opacity="0.42" stroke="var(--ink)" stroke-width="1.9"/>
      <circle cx="75" cy="45" r="8.6" fill="var(--paper-light)" fill-opacity="0.42" stroke="var(--ink)" stroke-width="1.9"/>
      <path d="M61.5 45.6 Q66.5 43.4 66.4 45.4" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
    </g>
    <circle class="cat-eye" cx="54" cy="46.5" r="1.9" fill="var(--ink)"/>
    <circle class="cat-eye" cx="75.5" cy="45.5" r="1.9" fill="var(--ink)"/>
    <path d="M61 56.5 L66.5 56.5 L63.8 60 Z" fill="var(--clay)"/>
    <path d="M63.8 60 q3 3.4 6.6 1.6" stroke="var(--ink)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M32 52 l-10 -1.6 M33 57 l-9 2.4" stroke="var(--ink)" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>
    <path d="M92 50 l10 -2 M91 55 l9 2.8" stroke="var(--ink)" stroke-width="0.9" stroke-linecap="round" opacity="0.55"/>
  </g>
</svg>`;
}

/** Diego: akita turquesa de anteojos rectangulares. Seriedad tierna. */
export function akitaSVG(extraClass = ""): string {
  return `
<svg class="fig fig-akita ${extraClass}" viewBox="0 0 170 150" role="img" aria-label="Diego, akita turquesa con anteojos rectangulares y cola enroscada" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow" cx="86" cy="140" rx="50" ry="6.5" fill="var(--shadow)"/>
  <path class="akita-tail" d="M120 92 C146 84 152 52 128 47 C112 44 106 60 118 65"
    fill="none" stroke="var(--turquoise-dark)" stroke-width="12" stroke-linecap="round"/>
  <path class="akita-body" d="M52 138 C42 108 52 78 88 72 C120 67 136 87 132 112 C129 130 110 138 84 138 Z"
    fill="var(--turquoise)"/>
  <path class="akita-chest" d="M70 136 C66 114 74 97 89 95 C101 93 108 105 106 120 C104 132 92 136 82 136 Z"
    fill="var(--paper-light)" opacity="0.92"/>
  <rect class="akita-leg" x="64" y="106" width="9.5" height="31" rx="4.7" fill="var(--turquoise-dark)"/>
  <rect class="akita-leg" x="90" y="106" width="9.5" height="31" rx="4.7" fill="var(--turquoise-dark)"/>
  <g class="akita-head">
    <path class="akita-ear akita-ear--left" d="M46 34 L46 8 L67 25 Z" fill="var(--turquoise-dark)"/>
    <path d="M51 29 L51 17 L60 24 Z" fill="var(--clay)" opacity="0.5"/>
    <path class="akita-ear akita-ear--right" d="M80 24 L96 8 L99 30 Z" fill="var(--turquoise-dark)"/>
    <path d="M85 23 L93 15 L94.5 25 Z" fill="var(--clay)" opacity="0.5"/>
    <path d="M38 64 C32 38 52 20 78 22 C102 24 112 44 103 64 C94 82 46 84 38 64 Z" fill="var(--turquoise)"/>
    <path class="akita-muzzle" d="M56 58 C55 46 65 40 75 42 C85 44 88 55 82 63 C75 71 58 68 56 58 Z"
      fill="var(--paper-light)" opacity="0.94"/>
    <ellipse cx="61" cy="51" rx="3.5" ry="3" fill="var(--ink)"/>
    <path d="M64 55 q4 3.6 8.6 1.4" stroke="var(--ink)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <g class="akita-glasses">
      <line x1="42" y1="42" x2="36" y2="40" stroke="var(--ink)" stroke-width="1.6"/>
      <rect x="45" y="34" width="17" height="13.5" rx="4.4" fill="var(--paper-light)" fill-opacity="0.4" stroke="var(--ink)" stroke-width="1.9"/>
      <rect x="72" y="32" width="17" height="13.5" rx="4.4" fill="var(--paper-light)" fill-opacity="0.4" stroke="var(--ink)" stroke-width="1.9"/>
      <path d="M62 40 Q67 37.5 72 38.6" fill="none" stroke="var(--ink)" stroke-width="1.6"/>
    </g>
    <path d="M50 41 l7 -0.6" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
    <path d="M77 39 l7 -0.6" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
    <path d="M47 27.5 l9 -2 M76 25 l9 1" stroke="var(--ink)" stroke-width="1.1" stroke-linecap="round" opacity="0.6"/>
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
    <g class="plant-smoke" aria-hidden="true">
      <circle class="smoke smoke--1" cx="82" cy="86" r="4" fill="var(--paper-light)" opacity="0"/>
      <circle class="smoke smoke--2" cx="90" cy="80" r="5" fill="var(--paper-light)" opacity="0"/>
      <circle class="smoke smoke--3" cx="85" cy="72" r="3.4" fill="var(--paper-light)" opacity="0"/>
    </g>
  </g>
  <ellipse class="plant-soil" cx="85" cy="121" rx="30" ry="7" fill="var(--leaf-dark)"/>
  <ellipse class="plant-puddle" cx="85" cy="121.5" rx="41" ry="7.5" fill="var(--turquoise)"/>
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

/** Dedal de agua de Dani. */
export function thimbleSVG(extraClass = ""): string {
  return `
<svg class="fig fig-thimble ${extraClass}" viewBox="0 0 60 72" role="img" aria-label="Dedal con una cantidad científicamente suficiente de agua" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow" cx="30" cy="66" rx="15" ry="3" fill="var(--shadow)"/>
  <g class="thimble-solid">
    <path d="M17 30 C15 14 24 8 30 8 C36 8 45 14 43 30 L41 56 C40.5 61 36 64 30 64 C24 64 19.5 61 19 56 Z" fill="var(--sage)"/>
    <path d="M16 28 L44 28 L43.4 35 L16.6 35 Z" fill="var(--leaf-dark)" opacity="0.9"/>
    <ellipse cx="30" cy="30" rx="12" ry="4" fill="var(--turquoise)" opacity="0.95"/>
    <circle cx="26" cy="15" r="1.3" fill="var(--ink)" opacity="0.4"/>
    <circle cx="32" cy="13" r="1.3" fill="var(--ink)" opacity="0.4"/>
    <circle cx="29" cy="19" r="1.3" fill="var(--ink)" opacity="0.4"/>
  </g>
</svg>`;
}

/** Paraguas diminuto de Diego (protocolo paraguas). */
export function umbrellaSVG(extraClass = ""): string {
  return `
<svg class="fig fig-umbrella ${extraClass}" viewBox="0 0 80 92" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <path d="M40 8 L40 3" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>
  <path d="M8 42 C10 20 24 9 40 9 C56 9 70 20 72 42 L61 42 Q55.5 35 50 42 Q45 35 40 42 Q35 35 30 42 Q24.5 35 19 42 Z"
    fill="var(--turquoise-dark)"/>
  <path d="M12 38 C16 24 26 15 38 13" stroke="var(--paper-light)" stroke-width="1.4" fill="none" opacity="0.35"/>
  <path d="M40 42 L40 76 Q40 84 33 84" stroke="var(--ink)" stroke-width="2.4" fill="none" stroke-linecap="round"/>
</svg>`;
}

/**
 * Sombra botánica grande, dos variantes:
 * 1 — rama de eucalipto en arco; 2 — fronda de helecho.
 */
export function branchShadowSVG(variant: 1 | 2, extraClass = ""): string {
  if (variant === 1) {
    return `
<svg class="branch-shadow ${extraClass}" viewBox="0 0 640 420" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--shadow)">
    <path d="M-10 330 C140 300 300 220 470 140 C530 112 590 92 650 84 L650 92 C592 100 534 120 476 148 C306 228 146 308 -10 338 Z"/>
    <ellipse cx="80" cy="306" rx="34" ry="15" transform="rotate(-18 80 306)"/>
    <ellipse cx="150" cy="284" rx="30" ry="13" transform="rotate(24 150 284)"/>
    <ellipse cx="222" cy="252" rx="33" ry="14" transform="rotate(-24 222 252)"/>
    <ellipse cx="292" cy="222" rx="28" ry="12" transform="rotate(20 292 222)"/>
    <ellipse cx="360" cy="190 " rx="30" ry="13" transform="rotate(-26 360 190)"/>
    <ellipse cx="425" cy="160" rx="25" ry="11" transform="rotate(18 425 160)"/>
    <ellipse cx="488" cy="132" rx="26" ry="11" transform="rotate(-28 488 132)"/>
    <ellipse cx="548" cy="108" rx="21" ry="9" transform="rotate(14 548 108)"/>
    <ellipse cx="602" cy="92" rx="17" ry="7.5" transform="rotate(-22 602 92)"/>
  </g>
</svg>`;
  }
  return `
<svg class="branch-shadow ${extraClass}" viewBox="0 0 520 480" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--shadow)">
    <path d="M74 480 C82 350 130 220 250 120 C310 70 380 40 450 30 L452 38 C384 48 316 78 258 126 C142 224 96 352 88 480 Z"/>
    <path d="M100 400 C70 392 48 368 46 338 C80 344 102 368 106 396 Z"/>
    <path d="M120 342 C92 330 76 304 78 274 C110 284 128 310 126 338 Z"/>
    <path d="M148 284 C124 268 114 240 120 212 C150 226 164 254 158 280 Z"/>
    <path d="M186 230 C166 210 160 182 170 156 C196 174 206 202 198 226 Z"/>
    <path d="M234 180 C220 156 220 128 234 104 C256 126 260 156 248 178 Z"/>
    <path d="M290 138 C282 112 288 84 306 64 C322 90 320 120 304 138 Z"/>
    <path d="M352 104 C350 78 362 52 384 38 C394 66 386 96 366 110 Z"/>
    <path d="M130 420 C158 408 190 410 214 428 C188 446 156 446 132 432 Z"/>
    <path d="M158 358 C186 348 218 352 240 372 C212 388 180 386 158 370 Z"/>
    <path d="M196 298 C224 292 254 300 272 322 C242 334 212 328 194 310 Z"/>
    <path d="M244 244 C272 242 300 254 314 278 C284 286 256 276 240 256 Z"/>
    <path d="M300 196 C328 198 352 214 362 240 C331 242 306 228 296 206 Z"/>
    <path d="M364 156 C390 162 410 182 416 208 C386 206 364 188 358 166 Z"/>
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
