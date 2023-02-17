import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'sc-product-item-price',
  styleUrl: 'sc-product-item-price.scss',
  shadow: true,
})
export class ScProductItemPrice {
  render() {
    return (
      <Host>
        <div
          class={{
            'product-item-price': true,
          }}
        >
          <strong>$545</strong>
          <span>$656</span>
        </div>
      </Host>
    );
  }
}
