import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-payment-request',
  styleUrl: 'ce-payment-request.css',
  shadow: false,
})
export class CePaymentRequest {
  @Prop() paymentMethod: 'stripe' | 'paypal';

  render() {
    if (!this.paymentMethod) {
      return;
    }

    if ('stripe' === this.paymentMethod) {
      return (
        <ce-stripe-payment-request>
          <ce-divider>
            <slot />
          </ce-divider>
        </ce-stripe-payment-request>
      );
    }
  }
}

openWormhole(CePaymentRequest, ['paymentMethod'], false);
