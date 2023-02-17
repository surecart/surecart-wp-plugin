import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'sc-product-item-title',
  styleUrl: 'sc-product-item-title.scss',
  shadow: true,
})
export class ScProductItemTitle {
  render() {
    return (
      <Host>
        <div
          class={{
            'product-item-title': true,
          }}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
