import { getHumanDiscount } from '../../../../functions/price';
import { Order } from '../../../../types';
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-confirmation-totals',
  styleUrl: 'ce-order-confirmation-totals.css',
  shadow: true,
})
export class CeOrderConfirmationTotals {
  @Prop() order: Order;

  renderDiscountLine() {
    if (!this.order?.discount?.promotion?.code) {
      return null;
    }

    let humanDiscount = '';

    if (this.order?.discount?.coupon) {
      humanDiscount = getHumanDiscount(this.order?.discount?.coupon);
    }

    return (
      <ce-line-item style={{ marginTop: 'var(--ce-spacing-small)' }}>
        <span slot="description">
          {__('Discount', 'checkout_engine')}
          <br />
          {this.order?.discount?.promotion?.code && (
            <ce-tag type="success" size="small">
              {this.order?.discount?.promotion?.code}
            </ce-tag>
          )}
        </span>
        {humanDiscount && (
          <span class="coupon-human-discount" slot="price-description">
            ({humanDiscount})
          </span>
        )}
        <ce-format-number slot="price" type="currency" currency={this.order?.currency} value={-this.order?.discount_amount}></ce-format-number>
      </ce-line-item>
    );
  }

  render() {
    return (
      <div class={{ 'line-item-totals': true }}>
        <ce-line-item-total order={this.order} total="subtotal">
          <span slot="description">{__('Subtotal', 'checkout_engine')}</span>
        </ce-line-item-total>
        {this.renderDiscountLine()}
        <ce-divider style={{ '--spacing': 'var(--ce-spacing-small)' }}></ce-divider>
        <ce-line-item-total order={this.order} size="large" show-currency>
          <span slot="description">{__('Total', 'checkout_engine')}</span>
        </ce-line-item-total>
      </div>
    );
  }
}

openWormhole(CeOrderConfirmationTotals, ['order', 'busy', 'loading', 'empty'], false);
