/**
 * Exporta el arte canónico como SVG autónomo en public/art/.
 *
 * TypeScript compila los módulos reales a un directorio temporal CommonJS;
 * no se concatenan fuentes ni se eliminan tipos mediante expresiones regulares.
 * Las hojas de estilo necesarias se incrustan y toda var(...) se resuelve antes
 * de escribir el asset.
 *
 * Uso: node scripts/export-art.mjs
 */
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const srcRoot = join(root, "src");
const outDir = join(root, "public", "art");

const tokensCss = readFileSync(join(srcRoot, "styles", "tokens.css"), "utf8");
const charactersCss = readFileSync(
  join(srcRoot, "styles", "characters.css"),
  "utf8",
);
const plantCss = readFileSync(join(srcRoot, "styles", "plant.css"), "utf8");

const plantMarker = "/* ============ planta:";
const plantMarkerIndex = charactersCss.indexOf(plantMarker);
if (plantMarkerIndex === -1) {
  throw new Error(
    "No se encontró el límite entre estilos de personajes y planta.",
  );
}

const characterExportCss = charactersCss.slice(0, plantMarkerIndex);

function stripCssComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function collectCssVariables(...sources) {
  const variables = Object.create(null);
  const pattern = /(--[\w-]+)\s*:\s*([^;{}]+);/g;

  for (const source of sources) {
    const css = stripCssComments(source);
    for (const match of css.matchAll(pattern)) {
      variables[match[1]] = match[2].trim();
    }
  }

  return variables;
}

const cssVariables = collectCssVariables(tokensCss, plantCss);

function matchingParen(input, openingIndex, context) {
  let depth = 0;

  for (let index = openingIndex; index < input.length; index += 1) {
    if (input[index] === "(") depth += 1;
    if (input[index] !== ")") continue;
    depth -= 1;
    if (depth === 0) return index;
  }

  throw new Error("Paréntesis CSS sin cerrar en " + context + ".");
}

function splitVarArguments(expression) {
  let depth = 0;

  for (let index = 0; index < expression.length; index += 1) {
    const character = expression[index];
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character === "," && depth === 0) {
      return [
        expression.slice(0, index).trim(),
        expression.slice(index + 1).trim(),
      ];
    }
  }

  return [expression.trim(), undefined];
}

function resolveCssVariables(input, context, stack = []) {
  let output = input;
  let replacements = 0;

  while (output.includes("var(")) {
    const start = output.lastIndexOf("var(");
    const opening = start + 3;
    const closing = matchingParen(output, opening, context);
    const expression = output.slice(opening + 1, closing);
    const [name, fallback] = splitVarArguments(expression);

    if (!name.startsWith("--")) {
      throw new Error("Variable CSS inválida " + name + " en " + context + ".");
    }
    if (stack.includes(name)) {
      throw new Error(
        "Referencia circular de variables CSS en " +
          context +
          ": " +
          stack.concat(name).join(" → "),
      );
    }

    const source = cssVariables[name] ?? fallback;
    if (source === undefined || source === "") {
      throw new Error(
        "No se puede resolver " + name + " al exportar " + context + ".",
      );
    }

    const replacement = resolveCssVariables(
      source,
      context,
      stack.concat(name),
    );
    output =
      output.slice(0, start) + replacement + output.slice(closing + 1);

    replacements += 1;
    if (replacements > 10000) {
      throw new Error(
        "Demasiadas sustituciones de variables CSS en " + context + ".",
      );
    }
  }

  return output;
}

function compactCss(css) {
  return stripCssComments(css)
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .trim();
}

function injectStyle(svg, css, context) {
  if (!css) return svg;
  const openingTagEnd = svg.indexOf(">");
  if (openingTagEnd === -1) {
    throw new Error("SVG sin etiqueta de apertura en " + context + ".");
  }

  return (
    svg.slice(0, openingTagEnd + 1) +
    "\n<style type=\"text/css\"><![CDATA[\n" +
    css +
    "\n]]></style>" +
    svg.slice(openingTagEnd + 1)
  );
}

function standaloneSvg(svg, css, context) {
  let output = svg.trim();
  if (!output.startsWith("<svg") || !output.endsWith("</svg>")) {
    throw new Error("El renderer no devolvió un SVG completo para " + context + ".");
  }

  const resolvedCss = css
    ? compactCss(resolveCssVariables(css, context + " (CSS)"))
    : "";
  output = resolveCssVariables(output, context + " (markup)");
  output = injectStyle(output, resolvedCss, context);
  output = output.replace(/[ \t]+$/gm, "");

  if (/var\s*\(/.test(output)) {
    throw new Error("Quedó una variable CSS sin resolver en " + context + ".");
  }
  if (output.toLowerCase().includes(".png")) {
    throw new Error("El SVG " + context + " contiene una referencia PNG.");
  }

  return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" + output + "\n";
}

function compileCanonicalModules() {
  const entryPoints = [
    join(srcRoot, "art", "characters", "DaniCharacter.ts"),
    join(srcRoot, "art", "characters", "DiegoCharacter.ts"),
    join(srcRoot, "art", "PlantCharacter.ts"),
    join(srcRoot, "art", "svgLibrary.ts"),
  ];
  const compilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.Node10,
    rootDir: srcRoot,
    outDir: tempDir,
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
    useDefineForClassFields: true,
    noEmitOnError: true,
    sourceMap: false,
    declaration: false,
  };
  const program = ts.createProgram(entryPoints, compilerOptions);
  const diagnostics = ts.getPreEmitDiagnostics(program);

  if (diagnostics.length > 0) {
    const host = {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    };
    throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
  }

  const result = program.emit();
  if (result.emitSkipped || result.diagnostics.length > 0) {
    const host = {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    };
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(result.diagnostics, host),
    );
  }

  writeFileSync(join(tempDir, "package.json"), "{\"type\":\"commonjs\"}\n");
  mkdirSync(join(tempDir, "styles"), { recursive: true });
  writeFileSync(join(tempDir, "styles", "plant.css"), "");
}

