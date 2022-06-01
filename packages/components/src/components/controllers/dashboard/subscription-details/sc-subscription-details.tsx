import { Component, h, Prop, State, Watch } from '@stencil/core';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

import apiFetch from '../../../../functions/fetch';
import { intervalString } from '../../../../functions/price';
import { Invoice, Price, Product, Subscription } from '../../../../types';

@Component({
  tag: 'sc-subscription-details',
  styleUrl: 'sc-subscription-details.css',
  shadow: true,
})
export class ScSubscriptionDetails {
  @Prop() subscription: Subscription;
  @Prop() pendingPrice: Price;
  @Prop() hideRenewalText: boolean;

  @State() loading: boolean;
  @State() hasPendingUpdate: boolean;

  renderName() {
    if (typeof this.subscription?.price?.product !== 'string') {
      return this.subscription?.price?.product?.name;
    }
    return __('Subscription', 'surecart');
  }

  @Watch('subscription')
  async handleSubscriptionChange() {
    this.hasPendingUpdate = !!Object.keys(this?.subscription?.pending_update || {})?.length;
    if (this?.subscription?.pending_update?.price && !this?.pendingPrice && !this.hideRenewalText) {
      this.pendingPrice = await this.fetchPrice(this.subscription.pending_update.price);
    }
  }

  componentWillLoad() {
    this.handleSubscriptionChange();
  }

  async fetchPrice(price_id: string) {
    try {
      this.loading = true;
      const price = await apiFetch({
        path: addQueryArgs(`surecart/v1/prices/${price_id}`, {
          expand: ['product'],
        }),
      });
      return price as Price;
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  renderRenewalText() {
    const tag = <sc-subscription-status-badge subscription={this?.subscription}></sc-subscription-status-badge>;

    if (this?.subscription?.cancel_at_period_end && this?.subscription?.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan will be canceled on', 'surecart'))}{' '}
          <sc-format-date date={this.subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }

    if (this.hasPendingUpdate) {
      return this.pendingPrice ? (
        <span>
          {__('Your plan switches to', 'surecart')} <strong>{(this.pendingPrice.product as Product).name}</strong> {__('on', 'surecart')}{' '}
          <sc-format-date date={this.subscription.current_period_end_at as number} type="timestamp" month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      ) : (
        <sc-skeleton></sc-skeleton>
      );
    }

    if (this?.subscription?.status === 'trialing' && this?.subscription?.trial_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan begins on', 'surecart'))}{' '}
          <sc-format-date date={this?.subscription?.trial_end_at} type="timestamp" month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }
    if (this.subscription?.status === 'active' && this.subscription?.current_period_end_at) {
      return (
        <span>
          {tag} {this.subscription?.remaining_period_count === null ? __('Your plan renews on', 'surecart') : __('Your next payment is on')}{' '}
          <sc-format-date date={this?.subscription?.current_period_end_at} type="timestamp" month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }

    return tag;
  }

  render() {
    return (
      <div class="subscription-details">
        <sc-text style={{ '--font-weight': 'var(--sc-font-weight-bold)' }}>
          {this.renderName()} {this.hasPendingUpdate && <sc-tag size="small">{__('Update Scheduled', 'surecart')}</sc-tag>}
        </sc-text>
        <div>
          <sc-format-number
            type="currency"
            currency={(this.subscription?.latest_invoice as Invoice)?.currency}
            value={(this.subscription?.latest_invoice as Invoice)?.total_amount}
          ></sc-format-number>{' '}
          {intervalString(this.subscription?.price)}
        </div>
        {!this.hideRenewalText && <div>{this.renderRenewalText()}</div>}
      </div>
    );
  }
}
