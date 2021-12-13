import { Component, h, Prop } from '@stencil/core';
import { Subscription } from '../../../types';
import { _n, __, sprintf } from '@wordpress/i18n';

@Component({
  tag: 'ce-customer-subscription',
  styleUrl: 'ce-customer-subscription.scss',
  shadow: true,
})
export class CeCustomerSubscription {
  @Prop() subscription: Subscription;

  render() {
    return (
      <div class="order-row">
        <div>{this.subscription?.created_at}</div>
        <div>
          {sprintf(
            _n('%d item', '%d items', this.subscription?.subscription_items?.pagination?.count || 0, 'checkout_subscription'),
            this.subscription?.subscription_items?.pagination?.count || 0,
          )}{' '}
        </div>
        <div>
          <ce-format-number type="currency" currency={this.subscription?.currency} value={this.subscription?.total_amount}></ce-format-number>
        </div>
        <div>
          <ce-subscription-status-badge status={this.subscription.status}></ce-subscription-status-badge>
        </div>
        <div>
          <slot name="action" />
        </div>
      </div>
    );
  }
}
