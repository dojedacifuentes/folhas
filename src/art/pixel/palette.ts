/**
 * Paleta compartida del pixel art. Se apoya en los tokens del proyecto para
 * conservar una sola fuente de color, con algunos matices propios para dar
 * volumen (luces y sombras de cada masa).
 */
export const PIX = {
  ink: "#2a2620",
  inkSoft: "#4a4335",

  // Dani (gata amarilla)
  yel: "var(--dani-yellow)",
  yelL: "var(--dani-light)",
  yelD: "var(--dani-shadow)",
  cream: "#f6e6bd",

  // Diego (akita turquesa)
  tur: "var(--diego-turquoise)",
  turL: "var(--diego-light)",
  turD: "var(--diego-shadow)",
  turCream: "#e7e2c4",

  // acentos comunes
  clay: "var(--terracotta-light)",
  clayD: "var(--terracotta)",
  nose: "#e28a5f",
  cheek: "#f2986f",
  lens: "#ecf6f4",
  white: "#fdf6e6",

  // acentos vivos (emoticones, chispas, cielo/frío)
  coral: "var(--coral)",
  berry: "var(--berry)",
  plum: "var(--plum)",
  sky: "var(--sky)",
  skyDeep: "var(--sky-deep)",
  mint: "var(--mint)",
  snow: "var(--snow)",

  // hojas secas / follaje seco
  sage: "var(--sage)",
  leafDry: "var(--leaf-dry)",
  leafDark: "var(--leaf-dark)",

  // planta / mundo
  pot: "var(--terracotta)",
  potD: "#7f4a24",
  soil: "#5a3f2c",
  soilWet: "#41301f",
  stem: "var(--green-new)",
  leafY: "var(--dani-yellow)",
  leafT: "var(--diego-turquoise)",
  leafG: "#7fbb43",
  leafGD: "#5a8a2f",
  bloom: "#ffd451",
  bloomC: "var(--coral)",
  burnt: "#332e28",
  smoke: "#f2ecdc",

  // sol
  sun: "var(--sun)",
  sunL: "#f6dd93",
  sunD: "#cf9a34",
  sunRay: "#eec964",

  // agua / sombra
  water: "var(--rain)",
  waterL: "#a6e0ea",
  shadow: "rgba(35,45,42,0.34)",
  shadowD: "rgba(24,34,32,0.5)",
} satisfies Record<string, string>;
