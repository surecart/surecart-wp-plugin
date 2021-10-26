import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.scss',
  shadow: true,
})
export class CEOrderSummary {
  @Prop() busy: boolean;
  @Prop() loading: boolean;
  @Prop() empty: boolean;

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
        {this.busy && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CEOrderSummary, ['checkoutSession', 'busy', 'loading', 'empty'], false);
