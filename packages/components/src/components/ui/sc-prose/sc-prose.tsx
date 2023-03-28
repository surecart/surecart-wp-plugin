import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-prose',
  styleUrl: 'sc-prose.css',
  shadow: true,
})
export class ScProse {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
