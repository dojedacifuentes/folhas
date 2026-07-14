import {
  characterSizeClass,
  characterSizeStyle,
  escapeCharacterAttribute,
  joinCharacterClasses,
  type CharacterAngle,
  type CharacterFacing,
  type CharacterSize,
} from "./CharacterTypes";

/**
 * Dibujo fuente de Dani. Cada ángulo usa paths propios; `facing` sólo decide
 * la dirección de mirada y la variante lateral, nunca refleja el SVG completo.
 */
export const DANI_VIEW_BOX = "0 0 180 150";
export const DANI_BASELINE = 141;

export interface DaniArtOptions {
  className?: string;
  state?: string;
  angle?: CharacterAngle;
  facing?: CharacterFacing;
  size?: CharacterSize;
  reducedMotion?: boolean;
  interactive?: boolean;
}

function daniFront(facing: CharacterFacing): string {
  const tail =
    facing === "left"
      ? `<path class="cat-tail dani-tail" data-silhouette="true"
          d="M58 130 C35 133 23 117 27 98 C30 84 43 78 51 85 C58 91 54 101 46 102 C39 103 35 97 38 92"
          fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="10" stroke-linecap="round"/>`
      : facing === "right"
        ? `<path class="cat-tail dani-tail" data-silhouette="true"
          d="M121 130 C145 133 157 117 153 98 C150 84 137 78 129 85 C122 91 126 101 134 102 C141 103 145 97 142 92"
          fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="10" stroke-linecap="round"/>`
        : `<path class="cat-tail dani-tail" data-silhouette="true"
          d="M116 132 C140 132 151 116 148 99 C146 86 136 80 128 85 C121 90 123 99 131 101 C138 102 142 97 140 91"
          fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="10" stroke-linecap="round"/>`;

  return `
  <g class="cat-tail-group dani-tail-group" data-part="tail">${tail}</g>
  <g class="dani-body-group" data-part="body" data-angle-art="front">
    <path class="cat-body dani-body" data-silhouette="true"
      d="M53 135 C49 119 51 94 64 80 C72 71 82 68 90 68 C100 68 111 73 118 83 C128 98 130 120 125 136 C107 143 72 143 53 135 Z"
      fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-belly" data-detail="coat"
      d="M76 82 C84 76 94 76 101 82 C109 96 109 122 104 138 L73 138 C68 119 69 96 76 82 Z"
      fill="var(--dani-light, #e6c96e)" opacity="0.78"/>
    <path class="dani-stripes" data-part="stripes" data-detail="coat"
      d="M58 93 L70 99 M56 105 L69 109 M122 94 L110 100 M125 107 L111 111"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="4" stroke-linecap="round" opacity="0.78"/>
    <path class="dani-leg dani-leg--front" data-part="paw-front" data-silhouette="true"
      d="M67 104 C63 116 64 130 65 137" fill="none" stroke="var(--dani-yellow, #d3a83c)" stroke-width="8" stroke-linecap="round"/>
    <path class="dani-leg dani-leg--support" data-part="paw-support" data-silhouette="true"
      d="M112 104 C116 117 115 130 114 137" fill="none" stroke="var(--dani-yellow, #d3a83c)" stroke-width="8" stroke-linecap="round"/>
    <path class="dani-paw dani-paw--front" data-part="paw-front-tip" data-silhouette="true"
      d="M56 137 C62 132 72 132 78 138 C72 143 61 143 56 137 Z" fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-paw dani-paw--support" data-part="paw-support-tip" data-silhouette="true"
      d="M102 138 C108 132 119 133 125 138 C120 143 108 143 102 138 Z" fill="var(--dani-light, #e6c96e)"/>
  </g>
  <g class="dani-bow" data-part="bow">
    <path data-silhouette="true" d="M79 78 C70 72 65 76 67 84 C70 91 77 88 84 84 Z" fill="var(--sage, #77866e)"/>
    <path data-silhouette="true" d="M96 78 C105 72 111 77 108 85 C105 91 98 88 92 84 Z" fill="var(--new-green, #6f8f59)"/>
    <circle cx="88" cy="82" r="5" fill="var(--leaf-dark, #63483c)"/>
  </g>
  <g class="cat-head dani-head" data-part="head">
    <path class="cat-ear dani-ear dani-ear--left" data-part="ear-near" data-silhouette="true"
      d="M47 35 L52 13 L70 30 Z" fill="var(--dani-shadow, #9d7333)"/>
    <path class="cat-ear dani-ear dani-ear--right" data-part="ear-far" data-silhouette="true"
      d="M107 30 L124 11 L126 38 Z" fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-ear-inner" data-detail="coat" d="M53 29 L56 20 L64 30 Z M113 29 L121 19 L122 32 Z"
      fill="var(--paper-light, #f8f1e5)" opacity="0.34"/>
    <path class="dani-face" data-part="face" data-silhouette="true"
      d="M42 50 C43 29 61 19 87 18 C112 17 130 31 132 51 C134 70 117 83 90 84 C62 85 41 72 42 50 Z"
      fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-forehead-stripes" data-part="stripes" data-detail="coat"
      d="M75 20 L79 31 M88 18 L88 30 M101 20 L97 31" fill="none"
      stroke="var(--dani-shadow, #9d7333)" stroke-width="3.6" stroke-linecap="round" opacity="0.82"/>
    <path class="dani-cheek-stripes" data-part="stripes" data-detail="coat"
      d="M48 57 L59 60 M129 56 L117 60" fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="3" stroke-linecap="round" opacity="0.72"/>
    <g class="dani-eyes" data-part="eyes">
      <circle class="cat-eye dani-eye dani-eye--left" data-detail="face" cx="68" cy="50" r="2.4" fill="var(--ink, #252521)"/>
      <circle class="cat-eye dani-eye dani-eye--right" data-detail="face" cx="105" cy="50" r="2.4" fill="var(--ink, #252521)"/>
      <path class="dani-sleep-eye" data-detail="face" d="M63 51 Q68 55 73 51 M100 51 Q105 55 110 51"
        fill="none" stroke="var(--ink, #252521)" stroke-width="1.8" stroke-linecap="round"/>
    </g>
    <g class="dani-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08"
      stroke="var(--ink, #252521)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
      <path class="dani-lens dani-lens--near" data-part="lens-near" d="M53 39 C61 35 75 36 80 41 C82 53 78 62 67 64 C55 63 51 54 53 39 Z"/>
      <path class="dani-lens dani-lens--far" data-part="lens-far" d="M92 40 C101 35 115 36 121 41 C123 54 117 62 106 64 C95 63 91 54 92 40 Z"/>
      <path class="dani-glasses-bridge" d="M80 44 C84 41 88 41 92 44" fill="none"/>
      <path class="dani-glasses-arm" d="M53 44 L42 41 M121 44 L131 42" fill="none"/>
      <path class="dani-lens-glint" data-detail="micro" d="M58 41 L64 39 M98 41 L104 39"
        stroke="var(--paper-light, #f8f1e5)" stroke-width="1.2" opacity="0.82"/>
    </g>
    <path class="dani-worry-brows" data-detail="face" d="M61 37 L72 39 M101 39 L112 37"
      stroke="var(--ink, #252521)" stroke-width="1.4" stroke-linecap="round"/>
    <path class="dani-muzzle" data-part="muzzle" data-detail="coat"
      d="M72 59 C79 54 97 54 104 60 C101 72 78 73 70 65 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.42"/>
    <path class="dani-nose" data-part="nose" data-detail="face" d="M84 59 L91 59 L88 64 Z" fill="var(--ink, #252521)"/>
    <path class="dani-mouth" data-detail="micro" d="M88 64 Q84 68 80 66 M88 64 Q92 68 96 66"
      fill="none" stroke="var(--ink, #252521)" stroke-width="1.2" stroke-linecap="round"/>
    <path class="dani-whiskers" data-part="whiskers" data-detail="micro"
      d="M66 61 L40 57 M66 66 L39 69 M108 61 L135 57 M108 66 L136 70"
      fill="none" stroke="var(--ink, #252521)" stroke-width="1" stroke-linecap="round" opacity="0.64"/>
  </g>`;
}

