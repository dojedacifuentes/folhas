/**
 * Exporta los dibujos de src/art/svgLibrary.ts como archivos SVG
 * independientes en public/art/, resolviendo las variables de color.
 * Uso: node scripts/export-art.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = readFileSync(join(root, "src/art/svgLibrary.ts"), "utf8");

// quitar anotaciones de tipos para poder ejecutarlo como JS plano
const js = src
  .replaceAll(": Record<number, string>", "")
  .replaceAll(": 1 | 2", "")
  .replaceAll(": number", "")
  .replaceAll(": string", "");

const tmp = join(root, "scripts/.tmp-svglib.mjs");
writeFileSync(tmp, js);
const lib = await import(pathToFileURL(tmp).href);
rmSync(tmp);

const palette = {
  "--paper": "#f2e9d6",
  "--paper-light": "#fbf4e4",
  "--ink": "#2b261e",
  "--night": "#1d2b35",
  "--night-soft": "#2a3d49",
  "--yellow": "#d9a53f",
  "--yellow-soft": "#eac878",
  "--turquoise": "#47867f",
  "--turquoise-dark": "#2f665f",
  "--sage": "#7f8d74",
  "--leaf-dry": "#a26e4c",
  "--leaf-dark": "#6a4c39",
  "--green-new": "#7a9a62",
  "--clay": "#c17250",
  "--shadow": "rgba(39, 55, 52, 0.18)",
  "--shadow-deep": "rgba(22, 37, 39, 0.4)",
};

function resolve(svg) {
  let out = svg.trim();
  for (const [name, value] of Object.entries(palette)) {
    out = out.replaceAll(`var(${name})`, value);
  }
  return out + "\n";
}

const outDir = join(root, "public/art");
mkdirSync(join(outDir, "leaves"), { recursive: true });

const files = {
  "cat-yellow.svg": lib.catSVG(),
  "akita-turquoise.svg": lib.akitaSVG(),
  "plant.svg": lib.plantSVG("plant--full"),
  "seed-cube.svg": lib.seedCubeSVG(),
  "thimble.svg": lib.thimbleSVG(),
  "branch-shadow-01.svg": lib.branchShadowSVG(1),
  "branch-shadow-02.svg": lib.branchShadowSVG(2),
  "shadow-shelter.svg": lib.shadowShelterSVG(),
  "umbrella.svg": lib.umbrellaSVG(),
};
for (let i = 1; i <= 6; i++) {
  files[`leaves/leaf-0${i}.svg`] = lib.leafSVG(i);
}

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(outDir, name), resolve(svg));
}
console.log(`Exportados ${Object.keys(files).length} SVG a public/art/`);
