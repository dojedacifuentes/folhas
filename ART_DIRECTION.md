# Dirección de arte

## v7 — Teatro botánico sobre la mesa

Dos capas que se abrazan: **pixel art cálido y curado** (personajes y
objetos) dentro de un **objeto editorial físico** (papel, tinta, luz).

Paleta profesional (`src/art/pixel/palette.ts`): cada material tiene una
rampa de 3–4 tonos con desplazamiento de matiz — luces hacia el cálido,
sombras hacia el ciruela — y el contorno no es negro sino ciruela-café
(`#3b2a33`). Dani es atigrada dorada (rayas `stripe`, tufos de pelaje,
rubor, doble brillo en los ojos, almohadillas); Diego es akita turquesa
(urajiro crema en las cejas, cola con punta crema, tramado de pelaje).
La maceta tiene cuatro tonos de barro, motitas en la tierra y un
corazoncito estampado casi escondido; la nube es casi blanca con sombra
azul-lluvia, pestañitas y lágrimas de lluvia con brillo; el sol lleva doce
rayos alternos y mofletes.

Atmósfera (`src/styles/atmosphere.css` + `src/app/atmosphere.ts`): grano
de impresión sobre todo el objeto, un rayo de luz que cruza la mesa en 38 s,
polvo flotando en los márgenes, páginas-diorama con esquinas levemente
desiguales y sombra en capas, inclinación máxima de ±0.55° siguiendo el
cursor (lerp, se apaga con `prefers-reduced-motion`), sombras de anclaje
bajo cada personaje (frías de noche) y ramas de fondo que se mecen en
ciclos de 26/34 s.

## Estilo visual: pixel art local (v3)

Todo el arte de personajes, planta, sol y objetos es **pixel art dibujado en
Canvas**, sin imágenes externas. Se construye por primitivas (elipses de
cuerpo/cabeza con sombreado de tres tonos, orejas triangulares, cola curva,
lentes como anillos, bigotes) sobre una rejilla, con contorno automático, y se
amplía por CSS con `image-rendering: pixelated` para bordes nítidos a cualquier
escala. La animación es por fotogramas (respiración, parpadeo, rayos del sol) y
se autolimpia cuando el sprite sale del DOM o la pestaña se oculta.

Motor y sprites en `src/art/pixel/`:

- `engine.ts` — rejilla de colores, dibujo y bucle de animación con guardián de
  generación.
- `draw.ts` — constructor con primitivas (rect, línea, elipse, triángulo,
  curva cuadrática, contorno).
- `palette.ts` — paleta apoyada en los tokens del proyecto.
- `characters.ts` / `world.ts` / `objects.ts` — Dani, Diego, planta (11
  estados), sol, y objetos interactivos.
- `registry.ts` — resuelve familia+estado, hidrata los `canvas[data-pixel]` tras
  montar cada escena y repinta al cambiar de estado.

Los `render*()` de las escenas conservan su firma pero emiten un canvas
pixelado; `setSceneVisualState` repinta Dani/Diego/planta al cambiar el estado
narrativo. Página de ajuste visual (solo dev): `/pixel-preview.html`.

## Metáfora

Cuidar es hacer lugar, acercar lo que cada uno tiene, encontrar la medida y quedarse. La experiencia se plantea como un pequeño libro de artista digital: íntimo, táctil, botánico y con humor seco.

## Sistema simbólico

| Símbolo | Función |
| --- | --- |
| Dani, gata amarilla con lentes | Curiosidad, sensibilidad y observación lateral |
| Diego, akita turquesa con lentes | Constancia, estructura y protección seriamente absurda |
| Planta | El vínculo compartido y la memoria de cada gesto |
| Semilla cuadrada | Una forma poco convencional de empezar |
| Dedal y regadera | La medida pequeña tratada como procedimiento importante |
| Hojas secas | Capas anteriores que se apartan con cuidado |
| Sombras | Presencia indirecta, consecuencia y refugio |

La floración final conserva acentos amarillos, turquesas y verdes. Lo compartido produce una forma nueva, no una mezcla indiferenciada.

## Paleta y materialidad

La fuente canónica es `src/styles/tokens.css`.

- Papel: `#f0e5d1`, `#faf3e5`, sombra `#d9c7aa`.
- Tinta y noche: `#29291f`, `#4a4739`, `#21383a`, `#172a2e`.
- Dani: `#d99d29`, luz `#e8b83f`, sombra `#a86a22`.
- Diego: `#3f776f`, luz `#6e9991`, sombra `#285451`.
- Botánica: hoja seca `#97623a`, salvia `#85865a`, musgo `#56643a`, verde nuevo `#657c45`.
- Clima: lluvia `#6c9696`, sol `#e6b748`, quemado `#39362b`.

El grano, las fibras, los bordes levemente irregulares y la tinta desplazada deben acompañar la composición sin reducir la legibilidad. No se cargan fuentes, imágenes de personajes ni texturas remotas.

