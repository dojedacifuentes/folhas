# Progreso

## Comedia botánica íntima (v6, 2026-07-17)

Auditoría integral sobre el concepto rector: "una comedia botánica íntima
dentro de un herbario vivo". Cada etapa gana descubrimiento, interacción,
transformación, reacción, una línea graciosa y una consecuencia que
reaparece.

- **Portada viva**: sello de archivo rotativo (8 frases, sin repetición
  inmediata, `pickLine`), Dani se esconde si el cursor se le acerca, las
  motas de polvo se apartan del cursor, la hoja-emblema se ilumina al
  tocarla.
- **Ritual de siembra completo** en Traer lo que tenemos: retirar tres
  piedritas de la tierra (el macetero comenta) → bandeja de candidatos
  (piedra y botón impostores con réplicas dignas; la semilla acepta "bajo
  condiciones razonables de humedad") → plantar → lluvia → brote.
- **Sistema de voces** (`speech.ts` + pools en `content.ts`): líneas por
  personaje y momento, sin repetición inmediata. Nada de frases incrustadas
  en componentes.
- **Memoria narrativa** (`state.memory`): inundación, viento, quema y
  semillas equivocadas se registran en los fallos y reaparecen en:
  réplicas post-incidente ("sobreviví. mi confianza, menos."), la finta del
  escape, y la **etiqueta botánica final** con datos reales — *Helianthus
  annuus*, "agua: suficiente, con incidentes", "luz: aprendida, con
  antecedentes", "semilla: hallada tras varias entrevistas". Frase de
  cierre que recuerda la partida ("Creció orientándose prudentemente lejos
  del sol.").
- **Escape con fintas**: 30% de amagues (pasito corto + arranque súbito)
  con línea legal ("mi abogado recomendó moverme.").
- **Entreactos teatrales**: las réplicas de los cierres de escena entran
  escalonadas (gata primero, akita ~0.9 s después), no en bloque.
- Verificado en móvil (375×812) y escritorio (1440×900), consola limpia.

## Dirección estética coherente (v5, 2026-07-17)

Decisión asumida: **herbario poético interactivo con humor vegetal y
minijuegos pixel art**. Todo debe pertenecer al mismo pequeño mundo.

- **Portada como lámina de herbario**: marco doble con esquinas montadas,
  motas de polvo flotantes, dos hojitas de borde, anotación manuscrita
  ("ficha n.º 1 — recolectada con cuidado"); fuera el cubo suelto. La
  **hoja-emblema** se rediseñó: verdes musgo/salvia/oliva, silueta asimétrica
  con borde irregular, nervadura central curva + secundarias, muesca
  distintiva y gota de rocío turquesa.
- **Hojas rascables en pixel art** (`LeafField` reescrito): cinco siluetas con
  mini-personalidad (amarilla quebradiza, rojiza moteada, salvia con
  agujeritos, redondita, alargada curvada), mantillo tramado y ramitas de
  celdas; espejos sin rotación para conservar la rejilla. El borrado ahora es
  por **mordidas pixel** (celdas cuadradas con borde irregular determinista) y
  las partículas son motitas cuadradas otoñales.
- **Causalidad corregida**: primero la semilla (consecuencia visible en la
  tierra), después la nube de Dani que llueve, y de ahí el brote.
- **Escape del macetero** (nuevo beat cómico al llegar a Cuidar): la maceta
  huye con la semilla; hay que atraparla 3 veces. Dardos repentinos a lados
  alternos, ventana de reacción corta y aceleración tras cada atrapada;
  frases de pánico burocrático ("no estaba listo para esta responsabilidad").
  Con animación reducida basta un toque. Hito `potCaught` persistido.
- **Quemado legible y rápido**: humo leve (heat>0.26) → humo claro + aviso
  "huele a verano excesivo…" (>0.58) → combustión en ~1 s. Verificado por
  muestreo: t250 sin humo / t500 smoke-1 / t750 smoke-2+aviso.
- **Cara del macetero** neutra y tierna (ojos punto, boca mínima, sin
  mejillas por defecto).
- **Humor de entreacto** rotativo (`content.quips`): macetero/semilla/planta/
  mundo, una frase por momento, sin repetición inmediata.
- **Final sin objetos arbitrarios**: la sombrilla y el dedal se reemplazaron
  por la **nube que descansa** y una **etiqueta botánica** de herbario; la
  nube es ahora el control de agua también en Cuidar, y aparece en el tableau
  oculto de Hacer lugar.

## Más juego y vida (v4, 2026-07-17)

Ronda centrada en hacerlo más divertido, gracioso e inesperado, con más
storytelling e interactividad.

- **Paleta más vibrante y artística**: tokens re-mapeados (amarillo/turquesa más
  saturados, verde girasol, coral, baya, ciruela, cielo, menta, nieve). El pixel
  art hereda los tokens, así que todo el arte se aviva a la vez.
- **Nube exprimible** en Offerings: reemplaza el dedal. La nube (con carita)
  flota sobre la maceta; se exprime pulsándola tres veces (medidor de tres
  gotas), llueve, y luego se cuida la semilla. Accesible con Enter.
- **Despeje de hojas más rápido**: pincel mayor (52) y umbral más bajo (0.4); se
  limpia en ~3 trazos. El atajo accesible aparece a los 6 s (antes 12 s).
- **Portada nueva**: sol pixel con carita, Dani y Diego asomándose por las
  esquinas, y **chispas que siguen el cursor**. Título y susurro conservados.
- **Planta viva** (`LivingPlant`): mientras juegas, la planta pide agua/comida/
  nanai/sol con **emoticones pixel** (`emote.ts`: corazón, gota, sueño, frío,
  chispa, hambre, nota, sol) y frases cortas en una burbuja; **se inclina hacia
  el cursor** y suelta un corazón si te acercas. Activa en Offerings y Final.
- **Epílogo final interactivo**: la planta florece en **girasol** y luego brotan
  **muchos girasoles** escalonados por el jardín; **Dani y Diego se juntan** con
  un corazón; una **mantita** los cubre del frío. Toques: Dani → nanai, Diego →
  abrazo, cubo que gira, planta que se inclina.

## Pixel art (v3, 2026-07-16)

Rediseño completo del arte a **pixel art dibujado en Canvas** (sin imágenes
externas), reemplazando el sistema SVG. Verificado en navegador en las cinco
escenas, sin errores de consola, con la progresión y los gestos intactos.

- Motor `src/art/pixel/` (engine + draw + palette + registry) con dibujo por
  primitivas, sombreado de tres tonos, contorno automático y animación por
  fotogramas autolimpiante.
- Sprites: Dani (gata) y Diego (akita) con lentes y expresiones por estado;
  planta con 11 estados (semilla → floración + ahogo/viento/sol/quemadura);
  sol con carita y rayos; objetos (dedal, cubo, gota, paraguas, hojas, viento,
  regadera, hoja de cubierta).
- Cableado: los `render*()` emiten `canvas[data-pixel]`; SceneManager y CareScene
  hidratan tras montar; `setSceneVisualState` repinta al cambiar de estado.
- Verificado: cubierta (hoja pixel arrastrable), raspado revela a Dani/Diego,
  arrastre de ofrendas → brote, agua/viento/sol → planta que crece, floración
  final. Care se detiene en su puerta (no salta etapa). `dist/` solo `index.html`.
- Página de ajuste dev: `/pixel-preview.html` (fuera del build).

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

## Reintegración de gestos táctiles (2026-07-15)

Se recuperaron los gestos del recorrido original sobre la base Folhas,
sin perder la máquina de momentos, el bloqueo de progresión ni la
persistencia. Nueva hoja `src/styles/gestures.css` para todo esto más
la pasada de game-feel.

- **Hacer lugar**: raspado real con `ScratchReveal` (lienzo de hojas
  procedural, pincel suave, umbral 58 %, partículas, sonido) sobre el
  tableau a plena opacidad; alternativa accesible «dejar pasar la luz»
  tras 12 s. Verificado en navegador (raspar cruza el umbral y revela).
- **Traer lo que tenemos**: `DraggableOffering` con imán suave; secuencia
  dedal → semilla que no expone la acción futura; el escenario se recoge
  al nacer el brote; las ofrendas crudas se retiran (la planta las
  representa). Verificado arrastre, colocación, restauración.
- **Encontrar la medida**: agua = dos toques (sin cambios); viento =
  deslizamiento horizontal (`PointerTracker`) con respaldo de toque/Enter
  y antirrebote de 260 ms; sol = **luz móvil** (`LightAligner`) que se
  arrastra por el cielo, gobierna las sombras (`ShadowSystem`) y quema la
  planta si se demora sobre ella (bucle de calor con `requestAnimationFrame`).
  Verificados en navegador los caminos de éxito de los tres momentos.
- **Voces bilingües**: Dani piensa y habla en portugués; Diego en español.
  Nueva línea final «as estações passam; a gente volta.» y la broma
  «isso conta como arquitetura? / sí.» reintegrada. Verificado.
- **Cubierta**: la hoja vuelve a arrastrarse (con toque/Enter de respaldo).

### Ajustes durante la verificación en navegador

- El objeto arrastrable no dibuja la tarjeta del hitbox ni su anillo.
- Composición de «Traer lo que tenemos» reanclada al escenario.
- Umbral de asentamiento de la luz relajado (0.78) y radio ampliado
  (0.40) para que el arrastre táctil no sea frustrante; zona de calor
  estrechada al centro para no quemar al partir junto a Dani.

## Validación manual pendiente

- [ ] Teclado completo (Tab/Enter/flechas) en las cinco escenas.
- [ ] Quemadura del sol en dispositivo real (el bucle de calor usa rAF,
      congelado cuando la pestaña de vista previa está en segundo plano;
      comparte `failPhase` ya verificado con agua/viento).
- [ ] Movimiento reducido y contraste en navegador real.
- [ ] Una pasada con sonido activado (altavoces).
