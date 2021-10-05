import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutState } from '../../../types';

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.scss',
  shadow: true,
})
export class CEOrderSummary {
  @Prop() state: CheckoutState;

  render() {
    return (
      <div class="summary">
        <slot />
        {['updating', 'paying', 'finalized'].includes(this.state) && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CEOrderSummary, ['state'], false);
