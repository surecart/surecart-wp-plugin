import { Component, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Subscription } from '../../../../types';

@Component({
  tag: 'sc-subscription-renew',
  styleUrl: 'sc-subscription-renew.scss',
  shadow: true,
})
export class ScSubscriptionCancel {
  @Prop() heading: string;
  @Prop() subscriptionId: string;
  @Prop() backUrl: string;
  @Prop() successUrl: string;
  @Prop({ mutable: true }) subscription: Subscription;
  @State() loading: boolean;
  @State() busy: boolean;
  @State() error: string;

  componentDidLoad() {
    this.fetchItems();
  }

  async fetchItems() {
    try {
      this.loading = true;
      await this.fetchSubscription();
    } catch (e) {
      console.error(this.error);
      this.error = e?.message || __('Something went wrong', 'surecart');
    } finally {
      this.loading = false;
    }
  }

  async fetchSubscription() {
    if (!this.subscriptionId) return;
    this.subscription = (await apiFetch({
      path: addQueryArgs(`/surecart/v1/subscriptions/${this.subscriptionId}`, {
        expand: ['price', 'price.product', 'current_period', 'period.checkout'],
      }),
    })) as Subscription;
  }

  async renewSubscription() {
    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: `/surecart/v1/subscriptions/${this.subscriptionId}/renew/`,
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
        <sc-alert type="info" open>
          {__('This plan will no longer be canceled. It will renew on', 'surecart')}{' '}
          <sc-format-date type="timestamp" date={this?.subscription?.current_period_end_at as number} month="long" day="numeric" year="numeric"></sc-format-date>.{' '}
        </sc-alert>
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
      <sc-dashboard-module heading={this.heading || __('Renew your plan', 'surecart')} class="subscription-cancel" error={this.error}>
        <sc-card>
          {this.renderContent()}

          <sc-button type="primary" full loading={this.loading || this.busy} disabled={this.loading || this.busy} onClick={() => this.renewSubscription()}>
            {__('Renew Plan', 'surecart')}
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
