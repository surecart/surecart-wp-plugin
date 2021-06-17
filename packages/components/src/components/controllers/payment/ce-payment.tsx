import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-payment',
  styleUrl: 'ce-payment.css',
  shadow: false,
})
export class CePayment {
  @Prop() paymentMethod: string = 'stripe';
  @Prop() stripePublishableKey: string;

  render() {
    if (!this.paymentMethod) {
      return <div>Please contact us for payment</div>;
    }
    if ('stripe' === this.paymentMethod) {
      return <ce-stripe-element publishable-key={this.stripePublishableKey}></ce-stripe-element>;
    }
  }
}

openWormhole(CePayment, ['paymentMethod', 'stripePublishableKey']);
