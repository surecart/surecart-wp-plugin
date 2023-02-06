import { Component, h, Host, Prop } from '@stencil/core';
import { Product } from '../../../../types';
import state from '../../../../store/product';

@Component({
  tag: 'sc-product-image',
  styleUrl: 'sc-product-image.css',
  shadow: true,
})
export class ScProductImage {
  @Prop() product: Product;

  render() {
    if (state.product?.image_url) {
      return <img src={state.product?.image_url} style={{ maxWidth: '100%', height: 'auto' }} />;
    }
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}
