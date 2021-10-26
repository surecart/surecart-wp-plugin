import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-total',
  styleUrl: 'ce-total.css',
  shadow: false,
})
export class CeTotal {
  @Prop() total: 'total' | 'subtotal' = 'total';
  @Prop() checkoutSession: CheckoutSession;

  session_key = {
    total: 'total_amount',
    subtotal: 'subtotal_amount',
  };

  render() {
    if (!this.checkoutSession?.currency) return;
    return <ce-format-number type="currency" currency={this.checkoutSession.currency} value={this.checkoutSession?.[this.session_key[this.total]]}></ce-format-number>;
  }
}

openWormhole(CeTotal, ['checkoutSession'], false);
