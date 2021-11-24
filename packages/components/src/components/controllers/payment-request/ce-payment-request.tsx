import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-payment-request',
  styleUrl: 'ce-payment-request.css',
  shadow: false,
})
export class CePaymentRequest {
  @Prop() processor: 'stripe' | 'paypal';

  render() {
    if (!this.processor) {
      return;
    }

    if ('stripe' === this.processor) {
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

openWormhole(CePaymentRequest, ['processor'], false);
