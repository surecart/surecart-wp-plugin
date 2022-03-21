import { Component, Method } from '@stencil/core';
import { IconLibraryMutator, IconLibraryResolver, registerIconLibrary, unregisterIconLibrary } from './library';
@Component({
  tag: 'sc-register-icon-library',
  shadow: false,
})
export class ScRegisterIconLibrary {
  @Method()
  async registerIconLibrary(name: string, options: { resolver: IconLibraryResolver; mutator?: IconLibraryMutator }) {
    return registerIconLibrary(name, options);
  }

  @Method()
  async unregisterIconLibrary(name: string) {
    return unregisterIconLibrary(name);
  }
}
