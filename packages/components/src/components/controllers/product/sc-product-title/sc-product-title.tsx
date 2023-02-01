import { Component, Host, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Product } from '../../../../types';

@Component({
  tag: 'sc-product-title',
  styleUrl: 'sc-product-title.css',
  shadow: true,
})
export class ScProductTitle {
  @Prop() product: Product;

  render() {
    return <Host>{this.product.name}</Host>;
  }
}

openWormhole(ScProductTitle, ['product'], false);
