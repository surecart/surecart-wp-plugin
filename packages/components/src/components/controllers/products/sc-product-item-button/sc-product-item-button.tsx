import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'sc-product-item-button',
  styleUrl: 'sc-product-item-button.scss',
  shadow: true,
})
export class ScProductItemButton {
  render() {
    return (
      <Host>
        <div
          class={{
            'product-item-button': true,
          }}
        >
          <sc-button full={false} type="primary">
            Add to cart
          </sc-button>
        </div>
      </Host>
    );
  }
}
