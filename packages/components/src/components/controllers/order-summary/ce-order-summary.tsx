import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.scss',
  shadow: true,
})
export class CEOrderSummary {
  @Prop() calculating: boolean = false;

  render() {
    return (
      <div class="summary">
        <slot />
        {this.calculating && <ce-block-ui></ce-block-ui>}
      </div>
    );
  }
}

openWormhole(CEOrderSummary, ['calculating'], false);
