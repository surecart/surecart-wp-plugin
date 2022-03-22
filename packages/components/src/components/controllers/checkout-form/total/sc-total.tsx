import { Order } from '../../../../types';
import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'sc-total',
  styleUrl: 'sc-total.css',
  shadow: false,
})
export class ScTotal {
  @Prop() total: 'total' | 'subtotal' | 'amount_due' = 'amount_due';
  @Prop() order: Order;

  order_key = {
    total: 'total_amount',
    subtotal: 'subtotal_amount',
    amount_due: 'amount_due',
  };

  render() {
    if (!this.order?.currency) return;
    if (!this.order?.line_items?.data?.length) return;
    return <sc-format-number type="currency" currency={this.order.currency} value={this.order?.[this.order_key[this.total]]}></sc-format-number>;
  }
}

openWormhole(ScTotal, ['order'], false);
