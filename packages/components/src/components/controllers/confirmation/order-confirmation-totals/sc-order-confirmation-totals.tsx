import { getHumanDiscount } from '../../../../functions/price';
import { Checkout } from '../../../../types';
import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-order-confirmation-totals',
  styleUrl: 'sc-order-confirmation-totals.css',
  shadow: true,
})
export class ScOrderConfirmationTotals {
  @Prop() order: Checkout;

  renderDiscountLine() {
    if (!this.order?.discount?.promotion?.code) {
      return null;
    }

    let humanDiscount = '';

    if (this.order?.discount?.coupon) {
      humanDiscount = getHumanDiscount(this.order?.discount?.coupon);
    }

    return (
      <sc-line-item style={{ marginTop: 'var(--sc-spacing-small)' }}>
        <span slot="description">
          {__('Discount', 'surecart')}
          <br />
          {this.order?.discount?.promotion?.code && (
            <sc-tag type="success" size="small">
              {this.order?.discount?.promotion?.code}
            </sc-tag>
          )}
        </span>
        {humanDiscount && (
          <span class="coupon-human-discount" slot="price-description">
            ({humanDiscount})
          </span>
        )}
        <sc-format-number slot="price" type="currency" currency={this.order?.currency} value={-this.order?.discount_amount}></sc-format-number>
      </sc-line-item>
    );
  }

  render() {
    return (
      <div class={{ 'line-item-totals': true }}>
        <sc-line-item-total order={this.order} total="subtotal">
          <span slot="description">{__('Subtotal', 'surecart')}</span>
        </sc-line-item-total>
        {this.renderDiscountLine()}

        {!!this.order?.bump_amount && (
          <sc-line-item style={{ marginTop: 'var(--sc-spacing-small)' }}>
            <span slot="description">{__('Bundle Discount', 'surecart')}</span>
            <sc-format-number slot="price" type="currency" currency={this.order?.currency} value={this.order?.bump_amount}></sc-format-number>
          </sc-line-item>
        )}

        {!!this.order?.tax_amount && (
          <sc-line-item style={{ marginTop: 'var(--sc-spacing-small)' }}>
            <span slot="description">{`${__('Tax', 'surecart')}: ${this.order?.tax_label || ''}`}</span>
            <sc-format-number slot="price" type="currency" currency={this.order?.currency} value={this.order?.tax_amount}></sc-format-number>
          </sc-line-item>
        )}

        <sc-divider style={{ '--spacing': 'var(--sc-spacing-small)' }}></sc-divider>
        <sc-line-item-total order={this.order} size="large" show-currency>
          <span slot="description">{__('Total', 'surecart')}</span>
        </sc-line-item-total>
      </div>
    );
  }
}

openWormhole(ScOrderConfirmationTotals, ['order', 'busy', 'loading', 'empty'], false);
