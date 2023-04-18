import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Price } from '../../../../types';
import { state } from '@store/product';

@Component({
  tag: 'sc-product-price',
  styleUrl: 'sc-product-price.css',
  shadow: true,
})
export class ScProductPrice {
  @Prop() prices: Price[];

  renderRange() {
    if (state.prices.length === 1) {
      return this.renderPrice(state.prices[0]);
    }
    return <sc-price-range prices={state.prices} />;
  }

  renderPrice(price) {
    return (
      <div class="price">
        {!!price?.scratch_amount && (
          <sc-format-number class="scratch-price" part="price__scratch" type="currency" currency={price.currency} value={price.scratch_amount}></sc-format-number>
        )}
        <sc-format-number type="currency" value={price?.amount} currency={price?.currency} />
        {!!price?.scratch_amount && (
          <sc-tag type="primary" pill class="sale-badge">
            {__('Sale', 'surecart')}
          </sc-tag>
        )}
      </div>
    );
  }

  render() {
    if (state.selectedPrice) {
      return this.renderPrice(state.selectedPrice);
    }

    if (state.prices.length) {
      return this.renderRange();
    }

    return <slot />;
  }
}