function daniThreeQuarterLeft(): string {
  return `
  <g class="cat-tail-group dani-tail-group" data-part="tail">
    <path class="cat-tail dani-tail" data-silhouette="true"
      d="M111 130 C137 131 154 113 152 91 C151 76 141 68 132 73 C123 79 126 90 136 91 C143 92 147 86 144 80"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g class="dani-body-group" data-part="body" data-angle-art="three-quarter-left">
    <path class="cat-body dani-body" data-silhouette="true"
      d="M49 135 C41 120 44 97 56 81 C65 69 79 64 94 64 C111 64 125 72 130 87 C136 104 129 127 116 137 C96 143 65 142 49 135 Z"
      fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-belly" data-detail="coat"
      d="M62 132 C56 112 62 87 76 74 C84 68 94 66 102 68 C89 80 84 96 86 114 C87 125 93 134 99 139 C83 141 68 139 62 132 Z"
      fill="var(--dani-light, #e6c96e)" opacity="0.8"/>
    <path class="dani-stripes" data-part="stripes" data-detail="coat"
      d="M111 72 L104 83 M121 78 L112 88 M127 91 L116 97 M119 114 L108 111"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="4" stroke-linecap="round" opacity="0.78"/>
    <path class="dani-leg dani-leg--front" data-part="paw-front" data-silhouette="true"
      d="M63 91 C54 98 51 108 55 116" fill="none" stroke="var(--dani-yellow, #d3a83c)" stroke-width="7" stroke-linecap="round"/>
    <path class="dani-paw dani-paw--front" data-part="paw-front-tip" data-silhouette="true"
      d="M48 115 C54 111 62 112 66 117 C61 121 53 120 48 115 Z" fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-leg dani-leg--support" data-part="paw-support" data-silhouette="true"
      d="M77 98 C72 113 72 128 73 137" fill="none" stroke="var(--dani-yellow, #d3a83c)" stroke-width="7" stroke-linecap="round"/>
    <path class="dani-paw dani-paw--support" data-part="paw-support-tip" data-silhouette="true"
      d="M64 137 C72 132 82 133 87 138 C81 142 69 143 64 137 Z" fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-paw dani-paw--tucked" data-part="paw-rear" data-silhouette="true"
      d="M101 136 C109 131 120 132 125 138 C117 142 106 142 101 136 Z" fill="var(--dani-shadow, #9d7333)"/>
  </g>
  <g class="dani-bow" data-part="bow">
    <path data-silhouette="true" d="M64 76 C55 71 51 77 54 84 C57 90 64 86 70 82 Z" fill="var(--sage, #77866e)"/>
    <path data-silhouette="true" d="M79 76 C87 71 93 76 91 83 C88 89 81 86 75 82 Z" fill="var(--new-green, #6f8f59)"/>
    <circle cx="72" cy="80" r="4.5" fill="var(--leaf-dark, #63483c)"/>
  </g>
  <g class="cat-head dani-head" data-part="head">
    <path class="cat-ear dani-ear dani-ear--left" data-part="ear-near" data-silhouette="true"
      d="M30 37 L33 14 L51 30 Z" fill="var(--dani-shadow, #9d7333)"/>
    <path class="cat-ear dani-ear dani-ear--right" data-part="ear-far" data-silhouette="true"
      d="M68 27 L86 12 L87 39 Z" fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-ear-inner" data-detail="coat" d="M35 31 L37 21 L45 30 Z M74 28 L82 19 L83 32 Z"
      fill="var(--paper-light, #f8f1e5)" opacity="0.32"/>
    <path class="dani-face" data-part="face" data-silhouette="true"
      d="M25 53 C24 36 37 23 55 20 C75 17 93 26 99 42 C106 59 96 74 77 80 C56 86 34 76 25 62 C23 59 23 56 25 53 Z"
      fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-forehead-stripes" data-part="stripes" data-detail="coat"
      d="M47 22 L51 32 M59 20 L60 31 M71 22 L68 32" fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="3.4" stroke-linecap="round" opacity="0.8"/>
    <path class="dani-cheek-stripes" data-part="stripes" data-detail="coat"
      d="M28 58 L40 60 M94 56 L83 60" fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="3" stroke-linecap="round" opacity="0.72"/>
    <g class="dani-eyes" data-part="eyes">
      <circle class="cat-eye dani-eye dani-eye--left" data-detail="face" cx="44" cy="50" r="2.3" fill="var(--ink, #252521)"/>
      <circle class="cat-eye dani-eye dani-eye--right" data-detail="face" cx="74" cy="47" r="2.2" fill="var(--ink, #252521)"/>
      <path class="dani-sleep-eye" data-detail="face" d="M39 51 Q44 55 49 51 M69 48 Q74 52 79 48"
        fill="none" stroke="var(--ink, #252521)" stroke-width="1.8" stroke-linecap="round"/>
    </g>
    <g class="dani-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08"
      stroke="var(--ink, #252521)" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round">
      <path class="dani-lens dani-lens--near" data-part="lens-near" d="M31 39 C38 35 51 35 56 40 C58 52 53 61 44 63 C34 61 30 52 31 39 Z"/>
      <path class="dani-lens dani-lens--far" data-part="lens-far" d="M60 37 C68 33 81 34 86 38 C88 50 84 58 75 60 C65 59 60 51 60 37 Z"/>
      <path class="dani-glasses-bridge" d="M56 43 C58 40 59 40 61 42" fill="none"/>
      <path class="dani-glasses-arm" d="M31 43 L24 41 M86 41 L96 40" fill="none"/>
      <path class="dani-lens-glint" data-detail="micro" d="M36 40 L42 38 M65 38 L70 36"
        stroke="var(--paper-light, #f8f1e5)" stroke-width="1.2" opacity="0.82"/>
    </g>
    <path class="dani-worry-brows" data-detail="face" d="M38 36 L48 38 M69 36 L78 34"
      stroke="var(--ink, #252521)" stroke-width="1.4" stroke-linecap="round"/>
    <path class="dani-muzzle" data-part="muzzle" data-detail="coat"
      d="M42 58 C49 52 66 51 73 57 C70 68 50 72 40 64 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.42"/>
    <path class="dani-nose" data-part="nose" data-detail="face" d="M53 57 L60 57 L57 62 Z" fill="var(--ink, #252521)"/>
    <path class="dani-mouth" data-detail="micro" d="M57 62 Q53 66 49 64 M57 62 Q61 66 65 64"
      fill="none" stroke="var(--ink, #252521)" stroke-width="1.2" stroke-linecap="round"/>
    <path class="dani-whiskers" data-part="whiskers" data-detail="micro"
      d="M41 60 L17 57 M41 65 L18 70 M74 59 L99 54 M73 64 L99 67"
      fill="none" stroke="var(--ink, #252521)" stroke-width="1" stroke-linecap="round" opacity="0.64"/>
  </g>`;
}

