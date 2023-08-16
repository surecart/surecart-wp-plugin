import { Component, h, Prop } from '@stencil/core';
import { Price, ProductMetrics } from 'src/types';

@Component({
  tag: 'sc-product-item-price',
  styleUrl: 'sc-product-item-price.scss',
  shadow: true,
})
export class ScProductItemPrice {
  /* Prices */
  @Prop() prices: Price[];

  /** Show price range? */
  @Prop() range: boolean = true;

  /** Product metrics */
  @Prop() metrics: ProductMetrics;

  /** Has variant? */
  @Prop() hasVariant: boolean = false;

  componentWillLoad() {
    // If variant product, then generate a price range.
    if (this.range && this.metrics?.prices_count > 1 && this.hasVariant) {
      const dummyPriceAttributes = {
        id: '',
        name: '',
        recurring: false,
        ad_hoc: false,
        ad_hoc_max_amount: 0,
        ad_hoc_min_amount: 0,
        scratch_amount: 0,
        setup_fee_enabled: false,
        setup_fee_amount: 0,
        setup_fee_name: '',
        setup_fee_trial_enabled: false,
        recurring_period_count: 0,
        archived: false,
        created_at: 0,
        updated_at: 0,
        position: 0,
        metadata: {},
      };

      // only currency and amount is necessary for the price range component.
      this.prices = [
        {
          amount: this.metrics?.min_price_amount,
          currency: this.metrics?.currency,
          ...dummyPriceAttributes,
        },
        {
          amount: this.metrics?.max_price_amount,
          currency: this.metrics?.currency,
          ...dummyPriceAttributes,
        },
      ];
    }
  }

  render() {
    const price = (this.prices || []).sort((a, b) => a?.position - b?.position).find(price => !price?.archived);
    return (
      <div class="product-price" part="base">
        {!this.range && this.prices?.length ? (
          <sc-format-number type="currency" currency={price?.currency || 'usd'} value={price?.amount}></sc-format-number>
        ) : (
          <sc-price-range prices={this.prices}></sc-price-range>
        )}
      </div>
    );
  }
}
