import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.scss',
  shadow: true,
})
export class CEOrderSummary {
  @Prop() calculating: boolean;
  @Prop() loading: boolean;
  @Prop() empty: boolean;
  @Prop() checkoutSession: CheckoutSession;

  // isEmpty() {
  //   return !this.loading && !this.checkoutSession?.line_items?.length;
  // }

  render() {
    return (
      <div class="summary">
        <div
          class={{
            summary__content: true,
            hidden: this.empty,
          }}
        >
          <slot />
        </div>
        {this.empty && <p>Your cart is empty.</p>}
        {this.calculating && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CEOrderSummary, ['checkoutSession', 'calculating', 'loading', 'empty'], false);
