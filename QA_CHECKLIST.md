# Checklist de QA

Estado al 2026-07-13: validación estructural y build completados. También se recorrió la experiencia real en navegador con puntero, teclado semántico y un gesto mantenido, además de inspección visual en escritorio y marcos de 320/360 px. Permanecen abiertas las variantes de error difíciles de automatizar, tecnología asistiva real y la matriz completa de dispositivos.

## Validación estructural automatizada

- [x] TypeScript reconoce 12 estados de Dani, 13 de Diego y cinco ángulos compartidos.
- [x] `PlantCharacter` expone sus 12 estados canónicos.
- [x] Los ocho objetos generan wrappers con los cinco `data-state` válidos.
- [x] `ShadowSystem` genera las seis capas declaradas y el modo de refugio final.
- [x] Las combinaciones de personajes inspeccionadas generan SVG/XML válido.
- [x] `/dev/art-reference/`, su módulo, CSS y dos PNG responden HTTP 200 con Vite.
- [x] Las referencias permanecen fuera de `public/` y de la entrada de producción.

## Flujo y estado

- [x] Una sesión nueva recorre, en orden: `cover → clear-space → offerings → care → final`.
- [x] No se puede saltar a una escena futura mediante estado local o activaciones rápidas.
- [x] Recargar conserva la escena y los hitos válidos.
- [ ] Un estado antiguo, incompleto o corrupto se adapta al último punto alcanzable.
- [ ] Reiniciar vuelve a la cubierta y limpia los hitos narrativos.
- [ ] Cada escena saliente deja de responder y libera temporizadores, eventos y animaciones.

## Acciones por escena

- [ ] Cover: tocar la hoja abre el herbario; Enter y Espacio producen el mismo resultado.
- [x] Clear-space: tocar el montón aparta las hojas una sola vez y revela el elenco.
- [x] Offerings: el dedal aparece primero y un toque deja una gota.
- [x] Offerings: solo después se habilita la semilla; al completarla aparece la continuación.
- [x] Care / agua: el primer toque muestra «falta una» y el segundo completa el momento.
- [x] Care / viento: un solo toque completa el momento.
- [x] Care / sol: menos de 480 ms pide un poco más; entre 480 y 1800 ms completa.
- [ ] Care / sol: Enter o Espacio mantenidos y soltados respetan los mismos límites.
- [x] Final: tocar planta o semilla es opcional y no altera el progreso.

## Errores locales — pendiente de navegador

- [ ] Un tercer toque rápido de agua, antes de asentarse el segundo, muestra `drowned`.
- [ ] Reintentar agua vuelve a `small`; no borra ofrendas ni avanza al viento.
- [ ] Un segundo toque rápido de viento muestra `windBent` y desplaza los lentes de Diego.
- [ ] Reintentar viento vuelve a `hydrated`; no repite agua ni avanza al sol.
- [ ] Soltar el sol después de 1800 ms muestra `overheated`.
- [ ] Mantener el sol hasta 2100 ms muestra `burnt` y humo.
- [ ] Reintentar sol vuelve a `growing`; no repite agua o viento ni abre el final.
- [ ] Durante una reacción, activaciones adicionales se ignoran o permanecen en el mismo error.
- [ ] El anuncio accesible describe el error y el reintento una sola vez.

## Continuidad visual

- [x] La planta conserva maceta, baseline, escala y posición reconocibles entre escenas.
- [x] Se distinguen `seed`, `sprout`, `small`, `hydrated`, `growing`, `healthy` y `flowering`.
- [ ] Cada exceso parte del estado correcto y vuelve al último momento válido.
- [x] En final se distinguen hojas ocres, turquesas, verdes y floración.
- [x] Dani y Diego conservan rasgos, lentes, proporciones y orientación en cinco ángulos.
- [x] Las sombras cambian con la luz sin reducir la legibilidad.
- [x] El final forma un refugio vegetal y no un corazón literal.

## Accesibilidad — pendiente de navegador/tecnología asistiva

- [x] Todos los controles son alcanzables en un orden de foco lógico.
- [x] Hay foco visible y área interactiva mínima de 44 × 44 px.
- [x] Los nombres accesibles explican acción y cantidad sin depender del color.
- [x] Solo una instrucción activa se anuncia en cada momento.
- [x] Los controles futuros están deshabilitados y fuera del recorrido de foco.
- [ ] `prefers-reduced-motion` conserva estados, consecuencias y tiempos comprensibles.
- [ ] La clase `reduced-motion` ofrece el mismo resultado que la preferencia del sistema.
- [ ] El contraste de texto, foco y controles cumple AA.
- [ ] La experiencia es comprensible con sonido desactivado.

## Matriz responsive — pendiente

- [x] Pasada visual complementaria a 320 × 720 y 360 × 700 sin overflow horizontal ni controles inaccesibles.

- [ ] 360 × 640: no hay cortes, superposición ni contenido inaccesible.
- [ ] 390 × 844: escenario, acción e instrucción caben sin saltos.
- [ ] 412 × 915: no aparece overflow horizontal.
- [ ] 768 × 1024: tableta mantiene jerarquía y áreas táctiles.
- [ ] 1366 × 768: la baja altura no oculta acción o continuación.
- [ ] 1440 × 900: el espacio negativo no separa texto, acción y personajes.
- [ ] Orientación horizontal móvil: el control activo sigue visible.
- [ ] Ratón, pantalla táctil y teclado completan el mismo recorrido.

## Inventario interno — validación parcial

- [x] Las dos referencias aparecen únicamente en la sección de consulta dev-only.
- [x] La página importa directamente las APIs canónicas; no duplica SVG.
- [x] Incluye paleta, cinco ángulos, estados, escalas, planta, objetos y sombras.
- [x] Tiene estructura semántica, textos alternativos, enlace de salto y `noindex`.
- [x] Revisar visualmente `/dev/art-reference/` en ancho compacto y escritorio.

## Exportador y entrega

- [x] `node scripts/export-art.mjs` genera 68 SVG autónomos y 49 variantes canónicas.
- [x] Los 68 SVG parsean como XML.
- [x] No quedan `var(...)` sin resolver ni referencias PNG exportadas.
- [x] `npx tsc --noEmit` termina sin errores.
- [x] `npm run build` termina sin errores.
- [x] `npm run preview` carga la aplicación y permite una recarga profunda.
- [ ] No hay errores de consola ni solicitudes remotas inesperadas durante el recorrido.
- [ ] Se realiza una pasada completa con sonido y otra sin sonido.
