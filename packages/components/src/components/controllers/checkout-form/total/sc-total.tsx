import { Component, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { Checkout } from '../../../../types';

const ORDER_KEYS = {
  total: 'total_display_amount',
  subtotal: 'subtotal_display_amount',
  amount_due: 'amount_due_display_amount',
};

@Component({
  tag: 'sc-total',
  styleUrl: 'sc-total.css',
  shadow: false,
})
export class ScTotal {
  @Prop() total: 'total' | 'subtotal' | 'amount_due' = 'amount_due';
  @Prop() checkout: Checkout;

  order_key = {
    total: 'total_display_amount',
    subtotal: 'subtotal_display_amount',
    amount_due: 'amount_due_display_amount',
  };

  render() {
    const checkoutData = this.checkout || checkoutState?.checkout;
    if (!checkoutData?.currency) return;
    if (!checkoutData?.line_items?.data?.length) return;
    return checkoutData?.[ORDER_KEYS[this.total]] || '';
  }
}
