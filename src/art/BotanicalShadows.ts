import { branchShadowSVG } from "./svgLibrary";

/**
 * Crea una capa de sombras botánicas ambientales
 * (dos ramas grandes que derivan lentamente).
 */
export function createBotanicalShadows(variantClass = ""): HTMLElement {
  const layer = document.createElement("div");
  layer.className = `shadow-layer ${variantClass}`;
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = `
    <div class="shadow-drift shadow-drift--a">${branchShadowSVG(1)}</div>
    <div class="shadow-drift shadow-drift--b">${branchShadowSVG(2)}</div>
  `;
  return layer;
}
