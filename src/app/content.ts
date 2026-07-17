/**
 * Toda la microcopy de la experiencia vive aquí.
 * Una escena puede cambiar de momento, pero solo expone una instrucción a la vez.
 *
 * Voces: Dani piensa y habla en portugués; Diego, en español.
 * Las instrucciones y la voz editorial permanecen en español.
 */
export const content = {
  cover: {
    title: "Herbario de lo que cuidamos",
    subtitle: "Una historia pequeña sobre cuidar en compañía",
    annotation: "ficha n.º 1 — recolectada con cuidado",
    instruction: "aparta la hoja",
    whisper: "tinha algo respirando aqui",
    leafLabel:
      "Hoja del herbario. Arrástrala hacia un lado, o pulsa Enter, para abrir.",
  },

  clearSpace: {
    number: "I",
    heading: "Hacer lugar",
    lede: "A veces cuidar empieza por despejar un poco.",
    instruction: "aparta las hojas",
    revealLabel:
      "Capa de hojas secas. Frótala con el dedo o el ratón para despejarla, o pulsa Enter.",
    altReveal: "dejar pasar la luz",
    catSays: "eu trouxe água.",
    akitaSays: "yo traje una semilla cuadrada.",
    editorial: "La botánica decidió no hacer preguntas.",
    next: "seguir",
    revealedAnnouncement:
      "Las hojas se apartaron. Dani, Diego y una maceta dormida estaban debajo.",
  },

  offerings: {
    number: "II",
    heading: "Traer lo que tenemos",
    lede: "Diego trae un plan diminuto. Dani trae el clima.",
    seedInstruction: "acerca la semilla a la maceta",
    waterInstruction: "exprime la nube sobre la semilla",
    waterLabel:
      "Nube de Dani. Pulsa para exprimirla sobre la maceta (tres veces), o pulsa Enter.",
    seedLabel:
      "Semilla cuadrada de Diego. Arrástrala hasta la maceta, o pulsa Enter para colocarla.",
    catThought: "chuva pequena. só o suficiente.",
    akitaThought: "procedimiento: semilla, centro, dignidad.",
    afterMain: "Algo despierta cuando cada uno acerca lo suyo.",
    afterNotes: [
      "Dani mira el brote de cerca.",
      "Diego confirma que la semilla sigue razonablemente cuadrada.",
    ],
    next: "cuidarlo",
    seedAnnouncement:
      "La semilla hizo un giro pequeño y encajó en la tierra.",
    waterAnnouncement:
      "La nube llovió sobre la semilla. Dani movió la cola, satisfecha.",
    sproutAnnouncement:
      "El brote despertó. Diego asintió con una seriedad innecesaria.",
  },

  care: {
    number: "III",
    heading: "Encontrar la medida",
    lede: "Cuidar también es saber cuándo basta.",
    escape: {
      instruction: "¡la maceta huyó! atrápala",
      controlLabel:
        "La maceta, huyendo con la semilla. Tócala tres veces para atraparla, o pulsa Enter.",
      lines: [
        "no estaba listo para esta responsabilidad.",
        "yo vine a contener raíces, no crisis.",
        "esto parecía más fácil en teoría.",
        "¡solicito tierra emocionalmente estable!",
      ],
      caughtLines: ["está bien.", "ya. procedamos.", "…gracias por insistir."],
      announcement:
        "La maceta intentó huir tres veces. Al final aceptó quedarse.",
    },
    water: {
      instruction: "deja dos gotas",
      controlLabel:
        "Nube con llovizna. Tócala dos veces para dejar exactamente dos gotas.",
      firstDrop: "una gota",
      hint: "falta una",
      failure: "ups: ya era una laguna",
      retry: "volvemos con más cariño",
      announcement:
        "Dos gotas humedecieron la tierra y una hoja amarilla se desperezó.",
    },
    wind: {
      instruction: "desliza un soplo corto",
      controlLabel:
        "Soplo suave. Desliza el dedo por el aire una vez, o toca el control, para apartar las hojas secas.",
      hint: "uno basta",
      failure: "eso fue viento con currículum",
      retry: "Diego recuperó sus lentes. Otra vez, suave.",
      announcement:
        "Un soplo acomodó el tallo y apareció una hoja turquesa.",
    },
    sun: {
      instruction: "lleva el sol junto a la planta",
      controlLabel:
        "Sol tibio. Arrástralo cerca de la planta y déjalo un instante; demasiado cerca, la calienta. También puedes mantenerlo pulsado.",
      hint: "un poquito más",
      smokeWarn: "huele a verano excesivo…",
      failure: "salió humo. el concepto de «instante» era importante",
      retry: "la maceta respiró. probemos con una luz más corta",
      announcement:
        "La luz fue suficiente. La planta creció y conservó todas sus hojas.",
    },
    catAside: "isso conta como arquitetura?",
    akitaAside: "sí.",
    complete: "La planta creció sin que nadie tuviera que salvarla del entusiasmo.",
    next: "ver lo que creció",
  },

  // Humor de entreacto: absurdo vegetal, ternura seca. Se rota al azar,
  // una frase principal por momento (nunca en bloque).
  quips: {
    pot: [
      "no estaba listo para esta responsabilidad.",
      "solicito tierra emocionalmente estable.",
      "yo vine a contener raíces, no crisis.",
      "esto parecía más fácil en teoría.",
    ],
    seed: [
      "aún estoy considerando brotar.",
      "necesito contexto antes de existir.",
      "no me presionen: soy potencial.",
    ],
    plant: [
      "hago fotosíntesis y lo mejor que puedo.",
      "crecí, pero a un costo.",
      "no fue magia: fue humedad y carácter.",
      "agradezco el agua. cuestiono el método.",
    ],
    world: [
      "este jardín opera sin garantías.",
      "todo brote implica riesgos administrativos.",
      "la naturaleza revisará su solicitud.",
    ],
  },

  final: {
    number: "IV",
    heading: "Quedarse",
    lines: [
      "No sé si las plantas entienden de promesas.",
      "Esta aprendió nuestros gestos: hacer lugar, aportar distinto y encontrar la medida.",
      "as estações passam; a gente volta.",
    ],
    dedication: [
      "Para Dani.",
      "Quiero seguir aprendiendo contigo las formas pequeñas de cuidar.",
    ],
    portuguese: "a gente cuida do que quer ver crescer.",
    signature: "D + D",
    catThought: "a sombra ficou bonita.",
    akitaThought: "turno de guardia voluntariamente serio.",
    plantLabel:
      "La planta florecida conserva hojas ocres, turquesas y verdes. Tócala si quieres.",
    cubeLabel: "La semilla cuadrada, medio enterrada. Tócala si quieres.",
    daniLabel: "Dani, dormitando. Tócala para arrullarla.",
    diegoLabel: "Diego, de guardia. Tócalo para el abrazo.",
    bloomAnnouncement: "La planta se abrió en un girasol. Y luego, en muchos.",
    nanai: "nanai…",
    abrazo: "juntos.",
    frio: "una mantita.",
    sunflowerLine: "Se abrió en un girasol. Y luego en muchos.",
  },

  chrome: {
    soundOn: "sonido activado",
    soundOff: "sonido desactivado",
    soundLabel: "Sonido",
    restart: "empezar de nuevo",
    restartLabel: "Empezar el herbario de nuevo desde la cubierta",
    restartConfirm: "¿de nuevo, seguro?",
    restartConfirmLabel:
      "Confirmar: tocar otra vez borra el progreso y vuelve a la cubierta",
  },

  speakers: {
    cat: "Dani",
    akita: "Diego",
  },
} as const;
