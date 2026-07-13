/**
 * Gramática de ilustración del herbario.
 * Curvas imperfectas, máximo tres tonos por objeto, sombras separadas de la figura.
 * Todos los dibujos son originales y locales.
 */

/** Dani: gata amarilla, curiosa y caligráfica, con lentes integrados. */
export function catSVG(extraClass = ""): string {
  return `
<svg class="fig fig-cat fig-dani ${extraClass}" viewBox="0 0 180 150" role="img" aria-label="Dani, gata amarilla estilizada con lentes irregulares y cola en forma de interrogación" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow dani-ground-shadow" cx="88" cy="140" rx="55" ry="6.5" fill="var(--shadow)"/>
  <g class="cat-tail-group dani-tail-group">
    <path class="cat-tail dani-tail" d="M126 119 C155 119 169 95 160 75 C154 61 139 57 130 66 C123 73 126 84 136 84"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="11" stroke-linecap="round"/>
    <path d="M137 84 C143 83 146 87 143 92" fill="none" stroke="var(--dani-light, #e6c96e)"
      stroke-width="3" stroke-linecap="round" opacity="0.72"/>
  </g>
  <g class="dani-body-group">
    <path class="cat-body dani-body" d="M45 132 C35 118 36 98 43 84 C51 68 68 61 88 62 C108 62 127 72 134 89 C141 105 135 124 121 133 C106 141 56 141 45 132 Z"
      fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-body-light" d="M56 126 C50 108 56 83 75 72 C88 65 105 68 116 77 C98 76 82 84 75 99 C69 112 70 126 76 137 C65 137 59 134 56 126 Z"
      fill="var(--dani-light, #e6c96e)" opacity="0.78"/>
    <path class="dani-back-mark" d="M106 69 C120 75 130 85 134 98" fill="none"
      stroke="var(--dani-shadow, #9d7333)" stroke-width="2.4" stroke-linecap="round" opacity="0.52"/>
    <path class="dani-leg dani-leg--rear" d="M105 111 C110 121 109 132 105 137" fill="none"
      stroke="var(--dani-shadow, #9d7333)" stroke-width="7" stroke-linecap="round"/>
    <path class="dani-leg dani-leg--front" d="M66 101 C62 113 62 128 65 137" fill="none"
      stroke="var(--dani-yellow, #d3a83c)" stroke-width="7" stroke-linecap="round"/>
    <path class="cat-paw dani-paw dani-paw--front" d="M57 137 C62 133 70 133 75 137 C71 141 61 142 57 137 Z"
      fill="var(--dani-light, #e6c96e)"/>
  </g>
  <g class="cat-head dani-head">
    <path class="cat-ear cat-ear--left dani-ear dani-ear--left" d="M34 35 L30 8 L50 25 Z"
      fill="var(--dani-shadow, #9d7333)"/>
    <path class="cat-ear cat-ear--right dani-ear dani-ear--right" d="M65 22 L84 5 L84 32 Z"
      fill="var(--dani-yellow, #d3a83c)" transform="rotate(8 75 20)"/>
    <path class="dani-face" d="M30 59 C24 43 30 26 46 19 C63 11 82 18 89 34 C96 49 87 65 68 70 C50 75 35 69 30 59 Z"
      fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-cheek" d="M31 55 C37 66 50 70 65 67" fill="none"
      stroke="var(--dani-yellow, #d3a83c)" stroke-width="3" stroke-linecap="round" opacity="0.68"/>
    <g class="dani-eyes">
      <circle class="cat-eye dani-eye dani-eye--left" cx="45" cy="43" r="2" fill="var(--ink)"/>
      <circle class="cat-eye dani-eye dani-eye--right" cx="69" cy="41" r="2" fill="var(--ink)"/>
    </g>
    <g class="dani-glasses" fill="var(--paper-light)" fill-opacity="0.13" stroke="var(--ink)"
      stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path class="dani-lens dani-lens--near" d="M34 34 C40 31 51 31 57 35 L56 49 C50 53 40 52 34 47 Z"/>
      <path class="dani-lens dani-lens--far" d="M59 34 C66 30 77 30 83 34 L82 47 C76 51 66 51 60 47 Z"/>
      <path class="dani-glasses-bridge" d="M57 38 C58 36 59 36 61 37" fill="none"/>
      <path class="dani-glasses-arm dani-glasses-arm--left" d="M34 37 L27 34" fill="none"/>
      <path class="dani-glasses-arm dani-glasses-arm--right" d="M83 36 L88 34" fill="none"/>
      <path class="dani-lens-glint" d="M39 36 L44 34 M66 34 L70 33" fill="none"
        stroke="var(--paper-light)" stroke-width="1.2" opacity="0.78"/>
    </g>
    <path class="dani-nose" d="M56 52 L59 54 L56 56" stroke="var(--ink)" fill="none"
      stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="dani-whiskers" d="M34 54 L19 51 M34 59 L20 62 M76 53 L89 49 M75 58 L88 62"
      stroke="var(--ink)" fill="none" stroke-width="1" stroke-linecap="round" opacity="0.62"/>
  </g>
</svg>`;
}

