import { Component, h, Prop, Host } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession, Keys } from '../../../types';

@Component({
  tag: 'ce-payment',
  styleUrl: 'ce-payment.scss',
  shadow: false,
})
export class CePayment {
  /** The current payment method for the payment */
  @Prop() processor: string = 'stripe';

  /** Checkout Session from ce-checkout. */
  @Prop() checkoutSession: CheckoutSession;

  /** Your stripe publishable key. */
  @Prop() keys: Keys = {
    stripe: '',
    stripeAccountId: '',
    paypal: '',
  };

  /** Your stripe connected account id. */
  @Prop() stripeAccountId: string;

  /** Is this created in "test" mode */
  @Prop() mode: 'test' | 'live' = 'live';

  /** Secure notice */
  @Prop() secureNotice: string;

  /** The input's label. */
  @Prop() label: string;

  /** Payment mode inside individual payment method (i.e. Payment Buttons) */
  @Prop() paymentMethod: 'stripe-payment-request' | null;

  render() {
    if (!this.processor) {
      return <div>Please contact us for payment</div>;
    }
    if ('stripe' === this.processor) {
      return (
        <Host>
          <ce-stripe-element
            label={this.label}
            checkoutSession={this.checkoutSession}
            stripeAccountId={this.keys.stripeAccountId}
            publishableKey={this.keys.stripe}
            disabled={!!this.paymentMethod}
          ></ce-stripe-element>
          <ce-secure-notice>
            <slot>{this.secureNotice}</slot>
          </ce-secure-notice>
        </Host>
      );
    }
  }
}

openWormhole(CePayment, ['processor', 'checkoutSession', 'mode', 'keys', 'paymentMethod'], false);
