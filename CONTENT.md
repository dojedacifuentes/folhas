# Contenido

La microcopy canónica vive en `src/app/content.ts`. Las escenas no mantienen copias propias. `SceneVisualState.instruction` recibe el texto del momento actual y lo oculta al resolverlo.

## Flujo de cinco escenas

| Escena | Rótulo | Título | Instrucción activa |
| --- | --- | --- | --- |
| `cover` | — | Herbario de lo que cuidamos | toca la hoja |
| `clear-space` | I | Hacer lugar | toca las hojas |
| `offerings` | II | Traer lo que tenemos | deja una gota → acomoda la semilla |
| `care` | III | Encontrar la medida | deja dos gotas → da un soplo corto → mantén el sol un instante |
| `final` | IV | Quedarse | Sin instrucción obligatoria |

Cada escena muestra una sola instrucción a la vez. El avance ocurre mediante acciones claras y ordenadas; una reacción visual, un anuncio breve y, si está habilitado, sonido opcional confirman el resultado antes de presentar el momento siguiente.

## Momentos y respuestas

### Hacer lugar

- Apertura: «A veces cuidar empieza por despejar un poco.»
- Dani: «yo traje agua.»
- Diego: «yo traje una semilla cuadrada.»
- Nota editorial: «La botánica decidió no hacer preguntas.»

### Traer lo que tenemos

- Agua: un toque deja una gota.
- Semilla: después se habilita un toque para acomodarla en la maceta.
- Cierre: «Algo despierta cuando cada uno acerca lo suyo.»

La instrucción de la semilla y su control no se presentan como acción disponible antes de completar el agua.

### Encontrar la medida

- Agua: dos toques exactos. Tras el primero aparece «falta una».
- Viento: un toque breve. La respuesta recuerda que «uno basta».
- Sol: mantener y soltar entre 480 y 1800 ms. Si falta tiempo, aparece «un poquito más».
- Cierre: «La planta creció sin que nadie tuviera que salvarla del entusiasmo.»

Los excesos se narran con humor y repiten solo el momento actual:

| Momento | Reacción | Reintento |
| --- | --- | --- |
| Agua | «ups: ya era una laguna» | «volvemos con más cariño» |
| Viento | «eso fue viento con currículum» | «Diego recuperó sus lentes. Otra vez, suave.» |
| Sol | “salió humo. el concepto de «instante» era importante” | «la maceta respiró. probemos con una luz más corta» |

La interfaz no expone los nombres técnicos `drowned`, `windBent`, `overheated` o `burnt`; estos pertenecen al estado visual, no a la voz de la obra.

### Quedarse

Texto principal:

> No sé si las plantas entienden de promesas.
>
> Esta aprendió nuestros gestos: hacer lugar, aportar distinto y encontrar la medida.

Dedicatoria:

> Para Dani.
>
> Quiero seguir aprendiendo contigo las formas pequeñas de cuidar.

Remate: «a gente cuida do que quer ver crescer.»

## Voz

- Minúsculas y frases cortas para instrucciones y diálogos.
- Ternura con humor seco, sin infantilizar.
- Dani observa, prueba y reacciona; Diego organiza, protege y trata tareas diminutas con solemnidad.
- La interfaz nunca culpa: describe, reacciona y ofrece un nuevo intento.
- Los nombres se usan en diálogos puntuales, anuncios accesibles y documentación; no como etiquetas constantes.
- Ningún texto exige sonido, color o movimiento para comprender la acción.
