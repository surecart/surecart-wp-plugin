import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { getFormattedPrice } from '../../../functions/price';
import { CheckoutSession } from '../../../types';

@Component({
  tag: 'ce-total',
  styleUrl: 'ce-total.scss',
  shadow: true,
})
export class CeTotal {
  @Prop() total: string = 'total';
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
    if (this.loading || !this.checkoutSession?.currency) {
      return (
        <ce-line-item>
          <ce-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>
          <ce-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', 'height': this.size === 'large' ? '40px' : '', '--border-radius': '6px' }}></ce-skeleton>
          {this.showCurrency && <ce-skeleton slot="currency" style={{ width: '30px', display: 'inline-block' }}></ce-skeleton>}
        </ce-line-item>
      );
    }

    return (
      <ce-line-item style={this.size === 'large' ? { '--price-size': 'var(--ce-font-size-x-large)' } : {}}>
        <span slot="title">
          <slot name="title" />
        </span>
        <span slot="description">
          <slot name="description" />
        </span>
        <span slot="price">{getFormattedPrice({ amount: this.checkoutSession?.[this.session_key[this.total]], currency: this.checkoutSession?.currency })}</span>
        {this.showCurrency && <span slot="currency">{this.checkoutSession?.currency}</span>}
      </ce-line-item>
    );
  }
}

openWormhole(CeTotal, ['checkoutSession', 'loading', 'calculating'], false);
