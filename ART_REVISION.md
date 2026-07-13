# Revisión artística y técnica · segunda edición

Fecha: 2026-07-13.

## Problemas encontrados

- Dani y Diego eran figuras genéricas sin lentes ni estados expresivos.
- La composición repetía el mismo triángulo en todas las salas y las sombras
  eran principalmente dos ramas ambientales.
- La paleta no distinguía papel, profundidad, personajes ni clima.
- El recorrido solo incluía hojas, ofrendas y luz; faltaba la idea de medida.
- El estado persistido aceptaba identificadores y logros incoherentes, y un
  reinicio durante una transición podía separar la vista del progreso.
- No había gestión de foco entre salas; algunos RAF, callbacks y partículas
  podían sobrevivir al desmontaje.
- El final y las ramas decorativas podían desbordar en móvil bajo o tableta.

## Cambios realizados

- Se mantuvo Vite + TypeScript, el controlador, el sistema de escenas, Canvas,
  SVG local, Web Audio opcional y despliegue estático.
- El flujo ahora es: cubierta → hacer lugar → ofrendas → cuidados (lluvia,
  viento y sol) → buscar la luz → quedarse.
- `sanitizeState`, prerrequisitos y transición al siguiente paso impiden saltos
  y corrigen progreso persistido inválido.
- Las escenas salientes se vuelven inertes y se desmontan al comenzar la
  transición; el foco y la etiqueta accesible siguen la sala activa.
- Se añadió materialidad de papel dirigida, marcos editoriales irregulares,
  atmósferas por sala y sombras derivadas de los personajes.
- El inventario interno `/art-preview.html` documenta vistas, siluetas,
  estados, lentes y tamaños pequeños; no entra en `dist/`.

## Paleta final

- Papel: `#eee4d3`, claro `#f8f1e5`, sombra `#d9cbb8`.
- Tinta: `#252521`, suave `#44433d`.
- Noche: `#233039`, profunda `#172329`.
- Dani: ocre `#d3a83c`, luz `#e6c96e`, sombra `#9d7333`.
- Diego: turquesa `#4d918b`, luz `#79aaa4`, sombra `#316a68`.
- Botánica/clima: seco `#9a694d`, salvia `#77866e`, verde nuevo
  `#6f8f59`, lluvia `#708a99`, sol `#e4b957`, quemado `#3a342f`.
- Tres profundidades de sombra viven en `src/styles/tokens.css`.

## Sistema de personajes

- Dani: silueta curva, cola caligráfica/interrogativa, orejas asimétricas,
  lentes irregulares integrados y postura observadora.
- Diego: pecho geométrico, patas firmes, orejas triangulares, cola contenida,
  lentes rectangulares bajos y solemnidad protectora.
- Estados Dani: `idle`, `curious`, `surprised`, `hiding`, `worried`,
  `sleeping`.
- Estados Diego: `idle`, `serious`, `concerned`, `protecting`, `embarrassed`,
  `recoveringGlasses`.
- Los SVG fuente están en `src/art/svgLibrary.ts`; `public/art/` contiene las
  exportaciones sin variables CSS.

## Mecánicas añadidas

- Lluvia: mover el paraguas para dejar pasar una cantidad moderada; poca agua
  permite corregir y demasiada provoca maceta flotante y pez efímero.
- Viento: mantener y soltar una corriente; el exceso inclina la planta y hace
  volar los lentes de Diego.
- Sol: regular cercanía y tiempo; el exceso quema de forma caricaturesca,
  dibuja humo y hace aparecer el manual botánico de Diego.
- Cada momento ofrece una alternativa accesible, anuncia el resultado, guarda
  solo su hito y reinicia únicamente el momento fallido en menos de tres
  segundos.

## Decisiones descartadas

- No se añadió micrófono, backend, framework, dependencia de runtime, niveles,
  puntuación, cronómetro, progreso visible, fracaso global ni fotografía.
- No se separaron los tres climas en salas largas: viven como momentos de una
  sola sala para conservar el ritmo de dos o tres minutos.
- No se usó un corazón literal; el refugio aparece como copa, paraguas y casa
  abstracta.

## Riesgos pendientes

- Validar sensación del raspado, arrastre y pulsación sostenida en un teléfono
  físico, además del volumen del paisaje sonoro.
- La lectura emocional de la dedicatoria y el grado exacto de humor requieren
  revisión humana de Dani y Diego.
