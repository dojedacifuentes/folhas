import {
  defaultState,
  sanitizeState,
  type ExperienceState,
} from "../app/state";

const KEY = "herbario-dani:v1";

export class StorageManager {
  load(): ExperienceState {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      return sanitizeState(JSON.parse(raw));
    } catch {
      return defaultState();
    }
  }

  save(state: ExperienceState): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(sanitizeState(state)));
    } catch {
      // el herbario tambien funciona sin memoria
    }
  }

  clear(): void {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // nada que limpiar
    }
  }
}
