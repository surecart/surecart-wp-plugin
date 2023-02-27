import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sc-product-selected-price',
  styleUrl: 'sc-product-selected-price.scss',
  shadow: true,
})
export class ScProductSelectedPrice {
  render() {
    return (
      <Host>
        <div class="selected-price">
          <span class="selected-price__price">$179 USD</span>
          <span class="selected-price__interval"> / every 3 months</span>
        </div>
      </Host>
    );
  }
}
