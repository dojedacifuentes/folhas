# Revisión artística y técnica

Fecha: 2026-07-13.

## Objetivo de la iteración

Conservar la arquitectura y la metáfora originales, concentrar la historia en cinco escenas y sustituir el arte provisional por un sistema canónico de personajes, planta, objetos y sombras. La mecánica central debe leerse como cuidado de la medida, no como destreza o puntuación.

## Diagnóstico de partida

- Dani y Diego tenían siluetas funcionales, pero poca cobertura de estados, ángulos y gestos reutilizables.
- Planta, objetos y sombras dependían de fachadas dispersas; faltaba una API visual común para inventario y exportación.
- La paleta y la materialidad necesitaban una fuente canónica y una jerarquía más clara entre papel, tinta, personajes, botánica y clima.
- La progresión podía presentar información o controles antes del momento narrativo correspondiente.
- Los excesos de cuidado no tenían consecuencias locales suficientemente claras, breves y recuperables.
- Faltaba una comparación interna entre las láminas de referencia y el arte renderizado.

## Paleta final

`src/styles/tokens.css` es la fuente canónica. Los tonos principales son papel `#f0e5d1`, papel claro `#faf3e5`, tinta `#29291f`, noche `#21383a`, Dani `#d99d29`, Diego `#3f776f`, salvia `#85865a`, verde nuevo `#657c45`, lluvia `#6c9696`, sol `#e6b748` y quemado `#39362b`. Cada escena modula esa familia sin introducir recursos remotos ni degradados genéricos.

## Decisiones narrativas

- Flujo único: `cover → clear-space → offerings → care → final`.
- Cover, hojas y ofrendas usan botones nativos grandes en lugar de exigir arrastre o raspado.
- Offerings presenta agua y semilla en orden; el objeto futuro permanece inactivo.
- Care reúne agua, viento y sol como tres momentos consecutivos.
- Solo existe una instrucción visible y una acción habilitada por momento.
- El estado persistido se sanea; una sesión antigua no puede desbloquear contenido futuro.
- El final es una escena para permanecer, no una pantalla de recompensa.

## Arquitectura final de arte

- `DaniCharacter.ts`: 12 estados canónicos y cinco ángulos.
- `DiegoCharacter.ts`: 13 estados canónicos y cinco ángulos.
- `PlantCharacter.ts`: 12 estados sobre una anatomía continua.
- `InteractiveObjects.ts`: ocho objetos con cinco estados de interacción.
- `ShadowSystem.ts`: seis capas controladas por luz, progreso y refugio.
- `artDirection.ts`: fachada y aliases de compatibilidad para consumidores anteriores.
- `visualState.ts`: `SceneVisualState` coordina personajes, planta, instrucción, interacción y resolución.

Las escenas solicitan estados tipados y no copian SVG. Las partes anatómicas mantienen nombres estables para que CSS pueda expresar postura, clima y consecuencias sin reemplazar el dibujo.

## Reacciones locales

| Momento | Condición | Estado visible | Recuperación |
| --- | --- | --- | --- |
| Agua | Tercer toque antes de asentarse el segundo | `drowned`; Dani y Diego reaccionan a lluvia | Reinicia agua en `small`; conserva ofrendas |
| Viento | Segundo toque antes de completar | `windBent`; Diego recupera sus lentes | Reinicia viento en `hydrated`; conserva agua |
| Sol | Soltar después de 1800 ms | `overheated` | Reinicia sol en `growing`; conserva agua y viento |
| Sol | Mantener hasta el límite automático de 2100 ms | `burnt` y humo | Reinicia sol en `growing`; conserva agua y viento |

Soltar antes de 480 ms no falla: muestra una pista y permite continuar en el mismo momento. Cada reacción bloquea activaciones adicionales, anuncia el resultado y vuelve a montar solo la fase actual después de una pausa breve.

## Página interna de comparación

`/dev/art-reference/` es una entrada Vite separada y no enlazada desde producción. Presenta:

- las dos láminas de `references/` lado a lado, solo como consulta;
- valores computados de paleta y tokens;
- cinco ángulos, todos los estados y escalas pequeña/grande de Dani y Diego;
- los 12 estados de `PlantCharacter`;
- los ocho objetos en cinco estados;
- variantes de `ShadowSystem`, incluido el refugio final.

Los PNG permanecen fuera de `public/` y no se usan para construir personajes, fondos o interacciones.

## Exportador

`node scripts/export-art.mjs` compila los módulos canónicos, resuelve variables CSS e incrusta los estilos necesarios. La ejecución final produjo 68 SVG autónomos en `public/art/`, de los cuales 49 son variantes canónicas.

La verificación automatizada confirmó:

- 68 archivos parseables como XML;
- cero `var(...)` sin resolver;
- cero referencias PNG;
- nombres históricos conservados para compatibilidad.

## Accesibilidad y movimiento

- Botones nativos para acciones discretas y equivalencia de Enter/Espacio.
- Hitboxes de al menos 44 × 44 px y foco visible.
- Nombres accesibles en controles y SVG; cambios narrativos anunciados brevemente.
- Una sola instrucción activa y controles futuros fuera del foco.
- Sonido opcional y ausencia de información comunicada solo por color.
- Ramas específicas para `prefers-reduced-motion` y `reduced-motion`, sin eliminar estados o resultados.

## Validación realizada

- `npx tsc --noEmit`: correcta.
- `npm run build`: correcta.
- `/dev/art-reference/`, sus módulos CSS/TS y las dos referencias: respuesta HTTP 200 mediante Vite.
- Generación estática de combinaciones de personajes y parseo XML: correctos.
- Exportador de 68 SVG: correcto.

No hubo navegador disponible en la sesión. Por tanto, no se declara completada la revisión visual por resolución, la prueba táctil real ni la inspección de consola en una sesión interactiva.

## Riesgos y pendientes manuales

No son fallos confirmados: son áreas que aún requieren evidencia en un navegador y dispositivos reales.

- Recorrer desde una sesión nueva y desde estados persistidos representativos.
- Probar ratón, teclado y tacto real, especialmente los umbrales del sol.
- Completar la matriz responsive de `QA_CHECKLIST.md`.
- Verificar foco, anuncios, contraste y movimiento reducido con tecnologías y dispositivos reales.
- Realizar una pasada con sonido y otra sin sonido.

## Decisiones descartadas y límites de alcance

Se mantienen Vite, TypeScript, SVG local, Canvas y Web Audio opcional. Se descartaron backend, framework de interfaz, dependencias pesadas, micrófono obligatorio, puntuación, cronómetro, fracaso global, fotografías y una sala independiente por clima. Agua, viento y sol permanecen como momentos consecutivos de `care` para sostener el ritmo breve.
