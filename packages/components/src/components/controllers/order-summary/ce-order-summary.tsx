import { Component, h, Prop } from '@stencil/core';

import { getFormattedPrice } from '../../../functions/price';
import { CheckoutSession } from '../../../types';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-order-summary',
  styleUrl: 'ce-order-summary.css',
  shadow: true,
})
export class CEOrderSummary {
  @Prop() checkoutSession: CheckoutSession;
  @Prop() loading: boolean = false;
  @Prop() calculating: boolean = false;

  lineItems() {
    if (!this.checkoutSession.line_items || !this.checkoutSession.line_items.length) {
      return '';
    }

    return this.checkoutSession?.line_items.map(item => {
      return (
        <ce-line-item>
          {!!item?.price?.meta_data?.wp_attachment_src && <img src={item?.price?.meta_data?.wp_attachment_src} slot="image" />}
          <span slot="title">{item.price.name}</span>
          <ce-quantity-select quantity={1} slot="description"></ce-quantity-select>
          <span slot="price">{getFormattedPrice({ amount: item.amount_subtotal, currency: this.checkoutSession?.currency })}</span>
          <span slot="price-description">{item.price.recurring_interval ? `${item.price.recurring_interval}` : `once`}</span>
        </ce-line-item>
      );
    });
  }

  render() {
    if (!this.checkoutSession?.line_items || this.loading) {
      return (
        <div>
          <ce-divider style={{ '--spacing': '20px;' }}></ce-divider>
          <ce-line-item>
            <ce-skeleton style={{ width: '120px', display: 'inline-block' }}></ce-skeleton>
            <span slot="price">
              <ce-skeleton slot="price" style={{ width: '60px', display: 'inline-block' }}></ce-skeleton>
            </span>
          </ce-line-item>
          <ce-divider style={{ '--spacing': '20px' }}></ce-divider>
          <ce-line-item>
            <ce-skeleton style={{ width: '100px', display: 'inline-block' }}></ce-skeleton>
            <span slot="price">
              <ce-skeleton slot="price" style={{ width: '80px', display: 'inline-block' }}></ce-skeleton>
            </span>
          </ce-line-item>
          <ce-divider style={{ '--spacing': '20px' }}></ce-divider>
          <ce-line-item>
            <ce-skeleton style={{ width: '80px', display: 'inline-block' }}></ce-skeleton>
            <ce-skeleton slot="price" style={{ width: '40px', display: 'inline-block' }}></ce-skeleton>
          </ce-line-item>
        </div>
      );
    }

    return (
      <div class="summary">
        <ce-divider style={{ '--spacing': '20px' }}></ce-divider>

        <div class="line-items">{this.lineItems()}</div>

        <ce-divider style={{ '--spacing': '20px' }}></ce-divider>

        <ce-line-item>
          <span slot="description">Subtotal</span>
          <span slot="price">{getFormattedPrice({ amount: this.checkoutSession?.amount_subtotal, currency: this.checkoutSession?.currency })}</span>
        </ce-line-item>

        <ce-line-item>
          <span slot="description">
            <ce-tag clearable style={{ 'margin-right': '8px' }}>
              Save 10
            </ce-tag>{' '}
            10% off
          </span>
          <span slot="price">-$5.00</span>
        </ce-line-item>

        <ce-divider style={{ '--spacing': '20px' }}></ce-divider>

        <ce-line-item style={{ '--price-size': 'var(--ce-font-size-x-large)' }}>
          <span slot="title">Total</span>
          <span slot="price">{getFormattedPrice({ amount: this.checkoutSession?.amount_total, currency: this.checkoutSession?.currency })}</span>
          <span slot="currency">{this.checkoutSession?.currency}</span>
        </ce-line-item>

        {this.calculating && <div class="overlay"></div>}
      </div>
    );
  }
}

openWormhole(CEOrderSummary, ['checkoutSession', 'loading', 'calculating'], false);
