import { Component, h, Prop } from '@stencil/core';

import { getFormattedPrice } from '../../../functions/price';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.css',
  shadow: true,
})
export class CEOrderSummary {
  @Prop() total: number = 0;
  @Prop() subtotal: number = 0;
  @Prop() currencyCode: string = 'USD';

  render() {
    return (
      <div>
        <ce-line-item>
          Subtotal
          <span slot="price">{getFormattedPrice({ amount: this.subtotal, currency: this.currencyCode })}</span>
        </ce-line-item>
        <ce-divider style={{ '--spacing': '20px' }}></ce-divider>
        <ce-line-item price={getFormattedPrice({ amount: this.total, currency: this.currencyCode })} currency={this.currencyCode}>
          Total
        </ce-line-item>
      </div>
    );
  }
}

openWormhole(CEOrderSummary, ['total', 'subtotal', 'currencyCode']);
