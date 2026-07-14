# Referencias de arte

Las láminas de `references/` son documentación interna para comparar la implementación con la dirección de arte. Se consultan únicamente desde la entrada de desarrollo `/dev/art-reference/`; no son recursos de la experiencia principal.

## Archivos y aislamiento

- `references/folhas-art-direction.png`: atmósfera, paleta, escala, objetos, planta y sombras.
- `references/folhas-character-guide.png`: anatomía, ángulos, expresiones y poses de Dani y Diego.
- `dev/art-reference/index.html` carga `src/dev/art-reference.ts` como una entrada separada.
- La página resuelve las dos láminas con `new URL(...)`; los PNG permanecen fuera de `public/`.
- La aplicación de producción no enlaza ni importa esta entrada, y el build principal no incorpora las láminas.

No deben copiarse los PNG a `public/`, usarse como fondos ni recortarse para simular personajes u objetos. La implementación final se compone con SVG originales, componentes tipados y tokens compartidos.

## Qué se extrajo de `folhas-art-direction.png`

- Papel crema, fibra suave, tinta irregular y una atmósfera íntima.
- Ocre y mostaza para Dani frente a petróleo y turquesa para Diego.
- Dani pequeña y curva; Diego alto, estable y protector.
- Macetas cálidas, hojas salvia y sombras botánicas que participan en el relato.
- Humor visual en los excesos de agua, viento y sol.
- Objetos independientes —semilla cúbica, dedal, gota, sol y paraguas— en lugar de escenas planas.

## Qué se extrajo de `folhas-character-guide.png`

- Dani: gata ocre, lentes redondos, rayas suaves, cola expresiva y lazo verde.
- Diego: akita de pecho ancho, urajiro crema, hocico corto, cola enrollada, lentes rectangulares y lazo oscuro.
- Expresiones localizadas en ojos, orejas, cabeza, patas, cola y lentes.
- Cinco ángulos canónicos: `front`, `three-quarter-left`, `three-quarter-right`, `profile` y `back`.
- Progresión continua de la planta desde semilla hasta floración.
- Instrucciones breves, áreas interactivas amplias y una sola acción principal por momento.

## Página de comparación de desarrollo

Con el servidor local activo, `http://localhost:5173/dev/art-reference/` muestra:

- ambas láminas junto a la traducción implementada;
- tokens de color con sus valores;
- los cinco ángulos de cada personaje;
- los 12 estados canónicos de Dani y los 13 de Diego;
- personajes en escala pequeña y grande;
- los 12 estados canónicos de `Plant`;
- ocho clases de objetos interactivos en sus cinco estados visuales;
- cuatro composiciones representativas de `ShadowSystem`.

Esta ruta es un inventario de desarrollo, no una escena adicional del relato ni una ruta publicada para visitantes.

## API visual que debe conservar la referencia

- `Dani` y `Diego`: estado, ángulo y tamaño como propiedades independientes.
- `Plant`: 12 estados canónicos (`seed`, `sprout`, `small`, `hydrated`, `growing`, `healthy`, `drowned`, `windBent`, `fallen`, `overheated`, `burnt`, `flowering`).
- Objetos: tipo y estado visual independientes.
- Sombras: capas y dirección de luz configurables.
- `SceneVisualState`: una única fuente por escena para personaje, planta, instrucción, habilitación de interacción y finalización.

## Exportación y verificación

El exportador (`node scripts/export-art.mjs`) genera en `public/art/` SVG autónomos de la API canónica; no copia las láminas de referencia. La última ejecución verificada produjo 68 SVG —49 variantes canónicas más archivos auxiliares—, todos parseables, sin `var(...)` pendiente y sin referencias a PNG.

También se verificaron `tsc`, `npm run build` y respuestas HTTP 200 para la ruta, su módulo, su CSS y las dos láminas en el servidor local. No se realizó una inspección visual real en navegador: la comparación responsive, el tacto y la fidelidad visual continúan pendientes en `QA_CHECKLIST.md`.
