import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'sc-product-collection-description',
  styleUrl: 'sc-product-collection-description.scss',
  shadow: true,
})
export class ScProductCollectionDescription {
  render() {
    return (
      <Host>
        <div
          class={{
            'product-collection-description': true,
          }}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
