import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { Price, Subscription } from '../../../../types';
import { _n, __, sprintf } from '@wordpress/i18n';
// import { translatedInterval } from '../../../functions/price';
import { openWormhole } from 'stencil-wormhole';
import { translatedInterval } from '../../../../functions/price';

@Component({
  tag: 'ce-customer-subscription-edit',
  styleUrl: 'ce-customer-subscription-edit.scss',
  shadow: true,
})
export class CeCustomerSubscriptionEdit {
  @Prop() subscription_id: string;
  @Prop() subscriptions: Subscription[];
  @Prop() upgradeGroups: Array<Array<string>>;
  @Prop() loading: boolean;
  @Prop() isIndex: boolean;

  @State() subscription: Subscription;

  @Event() ceFetchSubscription: EventEmitter<{ id: string; props?: object }>;

  @Watch('subscription_id')
  @Watch('subscriptions')
  handleIdAndSubscriptionsChange() {
    this.subscription = this.subscription_id ? (this.subscriptions || []).find(subscription => subscription.id === this.subscription_id) : null;
    if (!this.subscription && this.subscription_id) {
      this.ceFetchSubscription.emit({ id: this.subscription_id });
    }
  }

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
    if (this.subscription?.cancel_at_period_end && this.subscription.current_period_end) {
      return (
        <span>
          {sprintf(__('Your plan will be canceled on', 'checkout_engine'))}{' '}
          <ce-format-date date={this.subscription.current_period_end * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }
    if (this.subscription.status === 'trialing' && this.subscription.trial_end_at) {
      return (
        <span>
          {sprintf(__('Your plan begins on', 'checkout_engine'))}{' '}
          <ce-format-date date={this.subscription.trial_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }
    if (this.subscription.status === 'active' && this.subscription.current_period_end) {
      return (
        <span>
          {sprintf(__('Your plan renews on', 'checkout_engine'))}{' '}
          <ce-format-date date={this.subscription.current_period_end * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }

    return <ce-subscription-status-badge status={this.subscription.status}></ce-subscription-status-badge>;
  }

  price() {
    return this.subscription?.subscription_items?.data?.[0].price as Price;
  }

  upgradePriceIds() {
    return (this.upgradeGroups || []).filter(group => group.includes(this.price()?.id)).flat();
  }

  render() {
    // must be index state.
    if (this.isIndex) {
      return null;
    }

    if (this.loading) {
      return (
        <ce-card>
          <ce-flex>
            <ce-flex flex-direction="column" style={{ flex: '1' }}>
              <ce-skeleton style={{ width: '30%', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '20%', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '40%', display: 'inline-block' }}></ce-skeleton>
            </ce-flex>
            <ce-flex flex-direction="column">
              <ce-skeleton style={{ width: '200px' }}></ce-skeleton>
              <ce-skeleton style={{ width: '200px' }}></ce-skeleton>
            </ce-flex>
          </ce-flex>
        </ce-card>
      );
    }

    if (!this.subscription) {
      return null;
    }

    const price = this.subscription?.subscription_items?.data?.[0].price as Price;

    return (
      <ce-card>
        <div class="subscription-edit">
          <div class="module">
            <ce-heading size="small">{__('Current Plan', 'checkout_engine')}</ce-heading>
            <ce-divider style={{ '--spacing': 'var(--ce-spacing-small)' }}></ce-divider>
            <div style={{ maxWidth: '650px' }}>
              <div class="subscription__name" part="name">
                {this.renderName()}
              </div>
              <div class="subscription__price" part="price">
                <ce-format-number type="currency" currency={this.subscription?.currency} value={this.subscription?.total_amount}></ce-format-number>
                {translatedInterval(price.recurring_interval_count, price.recurring_interval, '/', '')}
              </div>
            </div>
          </div>

          {this.upgradePriceIds().length && (
            <div class="module">
              <ce-heading size="small">{__('Available Plans', 'checkout_engine')}</ce-heading>
              <ce-divider></ce-divider>
              <div class="subscription-edit__plans" part="plans">
                {this.upgradePriceIds().map(id => {
                  return (
                    <ce-card>
                      <ce-customer-subscription-plan current={id === this.price()?.id} priceId={id}></ce-customer-subscription-plan>
                    </ce-card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ce-card>
    );
  }
}

openWormhole(CeCustomerSubscriptionEdit, ['loading', 'subscriptions', 'error', 'isIndex', 'subscription_id', 'upgradeGroups'], false);
