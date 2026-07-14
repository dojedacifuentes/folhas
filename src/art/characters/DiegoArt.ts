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
 * Dibujo fuente de Diego. La masa vertical, el cuello unido al pecho, el
 * urajiro y la cola cerrada se mantienen en cada geometría visible.
 */
export const DIEGO_VIEW_BOX = "0 0 180 158";
export const DIEGO_BASELINE = 149;

export interface DiegoArtOptions {
  className?: string;
  state?: string;
  angle?: CharacterAngle;
  facing?: CharacterFacing;
  size?: CharacterSize;
  reducedMotion?: boolean;
  interactive?: boolean;
}

function diegoFront(facing: CharacterFacing): string {
  const tailPath =
    facing === "left"
      ? "M126 118 C151 119 162 100 156 83 C151 69 137 66 129 75 C122 84 128 94 138 93 C147 92 150 82 144 77"
      : facing === "right"
        ? "M54 118 C29 119 18 100 24 83 C29 69 43 66 51 75 C58 84 52 94 42 93 C33 92 30 82 36 77"
        : "M127 119 C151 120 162 101 156 84 C151 70 138 67 130 76 C123 84 128 94 138 94 C147 93 150 83 145 78";

  return `
  <g class="diego-tail-group" data-part="tail">
    <path class="akita-tail diego-tail" data-silhouette="true" d="${tailPath}" fill="none"
      stroke="var(--diego-shadow, #316a68)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
    <path class="diego-tail-tip" data-detail="coat" d="M142 76 C148 79 150 86 146 91"
      fill="none" stroke="var(--paper-light, #f8f1e5)" stroke-width="4" stroke-linecap="round" opacity="0.72"/>
  </g>
  <g class="diego-body-group" data-part="body" data-angle-art="front">
    <path class="akita-body diego-body" data-silhouette="true"
      d="M43 145 L44 102 C44 80 62 65 89 64 C117 64 135 80 136 102 L137 145 C113 151 68 151 43 145 Z"
      fill="var(--diego-turquoise, #4d918b)"/>
    <path class="diego-neck" data-part="neck" data-silhouette="true"
      d="M51 61 C61 51 75 47 90 47 C106 47 120 52 130 62 L127 91 C111 102 69 102 53 91 Z"
      fill="var(--diego-turquoise, #4d918b)"/>
    <path class="akita-chest diego-chest" data-part="chest" data-detail="coat"
      d="M70 76 C78 68 87 67 90 73 C94 67 104 68 111 76 L106 143 L74 143 Z"
      fill="var(--paper-light, #f8f1e5)" opacity="0.92"/>
    <path class="diego-shoulder diego-shoulder--left" data-detail="coat" d="M49 91 C58 82 68 80 77 85 L68 113 C57 110 49 103 49 91 Z"
      fill="var(--diego-light, #79aaa4)" opacity="0.62"/>
    <path class="diego-shoulder diego-shoulder--right" data-detail="coat" d="M131 91 C122 82 112 80 103 85 L112 113 C123 110 131 103 131 91 Z"
      fill="var(--diego-light, #79aaa4)" opacity="0.62"/>
    <path class="akita-leg diego-leg diego-leg--left" data-part="paw-front" data-silhouette="true"
      d="M49 104 C57 99 68 102 72 111 L70 143 C64 149 52 149 47 142 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="akita-leg diego-leg diego-leg--right" data-part="paw-far" data-silhouette="true"
      d="M108 111 C112 102 123 99 131 104 L133 142 C128 149 116 149 110 143 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-paw diego-paw--left" data-part="paw-front-tip" data-silhouette="true"
      d="M42 143 C51 137 68 137 77 144 C70 151 50 152 42 143 Z" fill="var(--paper-light, #f8f1e5)"/>
    <path class="diego-paw diego-paw--right" data-part="paw-far-tip" data-silhouette="true"
      d="M103 144 C112 137 129 137 138 143 C130 152 110 151 103 144 Z" fill="var(--paper-light, #f8f1e5)"/>
    <path class="diego-toes" data-detail="micro" d="M55 143 L54 148 M65 143 L65 148 M116 143 L116 148 M126 143 L127 148"
      stroke="var(--diego-shadow, #316a68)" stroke-width="1.2" stroke-linecap="round" opacity="0.62"/>
  </g>
  <g class="diego-bow" data-part="bow">
    <path data-silhouette="true" d="M78 77 C67 70 61 75 64 85 C68 93 77 88 86 83 Z" fill="var(--night-deep, #172329)"/>
    <path data-silhouette="true" d="M102 77 C113 70 120 76 116 86 C112 93 103 88 94 83 Z" fill="var(--night, #233039)"/>
    <rect x="84" y="77" width="12" height="12" rx="3" fill="var(--ink, #252521)"/>
  </g>
  <g class="akita-head diego-head" data-part="head">
    <path class="akita-ear diego-ear diego-ear--left" data-part="ear-near" data-silhouette="true"
      d="M50 34 L57 14 L73 31 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="akita-ear diego-ear diego-ear--right" data-part="ear-far" data-silhouette="true"
      d="M107 31 L123 14 L130 35 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-ear-inner" data-detail="coat" d="M57 30 L60 21 L68 31 Z M113 30 L121 21 L124 31 Z"
      fill="var(--paper-light, #f8f1e5)" opacity="0.28"/>
    <path class="diego-face" data-part="face" data-silhouette="true"
      d="M37 49 C41 28 61 16 89 15 C118 15 138 29 142 50 L135 66 C124 77 108 81 90 81 C70 81 53 77 43 66 Z"
      fill="var(--diego-turquoise, #4d918b)"/>
    <path class="diego-mask" data-part="urajiro" data-detail="coat"
      d="M45 49 C51 37 64 32 77 35 C71 43 72 55 80 63 C66 67 50 61 45 49 Z M135 49 C129 37 116 32 103 35 C109 43 108 55 100 63 C114 67 130 61 135 49 Z"
      fill="var(--paper-light, #f8f1e5)" opacity="0.94"/>
    <path class="akita-muzzle diego-muzzle" data-part="muzzle" data-silhouette="true"
      d="M66 51 C73 42 82 40 90 42 C99 40 109 43 115 52 C119 66 106 76 90 78 C74 76 61 66 66 51 Z"
      fill="var(--paper-light, #f8f1e5)"/>
    <g class="diego-eyes" data-part="eyes">
      <circle class="diego-eye diego-eye--left" data-detail="face" cx="68" cy="45" r="2.1" fill="var(--ink, #252521)"/>
      <circle class="diego-eye diego-eye--right" data-detail="face" cx="111" cy="45" r="2.1" fill="var(--ink, #252521)"/>
    </g>
    <g class="diego-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08"
      stroke="var(--ink, #252521)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      <path class="diego-lens diego-lens--left" data-part="lens-near" d="M52 36 L80 36 L80 54 L54 55 Z"/>
      <path class="diego-lens diego-lens--right" data-part="lens-far" d="M99 36 L128 37 L126 55 L99 54 Z"/>
      <path class="diego-glasses-bridge" d="M80 42 C86 39 93 39 99 42" fill="none"/>
      <path class="diego-glasses-arm" d="M53 40 L41 37 M127 41 L138 38" fill="none"/>
      <path class="diego-lens-glint" data-detail="micro" d="M57 39 L66 38 M104 39 L113 39"
        stroke="var(--paper-light, #f8f1e5)" stroke-width="1.2" opacity="0.8"/>
    </g>
    <path class="diego-brow diego-brow--left" data-detail="face" d="M58 32 L75 31" stroke="var(--ink, #252521)" stroke-width="1.6"/>
    <path class="diego-brow diego-brow--right" data-detail="face" d="M104 31 L121 33" stroke="var(--ink, #252521)" stroke-width="1.6"/>
    <path class="diego-blush" data-detail="face" d="M51 58 L61 60 M129 58 L119 60" stroke="var(--dani-shadow, #9d7333)" stroke-width="2.2" stroke-linecap="round"/>
    <path class="diego-nose" data-part="nose" data-detail="face" d="M83 55 L97 55 L90 62 Z" fill="var(--ink, #252521)"/>
    <path class="diego-mouth" data-detail="micro" d="M90 62 L90 67 M90 67 L82 70 M90 67 L98 70"
      stroke="var(--ink, #252521)" stroke-width="1.4" stroke-linecap="round" fill="none"/>
  </g>`;
}

