# QA — Herbario de lo que cuidamos

Fecha: 2026-07-13. Verificación realizada sobre Chrome (panel integrado),
viewports 1280×720, 734×694 y 375×812, más build de producción.

## Técnica

- [x] `npm run build` termina sin errores de TypeScript ni de Vite.
- [x] Sin errores en consola durante el recorrido completo (verificado).
- [x] Sin peticiones externas: cero fuentes remotas, cero imágenes remotas,
      cero APIs. Todo el arte es SVG/Canvas local.
- [x] Sin dependencias de runtime (solo vite y typescript en dev).
- [x] `dist/` no incluye `art-preview.html` ni la enlaza.
- [x] Peso total: ~52 KB JS + ~22 KB CSS (14 + 6 KB gzip).
- [x] Canvas con DPR limitado a 2; `getImageData` con stride 41 y
      throttle 260 ms (nunca por movimiento).
- [x] Partículas limitadas a 12 simultáneas con red de seguridad.
- [x] Timers y listeners se limpian en `destroy()` de cada escena.
- [x] Audio se suspende al ocultar la pestaña (`visibilitychange`).
- [x] Persistencia versionada `herbario-dani:v1`; reanuda escena y
      preferencia de sonido; «empezar de nuevo» funciona (verificado).
- [x] Sin overflow horizontal en 375×812 (scrollWidth === innerWidth,
      medido en vivo).

## Interacción

- [x] Cubierta: arrastre de hoja abre el libro (verificado con drag);
      Enter también (verificado); el susurro aparece al mover.
- [x] Escena I: raspado con trazos interpolados y pincel suave
      (verificado con varios trazos); umbral 58 %; alternativa
      «dejar pasar la luz» revela y dispara la secuencia (verificado);
      diálogos y «seguir» aparecen; el pie se oculta.
- [x] Escena II: arrastre del dedal y la semilla con imán suave
      (verificado); sin estado de fracaso (soltar lejos devuelve el
      objeto); gota + tierra más oscura; cubo gira al hundirse; brote
      con hoja verde; textos posteriores.
- [x] Escena III: luz arrastrable; sombras cambian de dirección y
      longitud; refugio de sombras al alinear; hojas amarilla, turquesa
      y verde aparecen escalonadas (verificado); alternativa
      «encontrar la luz» presente.
- [x] Escena IV: texto progresivo, dedicatoria, línea en portugués,
      firma; pensamientos tardíos (verificado el del akita); cubo gira
      una vez al tocarlo; hojas se inclinan al tocar la planta.
- [x] Sonido: apagado por defecto, toggle persiste en localStorage
      (verificado en ambos sentidos), nunca hay autoplay.

## Accesibilidad

- [x] Todo interactivo es `<button>` con etiqueta descriptiva en español.
- [x] Navegación por teclado: Enter abre la cubierta (verificado);
      Enter coloca ofrendas; flechas mueven la luz; Enter/Espacio
      revela el raspado.
- [x] Foco visible (contorno discontinuo, color adaptado a escenas oscuras).
- [x] Anuncios `aria-live` en cada hito narrativo.
- [x] Alternativas para cada gesto (raspado, arrastre, alineación).
- [x] `prefers-reduced-motion`: animaciones ambientales desactivadas,
      transiciones reducidas a opacidad corta, sin pérdida de contenido.
- [x] Controles ≥ 44×44 px; hablantes marcados con texto (GATO/AKITA),
      no solo con color.
- [x] El pie oculto sale del árbol de accesibilidad (`visibility: hidden`).

## Visual

- [x] Composición editorial en escritorio (columna de texto + escenario).
- [x] Vertical y táctil en 375×812; sin texto diminuto.
- [x] Las cinco escenas comparten paleta, trazo y lenguaje.
- [x] Sombras botánicas presentes en cubierta, ofrendas, luz y final.
- [x] La semilla cuadrada reaparece: cubierta (escondida), escena I,
      escena II (se planta), escena IV (medio enterrada, easter egg).
- [x] Sin elementos prohibidos (confeti, corazones, barras de progreso,
      gradientes SaaS, fotografías…).

## Pendiente de revisión humana

- [ ] Sensación del raspado y el arrastre en un teléfono táctil real.
- [ ] Escucha de los sonidos generados (volumen y carácter) con altavoces.
- [ ] Lectura final del tono de la microcopy por parte del autor.
