import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-license-activations',
  styleUrl: 'sc-license-activations.css',
  shadow: true,
})
export class ScLicenseActivations {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
