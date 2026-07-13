# QA — Herbario de lo que cuidamos · segunda edición

Fecha: 2026-07-13. Recorrido completo realizado en el navegador integrado
sobre el servidor local de Vite; build de producción ejecutado por separado.

## Técnica

- [x] `npm install` sin vulnerabilidades y `npm run build` correcto (TypeScript
      + Vite, sin dependencias de runtime).
- [x] `git diff --check` sin errores de whitespace.
- [x] Sin errores ni advertencias de consola durante el recorrido completo.
- [x] Arte local: 19 SVG exportados y válidos; sin peticiones de assets remotos.
- [x] `/art-preview.html` funciona en desarrollo y no se incluye en `dist/`.
- [x] Canvas con DPR máximo 2; partículas y RAF se cancelan al desmontar.
- [x] Animaciones CSS se pausan con la pestaña oculta.

## Progresión y persistencia

- [x] Orden único: cubierta → hojas → ofrendas → cuidados → luz → final.
- [x] El estado persistido se sanea por tipo y por prerrequisitos; una sala solo
      puede pedir la inmediatamente siguiente.
- [x] Solo hay una escena interactiva; la saliente se vuelve `inert`, se oculta
      del árbol accesible y destruye listeners antes del fundido.
- [x] Recarga en el momento de sol reanudó exactamente ese momento sin mostrar
      lluvia, viento ni sala futura.
- [x] Reinicio durante el vuelo de la hoja permaneció en cubierta después de
      drenar los temporizadores; no hubo salto tardío.
- [x] Las instrucciones y alternativas completadas quedan inertes y con
      `aria-hidden`; el control siguiente recibe foco.

## Interacción

- [x] Recorrido completo con Enter/clic y alternativas accesibles.
- [x] Ofrendas: ambos botones colocan objetos, el brote aparece una sola vez y
      el siguiente paso no se ofrece antes de completar ambos.
- [x] Lluvia: paraguas regulable, pista por falta de agua, éxito moderado y
      reinicio local por inundación.
- [x] Viento: pulsación sostenida o teclado, éxito al soltar en medida y fallo
      local con lentes de Diego.
- [x] Sol: regulación, éxito moderado y fallo local con planta quemada/manual.
- [x] Luz: arrastre, flechas y alternativa directa; refugio y tres hojas.
- [x] Final: planta y semilla siguen siendo objetivos táctiles; no hay premio,
      puntuación, confeti ni llamada a compartir.

## Accesibilidad y movimiento

- [x] Foco visible en controles; foco programático discreto en encabezados.
- [x] Controles táctiles de al menos 44×44 px, incluidos planta y semilla final.
- [x] `aria-live` anuncia hitos y reacciones; Dani/Diego tienen nombres y los
      SVG de contenido tienen etiquetas descriptivas.
- [x] Toda interacción de arrastre/raspado/regulación tiene alternativa.
- [x] `prefers-reduced-motion` elimina desplazamientos amplios, acorta fallos,
      asienta la luz sin 18 RAF y conserva las consecuencias narrativas.

## Responsive

- [x] Matriz comprobada: 360×640, 390×844, 412×915, 768×1024,
      1366×768 y 1440×900.
- [x] `document.scrollWidth === innerWidth` en los seis tamaños.
- [x] A 360×640 la escena final habilita scroll vertical interno de la sala
      actual; no existen escenas futuras debajo ni overflow horizontal.
- [x] A 390×844 el recorrido completo cabe sin scroll horizontal; textos,
      instrucciones y alternativas permanecen visibles.
- [x] A 1366×768 y 1440×900 se conserva la composición editorial en dos zonas.

## Pendiente de revisión humana

- [ ] Sensación del raspado, arrastre del paraguas y pulsación sostenida en un
      teléfono físico.
- [ ] Escucha del paisaje sonoro con altavoces reales.
- [ ] Lectura final del tono emocional y del grado de humor por Dani y Diego.
