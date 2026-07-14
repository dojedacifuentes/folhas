# PROGRESS

## Fase actual

Segunda iteración completada (2026-07-14). QA documentado en
`QA_CHECKLIST.md`; queda la revisión humana en un teléfono real.

## Segunda iteración — dirección de arte y humor

- Rediseño total de personajes: Dani (gatita amarilla, anteojos
  redondos) y Diego (akita turquesa, anteojos rectangulares, cejas
  serias, cola de spitz). Verificados en `/art-preview.html`.
- Paleta v2 más cálida y cohesionada; sombras entintadas de verde;
  arcilla como acento compartido (narices, orejas internas).
- Sombras botánicas rediseñadas: rama de eucalipto en arco y fronda de
  helecho; una rama cruza el tableau de la escena I; luz que se mueve
  lentamente sobre la cubierta.
- Voces con nombre: dani y diego en diálogos y notas editoriales.
- Humor implementado y verificado en navegador:
  - agua de más → glub, charco, paraguas de Diego, reinicio del agua
    (ciclo completo verificado dos veces);
  - sol de más → humo (0.7 s), chamuscado + «puf.» (2.3 s),
    restauración y luz al inicio (3 s) — verificado con MutationObserver.
- Progresión bloqueada: `furthestAllowed()` valida cada `goTo` y la
  reanudación; probado manipulando localStorage (currentScene «final»
  sin gestos → arranca en cubierta y corrige el guardado).
- Solo la instrucción de la sala actual es visible; las alternativas
  accesibles aparecen a los 12 s; el gag sustituye a la instrucción.
- Optimización: animaciones pausadas con pestaña oculta
  (`visibilitychange` + `animation-play-state`), `will-change` solo
  durante transiciones de escena, scroll fino solo en la escena final.

## Tareas realizadas

- [x] Fase 0: proyecto Vite + TypeScript inicializado en carpeta propia,
      git, `npm run build` verificado.
- [x] Fase 1: `ART_DIRECTION.md`, `CONTENT.md`, tokens CSS, tipografías locales.
- [x] Fase 2: librería SVG completa (gato, akita, planta, cubo, dedal,
      6 hojas, 2 ramas, refugio, iconos) + exportación a `public/art/` +
      página `/art-preview.html`.
- [x] Fase 3: `ScratchReveal` con Pointer Events, captura, interpolación,
      pincel suave, DPR ≤ 2, ResizeObserver con preservación de trazos,
      muestreo parcial de alfa con throttle, umbral 58 %, callback único.
- [x] Fase 4: cinco escenas conectadas (cubierta, hacer lugar, traer lo
      que tenemos, buscar la luz, volver) con máquina de estados y
      persistencia versionada `herbario-dani:v1`.
- [x] Fase 5: reacciones de personajes, pensamientos, sonidos Web Audio
      opcionales, easter eggs (cubo que gira, hojas que se inclinan),
      transiciones de página.

## Archivos creados

Ver estructura en `README.md`. Sin dependencias de runtime.

## Problemas y decisiones

- El Escritorio del usuario no estaba vacío: el proyecto vive en la
  subcarpeta `herbario-de-lo-que-cuidamos/` con su propio repositorio git.
- `public/art/` se genera desde `src/art/svgLibrary.ts` (fuente única)
  mediante `scripts/export-art.mjs`, para evitar duplicación divergente.
- El progreso del raspado se conserva tras resize reproduciendo los
  trazos normalizados, en lugar de copiar el bitmap (más estable entre DPR).
- El cálculo de progreso usa `getImageData` con stride 41 y throttle de
  260 ms: nunca en cada `pointermove`.

## Correcciones de la fase de QA

- `user-select: none` en el escenario: el raspado seleccionaba texto.
- Padding inferior de escena ampliado: la instrucción chocaba con los
  controles fijos.
- Reinicio a la izquierda y sonido a la derecha; en escenas oscuras los
  controles pasan a color papel (clase `on-dark`).
- La luz de la escena III ahora nace descentrada (cerca del gato) para
  invitar al gesto.
- Cola del akita enroscada sobre el lomo y orejas más pequeñas (leía
  como un segundo gato).
- El pie oculto usa `visibility: hidden` para salir del árbol de
  accesibilidad.

## Tareas restantes

- [ ] Revisión humana: tono de los textos, tacto del raspado y volumen
      de los sonidos en un teléfono real.
