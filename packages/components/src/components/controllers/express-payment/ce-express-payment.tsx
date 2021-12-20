import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-express-payment',
  styleUrl: 'ce-express-payment.css',
  shadow: false,
})
export class CeExpressPayment {
  @Prop() processor: 'stripe' | 'paypal';
  @Prop() formId: number | string;
  @Prop() checkoutSession: CheckoutSession;

  render() {
    if (this?.checkoutSession?.processor_data?.stripe?.publishable_key || !this?.checkoutSession?.processor_data?.stripe?.account_id) {
      return null;
    }

    return (
      <ce-stripe-payment-request formId={this.formId}>
        <ce-divider style={{ '--spacing': 'var(--ce-spacing-small)' }}>
          <slot />
        </ce-divider>
      </ce-stripe-payment-request>
    );
  }
}

openWormhole(CeExpressPayment, ['checkoutSession', 'formId'], false);
