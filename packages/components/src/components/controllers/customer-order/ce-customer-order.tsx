import { Component, h, Prop } from '@stencil/core';
import { CheckoutSession } from '../../../types';
import { _n, __, sprintf } from '@wordpress/i18n';

@Component({
  tag: 'ce-customer-order',
  styleUrl: 'ce-customer-order.scss',
  shadow: true,
})
export class CeCustomerOrders {
  @Prop() order: CheckoutSession;

  render() {
    return (
      <div class="order-row">
        <div>{this.order?.number}</div>
        <div>{sprintf(_n('%d item', '%d items', this.order?.line_items?.pagination?.count || 0, 'checkout_session'), this.order?.line_items?.pagination?.count || 0)} </div>
        <div>
          <ce-format-number type="currency" currency={this.order?.currency} value={this.order?.total_amount}></ce-format-number>
        </div>
        <div>{this.order?.status}</div>
        <div>
          <slot name="action" />
        </div>
      </div>
    );
  }
}
