import { Component, Method } from '@stencil/core';
import { IconLibraryMutator, IconLibraryResolver, registerIconLibrary, unregisterIconLibrary } from './library';
@Component({
  tag: 'ce-register-icon-library',
  shadow: false,
})
export class CeRegisterIconLibrary {
  @Method()
  async registerIconLibrary(name: string, options: { resolver: IconLibraryResolver; mutator?: IconLibraryMutator }) {
    return registerIconLibrary(name, options);
  }

  @Method()
  async unregisterIconLibrary(name: string) {
    return unregisterIconLibrary(name);
  }
}
