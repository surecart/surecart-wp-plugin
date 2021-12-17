import { CeIcon } from './ce-icon';

export type IconLibraryResolver = (name: string) => string;
export type IconLibraryMutator = (svg: SVGElement) => void;
export interface IconLibrary {
  name: string;
  resolver: IconLibraryResolver;
  mutator?: IconLibraryMutator;
}

let registry: IconLibrary[] = [];
let watchedIcons: CeIcon[] = [];

export function watchIcon(icon: CeIcon) {
  watchedIcons.push(icon);
}

export function unwatchIcon(icon: CeIcon) {
  watchedIcons = watchedIcons.filter(el => el !== icon);
}

export function getIconLibrary(name?: string) {
  console.log('get', { registry });
  return registry.filter(lib => lib.name === name)[0];
}

export function registerIconLibrary(name: string, options: { resolver: IconLibraryResolver; mutator?: IconLibraryMutator }) {
  unregisterIconLibrary(name);
  registry.push({
    name,
    resolver: options.resolver,
    mutator: options.mutator,
  });
  // Redraw watched icons
  watchedIcons.map(icon => {
    if (icon.library === name) {
      icon.redraw();
    }
  });
}

export function unregisterIconLibrary(name: string) {
  registry = registry.filter(lib => lib.name !== name);
}

window.ceRegisterIconLibrary = registerIconLibrary;
