import { Component, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { SubscriptionProtocol } from '../../../../types';
import { Subscription } from '../../../../types';

@Component({
  tag: 'ce-subscription-cancel',
  styleUrl: 'ce-subscription-cancel.scss',
  shadow: true,
})
export class CeSubscriptionCancel {
  @Prop() heading: string;
  @Prop() subscriptionId: string;
  @Prop() backUrl: string;
  @Prop() successUrl: string;
  @Prop({ mutable: true }) subscription: Subscription;
  @State() protocol: SubscriptionProtocol;
  @State() loading: boolean;
  @State() busy: boolean;
  @State() error: string;

  componentWillLoad() {
    this.fetchItems();
  }

  async fetchItems() {
    try {
      this.loading = true;
      await Promise.all([this.fetchProtocol(), this.fetchSubscription()]);
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
    } finally {
      this.loading = false;
    }
  }

  async fetchProtocol() {
    this.protocol = (await apiFetch({
      path: '/checkout-engine/v1/subscription_protocol',
    })) as SubscriptionProtocol;
  }

  async fetchSubscription() {
    if (!this.subscriptionId) return;
    this.subscription = (await apiFetch({
      path: addQueryArgs(`/checkout-engine/v1/subscriptions/${this.subscriptionId}`, {
        expand: ['price', 'price.product', 'latest_invoice', 'product'],
      }),
    })) as Subscription;
  }

  async cancelSubscription() {
    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: `/checkout-engine/v1/subscriptions/${this.subscriptionId}/cancel`,
        method: 'PATCH',
      });
      if (this.successUrl) {
        window.location.assign(this.successUrl);
      } else {
        this.busy = false;
      }
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'checkout_engine');
      this.busy = false;
    }
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    return (
      <Fragment>
        <ce-subscription-details subscription={this?.subscription} hideRenewalText={true}></ce-subscription-details>

        {this?.protocol?.cancel_behavior === 'pending' ? (
          <ce-alert type="info" open>
            {__('Your plan will be canceled, but is still available until the end of your billing period on', 'checkout_engine')}{' '}
            <strong>
              <ce-format-date type="timestamp" date={this?.subscription?.current_period_end_at as number} month="long" day="numeric" year="numeric"></ce-format-date>
            </strong>
            . {__('If you change your mind, you can renew your subscription.', 'checkout_engine')}
          </ce-alert>
        ) : (
          <ce-alert type="info" open>
            {__('Your plan will be canceled immediately. You cannot change your mind.', 'checkout_engine')}
          </ce-alert>
        )}
      </Fragment>
    );
  }

  renderLoading() {
    return (
      <div style={{ padding: '0.5em' }}>
        <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
        <ce-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></ce-skeleton>
        <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
      </div>
    );
  }

  render() {
    return (
      <ce-dashboard-module heading={this.heading || __('Cancel your plan', 'checkout_engine')} class="subscription-cancel" error={this.error}>
        <ce-card>
          {this.renderContent()}

          <ce-button type="primary" full loading={this.loading || this.busy} disabled={this.loading || this.busy} onClick={() => this.cancelSubscription()}>
            {__('Cancel Plan', 'checkout_engine')}
          </ce-button>

          {!!this.backUrl && (
            <ce-button href={this.backUrl} full loading={this.loading || this.busy} disabled={this.loading || this.busy}>
              {__('Go Back', 'checkout_engine')}
            </ce-button>
          )}
        </ce-card>

        {this.busy && <ce-block-ui></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
