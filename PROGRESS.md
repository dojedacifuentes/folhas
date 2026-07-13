# PROGRESS

## Fase actual

Fase 6 — QA y optimización (verificación en navegador en curso).

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

## Tareas restantes

- [ ] QA final documentado en `QA_CHECKLIST.md` (en curso).
- [ ] Revisión humana: tono de los textos y sensación de las interacciones
      en un teléfono real.
