import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'sc-product-collection-title',
  styleUrl: 'sc-product-collection-title.scss',
  shadow: true,
})
export class ScProductollectionTitle {
  render() {
    return (
      <Host>
        <div
          class={{
            'product-collection-title': true,
          }}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
