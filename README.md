# Herbario de lo que cuidamos

*Manual mínimo para una semilla cuadrada y dos criaturas.*

Un pequeño libro de artista digital: hacer lugar, traer lo que tenemos,
encontrar la medida, buscar la luz y quedarse alrededor de una planta,
Dani —gata amarilla con lentes—, Diego —akita turquesa con lentes— y una
semilla cuadrada. Dura entre dos y tres minutos. No hay puntuaciones ni prisa.

## Requisitos

- Node.js 18+ y npm.
- Un navegador moderno. Funciona con mouse, touch, stylus y teclado.

## Desarrollo

```bash
npm install
npm run dev
```

Abre la URL local que indica Vite. La página `/art-preview.html` muestra
el inventario visual de ilustraciones (solo en desarrollo; no forma parte
del build).

## Build y despliegue

```bash
npm run build     # genera dist/ (sitio estático, sin peticiones externas)
npm run preview   # sirve dist/ localmente para comprobarlo
```

El contenido de `dist/` puede desplegarse en cualquier hosting estático
(Netlify, GitHub Pages, Vercel, un servidor propio). No hay backend,
analítica ni fuentes remotas.

### Desplegar en Vercel

El repositorio incluye `vercel.json` con la configuración exacta. Al
importar el proyecto en Vercel:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install` (por defecto)

No se requieren variables de entorno.

## Estructura

```
src/
├── main.ts                    punto de entrada
├── app/                       controlador, escenas, estado, microcopy
├── scenes/                    seis escenas; cuidados contiene tres momentos
├── interactions/              raspado, arrastre, alineación de luz
├── art/                       librería SVG y arte procedural (Canvas)
├── audio/                     paisaje sonoro con Web Audio API
├── storage/                   persistencia en localStorage
├── accessibility/             preferencias de movimiento
└── styles/                    tokens, base, tipografía, escenas…
public/art/                    SVG independientes (exportados de la librería)
scripts/export-art.mjs         regenera public/art/ desde svgLibrary.ts
```

## Controles

- **Cubierta**: arrastra la hoja (o Enter con la hoja enfocada).
- **I. Hacer lugar**: frota la capa de hojas; alternativa «dejar pasar la luz».
- **II. Traer lo que tenemos**: arrastra el dedal y la semilla a la maceta;
  con teclado, Enter sobre cada objeto los coloca.
- **III. Encontrar la medida**: mueve el paraguas, mantén la corriente y regula
  el sol; cada gesto tiene una alternativa accesible.
- **IV. Buscar la luz**: arrastra la luz o muévela con las flechas;
  alternativa «encontrar la luz».
- **V. Quedarse**: escena viva; la planta y el cubo reaccionan al tacto.
- Abajo a la izquierda: «empezar de nuevo». Abajo a la derecha: sonido
  (desactivado por defecto; la preferencia se recuerda).

## Accesibilidad

- Navegación completa por teclado con foco visible.
- Alternativas para cada gesto (raspado, arrastre, alineación).
- Anuncios discretos con `aria-live`.
- `prefers-reduced-motion` respetado: sin deriva ambiental ni parallax.
- Controles de al menos 44 × 44 px; la información no depende solo del color.

## Personalizar los textos

Toda la microcopy vive en `src/app/content.ts` (documentada en
`CONTENT.md`). Cambia allí cualquier frase y reconstruye.

## Estado guardado

El progreso se guarda en `localStorage` bajo la clave `herbario-dani:v1`.
No se guarda información personal y no hay analítica.
