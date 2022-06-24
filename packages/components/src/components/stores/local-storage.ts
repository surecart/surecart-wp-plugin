import { createLocalStore } from 'stencil-store-storage';

export type MinimumStorage = Pick<Storage, 'getItem' | 'setItem'>;

const safeRead = <T extends object>(storage: MinimumStorage, key: string): T | null => {
  try {
    return JSON.parse(storage.getItem(key));
  } catch {
    return null;
  }
};

export const createStore = <T extends object>(storage: MinimumStorage, key: string, defaultValues: T, syncAcrossTabs = true) => {
  window.addEventListener('storage', () => {
    const currentState = safeRead<T>(storage, key);

    if (currentState === null) {
      return;
    }

    for (const key in currentState) {
      store.set(key, currentState[key]);
    }
  });

  return createLocalStore(key, defaultValues, sync);
};
