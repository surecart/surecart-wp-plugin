import { getIconLibrary, registerIconLibrary, unregisterIconLibrary, watchIcon, unwatchIcon } from '../library';

const REGISTRY_KEY = 'scIconLibraries';

const noopResolver = (name: string) => `${name}.svg`;

describe('icon library registry', () => {
  // Track every icon we attach so afterEach can clean module state.
  const watched: Array<{ library: string; redraw: () => void }> = [];

  function attach(library: string, redraw: () => void) {
    const icon = { library, redraw };
    watchIcon(icon);
    watched.push(icon);
    return icon;
  }

  beforeEach(() => {
    delete (window as any)[REGISTRY_KEY];
  });

  afterEach(() => {
    while (watched.length) unwatchIcon(watched.pop()!);
    delete (window as any)[REGISTRY_KEY];
  });

  describe('register / unregister', () => {
    it('registers a library and getIconLibrary returns it by name', () => {
      registerIconLibrary('default', { resolver: noopResolver });
      const lib = getIconLibrary('default');
      expect(lib?.name).toBe('default');
      expect(lib?.resolver('plus')).toBe('plus.svg');
    });

    it('re-registering the same name replaces instead of duplicating', () => {
      registerIconLibrary('default', { resolver: () => 'first' });
      registerIconLibrary('default', { resolver: () => 'second' });
      expect((window as any)[REGISTRY_KEY]).toHaveLength(1);
      expect(getIconLibrary('default')?.resolver('x')).toBe('second');
    });

    it('unregisterIconLibrary removes only the named entry', () => {
      registerIconLibrary('default', { resolver: noopResolver });
      registerIconLibrary('admin', { resolver: noopResolver });
      unregisterIconLibrary('default');
      expect(getIconLibrary('default')).toBeUndefined();
      expect(getIconLibrary('admin')).toBeDefined();
    });
  });

  describe('watcher redraw lifecycle', () => {
    it('does not fire redraw for watchers of a different library', () => {
      const redraw = jest.fn();
      attach('admin', redraw);
      registerIconLibrary('default', { resolver: noopResolver });
      expect(redraw).not.toHaveBeenCalled();
    });

    it('does not fire redraw after unwatchIcon', () => {
      const redraw = jest.fn();
      const icon = { library: 'default', redraw };
      watchIcon(icon);
      unwatchIcon(icon);
      registerIconLibrary('default', { resolver: noopResolver });
      expect(redraw).not.toHaveBeenCalled();
    });
  });

  describe('collision safety', () => {
    it.each([
      ['non-array object', { stolen: true }],
      ['null', null],
      ['number', 42],
      ['string', 'hijacked'],
    ])('getIconLibrary returns undefined when scIconLibraries is %s', (_label, value) => {
      (window as any)[REGISTRY_KEY] = value;
      expect(() => getIconLibrary('default')).not.toThrow();
      expect(getIconLibrary('default')).toBeUndefined();
    });

    it('getIconLibrary survives a hostile proxy that throws on access', () => {
      (window as any)[REGISTRY_KEY] = new Proxy([], {
        get(_target, prop) {
          if (prop === 'find' || prop === 'filter') throw new Error('hostile proxy');
          return Reflect.get(_target, prop);
        },
      });
      expect(() => getIconLibrary('default')).not.toThrow();
      expect(getIconLibrary('default')).toBeUndefined();
    });

    it('registerIconLibrary recovers from a non-array collision', () => {
      (window as any)[REGISTRY_KEY] = { stolen: true };
      registerIconLibrary('default', { resolver: noopResolver });
      expect(Array.isArray((window as any)[REGISTRY_KEY])).toBe(true);
      expect(getIconLibrary('default')?.name).toBe('default');
    });
  });
});
