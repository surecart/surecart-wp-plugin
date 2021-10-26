import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-line-item-total',
  styleUrl: 'ce-line-item-total.scss',
  shadow: true,
})
export class CeLineItemTotal {
  @Prop() total: 'total' | 'subtotal' = 'total';
  @Prop() loading: boolean;
  @Prop() checkoutSession: CheckoutSession;
  @Prop() showCurrency: boolean;
  @Prop() size: 'large' | 'medium';

  session_key = {
    total: 'total_amount',
    subtotal: 'subtotal_amount',
  };

  render() {
    // loading state
    if (this.loading) {
      return (
        <ce-line-item>
          <ce-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', 'height': this.size === 'large' ? '40px' : '', '--border-radius': '6px' }}></ce-skeleton>
          {this.showCurrency && <ce-skeleton slot="currency" style={{ width: '30px', display: 'inline-block' }}></ce-skeleton>}
        </ce-line-item>
      );
    }

    if (!this.checkoutSession?.currency) return;

    return (
      <ce-line-item style={this.size === 'large' ? { '--price-size': 'var(--ce-font-size-x-large)' } : {}}>
        <span slot="title">
          <slot name="title" />
        </span>
        <span slot="description">
          <slot name="description" />
        </span>
        <span slot="price">
          <ce-total total={this.total}></ce-total>
        </span>
        {this.showCurrency && <span slot="currency">{this.checkoutSession?.currency}</span>}
      </ce-line-item>
    );
  }
}

openWormhole(CeLineItemTotal, ['checkoutSession', 'loading', 'calculating'], false);