function daniThreeQuarterRight(): string {
  return `
  <g class="cat-tail-group dani-tail-group" data-part="tail">
    <path class="cat-tail dani-tail" data-silhouette="true"
      d="M68 130 C42 132 25 114 28 92 C30 76 40 69 49 74 C58 80 55 90 45 92 C38 93 34 87 37 81"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g class="dani-body-group" data-part="body" data-angle-art="three-quarter-right">
    <path class="cat-body dani-body" data-silhouette="true"
      d="M51 88 C57 73 71 65 88 64 C103 63 117 68 126 80 C138 96 141 119 132 135 C116 142 85 143 65 137 C52 127 45 105 51 88 Z"
      fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-belly" data-detail="coat"
      d="M78 68 C87 66 97 68 105 75 C119 88 124 112 118 132 C112 139 97 141 81 139 C88 133 94 124 95 113 C97 96 91 80 78 68 Z"
      fill="var(--dani-light, #e6c96e)" opacity="0.8"/>
    <path class="dani-stripes" data-part="stripes" data-detail="coat"
      d="M69 73 L76 84 M59 79 L68 89 M53 92 L64 98 M61 114 L72 111"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="4" stroke-linecap="round" opacity="0.78"/>
    <path class="dani-leg dani-leg--front" data-part="paw-front" data-silhouette="true"
      d="M116 91 C125 98 128 108 124 116" fill="none" stroke="var(--dani-yellow, #d3a83c)" stroke-width="7" stroke-linecap="round"/>
    <path class="dani-paw dani-paw--front" data-part="paw-front-tip" data-silhouette="true"
      d="M113 117 C117 112 126 111 132 115 C127 120 119 121 113 117 Z" fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-leg dani-leg--support" data-part="paw-support" data-silhouette="true"
      d="M103 98 C108 113 108 128 107 137" fill="none" stroke="var(--dani-yellow, #d3a83c)" stroke-width="7" stroke-linecap="round"/>
    <path class="dani-paw dani-paw--support" data-part="paw-support-tip" data-silhouette="true"
      d="M94 138 C99 133 109 132 117 137 C112 143 100 142 94 138 Z" fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-paw dani-paw--tucked" data-part="paw-rear" data-silhouette="true"
      d="M55 138 C60 132 71 131 79 136 C74 142 63 142 55 138 Z" fill="var(--dani-shadow, #9d7333)"/>
  </g>
  <g class="dani-bow" data-part="bow">
    <path data-silhouette="true" d="M101 76 C93 71 87 76 89 83 C92 89 99 86 105 82 Z" fill="var(--sage, #77866e)"/>
    <path data-silhouette="true" d="M116 76 C125 71 129 77 126 84 C123 90 116 86 110 82 Z" fill="var(--new-green, #6f8f59)"/>
    <circle cx="108" cy="80" r="4.5" fill="var(--leaf-dark, #63483c)"/>
  </g>
  <g class="cat-head dani-head" data-part="head">
    <path class="cat-ear dani-ear dani-ear--left" data-part="ear-near" data-silhouette="true"
      d="M93 28 L94 12 L112 27 Z" fill="var(--dani-yellow, #d3a83c)"/>
    <path class="cat-ear dani-ear dani-ear--right" data-part="ear-far" data-silhouette="true"
      d="M128 30 L147 14 L149 38 Z" fill="var(--dani-shadow, #9d7333)"/>
    <path class="dani-ear-inner" data-detail="coat" d="M99 27 L99 19 L107 27 Z M135 29 L144 21 L145 32 Z"
      fill="var(--paper-light, #f8f1e5)" opacity="0.32"/>
    <path class="dani-face" data-part="face" data-silhouette="true"
      d="M80 42 C86 26 104 17 124 20 C142 23 155 36 155 53 C157 56 157 59 155 62 C146 76 124 86 103 80 C84 74 74 59 80 42 Z"
      fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-forehead-stripes" data-part="stripes" data-detail="coat"
      d="M109 22 L112 32 M121 20 L121 31 M133 22 L130 32" fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="3.4" stroke-linecap="round" opacity="0.8"/>
    <path class="dani-cheek-stripes" data-part="stripes" data-detail="coat"
      d="M85 56 L96 60 M151 58 L139 60" fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="3" stroke-linecap="round" opacity="0.72"/>
    <g class="dani-eyes" data-part="eyes">
      <circle class="cat-eye dani-eye dani-eye--left" data-detail="face" cx="106" cy="47" r="2.2" fill="var(--ink, #252521)"/>
      <circle class="cat-eye dani-eye dani-eye--right" data-detail="face" cx="136" cy="50" r="2.3" fill="var(--ink, #252521)"/>
      <path class="dani-sleep-eye" data-detail="face" d="M101 48 Q106 52 111 48 M131 51 Q136 55 141 51"
        fill="none" stroke="var(--ink, #252521)" stroke-width="1.8" stroke-linecap="round"/>
    </g>
    <g class="dani-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08"
      stroke="var(--ink, #252521)" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round">
      <path class="dani-lens dani-lens--far" data-part="lens-far" d="M94 38 C99 34 112 33 120 37 C120 51 115 59 105 60 C96 58 92 50 94 38 Z"/>
      <path class="dani-lens dani-lens--near" data-part="lens-near" d="M124 40 C129 35 142 35 149 39 C150 52 146 61 136 63 C127 61 122 52 124 40 Z"/>
      <path class="dani-glasses-bridge" d="M119 42 C121 40 123 40 125 43" fill="none"/>
      <path class="dani-glasses-arm" d="M94 41 L84 40 M149 43 L156 41" fill="none"/>
      <path class="dani-lens-glint" data-detail="micro" d="M99 36 L104 38 M129 38 L135 40"
        stroke="var(--paper-light, #f8f1e5)" stroke-width="1.2" opacity="0.82"/>
    </g>
    <path class="dani-worry-brows" data-detail="face" d="M101 34 L110 36 M132 38 L142 36"
      stroke="var(--ink, #252521)" stroke-width="1.4" stroke-linecap="round"/>
    <path class="dani-muzzle" data-part="muzzle" data-detail="coat"
      d="M107 57 C114 51 131 52 138 58 C140 65 130 70 119 70 C110 68 105 63 107 57 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.42"/>
    <path class="dani-nose" data-part="nose" data-detail="face" d="M121 57 L128 57 L125 62 Z" fill="var(--ink, #252521)"/>
    <path class="dani-mouth" data-detail="micro" d="M125 62 Q121 66 117 64 M125 62 Q129 66 133 64"
      fill="none" stroke="var(--ink, #252521)" stroke-width="1.2" stroke-linecap="round"/>
    <path class="dani-whiskers" data-part="whiskers" data-detail="micro"
      d="M106 59 L81 54 M107 64 L81 67 M139 60 L163 57 M139 65 L162 70"
      fill="none" stroke="var(--ink, #252521)" stroke-width="1" stroke-linecap="round" opacity="0.64"/>
  </g>`;
}

