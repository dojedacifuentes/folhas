# Dirección de arte — Herbario de lo que cuidamos

## Metáfora

Cuidar no es conservar algo intacto. Es hacerle lugar, acercar lo que uno tiene,
encontrar la luz y volver. Cada escena es uno de esos gestos; la obra completa
es un pequeño libro de artista digital, no una landing ni un juego.

## Sistema simbólico

| Símbolo | Significado |
| --- | --- |
| Dani (gatita amarilla) | Danielle: intuición, curiosidad, calidez, humor, independencia. Anteojos redondos, cola en forma de signo de interrogación, una oreja inclinada. |
| Diego (akita turquesa) | Diego: constancia, estructura, protección, seriedad levemente absurda. Anteojos rectangulares, cejas serias, cola enroscada de spitz. |
| Planta | El vínculo: lo que se crea entre dos y no pertenece del todo a ninguno. Termina con una hoja amarilla, una turquesa y una verde nueva en el centro. |
| Semilla cuadrada | Una forma poco convencional de empezar. Un cubo turquesa tratado como semilla perfectamente normal. |
| Hojas secas | Ruido, estaciones anteriores, capas. Se apartan con cuidado, no se destruyen. |
| Sombras | Huella y presencia indirecta. No amenazan: acompañan y protegen sin ocupar el centro. |

La hoja verde central no es una mezcla cromática: es una forma distinta
(más vertical, con nervio visible) porque la conexión produce algo
distinto de sus partes.

## Paleta (v2)

Definida en `src/styles/tokens.css`:

- papel `#f2e9d6` / papel claro `#fbf4e4`
- tinta `#2b261e` / noche `#1d2b35` / noche suave `#2a3d49`
- amarillo ocre `#d9a53f` / amarillo suave `#eac878`
- turquesa `#47867f` / turquesa oscuro `#2f665f`
- salvia `#7f8d74` / hoja seca `#a26e4c` / hoja oscura `#6a4c39`
- verde nuevo `#7a9a62`
- arcilla (acento pequeño: narices, orejas internas) `#c17250`
- sombras entintadas de verde `rgba(39,55,52,.18)` y `rgba(22,37,39,.4)`

Las sombras llevan tinte verde en lugar de gris neutro: atmósfera,
no adorno. Los anteojos de tinta unen a los dos personajes; la arcilla
aparece solo en detalles diminutos compartidos.

## Tipografía

Sin fuentes externas. Serif local (Iowan Old Style → Palatino → Georgia)
para títulos, frases, numeración y textos contemplativos. Sans local
(Avenir Next → Segoe UI → system-ui) para instrucciones, controles y
textos técnicos.

## Reglas de ilustración

- Curvas imperfectas, formas sencillas, bordes ligeramente irregulares.
- Máximo tres tonos principales por objeto.
- Sombras separadas de la figura (elipse propia bajo cada personaje).
- Expresividad mediante postura y proporción, no mediante detalle facial.
- Nada de clipart, emoji, ojos brillantes, degradados plásticos, 3D ni
  estética infantil.

Todos los SVG viven en `src/art/svgLibrary.ts` (fuente única) y se exportan
a `public/art/` con `node scripts/export-art.mjs`.

## Composición

- Mucho espacio negativo y asimetría equilibrada.
- Elementos que salen parcialmente del encuadre (sombras botánicas).
- Una acción principal por escena; instrucción de máximo seis palabras.
- Móvil: vertical y táctil. Escritorio: columna de texto lateral y
  escenario amplio, sin estirar la versión móvil.

## Textura

Papel casi imperceptible: `feTurbulence` en data-URI a 3.5 % de opacidad
sobre toda la pantalla, sin filtros pesados.

## Movimiento

- Microinteracciones 120–300 ms; objetos 250–500 ms; transición narrativa
  600–900 ms; ambiente 6–18 s.
- Las transiciones son cambios de página o de luz: desplazamiento suave,
  sombras que cruzan, opacidad. Nunca zoom dramático ni rebotes.
- `prefers-reduced-motion`: se elimina la deriva ambiental y los
  desplazamientos se sustituyen por opacidad. Todo sigue siendo funcional.

## Humor: pequeños accidentes de cuidado

Dos accidentes reversibles, legibles y tiernos refuerzan el tema
(cuidar es dosificar), nunca castigan:

- **Agua de más** (escena II): tras colocar el dedal, este descansa junto
  a la maceta y puede verterse otra vez. Al tercer vertido extra la
  planta hace *glub* (charco, bamboleo), Diego abre un paraguas diminuto
  («protocolo paraguas.») y el gesto del agua se reinicia con calma.
- **Sol de más** (escena III): si la luz se queda demasiado cerca de la
  planta, primero sale humo (aviso amable), luego un *puf.* la deja
  chamuscada un momento y la luz vuelve a su punto de partida.

Reglas: el aviso llega antes que la consecuencia, la causa siempre es
visible, el reinicio es local (solo el gesto implicado) y el comentario
sustituye a la instrucción — nunca conviven dos textos de guía.

## Progresión

Ninguna etapa puede saltarse: cada escena desbloquea solo la siguiente
(validado también al reanudar desde localStorage). Solo se muestra la
instrucción de la sala actual; las alternativas accesibles aparecen a
los 12 segundos, como ayuda paciente y no como atajo.

## Elementos prohibidos

Glassmorphism, tarjetas repetidas, gradientes SaaS, corazones flotantes,
confeti, partículas permanentes, barras de progreso, puntuaciones,
insignias, cronómetros, tutoriales modales, carruseles, navegación
superior, loaders, fotografías, assets remotos.