function diegoThreeQuarterLeft(): string {
  return `
  <g class="diego-tail-group" data-part="tail">
    <path class="akita-tail diego-tail" data-silhouette="true"
      d="M126 118 C151 119 163 99 156 81 C151 67 137 65 128 74 C120 83 126 94 137 94 C147 94 151 83 145 77"
      fill="none" stroke="var(--diego-shadow, #316a68)" stroke-width="14" stroke-linecap="round"/>
    <path class="diego-tail-tip" data-detail="coat" d="M143 75 C150 80 151 87 146 92" fill="none" stroke="var(--paper-light, #f8f1e5)" stroke-width="4" stroke-linecap="round" opacity="0.72"/>
  </g>
  <g class="diego-body-group" data-part="body" data-angle-art="three-quarter-left">
    <path class="akita-body diego-body" data-silhouette="true"
      d="M39 145 L40 105 C40 82 56 67 80 64 C106 61 130 72 138 94 C142 106 140 127 135 145 C111 151 63 151 39 145 Z"
      fill="var(--diego-turquoise, #4d918b)"/>
    <path class="diego-neck" data-part="neck" data-silhouette="true"
      d="M45 63 C55 52 70 48 87 49 C105 49 121 56 131 69 L127 97 C108 105 64 102 48 91 Z"
      fill="var(--diego-turquoise, #4d918b)"/>
    <path class="akita-chest diego-chest" data-part="chest" data-detail="coat"
      d="M58 74 C68 66 80 66 89 75 C98 88 102 112 98 145 L63 145 C57 124 53 93 58 74 Z"
      fill="var(--paper-light, #f8f1e5)" opacity="0.92"/>
    <path class="diego-shoulder" data-detail="coat" d="M109 72 C127 78 136 94 134 112 C124 105 115 99 104 96 Z"
      fill="var(--diego-light, #79aaa4)" opacity="0.62"/>
    <path class="akita-leg diego-leg diego-leg--left" data-part="paw-front" data-silhouette="true"
      d="M45 105 C53 100 64 103 68 112 L66 143 C60 149 49 149 44 142 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="akita-leg diego-leg diego-leg--right" data-part="paw-far" data-silhouette="true"
      d="M108 112 C114 104 126 105 131 114 L132 143 C125 149 113 148 108 142 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-paw diego-paw--left" data-part="paw-front-tip" data-silhouette="true" d="M38 143 C47 137 64 137 73 144 C66 151 46 152 38 143 Z" fill="var(--paper-light, #f8f1e5)"/>
    <path class="diego-paw diego-paw--right" data-part="paw-far-tip" data-silhouette="true" d="M103 144 C112 138 128 138 137 144 C129 151 111 151 103 144 Z" fill="var(--paper-light, #f8f1e5)"/>
  </g>
  <g class="diego-bow" data-part="bow"><path data-silhouette="true" d="M64 78 C53 72 48 78 52 87 C57 94 65 88 73 83 Z" fill="var(--night-deep, #172329)"/><path data-silhouette="true" d="M86 78 C97 71 103 78 99 87 C94 94 86 88 78 83 Z" fill="var(--night, #233039)"/><rect x="71" y="77" width="10" height="12" rx="3" fill="var(--ink, #252521)"/></g>
  <g class="akita-head diego-head" data-part="head">
    <path class="akita-ear diego-ear diego-ear--left" data-part="ear-near" data-silhouette="true" d="M35 36 L42 15 L59 32 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="akita-ear diego-ear diego-ear--right" data-part="ear-far" data-silhouette="true" d="M91 31 L108 15 L114 36 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-face" data-part="face" data-silhouette="true" d="M23 52 C27 31 45 18 70 16 C98 14 119 28 125 49 L119 65 C108 77 91 82 72 82 C51 82 34 76 25 65 Z" fill="var(--diego-turquoise, #4d918b)"/>
    <path class="diego-mask" data-part="urajiro" data-detail="coat" d="M30 50 C36 38 48 34 61 36 C55 45 57 56 65 64 C51 68 35 62 30 50 Z M117 48 C111 37 100 34 88 36 C94 44 93 55 87 63 C99 67 113 60 117 48 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.94"/>
    <path class="akita-muzzle diego-muzzle" data-part="muzzle" data-silhouette="true" d="M45 53 C52 44 63 42 73 45 C82 44 92 48 96 57 C96 69 83 78 69 79 C54 77 40 68 45 53 Z" fill="var(--paper-light, #f8f1e5)"/>
    <g class="diego-eyes" data-part="eyes"><circle class="diego-eye diego-eye--left" data-detail="face" cx="50" cy="46" r="2.1" fill="var(--ink, #252521)"/><circle class="diego-eye diego-eye--right" data-detail="face" cx="87" cy="44" r="2" fill="var(--ink, #252521)"/></g>
    <g class="diego-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08" stroke="var(--ink, #252521)" stroke-width="2.6" stroke-linejoin="round">
      <path class="diego-lens diego-lens--left" data-part="lens-near" d="M35 37 L63 36 L64 55 L37 56 Z"/><path class="diego-lens diego-lens--right" data-part="lens-far" d="M70 35 L97 36 L96 53 L71 53 Z"/><path class="diego-glasses-bridge" d="M64 42 L70 41" fill="none"/><path class="diego-glasses-arm" d="M35 41 L24 39 M97 40 L118 38" fill="none"/><path class="diego-lens-glint" data-detail="micro" d="M40 40 L48 38 M75 38 L83 37" stroke="var(--paper-light, #f8f1e5)" stroke-width="1.2"/>
    </g>
    <path class="diego-brow diego-brow--left" data-detail="face" d="M40 33 L57 31" stroke="var(--ink, #252521)" stroke-width="1.6"/><path class="diego-brow diego-brow--right" data-detail="face" d="M77 30 L93 32" stroke="var(--ink, #252521)" stroke-width="1.6"/>
    <path class="diego-blush" data-detail="face" d="M33 60 L43 62 M103 57 L113 59" stroke="var(--dani-shadow, #9d7333)" stroke-width="2.2"/>
    <path class="diego-nose" data-part="nose" data-detail="face" d="M61 56 L75 56 L68 63 Z" fill="var(--ink, #252521)"/><path class="diego-mouth" data-detail="micro" d="M68 63 L68 68 M68 68 L60 71 M68 68 L76 71" stroke="var(--ink, #252521)" stroke-width="1.4" fill="none"/>
  </g>`;
}

