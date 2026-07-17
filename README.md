# Herbario de lo que cuidamos

Experiencia web breve y narrativa sobre cuidar algo en común. Funciona sin
backend, usa TypeScript y **pixel art dibujado en Canvas** (sin imágenes
externas), y organiza un recorrido de dos o tres minutos en cinco escenas.
Dani (gata amarilla) piensa en portugués; Diego (akita turquesa), en español.

## Recorrido

| Escena | Propósito | Acción principal |
| --- | --- | --- |
| `cover` | Entrar en la historia | Arrastrar la hoja (sol y personajes reaccionan) |
| `clear-space` | Hacer lugar | Raspar la capa de hojas (rápido, ~3 trazos) |
| `offerings` | Aportar algo distinto | Exprimir la nube y acomodar la semilla |
| `care` | Encontrar la medida | Dos gotas, un soplo deslizado y llevar el sol a la planta |
| `final` | Contemplar lo construido | Girasoles, abrazo, nanai y mantita |

Mientras juegas, la planta cobra vida: pide agua, comida o nanai con emoticones
pixel y frases cortas, y se inclina hacia el cursor.

`care` contiene tres momentos consecutivos. Un exceso de agua, viento o sol produce una reacción breve y reinicia solamente ese momento; los hitos anteriores permanecen guardados.

## Desarrollo

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev
```

La experiencia principal queda en `/`. El inventario interno de arte está disponible únicamente durante desarrollo en:

```text
/dev/art-reference/
```

Esta página compara las dos láminas de `references/`, tokens, personajes, planta, objetos y sombras. No está enlazada desde la aplicación, no copia las referencias a `public/` y no forma parte de la entrada de producción.

## Verificación y exportación

```bash
npx tsc --noEmit
npm run build
npm run preview
node scripts/export-art.mjs
```

El exportador consume las APIs canónicas y genera 68 SVG autónomos en `public/art/`: 49 variantes canónicas, vistas por ángulo y recursos compartidos. La ejecución verificada dejó cero variables `var(...)` sin resolver y cero referencias PNG.

## Arquitectura visual

- `src/art/characters/CharacterTypes.ts`: contrato común y cinco ángulos.
- `src/art/characters/DaniCharacter.ts`: 12 estados canónicos de Dani.
- `src/art/characters/DiegoCharacter.ts`: 13 estados canónicos de Diego.
- `src/art/PlantCharacter.ts`: una anatomía continua con 12 estados.
- `src/art/objects/InteractiveObjects.ts`: ocho objetos y cinco estados de interacción.
- `src/art/ShadowSystem.ts`: seis capas de sombra gobernadas por luz y progreso.
- `src/art/artDirection.ts`: fachada de compatibilidad para las escenas existentes.
- `src/app/visualState.ts`: `SceneVisualState`, contrato narrativo compartido entre personajes, planta, instrucción y bloqueo de interacción.
- `src/dev/art-reference.ts`: entrada aislada del inventario interno.

Las escenas solicitan estados; no copian anatomía SVG. Dani y Diego comparten proporciones, tamaños y ángulos, pero conservan siluetas y gestos propios. La planta cambia de estado sobre el mismo nodo y mantiene maceta, escala y partes anatómicas.

## Interacción y accesibilidad

- Solo existe una instrucción y una acción principal activas por momento.
- Clic, toque, Enter y Espacio siguen rutas equivalentes donde corresponde.
- Los controles tienen foco visible, nombre accesible y hitbox mínimo de 44 × 44 px.
- Las acciones futuras permanecen deshabilitadas y fuera del recorrido de foco.
- Los cambios importantes se anuncian mediante la región viva existente.
- `prefers-reduced-motion` y la clase `reduced-motion` reducen desplazamientos y animaciones sin eliminar consecuencias narrativas.
- El sonido es opcional; ninguna instrucción depende exclusivamente de él o del color.

El progreso se guarda localmente. El saneamiento del estado acepta sesiones anteriores y las adapta al flujo actual sin habilitar escenas futuras.

## Documentación

- `CONTENT.md`: microcopy y secuencia editorial.
- `ART_DIRECTION.md`: lenguaje visual y APIs canónicas.
- `ART_REVISION.md`: decisiones y límites de esta iteración.
- `ART_REFERENCE.md`: procedencia y uso dev-only de las láminas.
- `PROGRESS.md`: estado real de implementación y validación.
- `QA_CHECKLIST.md`: matriz funcional, visual y accesible; las pruebas manuales pendientes permanecen sin marcar.
