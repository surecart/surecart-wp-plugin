import { Component, h, Prop, Watch } from '@stencil/core';
import { Product } from '../../../../types';
import { state } from '@store/product';
import { availablePrices } from '@store/product/getters';

@Component({
  tag: 'sc-product',
  styleUrl: 'sc-product.scss',
  shadow: true,
})
export class ScProduct {
  /** The product. */
  @Prop() product: Product;

  /** The form id to use for the cart. */
  @Prop({ reflect: true }) formId: number;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The media position. */
  @Prop() mediaPosition: 'left' | 'right' = 'left';

  /** The media width. */
  @Prop() mediaWidth: string = '65%';

  @Prop() columnGap: string = '2em';

  componentWillLoad() {
    this.handleProductChange();
    state.formId = this.formId;
    state.mode = this.mode;
  }

  @Watch('product')
  handleProductChange() {
    state.product = this.product;
    state.prices = this.product?.prices?.data || [];
    state.selectedPrice = (availablePrices() || [])[0];
  }

  render() {
    return (
      <div
        class={{
          'product-info': true,
        }}
        part="base"
      >
        <div class="product-info__content">
          <slot />
        </div>
      </div>
    );
  }
}
