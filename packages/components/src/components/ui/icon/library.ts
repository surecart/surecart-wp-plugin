import { IconLibrary, IconLibraryOptions, IconLibraryMutator, IconLibraryResolver } from '../../../types';

// Re-export for back-compat with any external consumers importing from here.
export type { IconLibrary, IconLibraryOptions, IconLibraryMutator, IconLibraryResolver };

interface WatchedIcon {
  library: string;
  redraw: () => void;
}

// Namespaced key to avoid colliding with `window.registry` from other plugins.
const REGISTRY_KEY = 'scIconLibraries';
const EVENT_REGISTERED = 'surecart:icon-library-registered';

const win = typeof window !== 'undefined' ? window : undefined;
const watchedIcons = new Set<WatchedIcon>();

function readRegistry(): IconLibrary[] {
  if (!win) return [];
  return Array.isArray(win[REGISTRY_KEY]) ? win[REGISTRY_KEY] : [];
}

function writeRegistry(next: IconLibrary[]): void {
  if (!win) return;
  win[REGISTRY_KEY] = next;
}

function redrawForLibrary(name: string): void {
  watchedIcons.forEach(icon => {
    if (icon.library === name) icon.redraw();
  });
}

export function watchIcon(icon: WatchedIcon) {
  watchedIcons.add(icon);
}

export function unwatchIcon(icon: WatchedIcon) {
  watchedIcons.delete(icon);
}

export function getIconLibrary(name?: string): IconLibrary | undefined {
  // Must never throw — a throw inside sc-icon's componentWillLoad breaks
  // Stencil's lazy loader and surfaces as "Constructor for sc-*#undefined".
  try {
    return readRegistry().find(lib => lib?.name === name);
  } catch {
    return undefined;
  }
}

export function registerIconLibrary(name: string, options: IconLibraryOptions) {
  // Read-modify-write so concurrent bundles compose instead of clobbering.
  const next = readRegistry().filter(lib => lib?.name !== name);
  next.push({ name, ...options });
  writeRegistry(next);

  // Notify all bundles — listener below handles redraws.
  try {
    win?.dispatchEvent(new CustomEvent(EVENT_REGISTERED, { detail: { name } }));
  } catch {}
}

export function unregisterIconLibrary(name: string) {
  writeRegistry(readRegistry().filter(lib => lib?.name !== name));
}

win?.addEventListener?.(EVENT_REGISTERED, (e: Event) => {
  const name = (e as CustomEvent<{ name: string }>).detail?.name;
  if (name) redrawForLibrary(name);
});

if (win) win.ceRegisterIconLibrary = registerIconLibrary;
