# PROGRESS

## Fase actual

Segunda edición implementada. QA documentado en `QA_CHECKLIST.md`; queda la
revisión humana en un teléfono real (tacto, sonido y tono emocional).

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
- [x] Fase 4: seis escenas conectadas (cubierta, hacer lugar, traer lo
      que tenemos, cuidados, buscar la luz, quedarse) con estado secuencial y
      persistencia versionada `herbario-dani:v1`.
- [x] Fase 5: reacciones de personajes, pensamientos, sonidos Web Audio
      opcionales, easter eggs (cubo que gira, hojas que se inclinan),
      transiciones de página.
- [x] Fase 6: rediseño de Dani y Diego con lentes/estados, tokens ampliados,
      sombras narrativas, lluvia, viento, sol y fallos locales amables.

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
