import { Component, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';

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

  order_key = {
    total: 'total_display_amount',
    subtotal: 'subtotal_display_amount',
    amount_due: 'amount_due_display_amount',
  };

  render() {
    if (!checkoutState?.checkout?.currency) return;
    if (!checkoutState?.checkout?.line_items?.data?.length) return;
    return checkoutState?.checkout?.[ORDER_KEYS[this.total]] || '';
  }
}
