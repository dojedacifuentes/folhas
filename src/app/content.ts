/**
 * Toda la microcopy de la experiencia vive aquí.
 * No dispersar frases por componentes.
 */
export const content = {
  cover: {
    title: "Herbario de lo que cuidamos",
    subtitle: "Manual mínimo para una semilla cuadrada y dos criaturas",
    instruction: "aparta una hoja",
    whisper: "había algo respirando aquí",
    leafLabel: "Hoja seca. Arrástrala hacia un lado, o pulsa Enter, para abrir el herbario.",
  },

  clearSpace: {
    number: "I",
    heading: "Hacer lugar",
    lede: "A veces cuidar empieza por despejar un poco.",
    instruction: "aparta las hojas",
    canvasLabel:
      "Capa de hojas secas. Frota con el dedo o el ratón para despejarla, o usa la alternativa «dejar pasar la luz».",
    altReveal: "dejar pasar la luz",
    catSays: "yo traje agua.",
    akitaSays: "yo traje una semilla cuadrada.",
    editorial: "La botánica decidió no intervenir.",
    next: "seguir",
    revealedAnnouncement: "Las hojas se apartaron. Debajo esperaban dos criaturas y una planta dormida.",
  },

  offerings: {
    number: "II",
    heading: "Traer lo que tenemos",
    lede: "No siempre traemos lo mismo. Por suerte.",
    instruction: "acércalos a la maceta",
    waterLabel:
      "Dedal de agua. Arrástralo hasta la maceta, o pulsa Enter para colocarlo.",
    seedLabel:
      "Semilla cuadrada. Arrástrala hasta la maceta, o pulsa Enter para colocarla.",
    catThought: "cantidad científicamente suficiente",
    akitaThought: "geometría aplicada",
    afterMain: "Algo puede empezar incluso cuando cada uno llega con una cosa distinta.",
    afterNotes: [
      "Dani mira el brote.",
      "Diego comprueba que el cubo siga cuadrado.",
      "El brote asume la coordinación general.",
    ],
    next: "seguir",
    waterAnnouncement: "El agua llegó a la tierra.",
    seedAnnouncement: "La semilla cuadrada giró un cuarto de vuelta y se quedó.",
    sproutAnnouncement: "Apareció un brote pequeño con una hoja verde nueva.",
  },

  care: {
    number: "III",
    heading: "Encontrar la medida",
    lede: "Cuidar también es no exagerar.",
    rain: {
      instruction: "deja pasar un poco de lluvia",
      controlLabel:
        "Paraguas. Muévelo para dejar pasar una cantidad moderada de lluvia.",
      alternative: "medir la lluvia",
      hint: "un poquito",
      failure: "eso ya era un océano",
      announcement: "La tierra quedó húmeda y apareció una hoja nueva.",
    },
    wind: {
      instruction: "sopla con cuidado",
      controlLabel:
        "Corriente de aire. Mantén pulsado y suelta cuando el viento sea suficiente.",
      alternative: "dar aire justo",
      hint: "suavecito",
      failure: "eso fue meteorología hostil",
      announcement: "Las hojas se apartaron y el tallo recuperó el equilibrio.",
    },
    sun: {
      instruction: "acerca el sol",
      controlLabel: "Sol. Regula su cercanía para calentar la planta sin quemarla.",
      alternative: "templar la luz",
      hint: "un poco de sol",
      failure: "el concepto de poco era importante",
      announcement: "La planta se orientó hacia una luz tibia.",
    },
    complete: "La planta aprendió tres maneras de respirar.",
    next: "encontrar la luz",
  },

  light: {
    number: "IV",
    heading: "Buscar la luz",
    lede: "La sombra también puede cuidar.",
    instruction: "mueve la luz",
    lampLabel:
      "Fuente de luz. Arrástrala, o muévela con las flechas del teclado, hasta que las sombras se encuentren.",
    altAlign: "encontrar la luz",
    afterMain:
      "Encontrarse no siempre es ocupar el mismo lugar. A veces es aprender dónde poner la luz.",
    catSays: "¿eso cuenta como arquitectura?",
    akitaSays: "sí.",
    next: "seguir",
    alignedAnnouncement:
      "La luz encontró su sitio. Las sombras se unieron como un pequeño techo y la planta completó sus tres hojas.",
  },

  final: {
    number: "V",
    heading: "Quedarse",
    lines: [
      "No sé si las plantas entienden de promesas.",
      "Esta aprendió nuestros gestos: hacer lugar, encontrar la medida, buscar la luz y quedarse.",
    ],
    dedication: ["Para Dani.", "Quiero seguir aprendiendo contigo las formas pequeñas de cuidar."],
    portuguese: "a gente cuida do que quer ver crescer.",
    signature: "D + D",
    catThought: "nanai para a plantinha.",
    akitaThought: "turno de guardia innecesariamente serio.",
    plantLabel: "La planta: una hoja amarilla, una turquesa y una verde nueva. Tócala si quieres.",
    cubeLabel: "La semilla cuadrada, medio enterrada. Tócala si quieres.",
  },

  chrome: {
    soundOn: "sonido activado",
    soundOff: "sonido desactivado",
    soundLabel: "Sonido",
    restart: "empezar de nuevo",
    restartLabel: "Empezar el herbario de nuevo desde la cubierta",
  },

  speakers: {
    cat: "Dani",
    akita: "Diego",
  },
} as const;
