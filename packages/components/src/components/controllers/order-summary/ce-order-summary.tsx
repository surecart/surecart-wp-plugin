import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

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
        {this.empty && !this.loading && <p class="empty">{__('Your cart is empty.', 'checkout_engine')}</p>}
        {this.busy && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CEOrderSummary, ['checkoutSession', 'busy', 'loading', 'empty'], false);
