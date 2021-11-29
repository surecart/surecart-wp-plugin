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
  @Prop() keys: Keys = {
    stripe: '',
  };

  render() {
    if (this.keys.stripe) {
      return (
        <ce-stripe-payment-request>
          <ce-divider style={{ '--spacing': 'var(--ce-spacing-small)' }}>
            <slot />
          </ce-divider>
        </ce-stripe-payment-request>
      );
    }
  }
}

openWormhole(CeExpressPayment, ['keys'], false);