function diegoThreeQuarterRight(): string {
  return `
  <g class="diego-tail-group" data-part="tail"><path class="akita-tail diego-tail" data-silhouette="true" d="M54 118 C29 119 17 99 24 81 C29 67 43 65 52 74 C60 83 54 94 43 94 C33 94 29 83 35 77" fill="none" stroke="var(--diego-shadow, #316a68)" stroke-width="14" stroke-linecap="round"/><path class="diego-tail-tip" data-detail="coat" d="M37 75 C30 80 29 87 34 92" fill="none" stroke="var(--paper-light, #f8f1e5)" stroke-width="4" stroke-linecap="round" opacity="0.72"/></g>
  <g class="diego-body-group" data-part="body" data-angle-art="three-quarter-right">
    <path class="akita-body diego-body" data-silhouette="true" d="M141 145 L140 105 C140 82 124 67 100 64 C74 61 50 72 42 94 C38 106 40 127 45 145 C69 151 117 151 141 145 Z" fill="var(--diego-turquoise, #4d918b)"/>
    <path class="diego-neck" data-part="neck" data-silhouette="true" d="M135 63 C125 52 110 48 93 49 C75 49 59 56 49 69 L53 97 C72 105 116 102 132 91 Z" fill="var(--diego-turquoise, #4d918b)"/>
    <path class="akita-chest diego-chest" data-part="chest" data-detail="coat" d="M122 74 C112 66 100 66 91 75 C82 88 78 112 82 145 L117 145 C123 124 127 93 122 74 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.92"/>
    <path class="diego-shoulder" data-detail="coat" d="M71 72 C53 78 44 94 46 112 C56 105 65 99 76 96 Z" fill="var(--diego-light, #79aaa4)" opacity="0.62"/>
    <path class="akita-leg diego-leg diego-leg--left" data-part="paw-front" data-silhouette="true" d="M135 105 C127 100 116 103 112 112 L114 143 C120 149 131 149 136 142 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="akita-leg diego-leg diego-leg--right" data-part="paw-far" data-silhouette="true" d="M72 112 C66 104 54 105 49 114 L48 143 C55 149 67 148 72 142 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-paw diego-paw--left" data-part="paw-front-tip" data-silhouette="true" d="M142 143 C133 137 116 137 107 144 C114 151 134 152 142 143 Z" fill="var(--paper-light, #f8f1e5)"/><path class="diego-paw diego-paw--right" data-part="paw-far-tip" data-silhouette="true" d="M77 144 C68 138 52 138 43 144 C51 151 69 151 77 144 Z" fill="var(--paper-light, #f8f1e5)"/>
  </g>
  <g class="diego-bow" data-part="bow"><path data-silhouette="true" d="M116 78 C127 72 132 78 128 87 C123 94 115 88 107 83 Z" fill="var(--night-deep, #172329)"/><path data-silhouette="true" d="M94 78 C83 71 77 78 81 87 C86 94 94 88 102 83 Z" fill="var(--night, #233039)"/><rect x="99" y="77" width="10" height="12" rx="3" fill="var(--ink, #252521)"/></g>
  <g class="akita-head diego-head" data-part="head">
    <path class="akita-ear diego-ear diego-ear--left" data-part="ear-far" data-silhouette="true" d="M66 31 L72 15 L89 31 Z" fill="var(--diego-shadow, #316a68)"/><path class="akita-ear diego-ear diego-ear--right" data-part="ear-near" data-silhouette="true" d="M121 32 L138 15 L145 36 Z" fill="var(--diego-shadow, #316a68)"/>
    <path class="diego-face" data-part="face" data-silhouette="true" d="M55 49 C61 28 82 14 110 16 C135 18 153 31 157 52 L155 65 C146 76 129 82 108 82 C89 82 72 77 61 65 Z" fill="var(--diego-turquoise, #4d918b)"/>
    <path class="diego-mask" data-part="urajiro" data-detail="coat" d="M63 48 C69 37 80 34 92 36 C86 44 87 55 93 63 C81 67 67 60 63 48 Z M150 50 C144 38 132 34 119 36 C125 45 123 56 115 64 C129 68 145 62 150 50 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.94"/>
    <path class="akita-muzzle diego-muzzle" data-part="muzzle" data-silhouette="true" d="M135 53 C128 44 117 42 107 45 C98 44 88 48 84 57 C84 69 97 78 111 79 C126 77 140 68 135 53 Z" fill="var(--paper-light, #f8f1e5)"/>
    <g class="diego-eyes" data-part="eyes"><circle class="diego-eye diego-eye--left" data-detail="face" cx="93" cy="44" r="2" fill="var(--ink, #252521)"/><circle class="diego-eye diego-eye--right" data-detail="face" cx="130" cy="46" r="2.1" fill="var(--ink, #252521)"/></g>
    <g class="diego-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08" stroke="var(--ink, #252521)" stroke-width="2.6" stroke-linejoin="round"><path class="diego-lens diego-lens--right" data-part="lens-far" d="M83 36 L110 35 L109 53 L84 53 Z"/><path class="diego-lens diego-lens--left" data-part="lens-near" d="M117 36 L145 37 L143 56 L116 55 Z"/><path class="diego-glasses-bridge" d="M110 41 L116 42" fill="none"/><path class="diego-glasses-arm" d="M83 40 L62 38 M145 41 L156 39" fill="none"/><path class="diego-lens-glint" data-detail="micro" d="M105 38 L97 37 M140 40 L132 38" stroke="var(--paper-light, #f8f1e5)" stroke-width="1.2"/></g>
    <path class="diego-brow diego-brow--left" data-detail="face" d="M103 30 L87 32" stroke="var(--ink, #252521)" stroke-width="1.6"/><path class="diego-brow diego-brow--right" data-detail="face" d="M140 33 L123 31" stroke="var(--ink, #252521)" stroke-width="1.6"/><path class="diego-blush" data-detail="face" d="M147 60 L137 62 M77 57 L67 59" stroke="var(--dani-shadow, #9d7333)" stroke-width="2.2"/>
    <path class="diego-nose" data-part="nose" data-detail="face" d="M119 56 L105 56 L112 63 Z" fill="var(--ink, #252521)"/><path class="diego-mouth" data-detail="micro" d="M112 63 L112 68 M112 68 L120 71 M112 68 L104 71" stroke="var(--ink, #252521)" stroke-width="1.4" fill="none"/>
  </g>`;
}

