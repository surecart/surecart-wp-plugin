import { Component, h, Prop } from '@stencil/core';
import { Product } from '../../../../types';
import state from '../../../../store/product';

@Component({
  tag: 'sc-product',
  styleUrl: 'sc-product.css',
  shadow: true,
})
export class ScProduct {
  @Prop() product: Product;

  componentWillLoad() {
    state.product = this.product;
    state.prices = this.product?.prices?.data || [];
    state.selectedPrice = this.product?.prices?.data?.[0];
  }

  render() {
    return (
      <div part="base">
        <slot />
      </div>
    );
  }
}
