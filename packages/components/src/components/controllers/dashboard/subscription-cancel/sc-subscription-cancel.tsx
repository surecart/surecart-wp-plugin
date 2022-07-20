import { Component, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { SubscriptionProtocol } from '../../../../types';
import { Subscription } from '../../../../types';

@Component({
  tag: 'sc-subscription-cancel',
  styleUrl: 'sc-subscription-cancel.scss',
  shadow: true,
})
export class ScSubscriptionCancel {
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
      console.error(e);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async fetchProtocol() {
    this.protocol = (await apiFetch({
      path: '/surecart/v1/subscription_protocol',
    })) as SubscriptionProtocol;
  }

  async fetchSubscription() {
    if (!this.subscriptionId) return;
    this.subscription = (await apiFetch({
      path: addQueryArgs(`/surecart/v1/subscriptions/${this.subscriptionId}`, {
        expand: ['price', 'price.product', 'latest_invoice', 'product'],
      }),
    })) as Subscription;
  }

  async cancelSubscription() {
    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: `/surecart/v1/subscriptions/${this.subscriptionId}/cancel`,
        method: 'PATCH',
      });
      if (this.successUrl) {
        window.location.assign(this.successUrl);
      } else {
        this.busy = false;
      }
    } catch (e) {
      this.error = e?.message || __('Something went wrong', 'surecart');
      this.busy = false;
    }
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    return (
      <Fragment>
        <sc-subscription-details subscription={this?.subscription} hideRenewalText={true}></sc-subscription-details>

        {this?.protocol?.cancel_behavior === 'pending' ? (
          <sc-alert type="info" open>
            {__('Your plan will be canceled, but is still available until the end of your billing period on', 'surecart')}{' '}
            <strong>
              <sc-format-date type="timestamp" date={this?.subscription?.current_period_end_at as number} month="long" day="numeric" year="numeric"></sc-format-date>
            </strong>
            . {__('If you change your mind, you can renew your subscription.', 'surecart')}
          </sc-alert>
        ) : (
          <sc-alert type="info" open>
            {__('Your plan will be canceled immediately. You cannot change your mind.', 'surecart')}
          </sc-alert>
        )}
      </Fragment>
    );
  }

  renderLoading() {
    return (
      <div style={{ padding: '0.5em' }}>
        <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
        <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
        <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
      </div>
    );
  }

  render() {
    return (
      <sc-dashboard-module heading={this.heading || __('Cancel your plan', 'surecart')} class="subscription-cancel" error={this.error}>
        <sc-card>
          {this.renderContent()}

          <sc-button type="primary" full loading={this.loading || this.busy} disabled={this.loading || this.busy} onClick={() => this.cancelSubscription()}>
            {__('Cancel Plan', 'surecart')}
          </sc-button>

          {!!this.backUrl && (
            <sc-button href={this.backUrl} full loading={this.loading || this.busy} disabled={this.loading || this.busy}>
              {__('Go Back', 'surecart')}
            </sc-button>
          )}
        </sc-card>

        {this.busy && <sc-block-ui></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
