import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';
import { __ } from '@wordpress/i18n';
import { getHumanDiscount } from '../../../functions/price';

@Component({
  tag: 'ce-order-confirmation-totals',
  styleUrl: 'ce-order-confirmation-totals.css',
  shadow: true,
})
export class CeOrderConfirmationTotals {
  @Prop() checkoutSession: CheckoutSession;

  renderDiscountLine() {
    if (!this.checkoutSession?.discount?.promotion?.code) {
      return null;
    }

    let humanDiscount = '';

    if (this.checkoutSession?.discount?.coupon) {
      humanDiscount = getHumanDiscount(this.checkoutSession?.discount?.coupon);
    }

    return (
      <ce-line-item style={{ marginTop: 'var(--ce-spacing-small)' }}>
        <span slot="description">
          Discount
          <br />
          {this.checkoutSession?.discount?.promotion?.code && (
            <ce-tag type="success" size="small">
              {this.checkoutSession?.discount?.promotion?.code}
            </ce-tag>
          )}
        </span>
        {humanDiscount && (
          <span class="coupon-human-discount" slot="price-description">
            ({humanDiscount})
          </span>
        )}
        <ce-format-number slot="price" type="currency" currency={this.checkoutSession?.currency} value={-this.checkoutSession?.discount_amount}></ce-format-number>
      </ce-line-item>
    );
  }

  render() {
    return (
      <div class={{ 'confirmation-summary': true }}>
        <ce-card borderless>
          <span slot="title">{__('Totals', 'checkout_engine')}</span>
          <ce-line-item-total total="subtotal">
            <span slot="description">Subtotal</span>
          </ce-line-item-total>
          {this.renderDiscountLine()}
          <ce-divider style={{ '--spacing': 'var(--ce-spacing-small)' }}></ce-divider>
          <ce-line-item-total size="large" show-currency>
            <span slot="title">Total</span>
          </ce-line-item-total>
        </ce-card>
      </div>
    );
  }
}

openWormhole(CeOrderConfirmationTotals, ['checkoutSession', 'busy', 'loading', 'empty'], false);
