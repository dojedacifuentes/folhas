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
  "--paper": "#f1e8d8",
  "--paper-light": "#fbf5e9",
  "--ink": "#24231f",
  "--night": "#1f2b33",
  "--yellow": "#d8ad38",
  "--yellow-soft": "#e5c769",
  "--turquoise": "#4d9691",
  "--turquoise-dark": "#34736f",
  "--sage": "#7d8b72",
  "--leaf-dry": "#986a4c",
  "--leaf-dark": "#63483a",
  "--green-new": "#718f5a",
  "--shadow": "rgba(25, 31, 31, 0.22)",
  "--shadow-deep": "rgba(16, 22, 24, 0.36)",
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
};
for (let i = 1; i <= 6; i++) {
  files[`leaves/leaf-0${i}.svg`] = lib.leafSVG(i);
}

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(outDir, name), resolve(svg));
}
console.log(`Exportados ${Object.keys(files).length} SVG a public/art/`);