function diegoProfile(facing: CharacterFacing): string {
  if (facing === "right") {
    return `
    <g class="diego-tail-group" data-part="tail"><path class="akita-tail diego-tail" data-silhouette="true" d="M60 119 C35 120 22 101 28 83 C33 68 48 66 57 75 C65 84 59 95 48 95 C39 95 35 86 40 79" fill="none" stroke="var(--diego-shadow, #316a68)" stroke-width="14" stroke-linecap="round"/></g>
    <g class="diego-body-group" data-part="body" data-angle-art="profile-right"><path class="akita-body diego-body" data-silhouette="true" d="M47 145 L47 104 C47 81 63 67 86 65 C109 63 128 76 134 97 L132 145 C108 151 70 151 47 145 Z" fill="var(--diego-turquoise, #4d918b)"/><path class="diego-neck" data-part="neck" data-silhouette="true" d="M78 58 C92 49 113 51 127 65 L128 96 C114 104 91 101 79 91 Z" fill="var(--diego-turquoise, #4d918b)"/><path class="akita-chest diego-chest" data-part="chest" data-detail="coat" d="M106 70 C120 80 122 112 116 145 L92 145 C99 119 97 90 106 70 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.92"/><path class="akita-leg diego-leg diego-leg--left" data-part="paw-front" data-silhouette="true" d="M112 109 L116 143" stroke="var(--diego-shadow, #316a68)" stroke-width="14" stroke-linecap="round"/><path class="diego-paw diego-paw--left" data-part="paw-front-tip" data-silhouette="true" d="M103 144 C112 138 128 138 138 144 C130 151 111 151 103 144 Z" fill="var(--paper-light, #f8f1e5)"/></g>
    <g class="diego-bow" data-part="bow"><path data-silhouette="true" d="M116 76 C106 70 101 76 105 85 L119 81 Z" fill="var(--night-deep, #172329)"/><path data-silhouette="true" d="M126 76 C136 71 141 77 137 86 L123 81 Z" fill="var(--night, #233039)"/><rect x="117" y="76" width="10" height="11" rx="3" fill="var(--ink, #252521)"/></g>
    <g class="akita-head diego-head" data-part="head"><path class="akita-ear diego-ear diego-ear--left" data-part="ear-far" data-silhouette="true" d="M89 35 L95 15 L111 32 Z" fill="var(--diego-shadow, #316a68)"/><path class="akita-ear diego-ear diego-ear--right" data-part="ear-near" data-silhouette="true" d="M119 31 L136 15 L141 38 Z" fill="var(--diego-shadow, #316a68)"/><path class="diego-face" data-part="face" data-silhouette="true" d="M79 50 C85 29 104 18 127 20 C147 22 157 35 157 51 C168 55 173 65 165 71 C158 76 147 73 140 70 C129 82 108 84 92 75 C82 69 76 59 79 50 Z" fill="var(--diego-turquoise, #4d918b)"/><path class="diego-mask" data-part="urajiro" data-detail="coat" d="M117 36 C133 34 148 43 149 57 C143 63 137 66 130 67 C122 57 120 46 117 36 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.94"/><path class="akita-muzzle diego-muzzle" data-part="muzzle" data-silhouette="true" d="M132 53 C146 49 163 55 168 63 C165 74 147 78 134 70 Z" fill="var(--paper-light, #f8f1e5)"/><g class="diego-eyes" data-part="eyes"><circle class="diego-eye diego-eye--left" data-detail="face" cx="135" cy="47" r="2.2" fill="var(--ink, #252521)"/></g><g class="diego-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08" stroke="var(--ink, #252521)" stroke-width="2.7"><path class="diego-lens diego-lens--left" data-part="lens-near" d="M119 37 L150 39 L149 57 L120 56 Z"/><path class="diego-glasses-arm" d="M120 41 L103 38 M150 43 L159 44" fill="none"/><path class="diego-lens-glint" data-detail="micro" d="M125 40 L134 39" stroke="var(--paper-light, #f8f1e5)"/></g><path class="diego-brow diego-brow--left" data-detail="face" d="M126 33 L143 35" stroke="var(--ink, #252521)" stroke-width="1.6"/><path class="diego-blush" data-detail="face" d="M146 61 L157 63" stroke="var(--dani-shadow, #9d7333)" stroke-width="2.2"/><path class="diego-nose" data-part="nose" data-detail="face" d="M159 58 L169 62 L161 67 Z" fill="var(--ink, #252521)"/><path class="diego-mouth" data-detail="micro" d="M160 67 Q155 71 150 70" stroke="var(--ink, #252521)" stroke-width="1.4" fill="none"/></g>`;
  }

  return `
  <g class="diego-tail-group" data-part="tail"><path class="akita-tail diego-tail" data-silhouette="true" d="M120 119 C145 120 158 101 152 83 C147 68 132 66 123 75 C115 84 121 95 132 95 C141 95 145 86 140 79" fill="none" stroke="var(--diego-shadow, #316a68)" stroke-width="14" stroke-linecap="round"/></g>
  <g class="diego-body-group" data-part="body" data-angle-art="profile-left"><path class="akita-body diego-body" data-silhouette="true" d="M133 145 L133 104 C133 81 117 67 94 65 C71 63 52 76 46 97 L48 145 C72 151 110 151 133 145 Z" fill="var(--diego-turquoise, #4d918b)"/><path class="diego-neck" data-part="neck" data-silhouette="true" d="M102 58 C88 49 67 51 53 65 L52 96 C66 104 89 101 101 91 Z" fill="var(--diego-turquoise, #4d918b)"/><path class="akita-chest diego-chest" data-part="chest" data-detail="coat" d="M74 70 C60 80 58 112 64 145 L88 145 C81 119 83 90 74 70 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.92"/><path class="akita-leg diego-leg diego-leg--left" data-part="paw-front" data-silhouette="true" d="M68 109 L64 143" stroke="var(--diego-shadow, #316a68)" stroke-width="14" stroke-linecap="round"/><path class="diego-paw diego-paw--left" data-part="paw-front-tip" data-silhouette="true" d="M77 144 C68 138 52 138 42 144 C50 151 69 151 77 144 Z" fill="var(--paper-light, #f8f1e5)"/></g>
  <g class="diego-bow" data-part="bow"><path data-silhouette="true" d="M64 76 C74 70 79 76 75 85 L61 81 Z" fill="var(--night-deep, #172329)"/><path data-silhouette="true" d="M54 76 C44 71 39 77 43 86 L57 81 Z" fill="var(--night, #233039)"/><rect x="53" y="76" width="10" height="11" rx="3" fill="var(--ink, #252521)"/></g>
  <g class="akita-head diego-head" data-part="head"><path class="akita-ear diego-ear diego-ear--left" data-part="ear-near" data-silhouette="true" d="M61 31 L44 15 L39 38 Z" fill="var(--diego-shadow, #316a68)"/><path class="akita-ear diego-ear diego-ear--right" data-part="ear-far" data-silhouette="true" d="M91 35 L85 15 L69 32 Z" fill="var(--diego-shadow, #316a68)"/><path class="diego-face" data-part="face" data-silhouette="true" d="M101 50 C95 29 76 18 53 20 C33 22 23 35 23 51 C12 55 7 65 15 71 C22 76 33 73 40 70 C51 82 72 84 88 75 C98 69 104 59 101 50 Z" fill="var(--diego-turquoise, #4d918b)"/><path class="diego-mask" data-part="urajiro" data-detail="coat" d="M63 36 C47 34 32 43 31 57 C37 63 43 66 50 67 C58 57 60 46 63 36 Z" fill="var(--paper-light, #f8f1e5)" opacity="0.94"/><path class="akita-muzzle diego-muzzle" data-part="muzzle" data-silhouette="true" d="M48 53 C34 49 17 55 12 63 C15 74 33 78 46 70 Z" fill="var(--paper-light, #f8f1e5)"/><g class="diego-eyes" data-part="eyes"><circle class="diego-eye diego-eye--left" data-detail="face" cx="45" cy="47" r="2.2" fill="var(--ink, #252521)"/></g><g class="diego-glasses" data-part="glasses" data-detail="face" fill="var(--paper-light, #f8f1e5)" fill-opacity="0.08" stroke="var(--ink, #252521)" stroke-width="2.7"><path class="diego-lens diego-lens--left" data-part="lens-near" d="M61 37 L30 39 L31 57 L60 56 Z"/><path class="diego-glasses-arm" d="M60 41 L77 38 M30 43 L21 44" fill="none"/><path class="diego-lens-glint" data-detail="micro" d="M55 40 L46 39" stroke="var(--paper-light, #f8f1e5)"/></g><path class="diego-brow diego-brow--left" data-detail="face" d="M54 33 L37 35" stroke="var(--ink, #252521)" stroke-width="1.6"/><path class="diego-blush" data-detail="face" d="M34 61 L23 63" stroke="var(--dani-shadow, #9d7333)" stroke-width="2.2"/><path class="diego-nose" data-part="nose" data-detail="face" d="M21 58 L11 62 L19 67 Z" fill="var(--ink, #252521)"/><path class="diego-mouth" data-detail="micro" d="M20 67 Q25 71 30 70" stroke="var(--ink, #252521)" stroke-width="1.4" fill="none"/></g>`;
}