function daniProfile(facing: CharacterFacing): string {
  if (facing === "right") {
    return `
    <g class="cat-tail-group dani-tail-group" data-part="tail">
      <path class="cat-tail dani-tail" data-silhouette="true" d="M65 132 C39 133 29 114 35 96 C39 84 49 82 56 88 C61 94 57 101 50 101"
        fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="10" stroke-linecap="round"/>
    </g>
    <g class="dani-body-group" data-part="body" data-angle-art="profile-right">
      <path class="cat-body dani-body" data-silhouette="true" d="M56 136 C48 119 53 91 70 77 C83 66 105 66 118 78 C130 90 132 119 121 136 C101 142 74 142 56 136 Z" fill="var(--dani-yellow, #d3a83c)"/>
      <path class="dani-belly" data-detail="coat" d="M94 75 C109 82 115 101 111 137 L86 138 C91 120 92 94 94 75 Z" fill="var(--dani-light, #e6c96e)" opacity="0.72"/>
      <path class="dani-stripes" data-part="stripes" data-detail="coat" d="M66 86 L78 93 M61 99 L75 104 M63 113 L76 116" fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="4" stroke-linecap="round"/>
      <path class="dani-leg dani-leg--support" data-part="paw-support" data-silhouette="true" d="M103 105 L104 137" stroke="var(--dani-yellow, #d3a83c)" stroke-width="8" stroke-linecap="round"/>
      <path class="dani-paw dani-paw--support" data-part="paw-support-tip" data-silhouette="true" d="M94 138 C102 133 114 133 120 139 C113 143 101 143 94 138 Z" fill="var(--dani-light, #e6c96e)"/>
    </g>
    <g class="dani-bow" data-part="bow"><path data-silhouette="true" d="M109 78 C100 72 96 78 99 85 L111 82 Z" fill="var(--sage, #77866e)"/><path data-silhouette="true" d="M117 78 C126 73 131 79 127 85 L115 82 Z" fill="var(--new-green, #6f8f59)"/><circle cx="113" cy="81" r="4" fill="var(--leaf-dark, #63483c)"/></g>
    <g class="cat-head dani-head" data-part="head">
      <path class="cat-ear dani-ear dani-ear--left" data-part="ear-far" data-silhouette="true" d="M89 34 L94 14 L108 31 Z" fill="var(--dani-shadow, #9d7333)"/>
      <path class="cat-ear dani-ear dani-ear--right" data-part="ear-near" data-silhouette="true" d="M116 30 L133 13 L133 39 Z" fill="var(--dani-yellow, #d3a83c)"/>
      <path class="dani-face" data-part="face" data-silhouette="true" d="M85 48 C91 28 109 22 128 27 C143 31 150 42 149 54 C158 57 163 64 157 68 C151 72 142 70 137 69 C128 80 108 83 94 73 C86 67 82 57 85 48 Z" fill="var(--dani-light, #e6c96e)"/>
      <path class="dani-forehead-stripes" data-part="stripes" data-detail="coat" d="M108 27 L111 37 M120 25 L120 36" stroke="var(--dani-shadow, #9d7333)" stroke-width="3.4" stroke-linecap="round"/>
      <g class="dani-eyes" data-part="eyes"><circle class="cat-eye dani-eye dani-eye--left" data-detail="face" cx="128" cy="49" r="2.5" fill="var(--ink, #252521)"/><path class="dani-sleep-eye" data-detail="face" d="M123 50 Q128 54 133 50" fill="none" stroke="var(--ink, #252521)" stroke-width="1.8"/></g>
      <g class="dani-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08" stroke="var(--ink, #252521)" stroke-width="2.4">
        <path class="dani-lens dani-lens--near" data-part="lens-near" d="M115 39 C125 34 140 37 144 42 C145 54 139 61 128 62 C118 59 114 51 115 39 Z"/><path class="dani-glasses-arm" d="M116 42 L101 40 M143 44 L150 45" fill="none"/><path class="dani-lens-glint" data-detail="micro" d="M121 39 L127 37" stroke="var(--paper-light, #f8f1e5)"/>
      </g>
      <path class="dani-worry-brows" data-detail="face" d="M122 36 L133 38" stroke="var(--ink, #252521)" stroke-width="1.4"/>
      <path class="dani-muzzle" data-part="muzzle" data-detail="coat" d="M136 55 C146 53 157 58 159 63 C154 71 141 72 134 65 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.42"/>
      <path class="dani-nose" data-part="nose" data-detail="face" d="M153 59 L160 62 L154 66 Z" fill="var(--ink, #252521)"/>
      <path class="dani-whiskers" data-part="whiskers" data-detail="micro" d="M145 67 L169 70 M143 63 L169 61" stroke="var(--ink, #252521)" fill="none" stroke-width="1" opacity="0.64"/>
    </g>`;
  }

  return `
  <g class="cat-tail-group dani-tail-group" data-part="tail">
    <path class="cat-tail dani-tail" data-silhouette="true" d="M115 132 C141 133 151 114 145 96 C141 84 131 82 124 88 C119 94 123 101 130 101"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="10" stroke-linecap="round"/>
  </g>
  <g class="dani-body-group" data-part="body" data-angle-art="profile-left">
    <path class="cat-body dani-body" data-silhouette="true" d="M124 136 C132 119 127 91 110 77 C97 66 75 66 62 78 C50 90 48 119 59 136 C79 142 106 142 124 136 Z" fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-belly" data-detail="coat" d="M86 75 C71 82 65 101 69 137 L94 138 C89 120 88 94 86 75 Z" fill="var(--dani-light, #e6c96e)" opacity="0.72"/>
    <path class="dani-stripes" data-part="stripes" data-detail="coat" d="M114 86 L102 93 M119 99 L105 104 M117 113 L104 116" fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="4" stroke-linecap="round"/>
    <path class="dani-leg dani-leg--support" data-part="paw-support" data-silhouette="true" d="M77 105 L76 137" stroke="var(--dani-yellow, #d3a83c)" stroke-width="8" stroke-linecap="round"/>
    <path class="dani-paw dani-paw--support" data-part="paw-support-tip" data-silhouette="true" d="M86 138 C78 133 66 133 60 139 C67 143 79 143 86 138 Z" fill="var(--dani-light, #e6c96e)"/>
  </g>
  <g class="dani-bow" data-part="bow"><path data-silhouette="true" d="M71 78 C80 72 84 78 81 85 L69 82 Z" fill="var(--sage, #77866e)"/><path data-silhouette="true" d="M63 78 C54 73 49 79 53 85 L65 82 Z" fill="var(--new-green, #6f8f59)"/><circle cx="67" cy="81" r="4" fill="var(--leaf-dark, #63483c)"/></g>
  <g class="cat-head dani-head" data-part="head">
    <path class="cat-ear dani-ear dani-ear--left" data-part="ear-near" data-silhouette="true" d="M64 30 L47 13 L47 39 Z" fill="var(--dani-yellow, #d3a83c)"/>
    <path class="cat-ear dani-ear dani-ear--right" data-part="ear-far" data-silhouette="true" d="M91 34 L86 14 L72 31 Z" fill="var(--dani-shadow, #9d7333)"/>
    <path class="dani-face" data-part="face" data-silhouette="true" d="M95 48 C89 28 71 22 52 27 C37 31 30 42 31 54 C22 57 17 64 23 68 C29 72 38 70 43 69 C52 80 72 83 86 73 C94 67 98 57 95 48 Z" fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-forehead-stripes" data-part="stripes" data-detail="coat" d="M72 27 L69 37 M60 25 L60 36" stroke="var(--dani-shadow, #9d7333)" stroke-width="3.4" stroke-linecap="round"/>
    <g class="dani-eyes" data-part="eyes"><circle class="cat-eye dani-eye dani-eye--left" data-detail="face" cx="52" cy="49" r="2.5" fill="var(--ink, #252521)"/><path class="dani-sleep-eye" data-detail="face" d="M47 50 Q52 54 57 50" fill="none" stroke="var(--ink, #252521)" stroke-width="1.8"/></g>
    <g class="dani-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08" stroke="var(--ink, #252521)" stroke-width="2.4">
      <path class="dani-lens dani-lens--near" data-part="lens-near" d="M65 39 C55 34 40 37 36 42 C35 54 41 61 52 62 C62 59 66 51 65 39 Z"/><path class="dani-glasses-arm" d="M64 42 L79 40 M37 44 L30 45" fill="none"/><path class="dani-lens-glint" data-detail="micro" d="M59 39 L53 37" stroke="var(--paper-light, #f8f1e5)"/>
    </g>
    <path class="dani-worry-brows" data-detail="face" d="M58 36 L47 38" stroke="var(--ink, #252521)" stroke-width="1.4"/>
    <path class="dani-muzzle" data-part="muzzle" data-detail="coat" d="M44 55 C34 53 23 58 21 63 C26 71 39 72 46 65 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.42"/>
    <path class="dani-nose" data-part="nose" data-detail="face" d="M27 59 L20 62 L26 66 Z" fill="var(--ink, #252521)"/>
    <path class="dani-whiskers" data-part="whiskers" data-detail="micro" d="M35 67 L11 70 M37 63 L11 61" stroke="var(--ink, #252521)" fill="none" stroke-width="1" opacity="0.64"/>
  </g>`;
}

