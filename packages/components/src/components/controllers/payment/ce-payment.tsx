import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-payment',
  styleUrl: 'ce-payment.css',
  shadow: false,
})
export class CePayment {
  /** The current payment method for the payment */
  @Prop() paymentMethod: string = 'stripe';

  /** Checkout Session from ce-checkout. */
  @Prop() checkoutSession: CheckoutSession;

  /** Your stripe publishable key. */
  @Prop() stripePublishableKey: string;

  /** Your stripe connected account id. */
  @Prop() stripeAccountId: string;

  render() {
    if (!this.paymentMethod) {
      return <div>Please contact us for payment</div>;
    }
    if ('stripe' === this.paymentMethod) {
      return (
        <div>
          <slot name="before" />
          <ce-stripe-element checkoutSession={this.checkoutSession} stripeAccountId={this.stripeAccountId} publishableKey={this.stripePublishableKey}></ce-stripe-element>
          <slot name="after" />
        </div>
      );
    }
  }
}

openWormhole(CePayment, ['paymentMethod', 'checkoutSession'], false);