function diegoBack(facing: CharacterFacing): string {
  const tailPath =
    facing === "right"
      ? "M56 119 C31 120 19 100 26 82 C31 68 45 66 54 75 C62 84 56 94 45 94 C35 94 31 84 37 78"
      : "M124 119 C149 120 161 100 154 82 C149 68 135 66 126 75 C118 84 124 94 135 94 C145 94 149 84 143 78";

  return `
  <g class="diego-tail-group" data-part="tail"><path class="akita-tail diego-tail" data-silhouette="true" d="${tailPath}" fill="none" stroke="var(--diego-shadow, #316a68)" stroke-width="14" stroke-linecap="round"/></g>
  <g class="diego-body-group" data-part="body" data-angle-art="back"><path class="akita-body diego-body" data-silhouette="true" d="M42 145 L43 103 C43 78 62 64 90 64 C118 64 137 78 138 103 L138 145 C112 151 68 151 42 145 Z" fill="var(--diego-turquoise, #4d918b)"/><path class="diego-back-plane" data-detail="coat" d="M90 65 C113 67 127 83 128 108 L127 145 L90 149 Z" fill="var(--diego-shadow, #316a68)" opacity="0.28"/><path class="akita-leg diego-leg diego-leg--left" data-part="paw-front" data-silhouette="true" d="M49 108 L50 143" stroke="var(--diego-shadow, #316a68)" stroke-width="15" stroke-linecap="round"/><path class="akita-leg diego-leg diego-leg--right" data-part="paw-far" data-silhouette="true" d="M131 108 L130 143" stroke="var(--diego-shadow, #316a68)" stroke-width="15" stroke-linecap="round"/><path class="diego-paw diego-paw--left" data-part="paw-front-tip" data-silhouette="true" d="M40 144 C49 138 65 138 75 144 C67 151 48 151 40 144 Z" fill="var(--paper-light, #f8f1e5)"/><path class="diego-paw diego-paw--right" data-part="paw-far-tip" data-silhouette="true" d="M105 144 C115 138 131 138 140 144 C132 151 113 151 105 144 Z" fill="var(--paper-light, #f8f1e5)"/></g>
  <g class="diego-bow diego-bow--back" data-part="bow"><path data-silhouette="true" d="M78 78 C68 72 63 77 67 86 L86 82 Z" fill="var(--night-deep, #172329)"/><path data-silhouette="true" d="M102 78 C112 72 117 77 113 86 L94 82 Z" fill="var(--night, #233039)"/><rect x="85" y="77" width="10" height="11" rx="3" fill="var(--ink, #252521)"/></g>
  <g class="akita-head diego-head" data-part="head"><path class="akita-ear diego-ear diego-ear--left" data-part="ear-near" data-silhouette="true" d="M50 36 L57 14 L74 32 Z" fill="var(--diego-shadow, #316a68)"/><path class="akita-ear diego-ear diego-ear--right" data-part="ear-far" data-silhouette="true" d="M106 32 L123 14 L130 36 Z" fill="var(--diego-shadow, #316a68)"/><path class="diego-face diego-head-back" data-part="head-back" data-silhouette="true" d="M38 51 C41 29 61 16 90 15 C119 16 139 29 142 51 L136 67 C124 78 108 82 90 82 C70 82 53 78 43 67 Z" fill="var(--diego-turquoise, #4d918b)"/><path class="diego-back-mark" data-detail="coat" d="M69 20 C77 29 83 40 90 55 C97 40 103 29 111 20 C102 17 82 17 69 20 Z" fill="var(--diego-shadow, #316a68)" opacity="0.52"/></g>`;
}

