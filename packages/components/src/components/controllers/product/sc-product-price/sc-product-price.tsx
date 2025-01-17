/**
 * External dependencies.
 */
import { Component, h, Prop, Host } from '@stencil/core';
import { __, _n } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state } from '@store/product';
import { Price, Variant } from '../../../../types';
import { getDiscountedAmount as getUpsellDiscountAmount, getScratchAmount as getUpsellScratchAmount } from '@store/upsell/getters';

@Component({
  tag: 'sc-product-price',
  styleUrl: 'sc-product-price.scss',
  shadow: true,
})
export class ScProductPrice {
  /** The product's prices. */
  @Prop() prices: Price[];

  /** The sale text */
  @Prop() saleText: string;

  /** The product id */
  @Prop() productId: string;

  renderRange() {
    return state[this.productId]?.range_display_amount;
  }

  renderVariantPrice(selectedVariant: Variant) {
    const variant = state[this.productId]?.variants?.find(variant => variant?.id === selectedVariant?.id);
    return this.renderPrice(state[this.productId].selectedPrice, variant?.amount);
  }

  renderPrice(price: Price, variantAmount?: number) {
    const originalAmount = variantAmount ?? price?.amount ?? 0;

    const amount = getUpsellDiscountAmount(originalAmount);
    const scratch_amount = getUpsellScratchAmount(price?.scratch_amount);

    return (
      <sc-price
        currency={price?.currency}
        amount={amount}
        scratchAmount={scratch_amount}
        saleText={this.saleText}
        adHoc={price?.ad_hoc}
        trialDurationDays={price?.trial_duration_days}
        setupFeeAmount={price?.setup_fee_enabled ? price?.setup_fee_amount : null}
        setupFeeName={price?.setup_fee_enabled ? price?.setup_fee_name : null}
        recurringPeriodCount={price?.recurring_period_count}
        recurringInterval={price?.recurring_interval}
        recurringIntervalCount={price?.recurring_interval_count}
      />
    );
  }

  render() {
    return (
      <Host role="paragraph">
        {(() => {
          if (state[this.productId]?.selectedVariant) {
            return this.renderVariantPrice(state[this.productId]?.selectedVariant);
          }

          if (state[this.productId]?.selectedPrice) {
            return this.renderPrice(state[this.productId].selectedPrice);
          }

          if (state[this.productId]?.prices?.length) {
            return this.renderRange();
          }

          return <slot />;
        })()}
      </Host>
    );
  }
}
