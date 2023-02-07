import { Component, h, Prop, Watch } from '@stencil/core';
import { Product } from '../../../../types';
import state from '../../../../store/product';

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
    state.selectedPrice = this.product?.prices?.data?.[0];
  }

  render() {
    return (
      <div
        class={{
          'product-info': true,
          'product-info__no-media': !state.product?.image_url,
          'product-info__has-media-right': this.mediaPosition === 'right',
        }}
        part="base"
      >
        {state.product?.image_url ? (
          <sc-columns style={{ '--sc-column-spacing': this.columnGap }}>
            <sc-column class="media-column" style={{ flexBasis: this.mediaWidth }}>
              <sc-product-image />
            </sc-column>
            <sc-column>
              <div class="product-info__content">
                <slot />
              </div>
            </sc-column>
          </sc-columns>
        ) : (
          <div class="product-info__content">
            <slot />
          </div>
        )}
      </div>
    );
  }
}
