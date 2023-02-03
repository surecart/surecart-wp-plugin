import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { Price } from '../../../../types';

@Component({
  tag: 'sc-product-prices',
  styleUrl: 'sc-product-prices.css',
  shadow: true,
})
export class ScProductPrices {
  @Prop() prices: Price[];

  render() {
    if (this.prices.length === 1) {
      const price = this.prices[0];

      return (
        <div class="price">
          {!!price?.scratch_amount && (
            <sc-format-number class="scratch-price" part="price__scratch" type="currency" currency={price.currency} value={price.scratch_amount}></sc-format-number>
          )}
          <sc-format-number type="currency" value={price?.amount} currency={price?.currency} />
          {!!price?.scratch_amount && (
            <sc-tag type="primary" pill>
              {__('Sale', 'surecart')}
            </sc-tag>
          )}
        </div>
      );
    }

    return <sc-price-range prices={this.prices} />;
  }
}

openWormhole(ScProductPrices, ['prices'], false);
