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

## Validación manual realizada (2026-07-14, navegador integrado)

- [x] Recorrido completo desde sesión nueva: cubierta → hacer lugar →
      traer lo que tenemos → encontrar la medida → quedarse.
- [x] Recorrido con ratón/toque en las cinco escenas; sin errores de
      consola en ningún punto.
- [x] Momento del agua: dos gotas exactas avanzan; secuencia
      agua → semilla no expone la acción futura.
- [x] Momento del viento: un soplo corto avanza.
- [x] Umbrales del sol verificados con eventos temporizados:
      mantener 1.4 s completa el gesto; mantener 6 s dispara el fallo
      («la maceta respiró. probemos con una luz más corta»), que
      reinicia solamente ese momento y conserva los hitos previos.
- [x] Escena final: paraguas, planta florecida, texto completo,
      dedicatoria, línea en portugués y firma D + D visibles con scroll.
- [x] Estado persistido saneado (verificado en sesiones previas del
      flujo antiguo adaptándose al actual).

## Corregido tras la validación en navegador

- **Reinicio accidental**: en viewports bajos, el contenido desplazable
  pasaba bajo los controles fijos y un toque destinado a «ver lo que
  creció» aterrizaba en «empezar de nuevo», borrando todo el recorrido.
  Ahora el reinicio pide confirmación en dos toques
  («¿de nuevo, seguro?», revierte solo a los 3.5 s) — verificado.
- Los controles fijos llevan chip de papel (o de noche en escenas
  oscuras) para leerse sobre cualquier contenido que pase debajo.
- Más holgura inferior en pantallas bajas y margen bajo los controles
  de avance para reducir la superposición.

## Validación manual pendiente

- [ ] Teclado completo (Tab/Enter/flechas) en las cinco escenas.
- [ ] Umbrales del sol en un dispositivo táctil real.
- [ ] Movimiento reducido y contraste en navegador real.
- [ ] Una pasada con sonido activado (altavoces).
