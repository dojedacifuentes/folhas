/**
 * Toda la microcopy de la experiencia vive aquí.
 * Una escena puede cambiar de momento, pero solo expone una instrucción a la vez.
 */
export const content = {
  cover: {
    title: "Herbario de lo que cuidamos",
    subtitle: "Una historia pequeña sobre cuidar en compañía",
    instruction: "toca la hoja",
    whisper: "había algo respirando aquí",
    leafLabel: "Hoja seca que cubre el herbario. Tócala para abrir.",
  },

  clearSpace: {
    number: "I",
    heading: "Hacer lugar",
    lede: "A veces cuidar empieza por despejar un poco.",
    instruction: "toca las hojas",
    revealLabel:
      "Montoncito de hojas secas. Tócalo para apartarlo y descubrir quién espera debajo.",
    catSays: "yo traje agua.",
    akitaSays: "yo traje una semilla cuadrada.",
    editorial: "La botánica decidió no hacer preguntas.",
    next: "seguir",
    revealedAnnouncement:
      "Las hojas se apartaron. Dani, Diego y una maceta dormida estaban debajo.",
  },

  offerings: {
    number: "II",
    heading: "Traer lo que tenemos",
    lede: "Dani observa. Diego ya hizo un plan diminuto.",
    waterInstruction: "deja una gota",
    seedInstruction: "acomoda la semilla",
    waterLabel: "Dedal de Dani. Tócalo para dejar una gota en la tierra.",
    seedLabel:
      "Semilla cuadrada de Diego. Tócala para que encuentre su lugar en la maceta.",
    catThought: "una gota. exactamente una.",
    akitaThought: "procedimiento: semilla, centro, dignidad.",
    afterMain: "Algo despierta cuando cada uno acerca lo suyo.",
    afterNotes: [
      "Dani mira el brote de cerca.",
      "Diego confirma que la semilla sigue razonablemente cuadrada.",
    ],
    next: "cuidarlo",
    waterAnnouncement:
      "Una gota oscureció la tierra. Dani movió la cola, satisfecha.",
    seedAnnouncement:
      "La semilla hizo un giro pequeño y encajó en la tierra.",
    sproutAnnouncement:
      "El brote despertó. Diego asintió con una seriedad innecesaria.",
  },

  care: {
    number: "III",
    heading: "Encontrar la medida",
    lede: "Cuidar también es saber cuándo basta.",
    water: {
      instruction: "deja dos gotas",
      controlLabel:
        "Dedal con agua. Tócalo dos veces para dejar exactamente dos gotas.",
      firstDrop: "una gota",
      hint: "falta una",
      failure: "ups: ya era una laguna",
      retry: "volvemos con más cariño",
      announcement:
        "Dos gotas humedecieron la tierra y una hoja amarilla se desperezó.",
    },
    wind: {
      instruction: "da un soplo corto",
      controlLabel:
        "Soplo suave. Actívalo una vez para apartar las hojas secas.",
      hint: "uno basta",
      failure: "eso fue viento con currículum",
      retry: "Diego recuperó sus lentes. Otra vez, suave.",
      announcement:
        "Un soplo acomodó el tallo y apareció una hoja turquesa.",
    },
    sun: {
      instruction: "mantén el sol un instante",
      controlLabel:
        "Sol tibio. Mantén pulsado un instante y suelta antes de calentarlo demasiado.",
      hint: "un poquito más",
      failure: "salió humo. el concepto de «instante» era importante",
      retry: "la maceta respiró. probemos con una luz más corta",
      announcement:
        "La luz fue suficiente. La planta creció y conservó todas sus hojas.",
    },
    complete: "La planta creció sin que nadie tuviera que salvarla del entusiasmo.",
    next: "ver lo que creció",
  },

  final: {
    number: "IV",
    heading: "Quedarse",
    lines: [
      "No sé si las plantas entienden de promesas.",
      "Esta aprendió nuestros gestos: hacer lugar, aportar distinto y encontrar la medida.",
    ],
    dedication: [
      "Para Dani.",
      "Quiero seguir aprendiendo contigo las formas pequeñas de cuidar.",
    ],
    portuguese: "a gente cuida do que quer ver crescer.",
    signature: "D + D",
    catThought: "la sombra quedó bonita.",
    akitaThought: "turno de guardia voluntariamente serio.",
    plantLabel:
      "La planta florecida conserva hojas ocres, turquesas y verdes. Tócala si quieres.",
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