function diegoGeometry(angle: CharacterAngle, facing: CharacterFacing): string {
  switch (angle) {
    case "front":
      return diegoFront(facing);
    case "three-quarter-left":
      return diegoThreeQuarterLeft();
    case "three-quarter-right":
      return diegoThreeQuarterRight();
    case "profile":
      return diegoProfile(facing);
    case "back":
      return diegoBack(facing);
  }
}

export function renderDiegoArt(extraClass?: string): string;
export function renderDiegoArt(options?: DiegoArtOptions): string;
export function renderDiegoArt(input: string | DiegoArtOptions = ""): string {
  const options: DiegoArtOptions = typeof input === "string" ? { className: input } : input;
  const angle = options.angle ?? "three-quarter-left";
  const facing = options.facing ?? "left";
  const interactive = options.interactive ?? false;
  const style = characterSizeStyle(options.size);
  const classes = joinCharacterClasses(
    "fig fig-akita fig-diego character",
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
<svg class="${escapeCharacterAttribute(classes)}" viewBox="${DIEGO_VIEW_BOX}"
  role="${interactive ? "button" : "img"}"${interactive ? ' tabindex="0"' : ""}
  data-character="diego" data-baseline="${DIEGO_BASELINE}"
  data-angle="${angle}" data-facing="${facing}"${options.state ? ` data-state="${escapeCharacterAttribute(options.state)}"` : ""}
  data-reduced-motion="${options.reducedMotion ? "true" : "false"}" data-interactive="${interactive ? "true" : "false"}"
  ${style ? `style="${style}"` : ""}
  aria-label="Diego, akita alto turquesa con urajiro crema, lentes rectangulares y lazo"
  xmlns="http://www.w3.org/2000/svg">
  <ellipse class="fig-shadow diego-ground-shadow" data-part="ground-shadow"
    cx="90" cy="149" rx="59" ry="6" fill="var(--shadow, rgba(30, 35, 33, 0.16))"/>
  ${diegoGeometry(angle, facing)}
</svg>`;
}
