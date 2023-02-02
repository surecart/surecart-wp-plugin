import { Component, Host, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Product } from '../../../../types';

@Component({
  tag: 'sc-product-text',
  styleUrl: 'sc-product-text.css',
  shadow: true,
})
export class ScProductText {
  @Prop() product: Product;
  @Prop() text: 'name' | 'description' = 'name';

  render() {
    if (this.product?.[this.text]) {
      return this.product[this.text];
    }
    return (
      <Host>
        <slot />
      </Host>
    );
  }
}

openWormhole(ScProductText, ['product'], false);