function daniBack(facing: CharacterFacing): string {
  const tailPath =
    facing === "left"
      ? "M118 132 C142 130 151 112 145 96 C140 83 129 84 124 91 C120 98 125 105 132 103"
      : facing === "right"
        ? "M62 132 C38 130 29 112 35 96 C40 83 51 84 56 91 C60 98 55 105 48 103"
        : "M116 132 C140 131 149 113 144 97 C140 85 130 84 124 91 C120 97 124 103 131 103";

  return `
  <g class="cat-tail-group dani-tail-group" data-part="tail">
    <path class="cat-tail dani-tail" data-silhouette="true" d="${tailPath}" fill="none"
      stroke="var(--dani-shadow, #9d7333)" stroke-width="10" stroke-linecap="round"/>
  </g>
  <g class="dani-body-group" data-part="body" data-angle-art="back">
    <path class="cat-body dani-body" data-silhouette="true"
      d="M51 137 C47 119 51 91 64 77 C76 65 103 65 116 77 C130 91 134 119 129 137 C110 143 70 143 51 137 Z"
      fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-back-shadow" data-detail="coat" d="M91 68 C110 71 121 91 120 116 C119 127 115 136 109 140 L91 141 Z"
      fill="var(--dani-shadow, #9d7333)" opacity="0.3"/>
    <path class="dani-stripes" data-part="stripes" data-detail="coat"
      d="M70 77 L79 88 M89 69 L89 84 M108 77 L99 88 M57 100 L72 104 M123 100 L108 104"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="4" stroke-linecap="round" opacity="0.82"/>
    <path class="dani-paw dani-paw--front" data-part="paw-front-tip" data-silhouette="true" d="M52 137 C61 133 72 133 78 139 C69 143 59 143 52 137 Z" fill="var(--dani-light, #e6c96e)"/>
    <path class="dani-paw dani-paw--support" data-part="paw-support-tip" data-silhouette="true" d="M102 139 C108 133 119 133 128 137 C121 143 111 143 102 139 Z" fill="var(--dani-light, #e6c96e)"/>
  </g>
  <g class="dani-bow dani-bow--back" data-part="bow"><path data-silhouette="true" d="M77 78 C70 73 66 77 69 84 L84 82 Z" fill="var(--sage, #77866e)"/><path data-silhouette="true" d="M103 78 C110 73 114 77 111 84 L96 82 Z" fill="var(--new-green, #6f8f59)"/><circle cx="90" cy="81" r="4" fill="var(--leaf-dark, #63483c)"/></g>
  <g class="cat-head dani-head" data-part="head">
    <path class="cat-ear dani-ear dani-ear--left" data-part="ear-near" data-silhouette="true" d="M48 38 L53 13 L72 31 Z" fill="var(--dani-shadow, #9d7333)"/>
    <path class="cat-ear dani-ear dani-ear--right" data-part="ear-far" data-silhouette="true" d="M108 31 L126 13 L128 39 Z" fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-face dani-head-back" data-part="head-back" data-silhouette="true"
      d="M43 51 C44 30 62 20 89 19 C115 19 133 31 134 52 C135 72 116 83 89 84 C62 84 42 72 43 51 Z"
      fill="var(--dani-yellow, #d3a83c)"/>
    <path class="dani-forehead-stripes" data-part="stripes" data-detail="coat" d="M70 23 L75 37 M89 20 L89 36 M108 23 L103 37"
      fill="none" stroke="var(--dani-shadow, #9d7333)" stroke-width="4" stroke-linecap="round" opacity="0.84"/>
  </g>`;
}

