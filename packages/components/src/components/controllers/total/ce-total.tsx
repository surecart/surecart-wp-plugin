import { Order } from '../../../types';
import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-total',
  styleUrl: 'ce-total.css',
  shadow: false,
})
export class CeTotal {
  @Prop() total: 'total' | 'subtotal' = 'total';
  @Prop() order: Order;

  session_key = {
    total: 'total_amount',
    subtotal: 'subtotal_amount',
  };

  render() {
    if (!this.order?.currency) return;
    if (!this.order?.line_items?.data?.length) return;
    return <ce-format-number type="currency" currency={this.order.currency} value={this.order?.[this.session_key[this.total]]}></ce-format-number>;
  }
}

openWormhole(CeTotal, ['order'], false);
