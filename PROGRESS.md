# Progreso

## Implementación completada

- [x] Reducir el recorrido a cinco escenas: `cover`, `clear-space`, `offerings`, `care` y `final`.
- [x] Sanear el estado persistente y adaptar sesiones del recorrido anterior.
- [x] Sustituir arrastre y raspado obligatorio por acciones nativas de tocar.
- [x] Secuenciar agua y semilla sin exponer la acción futura.
- [x] Integrar agua, viento y sol como momentos consecutivos de `care`.
- [x] Reiniciar solamente el momento fallido y conservar hitos anteriores.
- [x] Centralizar microcopy e instrucciones en `src/app/content.ts`.
- [x] Añadir `SceneVisualState` para coordinar estado visual, instrucción y bloqueo.
- [x] Crear cinco ángulos compartidos y renderers canónicos para personajes.
- [x] Completar 12 estados de Dani y 13 de Diego.
- [x] Crear `PlantCharacter` con 12 estados sobre una anatomía continua.
- [x] Crear ocho objetos interactivos con cinco estados y hitbox mínimo de 44 px.
- [x] Crear `ShadowSystem` con seis capas, luz, progreso y refugio final.
- [x] Añadir `/dev/art-reference/` como inventario interno aislado.
- [x] Actualizar el exportador para consumir APIs canónicas.

## Arquitectura actual

| Responsabilidad | Fuente canónica |
| --- | --- |
| Ángulos, facing, tamaños e interacción común | `src/art/characters/CharacterTypes.ts` |
| Dani, 12 estados | `src/art/characters/DaniCharacter.ts` |
| Diego, 13 estados | `src/art/characters/DiegoCharacter.ts` |
| Planta, 12 estados | `src/art/PlantCharacter.ts` |
| Objetos, 8 tipos × 5 estados | `src/art/objects/InteractiveObjects.ts` |
| Sombras, 6 capas | `src/art/ShadowSystem.ts` |
| Compatibilidad de escenas | `src/art/artDirection.ts` |
| Estado visual narrativo | `src/app/visualState.ts` |
| Comparación interna | `src/dev/art-reference.ts` |

La fachada `artDirection.ts` conserva aliases narrativos anteriores, pero las nuevas implementaciones consumen renderers canónicos. La planta ya no se describe únicamente como `dormant → grown`: su continuidad completa es `seed → sprout → small → hydrated → growing → healthy → flowering`, con `drowned`, `windBent`, `fallen`, `overheated` y `burnt` como consecuencias.

## Exportación de arte

- [x] `node scripts/export-art.mjs` ejecutado tras la integración final.
- [x] 68 SVG autónomos generados en `public/art/`.
- [x] 49 variantes canónicas incluidas.
- [x] Los 68 archivos parsean como XML.
- [x] Cero variables CSS `var(...)` sin resolver.
- [x] Cero referencias PNG en los SVG exportados.

## Validación automatizada realizada

- [x] `npx tsc --noEmit`.
- [x] `npm run build` con TypeScript y Vite.
- [x] Transformación Vite de la entrada, módulo y CSS de `/dev/art-reference/`.
- [x] Respuesta HTTP 200 de la página interna y las dos referencias durante desarrollo.
- [x] Generación y parseo estático de combinaciones de personajes.

## Validación manual pendiente

- [ ] Recorrer desde una sesión nueva y desde estados persistidos representativos.
- [ ] Probar ratón, tacto y teclado en las cinco escenas.
- [ ] Revisar los umbrales del sol en un dispositivo táctil real.
- [ ] Confirmar foco, anuncios, contraste y movimiento reducido en navegador.
- [ ] Completar todas las resoluciones de `QA_CHECKLIST.md`.
- [ ] Revisar consola y solicitudes de red durante un recorrido completo.
- [ ] Realizar una pasada con sonido y otra sin sonido.

No hubo un navegador disponible en la sesión de implementación. El build, el marcado y los assets están validados; la matriz visual/táctil permanece abierta de forma intencional.
