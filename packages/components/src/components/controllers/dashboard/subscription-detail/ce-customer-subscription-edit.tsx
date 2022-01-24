import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { Invoice, Subscription } from '../../../../types';
import { _n, __, sprintf } from '@wordpress/i18n';
import apiFetch from '../../../../functions/fetch';
import { openWormhole } from 'stencil-wormhole';
import { addQueryArgs } from '@wordpress/url';
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
  @State() error: string;
  @State() updating: boolean;

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
    if (typeof this?.subscription?.price?.product !== 'string') {
      return this?.subscription?.price?.product?.name;
    }
    return __('Subscription', 'checkout_engine');
  }

  renderRenewalText() {
    if (this.subscription?.cancel_at_period_end && this.subscription.current_period_end_at) {
      return (
        <span>
          {sprintf(__('Your plan will be canceled on', 'checkout_engine'))}{' '}
          <ce-format-date date={this.subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
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
    if (this.subscription.status === 'active' && this.subscription.current_period_end_at) {
      return (
        <span>
          {sprintf(__('Your plan renews on', 'checkout_engine'))}{' '}
          <ce-format-date date={this.subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }

    return <ce-subscription-status-badge status={this.subscription.status}></ce-subscription-status-badge>;
  }

  upgradePriceIds() {
    return (this.upgradeGroups || []).filter(group => group.includes(this.subscription?.price?.id)).flat();
  }

  async updatePlan(price: string, quantity: number) {
    try {
      this.error = '';
      this.updating = true;
      this.subscription = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`checkout-engine/v1/subscriptions/${this.subscription.id}`, {
          expand: ['price', 'price.product'],
        }),
        data: {
          price,
          quantity,
        },
      })) as Subscription;
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
      console.error(this.error);
    } finally {
      this.updating = false;
    }
  }

  render() {
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

    const price = this.subscription?.price;

    return (
      <ce-card class="subscription-edit">
        <div class="subscription-edit__content">
          <div class="module">
            <ce-heading size="small">{__('Current Plan', 'checkout_engine')}</ce-heading>
            <ce-divider style={{ '--spacing': 'var(--ce-spacing-small)' }}></ce-divider>
            <div style={{ maxWidth: '650px' }}>
              <div class="subscription__name" part="name">
                {this.renderName()}
              </div>
              <div class="subscription__price" part="price">
                <ce-format-number
                  type="currency"
                  currency={(this.subscription?.latest_invoice as Invoice)?.currency}
                  value={(this.subscription?.latest_invoice as Invoice)?.total_amount}
                ></ce-format-number>
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
                      <ce-customer-subscription-plan priceId={id}>
                        <span slot="actions">
                          {id === this.subscription?.price?.id ? (
                            <ce-button size="medium" type="text">
                              <ce-icon name="check" slot="prefix"></ce-icon>
                              {__('Current Plan', 'checkout_engine')}
                            </ce-button>
                          ) : (
                            <ce-button size="medium" type="default" onClick={() => this.updatePlan(id, 1)}>
                              {__('Change to This Plan', 'checkout_engine')}
                            </ce-button>
                          )}
                        </span>
                      </ce-customer-subscription-plan>
                    </ce-card>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <ce-button
              size="medium"
              type="default"
              onClick={() => {
                window.history.back();
              }}
            >
              {__('Go Back', 'checkout_engine')}
            </ce-button>
          </div>
        </div>
        {this.updating && <ce-block-ui spinner></ce-block-ui>}
      </ce-card>
    );
  }
}

openWormhole(CeCustomerSubscriptionEdit, ['loading', 'subscriptions', 'error', 'isIndex', 'subscription_id', 'upgradeGroups'], false);
