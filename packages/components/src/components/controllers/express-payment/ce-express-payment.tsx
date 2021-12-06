import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { Keys } from '../../../types';

@Component({
  tag: 'ce-express-payment',
  styleUrl: 'ce-express-payment.css',
  shadow: false,
})
export class CeExpressPayment {
  sPayment;
  @Prop() processor: 'stripe' | 'paypal';
  @Prop() formId: number | string;
  @Prop() keys: Keys = {
    stripe: '',
  };

  render() {
    if (this.keys.stripe) {
      return (
        <ce-stripe-payment-request formId={this.formId}>
          <ce-divider style={{ '--spacing': 'var(--ce-spacing-small)' }}>
            <slot />
          </ce-divider>
        </ce-stripe-payment-request>
      );
    }
  }
}

openWormhole(CeExpressPayment, ['keys', 'formId'], false);