function stateSlug(state) {
  return state
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .toLowerCase();
}

function facingForAngle(angle) {
  if (angle === "front") return "front";
  if (angle.includes("right")) return "right";
  return "left";
}

function addAsset(files, name, svg, css = "") {
  files.set(name, standaloneSvg(svg, css, name));
}

const tempDir = mkdtempSync(join(tmpdir(), "folhas-art-export-"));

try {
  compileCanonicalModules();

  const requireCompiled = createRequire(join(tempDir, "export-entry.cjs"));
  const dani = requireCompiled(
    join(tempDir, "art", "characters", "DaniCharacter.js"),
  );
  const diego = requireCompiled(
    join(tempDir, "art", "characters", "DiegoCharacter.js"),
  );
  const characterTypes = requireCompiled(
    join(tempDir, "art", "characters", "CharacterTypes.js"),
  );
  const plant = requireCompiled(
    join(tempDir, "art", "PlantCharacter.js"),
  );
  const library = requireCompiled(
    join(tempDir, "art", "svgLibrary.js"),
  );

  const files = new Map();
  const daniIdle = dani.renderDani({
    state: "idle",
    angle: "front",
    facing: "front",
    reducedMotion: true,
  });
  const diegoIdle = diego.renderDiego({
    state: "idle",
    angle: "front",
    facing: "front",
    reducedMotion: true,
  });
  const finalPlant = plant.renderPlantCharacter({
    state: "flowering",
  });

  // Nombres históricos: se conservan, pero ahora consumen renderers canónicos.
  addAsset(files, "cat-yellow.svg", daniIdle, characterExportCss);
  addAsset(files, "dani-yellow.svg", daniIdle, characterExportCss);
  addAsset(files, "akita-turquoise.svg", diegoIdle, characterExportCss);
  addAsset(files, "diego-turquoise.svg", diegoIdle, characterExportCss);
  addAsset(files, "plant.svg", finalPlant, plantCss);
  addAsset(files, "seed-cube.svg", library.seedCubeSVG());
  addAsset(files, "thimble.svg", library.thimbleSVG());
  addAsset(files, "umbrella.svg", library.umbrellaSVG());
  addAsset(files, "shadow-dani.svg", library.characterShadowSVG("dani"));
  addAsset(files, "shadow-diego.svg", library.characterShadowSVG("diego"));
  addAsset(files, "branch-shadow-01.svg", library.branchShadowSVG(1));
  addAsset(files, "branch-shadow-02.svg", library.branchShadowSVG(2));
  addAsset(files, "shadow-shelter.svg", library.shadowShelterSVG());

  for (let variant = 1; variant <= 6; variant += 1) {
    addAsset(
      files,
      "leaves/leaf-0" + variant + ".svg",
      library.leafSVG(variant),
    );
  }

  // Cada estado canónico se exporta sin mantener una segunda lista manual.
  for (const state of dani.DANI_STATES) {
    addAsset(
      files,
      "variants/dani/states/" + stateSlug(state) + ".svg",
      dani.renderDani({
        state,
        angle: "front",
        facing: "front",
        reducedMotion: true,
      }),
      characterExportCss,
    );
  }

  for (const state of diego.DIEGO_STATES) {
    addAsset(
      files,
      "variants/diego/states/" + stateSlug(state) + ".svg",
      diego.renderDiego({
        state,
        angle: "front",
        facing: "front",
        reducedMotion: true,
      }),
      characterExportCss,
    );
  }

  for (const state of plant.PLANT_STATES) {
    addAsset(
      files,
      "variants/plant/states/" + stateSlug(state) + ".svg",
      plant.renderPlantCharacter({ state }),
      plantCss,
    );
  }

  // Las vistas de modelo usan idle para que el ángulo sea la única variable.
  for (const angle of characterTypes.CHARACTER_ANGLES) {
    const facing = facingForAngle(angle);
    addAsset(
      files,
      "variants/dani/angles/" + stateSlug(angle) + ".svg",
      dani.renderDani({
        state: "idle",
        angle,
        facing,
        reducedMotion: true,
      }),
      characterExportCss,
    );
    addAsset(
      files,
      "variants/diego/angles/" + stateSlug(angle) + ".svg",
      diego.renderDiego({
        state: "idle",
        angle,
        facing,
        reducedMotion: true,
      }),
      characterExportCss,
    );
  }

  addAsset(
    files,
    "variants/dani/angles/profile-right.svg",
    dani.renderDani({
      state: "idle",
      angle: "profile",
      facing: "right",
      reducedMotion: true,
    }),
    characterExportCss,
  );
  addAsset(
    files,
    "variants/diego/angles/profile-right.svg",
    diego.renderDiego({
      state: "idle",
      angle: "profile",
      facing: "right",
      reducedMotion: true,
    }),
    characterExportCss,
  );

  rmSync(join(outDir, "variants"), { recursive: true, force: true });

  for (const [name, svg] of files) {
    const outputPath = join(outDir, name);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, svg);
  }

  const variantCount = [...files.keys()].filter((name) =>
    name.startsWith("variants/"),
  ).length;
  console.log(
    "Exportados " +
      files.size +
      " SVG autónomos a public/art/ (" +
      variantCount +
      " variantes canónicas).",
  );
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
