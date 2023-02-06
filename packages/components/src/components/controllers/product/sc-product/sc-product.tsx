import { Component, h, Prop } from '@stencil/core';
import { Product } from '../../../../types';
import state from '../../../../store/product';

@Component({
  tag: 'sc-product',
  styleUrl: 'sc-product.css',
  shadow: true,
})
export class ScProduct {
  /** The product. */
  @Prop() product: Product;

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: number;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  componentWillLoad() {
    state.product = this.product;
    state.prices = this.product?.prices?.data || [];
    state.selectedPrice = this.product?.prices?.data?.[0];
    state.formId = this.formId;
    state.mode = this.mode;
  }

  render() {
    return (
      <div part="base">
        <slot />
      </div>
    );
  }
}
