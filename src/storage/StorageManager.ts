import { defaultState, type ExperienceState } from "../app/state";

const KEY = "herbario-dani:v1";

export class StorageManager {
  load(): ExperienceState {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw) as Partial<ExperienceState>;
      return { ...defaultState(), ...parsed };
    } catch {
      return defaultState();
    }
  }

  save(state: ExperienceState): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // el herbario también funciona sin memoria
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
