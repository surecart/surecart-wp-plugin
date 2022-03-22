import { Order } from '../../../../types';
import { Component, h, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-line-item-total',
  styleUrl: 'sc-line-item-total.scss',
  shadow: true,
})
export class ScLineItemTotal {
  @Prop() total: 'total' | 'subtotal' = 'total';
  @Prop() loading: boolean;
  @Prop() order: Order;
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
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', 'height': this.size === 'large' ? '40px' : '', '--border-radius': '6px' }}></sc-skeleton>
          {this.showCurrency && <sc-skeleton slot="currency" style={{ width: '30px', display: 'inline-block' }}></sc-skeleton>}
        </sc-line-item>
      );
    }

    if (!this.order?.currency) return;

    if (this.total === 'total' && this.order.trial_amount !== 0) {
      return (
        <div class="line-item-total__group">
          <sc-line-item>
            <span slot="description">
              <slot name="description" />
            </span>
            <span slot="price">
              <sc-total order={this.order} total={this.total}></sc-total>
            </span>
          </sc-line-item>
          <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
            <span slot="title">{__('Total Due Today', 'surecart')}</span>
            <span slot="description">
              <slot name="description" />
            </span>
            <span slot="price">
              <sc-format-number type="currency" currency={this.order?.currency} value={this.order?.amount_due}></sc-format-number>
            </span>
            {this.showCurrency && <span slot="currency">{this.order?.currency}</span>}
          </sc-line-item>
        </div>
      );
    }

    return (
      <sc-line-item style={this.size === 'large' ? { '--price-size': 'var(--sc-font-size-x-large)' } : {}}>
        <span slot="title">
          <slot name="title" />
        </span>
        <span slot="description">
          <slot name="description" />
        </span>
        <span slot="price">
          <sc-total order={this.order} total={this.total}></sc-total>
        </span>
        {this.showCurrency && <span slot="currency">{this.order?.currency}</span>}
      </sc-line-item>
    );
  }
}

openWormhole(ScLineItemTotal, ['order', 'loading', 'calculating'], false);
