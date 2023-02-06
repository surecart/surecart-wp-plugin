import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-product-price-choices',
  styleUrl: 'sc-product-price-choices.css',
  shadow: true,
})
export class ScProductPriceChoices {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
