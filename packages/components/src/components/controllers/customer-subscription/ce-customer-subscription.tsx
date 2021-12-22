import { Component, h, Prop } from '@stencil/core';
import { Price, Subscription } from '../../../types';
import { _n, __, sprintf } from '@wordpress/i18n';
import { translatedInterval } from '../../../functions/price';

@Component({
  tag: 'ce-customer-subscription',
  styleUrl: 'ce-customer-subscription.scss',
  shadow: true,
})
export class CeCustomerSubscription {
  @Prop() subscription: Subscription;

  renderName() {
    if (!this.subscription.subscription_items) return __('Subscription', 'checkout_engine');
    if (this.subscription.subscription_items.pagination.count > 1) {
      return sprintf(__('%d items', 'checkout_engine'), this.subscription.subscription_items.pagination.count);
    }
    const price = this.subscription.subscription_items.data[0].price as Price;

    if (typeof price?.product === 'string') return sprintf(__('%d item', 'checkout_engine'), 1);

    if (price?.product?.name) {
      return price.product.name;
    }
  }

  renderRenewalText() {
    if (this.subscription.cancel_at_period_end) {
      return __('Canceled', 'checkout_engine');
    }
    if (this.subscription.status === 'trialing' && this.subscription.current_period_start) {
      return sprintf(__('Your plan begins %s', 'checkout_engine'), new Date(this.subscription.current_period_start * 1000));
    }
    if (this.subscription.status === 'active' && this.subscription.current_period_end) {
      return (
        <span>
          {sprintf(__('Your plan renews on', 'checkout_engine'))}{' '}
          <ce-format-date date={this.subscription.current_period_end * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }
  }

  render() {
    const price = this.subscription?.subscription_items?.data?.[0].price as Price;
    return (
      <ce-card part="card">
        <ce-flex>
          <div class="subscription__details" part="details">
            <div class="subscription__name" part="name">
              {this.renderName()}
            </div>
            <div class="subscription__price" part="price">
              <ce-format-number type="currency" currency={this.subscription?.currency} value={this.subscription?.total_amount}></ce-format-number>
              {translatedInterval(price.recurring_interval_count, price.recurring_interval, '/', '')}
            </div>
            <div class="subscription__renewal" part="renewal">
              {this.renderRenewalText()}
            </div>
          </div>
          <ce-flex class="subscription__actions" flex-direction="column" part="actions">
            <slot name="actions" />
          </ce-flex>
        </ce-flex>
      </ce-card>
    );
  }
}