/** Diego: akita turquesa, geométrico y protector, con lentes bajos. */
export function akitaSVG(extraClass = ""): string {
  return `
<svg class="fig fig-akita fig-diego ${extraClass}" viewBox="0 0 180 158" role="img" aria-label="Diego, akita turquesa geométrico con lentes rectangulares bajos y postura protectora" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow diego-ground-shadow" cx="91" cy="149" rx="58" ry="7" fill="var(--shadow)"/>
  <path class="akita-tail diego-tail" d="M128 101 C154 95 162 69 145 57 C132 48 117 57 121 70 C123 78 135 80 141 73"
    fill="none" stroke="var(--diego-shadow, #316a68)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>
  <g class="diego-body-group">
    <path class="akita-body diego-body" d="M43 143 L40 107 C39 87 50 75 69 69 L111 69 C131 75 141 90 140 111 L135 143 Z"
      fill="var(--diego-turquoise, #4d918b)"/>
    <path class="diego-shoulder" d="M42 105 C51 89 66 82 85 82 C108 82 127 93 139 110"
      fill="none" stroke="var(--diego-light, #79aaa4)" stroke-width="8" stroke-linecap="square" opacity="0.72"/>
    <path class="akita-chest diego-chest" d="M67 143 L65 91 L91 84 L111 96 L108 143 Z"
      fill="var(--paper-light)" opacity="0.86"/>
    <path class="akita-leg diego-leg diego-leg--left" d="M52 112 L68 112 L67 145 L50 145 Z"
      fill="var(--diego-shadow, #316a68)"/>
    <path class="akita-leg diego-leg diego-leg--right" d="M112 110 L128 112 L130 145 L112 145 Z"
      fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-paw diego-paw--left" d="M47 145 L70 145 L69 149 L46 149 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-paw diego-paw--right" d="M109 145 L133 145 L134 149 L110 149 Z" fill="var(--diego-shadow, #316a68)"/>
  </g>
  <g class="akita-head diego-head">
    <path class="akita-ear akita-ear--left diego-ear diego-ear--left" d="M45 31 L44 5 L68 23 Z"
      fill="var(--diego-shadow, #316a68)"/>
    <path class="akita-ear akita-ear--right diego-ear diego-ear--right" d="M103 22 L126 4 L124 35 Z"
      fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-face" d="M42 57 L46 29 C55 17 72 13 91 15 C108 16 121 25 126 40 L121 64 C107 74 87 77 65 72 C53 70 46 65 42 57 Z"
      fill="var(--diego-turquoise, #4d918b)"/>
    <path class="akita-muzzle diego-muzzle" d="M65 48 C69 41 78 38 88 39 C99 40 106 46 105 55 C102 65 90 68 78 64 C69 62 64 56 65 48 Z"
      fill="var(--paper-light)" opacity="0.92"/>
    <g class="diego-eyes">
      <circle class="diego-eye diego-eye--left" cx="68" cy="42" r="2" fill="var(--ink)"/>
      <circle class="diego-eye diego-eye--right" cx="99" cy="42" r="2" fill="var(--ink)"/>
    </g>
    <g class="diego-glasses" fill="var(--paper-light)" fill-opacity="0.1" stroke="var(--ink)"
      stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path class="diego-lens diego-lens--left" d="M54 34 L77 34 L78 49 L55 50 Z"/>
      <path class="diego-lens diego-lens--right" d="M84 34 L109 35 L108 50 L84 49 Z"/>
      <path class="diego-glasses-bridge" d="M78 39 L84 39" fill="none"/>
      <path class="diego-glasses-arm diego-glasses-arm--left" d="M54 38 L46 35" fill="none"/>
      <path class="diego-glasses-arm diego-glasses-arm--right" d="M109 39 L121 37" fill="none"/>
      <path class="diego-lens-glint" d="M58 37 L65 36 M88 37 L95 37" fill="none"
        stroke="var(--paper-light)" stroke-width="1.2" opacity="0.72"/>
    </g>
    <path class="diego-brow diego-brow--left" d="M58 29 L73 28" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="square"/>
    <path class="diego-brow diego-brow--right" d="M91 28 L107 30" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="square"/>
    <path class="diego-nose" d="M80 50 L89 50 L85 55 Z" fill="var(--ink)"/>
    <path class="diego-mouth" d="M85 55 L85 59 M85 59 L79 61 M85 59 L91 61" stroke="var(--ink)"
      stroke-width="1.3" stroke-linecap="round" fill="none"/>
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

/** Paraguas editorial: refugio móvil y, en sombra, pequeña copa de árbol. */
export function umbrellaSVG(extraClass = ""): string {
  return `
<svg class="fig fig-umbrella ${extraClass}" viewBox="0 0 180 160" role="img" aria-label="Paraguas de papel con mango curvo y una hoja atrapada" xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow umbrella-ground-shadow" cx="91" cy="151" rx="43" ry="5" fill="var(--shadow)"/>
  <g class="umbrella-body">
    <path class="umbrella-canopy" d="M18 69 C24 31 55 11 91 12 C127 12 158 32 164 69 C151 61 139 61 127 70 C115 60 103 60 91 70 C79 60 67 60 55 70 C43 61 31 61 18 69 Z"
      fill="var(--rain, #708a99)"/>
    <path class="umbrella-canopy-light" d="M27 58 C42 30 65 20 89 18 C77 30 70 46 69 63 C55 56 41 55 27 58 Z"
      fill="var(--paper-light)" opacity="0.28"/>
    <path class="umbrella-rib" d="M91 16 L91 70 M91 17 C73 31 61 48 55 69 M91 17 C110 31 121 48 127 69"
      stroke="var(--night)" stroke-width="1.5" fill="none" opacity="0.52"/>
    <path class="umbrella-stem" d="M91 68 L91 129 C91 144 111 146 116 134" stroke="var(--night)"
      stroke-width="5" stroke-linecap="round" fill="none"/>
    <path class="umbrella-stem-glint" d="M89 76 L89 117" stroke="var(--paper-light)" stroke-width="1.2"
      stroke-linecap="round" opacity="0.45"/>
  </g>
  <g class="umbrella-caught-leaf" transform="translate(124 47) rotate(18)">
    <path d="M0 17 C1 7 8 1 19 0 C19 11 12 18 1 19 Z" fill="var(--dani-yellow, #d3a83c)"/>
    <path d="M3 16 C7 11 11 7 16 3" stroke="var(--leaf-dark)" stroke-width="1" fill="none" opacity="0.56"/>
  </g>
</svg>`;
}

/**
 * Sombras narrativas de los personajes. No son copias literales: la de Dani
 * se vuelve rama curiosa; la de Diego, una estructura estable de refugio.
 */
export function characterShadowSVG(kind: "dani" | "diego", extraClass = ""): string {
  if (kind === "dani") {
    return `
<svg class="character-shadow character-shadow--dani ${extraClass}" viewBox="0 0 220 170" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--shadow-deep)" opacity="0.9">
    <path d="M27 154 C28 119 49 89 82 78 C112 68 143 80 153 103 C160 120 153 141 137 153 Z"/>
    <path d="M50 92 C40 72 48 48 69 38 C89 29 111 38 118 57 C124 75 111 91 91 95 Z"/>
    <path d="M47 56 L42 26 L66 45 Z M88 41 L110 18 L110 51 Z"/>
    <path d="M139 109 C176 109 199 86 193 59 C188 38 164 31 151 45 C141 56 147 69 160 69 L160 78 C137 78 126 55 139 36 C158 10 199 21 207 53 C217 92 186 126 145 128 Z"/>
    <path d="M187 51 C193 35 207 25 219 26 C216 41 203 52 187 57 Z"/>
    <path d="M198 82 C210 73 222 72 232 78 C223 89 210 92 198 88 Z"/>
  </g>
</svg>`;
  }
  return `
<svg class="character-shadow character-shadow--diego ${extraClass}" viewBox="0 0 220 170" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <g fill="var(--shadow-deep)" opacity="0.92">
    <path d="M31 158 L34 102 C35 76 51 61 76 56 L145 56 C171 63 185 82 186 108 L190 158 Z"/>
    <path d="M52 66 L51 25 L84 52 Z M137 49 L174 21 L171 70 Z"/>
    <path d="M42 98 L16 128 L25 139 L55 111 Z M177 99 L207 126 L197 139 L164 111 Z"/>
    <path d="M157 87 C187 83 204 63 197 43 C192 30 177 27 167 36 L158 27 C177 8 210 18 217 42 C227 76 202 108 166 113 Z"/>
  </g>
  <path d="M23 141 C72 119 151 119 201 141" stroke="var(--shadow-deep)" stroke-width="9"
    stroke-linecap="square" fill="none" opacity="0.92"/>
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
