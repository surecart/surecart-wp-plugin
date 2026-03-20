/**
 * External dependencies.
 */
import { Component, h, Prop, Host } from '@stencil/core';
import { __, _n } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { state } from '@store/product';
import { state as upsellState } from '@store/upsell';
import { Price, Variant } from '../../../../types';

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
    return this.renderPrice(state[this.productId].selectedPrice, variant);
  }

  renderPrice(price: Price, variant: Variant = null) {
    const originalAmount = variant?.display_amount ?? price?.display_amount ?? '';

    // maybe change for upsells.
    const amount = upsellState?.line_item?.subtotal_with_upsell_discount_amount || price?.amount;
    const upsellDisplayAmount = upsellState?.line_item?.subtotal_with_upsell_discount_display_amount;
    const displayAmount = upsellDisplayAmount ? upsellDisplayAmount : originalAmount;

    const scratchAmount = upsellState?.line_item?.subtotal_amount || price?.scratch_amount;
    const upsellScratchDisplayAmount = upsellState?.line_item?.subtotal_display_amount;
    const scratchDisplayAmount = upsellScratchDisplayAmount ? upsellScratchDisplayAmount : price?.scratch_display_amount;

    return (
      <sc-price
        currency={price?.currency}
        amount={amount}
        displayAmount={displayAmount}
        scratchAmount={scratchAmount}
        scratchDisplayAmount={scratchDisplayAmount}
        saleText={this.saleText}
        adHoc={price?.ad_hoc}
        trialDurationDays={price?.trial_duration_days}
        setupFeeText={price?.setup_fee_text}
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
