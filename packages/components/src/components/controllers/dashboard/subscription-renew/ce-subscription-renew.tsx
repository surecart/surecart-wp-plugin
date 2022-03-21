import { Component, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Subscription } from '../../../../types';

@Component({
  tag: 'ce-subscription-renew',
  styleUrl: 'ce-subscription-renew.scss',
  shadow: true,
})
export class CeSubscriptionCancel {
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
        expand: ['price', 'price.product', 'latest_invoice', 'product'],
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
        <ce-subscription-details subscription={this?.subscription} hideRenewalText={true}></ce-subscription-details>
        <ce-alert type="info" open>
          {__('This plan will no longer be canceled. It will renew on', 'surecart')}{' '}
          <ce-format-date type="timestamp" date={this?.subscription?.current_period_end_at as number} month="long" day="numeric" year="numeric"></ce-format-date>.{' '}
        </ce-alert>
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
      <ce-dashboard-module heading={this.heading || __('Renew your plan', 'surecart')} class="subscription-cancel" error={this.error}>
        <ce-card>
          {this.renderContent()}

          <ce-button type="primary" full loading={this.loading || this.busy} disabled={this.loading || this.busy} onClick={() => this.renewSubscription()}>
            {__('Renew Plan', 'surecart')}
          </ce-button>

          {!!this.backUrl && (
            <ce-button href={this.backUrl} full loading={this.loading || this.busy} disabled={this.loading || this.busy}>
              {__('Go Back', 'surecart')}
            </ce-button>
          )}
        </ce-card>

        {this.busy && <ce-block-ui></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
