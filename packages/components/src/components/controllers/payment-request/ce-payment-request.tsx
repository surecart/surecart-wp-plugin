import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-payment-request',
  styleUrl: 'ce-payment-request.css',
  shadow: false,
})
export class CePaymentRequest {
  @Prop() paymentMethod: 'stripe' | 'paypal';
  @Prop() total: number;
  @Prop() stripePublishableKey: string;
  @Prop() stripeAccountId: string;

  render() {
    if (!this.paymentMethod) {
      return;
    }

    if ('stripe' === this.paymentMethod) {
      return (
        <ce-stripe-payment-request amount={this.total} publishable-key={this.stripePublishableKey}>
          <ce-divider>Or</ce-divider>
        </ce-stripe-payment-request>
      );
    }
  }
}

openWormhole(CePaymentRequest, ['total', 'paymentMethod', 'stripePublishableKey'], false);
