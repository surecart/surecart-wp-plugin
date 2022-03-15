import { Component, h, Prop, State, Watch } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { translatedInterval } from '../../../../functions/price';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Invoice, Price, Product, Subscription } from '../../../../types';

@Component({
  tag: 'ce-subscription-details',
  styleUrl: 'ce-subscription-details.css',
  shadow: true,
})
export class CeSubscriptionDetails {
  @Prop() subscription: Subscription;
  @Prop() pendingPrice: Price;
  @Prop() hideRenewalText: boolean;

  @State() loading: boolean;
  @State() hasPendingUpdate: boolean;

  renderName() {
    if (typeof this.subscription?.price?.product !== 'string') {
      return this.subscription?.price?.product?.name;
    }
    return __('Subscription', 'checkout_engine');
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
        path: addQueryArgs(`checkout-engine/v1/prices/${price_id}`, {
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
    const tag = <ce-subscription-status-badge subscription={this?.subscription}></ce-subscription-status-badge>;

    if (this?.subscription?.cancel_at_period_end && this?.subscription?.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan will be canceled on', 'checkout_engine'))}{' '}
          <ce-format-date date={this.subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }

    if (this.hasPendingUpdate) {
      return this.pendingPrice ? (
        <span>
          {__('Your plan switches to', 'checkout_engine')} <strong>{(this.pendingPrice.product as Product).name}</strong> {__('on', 'checkout_engine')}{' '}
          <ce-format-date date={this.subscription.current_period_end_at as number} type="timestamp" month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      ) : (
        <ce-skeleton></ce-skeleton>
      );
    }

    if (this?.subscription?.status === 'trialing' && this?.subscription?.trial_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan begins on', 'checkout_engine'))}{' '}
          <ce-format-date date={this?.subscription?.trial_end_at} type="timestamp" month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }
    if (this.subscription?.status === 'active' && this.subscription?.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan renews on', 'checkout_engine'))}{' '}
          <ce-format-date date={this?.subscription?.current_period_end_at} type="timestamp" month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }

    return tag;
  }

  render() {
    return (
      <div class="subscription-details">
        <ce-text style={{ '--font-weight': 'var(--ce-font-weight-bold)' }}>
          {this.renderName()} {this.hasPendingUpdate && <ce-tag size="small">{__('Update Scheduled', 'checkout_engine')}</ce-tag>}
        </ce-text>
        <div>
          <ce-format-number
            type="currency"
            currency={(this.subscription?.latest_invoice as Invoice)?.currency}
            value={(this.subscription?.latest_invoice as Invoice)?.total_amount}
          ></ce-format-number>
          {translatedInterval(this.subscription?.price?.recurring_interval_count || 0, this.subscription?.price?.recurring_interval, '/', '')}
        </div>
        {!this.hideRenewalText && <div>{this.renderRenewalText()}</div>}
      </div>
    );
  }
}