## Personajes canónicos

`CharacterTypes.ts` define cinco vistas con geometría propia:

`front`, `three-quarter-left`, `three-quarter-right`, `profile`, `back`.

No se simulan los ángulos reflejando el SVG completo. `facing` solo cambia la dirección pertinente de mirada o gesto.

### Dani

`DaniCharacter.ts` expone 12 estados:

`idle`, `curious`, `happy`, `surprised`, `worried`, `proud`, `sleeping`, `watering`, `watching`, `reactingToRain`, `reactingToWind`, `reactingToHeat`.

La silueta es curva y ligera; la cola, las orejas, las patas y los lentes llevan la mayor parte de la expresión.

### Diego

`DiegoCharacter.ts` expone 13 estados:

`idle`, `focused`, `concerned`, `happy`, `surprised`, `proud`, `protecting`, `planting`, `watching`, `recoveringGlasses`, `reactingToRain`, `reactingToWind`, `reactingToHeat`.

La silueta es más vertical y geométrica; pecho, postura, orejas, cola y lentes comunican estabilidad o pérdida momentánea de compostura.

Ambos renderers aceptan estado, ángulo, orientación, tamaño, movimiento reducido e interacción opcional. Los tamaños semánticos son `small`, `medium` y `large`; también se acepta un ancho numérico acotado.

## PlantCharacter

`src/art/PlantCharacter.ts` mantiene una única anatomía SVG y 12 estados canónicos:

| Continuidad | Estados |
| --- | --- |
| Crecimiento | `seed`, `sprout`, `small`, `growing`, `healthy`, `flowering` |
| Cuidado | `hydrated` |
| Excesos y consecuencias | `drowned`, `windBent`, `fallen`, `overheated`, `burnt` |

Cambiar de estado conserva maceta, tierra, tallos, hojas, rostro y baseline. CSS muestra, inclina o transforma esas mismas capas. `PlantArt.ts` y `artDirection.ts` mantienen aliases de compatibilidad como `dormant`, `awakened`, `balanced`, `grown`, `soaked`, `windblown` y `recovering` para escenas anteriores.

## Objetos interactivos

`src/art/objects/InteractiveObjects.ts` unifica ocho objetos:

`seed`, `thimble`, `watering-cup`, `drop`, `sun`, `umbrella`, `dry-leaves`, `wind`.

Todos comparten `idle`, `hovered`, `active`, `completed` y `disabled`, un wrapper con `data-state`, nombre accesible y hitbox mínimo de 44 px. Semilla, dedal, paraguas y hojas reutilizan las fachadas SVG existentes; los demás glifos son SVG locales del módulo, nunca PNG.

## Sombras narrativas

`src/art/ShadowSystem.ts` separa seis capas:

`scene`, `botanical`, `dani`, `diego`, `plant`, `interactive`.

Las props `x`, `y`, `intensity`, `length`, `angle`, `shelter` y `progress` se convierten en variables CSS. La luz cambia dirección, longitud y opacidad; el progreso acerca objetos y personajes a la planta. En modo `final`, las sombras de Dani y Diego convergen con una copa vegetal para formar refugio, no un corazón literal.

## Estado visual de escena

`src/app/visualState.ts` define `SceneVisualState`:

- `daniState`
- `diegoState`
- `plantState`
- `instruction`
- `interactionEnabled`
- `completed`

La narrativa decide ese estado y los SVG lo representan. `setSceneVisualState` actualiza los mismos nodos, la instrucción y los atributos `data-*`; así una acción futura no aparece antes de tiempo y las transiciones no requieren reemplazar anatomías completas.

## Composición, interacción y movimiento

- Mucho espacio negativo y asimetría equilibrada.
- Una acción principal y una instrucción visible por momento.
- Tocar para acciones discretas; mantener y soltar solo cuando la duración expresa medida.
- Respuesta inmediata en cientos de milisegundos y pausas narrativas breves.
- Animación ambiental lenta y no simultánea.
- Móvil prioriza composición vertical; escritorio amplía el escenario sin deformar figuras.
- Con `prefers-reduced-motion` o la clase `reduced-motion` se eliminan deriva y repeticiones, se acortan transiciones y se conservan todos los estados.

## Referencia interna

`/dev/art-reference/` muestra las dos láminas de `references/` solo para consulta y genera el resto del inventario desde las APIs canónicas: paleta, cinco ángulos, estados, escalas, planta, objetos y sombras. La entrada está aislada de producción, no se enlaza desde la obra y no copia los PNG a `public/`.

## Límites estéticos

Curvas imperfectas, formas sencillas, pocos tonos y sombras separadas de la figura. Evitar clipart, emoji, 3D plástico, tarjetas de producto, glassmorphism, confeti, puntuaciones, cronómetros, navegación superior, tutoriales modales y recursos remotos.