function daniGeometry(angle: CharacterAngle, facing: CharacterFacing): string {
  switch (angle) {
    case "front":
      return daniFront(facing);
    case "three-quarter-left":
      return daniThreeQuarterLeft();
    case "three-quarter-right":
      return daniThreeQuarterRight();
    case "profile":
      return daniProfile(facing);
    case "back":
      return daniBack(facing);
  }
}

export function renderDaniArt(extraClass?: string): string;
export function renderDaniArt(options?: DaniArtOptions): string;
export function renderDaniArt(input: string | DaniArtOptions = ""): string {
  const options: DaniArtOptions = typeof input === "string" ? { className: input } : input;
  const angle = options.angle ?? "three-quarter-left";
  const facing = options.facing ?? "left";
  const interactive = options.interactive ?? false;
  const style = characterSizeStyle(options.size);
  const classes = joinCharacterClasses(
    "fig fig-cat fig-dani character",
    `character--angle-${angle}`,
    `character--facing-${facing}`,
    characterSizeClass(options.size),
    (options.size === "small" || (typeof options.size === "number" && options.size <= 48)) &&
      "character--small",
    options.reducedMotion && "character--reduced-motion",
    interactive && "character--interactive",
    options.className,
  );

  return `
<svg class="${escapeCharacterAttribute(classes)}" viewBox="${DANI_VIEW_BOX}"
  role="${interactive ? "button" : "img"}"${interactive ? ' tabindex="0"' : ""}
  data-character="dani" data-baseline="${DANI_BASELINE}"
  data-angle="${angle}" data-facing="${facing}"${options.state ? ` data-state="${escapeCharacterAttribute(options.state)}"` : ""}
  data-reduced-motion="${options.reducedMotion ? "true" : "false"}" data-interactive="${interactive ? "true" : "false"}"
  ${style ? `style="${style}"` : ""}
  aria-label="Dani, gata ocre pequeña con rayas, lentes redondos y lazo verde"
  xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow dani-ground-shadow" data-part="ground-shadow"
    cx="90" cy="141" rx="55" ry="5.5" fill="var(--shadow, rgba(30, 35, 33, 0.16))"/>
  ${daniGeometry(angle, facing)}
</svg>`;
}
