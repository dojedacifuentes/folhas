/**
 * Selección de líneas de diálogo sin repetición inmediata.
 * El contenido vive en content.ts; aquí solo se elige con memoria corta,
 * para que cada personaje conserve su voz sin sonar a disco rayado.
 */

const lastByPool = new Map<readonly string[], string>();

/** Devuelve una línea del pool, evitando repetir la última entregada. */
export function pickLine(pool: readonly string[]): string {
  if (pool.length === 0) return "";
  if (pool.length === 1) return pool[0];
  const last = lastByPool.get(pool);
  let line = pool[Math.floor(Math.random() * pool.length)];
  if (line === last) {
    line = pool[(pool.indexOf(line) + 1) % pool.length];
  }
  lastByPool.set(pool, line);
  return line;
}
