import { Component, h, Host, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

import { Product } from '../../../../types';

@Component({
  tag: 'sc-product-image',
  styleUrl: 'sc-product-image.css',
  shadow: true,
})
export class ScProductImage {
  @Prop() product: Product;

  render() {
    if (this.product?.image_url) {
      return <img src={this.product?.image_url} style={{ maxWidth: '100%', height: 'auto' }} />;
    }
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}

openWormhole(ScProductImage, ['product'], false);
