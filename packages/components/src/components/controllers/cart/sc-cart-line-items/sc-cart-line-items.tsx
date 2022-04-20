import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-cart-line-items',
  styleUrl: 'sc-cart-line-items.css',
  shadow: true,
})
export class ScCartLineItems {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
