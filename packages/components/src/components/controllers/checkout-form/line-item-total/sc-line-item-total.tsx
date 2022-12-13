import { Checkout } from '../../../../types';
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
  @Prop() order: Checkout;
  @Prop() size: 'large' | 'medium';

  order_key = {
    total: 'total_amount',
    subtotal: 'subtotal_amount',
    amount_due: 'amount_due',
  };

  render() {
    // loading state
    if (this.loading && !this.order?.[this?.order_key?.[this?.total]]) {
      return (
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', 'height': this.size === 'large' ? '40px' : '', '--border-radius': '6px' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    if (!this.order?.currency) return;

    // if the total amount is different than the amount due.
    if (this.total === 'total' && this.order?.total_amount !== this.order?.amount_due) {
      return (
        <div class="line-item-total__group">
          <sc-line-item>
            <span slot="description">
              <slot name="title" />
              <slot name="description" />
            </span>
            <span slot="price">
              <sc-total order={this.order} total={this.total}></sc-total>
            </span>
          </sc-line-item>
          <sc-line-item style={{ '--price-size': 'var(--sc-font-size-x-large)' }}>
            <span slot="title">
              <slot name="subscription-title">{__('Total Due Today', 'surecart')}</slot>
            </span>
            <span slot="price">
              <sc-format-number type="currency" currency={this.order?.currency} value={this.order?.amount_due}></sc-format-number>
            </span>
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
          {!!this.order?.total_savings_amount && this.total === 'total' && (
            <sc-format-number class="scratch-price" type="currency" value={-this.order?.total_savings_amount + this.order?.total_amount} currency={this.order?.currency || 'usd'} />
          )}
          <sc-total order={this.order} total={this.total}></sc-total>
        </span>
      </sc-line-item>
    );
  }
}

openWormhole(ScLineItemTotal, ['order', 'loading', 'calculating'], false);
