# Dirección de arte — Herbario de lo que cuidamos

## Metáfora

Cuidar no es conservar algo intacto. Es hacerle lugar, acercar lo que uno tiene,
encontrar la luz y volver. Cada escena es uno de esos gestos; la obra completa
es un pequeño libro de artista digital, no una landing ni un juego.

## Sistema simbólico

| Símbolo | Significado |
| --- | --- |
| Dani, gata amarilla con lentes | Intuición, curiosidad, calidez y observación. Cola caligráfica en forma de interrogación, orejas asimétricas y lentes irregulares. |
| Diego, akita turquesa con lentes | Constancia, estructura y protección seria de manera levemente absurda. Geometría sólida, orejas triangulares y lentes rectangulares bajos. |
| Planta | El vínculo: lo que se crea entre dos y no pertenece del todo a ninguno. Termina con una hoja amarilla, una turquesa y una verde nueva en el centro. |
| Semilla cuadrada | Una forma poco convencional de empezar. Un cubo turquesa tratado como semilla perfectamente normal. |
| Hojas secas | Ruido, estaciones anteriores, capas. Se apartan con cuidado, no se destruyen. |
| Sombras | Huella y presencia indirecta. No amenazan: acompañan y protegen sin ocupar el centro. |

La hoja verde central no es una mezcla cromática: es una forma distinta
(más vertical, con nervio visible) porque la conexión produce algo
distinto de sus partes.

## Paleta

Definida en `src/styles/tokens.css`:

- papel `#eee4d3` / papel claro `#f8f1e5` / sombra `#d9cbb8`
- tinta `#252521` / tinta suave `#44433d`
- noche `#233039` / noche profunda `#172329`
- Dani `#d3a83c` / luz `#e6c96e` / sombra `#9d7333`
- Diego `#4d918b` / luz `#79aaa4` / sombra `#316a68`
- salvia `#77866e` / hoja seca `#9a694d` / verde nuevo `#6f8f59`
- lluvia `#708a99` / sol `#e4b957` / quemado `#3a342f`

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

## Elementos prohibidos

Glassmorphism, tarjetas repetidas, gradientes SaaS, corazones flotantes,
confeti, partículas permanentes, barras de progreso, puntuaciones,
insignias, cronómetros, tutoriales modales, carruseles, navegación
superior, loaders, fotografías, assets remotos.
