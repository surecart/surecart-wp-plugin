import { Component, Event, EventEmitter, Fragment, h, Prop, State } from '@stencil/core';
import { Invoice, Subscription } from '../../../../types';
import apiFetch from '../../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
import { _n, __, sprintf } from '@wordpress/i18n';
import { translatedInterval } from '../../../../functions/price';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-customer-subscription',
  styleUrl: 'ce-customer-subscription.scss',
  shadow: true,
})
export class CeCustomerSubscription {
  @Prop({ mutable: true }) subscription: Subscription;
  @Prop() upgradeGroups: Array<Array<string>>;
  @Event() ceUpdateSubscription: EventEmitter<Subscription>;

  @State() updating: boolean;
  @State() error: string;
  @State() state: 'cancel' | 'update' | '';

  renderName() {
    if (typeof this?.subscription?.price?.product !== 'string') {
      return this?.subscription?.price?.product?.name;
    }
    return __('Subscription', 'checkout_engine');
  }

  upgradePriceIds() {
    return (this.upgradeGroups || [])
      .filter(group => {
        return group.includes(this.subscription?.price?.id);
      })
      .flat();
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

    console.log(this.subscription);

    return <ce-subscription-status-badge status={this.subscription.status}></ce-subscription-status-badge>;
  }

  async cancelPlan() {
    try {
      this.error = '';
      this.updating = true;
      this.subscription = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`checkout-engine/v1/subscriptions/${this.subscription.id}`, {
          expand: ['subscription_items', 'subscription_item.price', 'price.product'],
        }),
        data: {
          cancel_at_period_end: true,
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
      this.state = '';
      this.updating = false;
    }
  }

  async renewPlan() {
    try {
      this.error = '';
      this.updating = true;
      this.subscription = (await apiFetch({
        method: 'PATCH',
        path: addQueryArgs(`checkout-engine/v1/subscriptions/${this.subscription.id}`, {
          expand: ['subscription_items', 'subscription_item.price', 'price.product'],
        }),
        data: {
          cancel_at_period_end: false,
        },
      })) as Subscription;
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
    } finally {
      this.state = '';
      this.updating = false;
    }
  }

  canUpdatePlan() {
    if (this.upgradePriceIds().length > 1) {
      if (['active', 'trialing'].includes(this.subscription.status)) {
        if (!this.subscription?.cancel_at_period_end) {
          return true;
        }
      }
    }
    return false;
  }

  canCancelPlan() {
    if (['active', 'trialing'].includes(this.subscription.status)) {
      if (!this.subscription?.cancel_at_period_end) {
        return true;
      }
    }
    return false;
  }

  renderCancelText() {
    if (this.subscription.current_period_end_at) {
      return (
        <span>
          {__('Your plan will be canceled, but is still available until the end of your billing period on ', 'checkout_engine')}
          <ce-format-date date={this.subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>.
          {__('If you change your mind, you can renew your subscription.', 'checkout_engine')}
        </span>
      );
    }
  }

  updatePlan(e) {
    this.ceUpdateSubscription.emit(this.subscription);
    e.preventDefault();
  }

  render() {
    const price = this.subscription?.price;

    if (this.state === 'cancel') {
      return (
        <ce-card class="subscription" part="card">
          <ce-flex flex-direction="column" style={{ maxWidth: '440px', margin: 'auto' }}>
            <div class="subscription__name" part="name">
              {this.renderName()}
            </div>
            <div class="subscription__price" part="price">
              <ce-format-number
                type="currency"
                currency={(this.subscription?.latest_invoice as Invoice)?.currency}
                value={(this.subscription?.latest_invoice as Invoice)?.total_amount}
              ></ce-format-number>
              {translatedInterval(price?.recurring_interval_count || 0, price?.recurring_interval, '/', '')}
            </div>
            <ce-text>{this.renderCancelText()}</ce-text>
            <ce-button size="large" type="primary" onClick={() => this.cancelPlan()} loading={this.updating}>
              {__('Cancel Plan', 'checkout_engine')}
            </ce-button>
            <ce-button
              size="large"
              type="default"
              onClick={() => {
                if (!this.updating) {
                  this.state = '';
                }
              }}
            >
              {__('Go Back', 'checkout_engine')}
            </ce-button>
            <div class="subscription__fine-print">By canceling your plan, you agree to Typographic's Terms of Service and Privacy Policy.</div>
          </ce-flex>
        </ce-card>
      );
    }

    return (
      <Fragment>
        <ce-alert open={!!this.error} type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
        <ce-card class="subscription" part="card">
          <ce-flex>
            <div class="subscription__details" part="details">
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
              <div class="subscription__renewal" part="renewal">
                {this.renderRenewalText()}
              </div>
            </div>
            <ce-flex class="subscription__actions" flex-direction="column" part="actions">
              {this.subscription.cancel_at_period_end && (
                <ce-button type="default" onClick={() => this.renewPlan()}>
                  {__('Renew Plan', 'checkout_engine')}
                </ce-button>
              )}
              {this.canUpdatePlan() && (
                <ce-button type="primary" href={addQueryArgs(window.location.href, { subscription: { id: this.subscription.id } })} onClick={e => this.updatePlan(e)}>
                  {__('Update Plan', 'checkout_engine')}
                </ce-button>
              )}
              {this.canCancelPlan() && <ce-button onClick={() => (this.state = 'cancel')}>{__('Cancel Plan', 'checkout_engine')}</ce-button>}
            </ce-flex>
          </ce-flex>
          {this.updating && <ce-block-ui spinner></ce-block-ui>}
        </ce-card>
      </Fragment>
    );
  }
}

openWormhole(CeCustomerSubscription, ['upgradeGroups', 'cancelBehavior'], false);
