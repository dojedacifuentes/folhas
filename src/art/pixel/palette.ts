/**
 * Paleta del pixel art, v7 profesional.
 *
 * Reglas de la rampa: cada material tiene 3–4 tonos con desplazamiento de
 * matiz (las luces giran hacia el cálido, las sombras hacia el frío/ciruela),
 * saturación contenida y un solo acento frío (turquesa/lluvia). El contorno
 * no es negro: es un ciruela-café que abraza sin endurecer.
 */
export const PIX = {
  // contorno y trazos suaves (ciruela cálido, no negro)
  ink: "#3b2a33",
  inkSoft: "#6b5560",

  // Dani (gata atigrada dorada)
  yelL: "#ffd985",
  yel: "#f5ae3d",
  yelD: "#d07f2a",
  yelDD: "#9c5a22",
  cream: "#ffefc9",
  stripe: "#c9832d",

  // Diego (akita turquesa)
  turL: "#7fd9c6",
  tur: "#2aa593",
  turD: "#177a6e",
  turDD: "#0e5a55",
  turCream: "#f2ecd3",

  // acentos de piel y utilería
  clay: "#ef8f46",
  clayD: "#c26a2e",
  nose: "#e88a68",
  cheek: "#f7a08c",
  blushL: "#ffbfae",
  lens: "#eef7f4",
  white: "#fdf6e6",

  // acentos vivos (emoticones, chispas, frío)
  coral: "#f47a54",
  berry: "#d95f8c",
  plum: "#6f5bad",
  mint: "#8fdcae",
  snow: "#f6fcfd",

  // hojas secas / follaje seco
  sage: "#93a05e",
  leafDry: "#b06a33",
  leafDark: "#6a4526",
  moss: "#5a7a34",
  olive: "#6f7c34",

  // maceta y tierra
  potL: "#f0a05a",
  pot: "#d3733a",
  potD: "#a34e26",
  potDD: "#7a3a1e",
  clayLight: "#f7c391",
  soil: "#6b4a30",
  soilWet: "#463020",
  soilSpeck: "#8a6a45",

  // planta
  stem: "#7fbb43",
  leafY: "#f5ae3d",
  leafT: "#2aa593",
  leafG: "#8fce53",
  leafGD: "#5d9a34",
  leafDD: "#3f6f24",
  bloom: "#ffd451",
  bloomC: "#f47a54",
  burnt: "#332e28",
  smoke: "#f2ecdc",

  // sol
  sun: "#ffc94f",
  sunL: "#ffe9a3",
  sunD: "#e8a02e",
  sunRay: "#ffdd7a",

  // nube y agua
  sky: "#dff2f8",
  skyDeep: "#aedeea",
  skyShadow: "#7fb8cd",
  water: "#58c2d8",
  waterL: "#b8ecf2",
  waterD: "#2e8fa8",
  shadow: "rgba(52, 42, 55, 0.32)",
  shadowD: "rgba(38, 30, 42, 0.48)",
} satisfies Record<string, string>;
