import { Component, h, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { __ } from '@wordpress/i18n';
import { formBusy } from '@store/form/getters';
import { Checkout } from '../../../../types';

@Component({
  tag: 'sc-line-item-total',
  styleUrl: 'sc-line-item-total.scss',
  shadow: true,
})
export class ScLineItemTotal {
  @Prop() total: 'total' | 'subtotal' = 'total';
  @Prop() size: 'large' | 'medium';
  @Prop() checkout: Checkout;

  order_key = {
    total: 'total_amount',
    subtotal: 'subtotal_amount',
    amount_due: 'amount_due',
  };

  render() {
    const checkout = this.checkout || checkoutState?.checkout;
    // loading state
    if (formBusy() && !checkout?.[this?.order_key?.[this?.total]]) {
      return (
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', 'height': this.size === 'large' ? '40px' : '', '--border-radius': '6px' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    if (!checkout?.currency) return;

    // if the total amount is different than the amount due.
    if (this.total === 'total' && checkout?.total_amount !== checkout?.amount_due) {
      return (
        <div class="line-item-total__group">
          <sc-line-item>
            <span slot="description">
              <slot name="title" />
              <slot name="description" />
            </span>
            <span slot="price">
              <sc-total order={checkout} total={this.total}></sc-total>
            </span>
          </sc-line-item>
          <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
            <span slot="title">
              <slot name="subscription-title">{__('Total Due Today', 'surecart')}</slot>
            </span>
            <span slot="price">
              <sc-format-number type="currency" currency={checkout?.currency} value={checkout?.amount_due}></sc-format-number>
            </span>
          </sc-line-item>
        </div>
      );
    }

    return (
      <sc-line-item style={this.size === 'large' ? { '--price-size': 'var(--sc-font-size-x-large)' } : {}}>
        <span slot="title">
          <slot name="title" />
        </span>
        <span slot="description">
          <slot name="description" />
        </span>
        <span slot="price">
          {!!checkout?.total_savings_amount && this.total === 'total' && (
            <sc-format-number class="scratch-price" type="currency" value={-checkout?.total_savings_amount + checkout?.total_amount} currency={checkout?.currency || 'usd'} />
          )}
          <sc-total class="total-price" order={checkout} total={this.total}></sc-total>
        </span>
      </sc-line-item>
    );
  }
}
