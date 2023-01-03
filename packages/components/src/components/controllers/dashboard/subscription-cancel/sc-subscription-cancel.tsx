import { Component, Event, EventEmitter, Fragment, h, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
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
  @Prop() backUrl: string;
  @Prop() successUrl: string;
  @Prop() subscription: Subscription;
  @Prop() protocol: SubscriptionProtocol;
  @State() loading: boolean;
  @State() busy: boolean;
  @State() error: string;
  @Event() scAbandon: EventEmitter<void>;
  @Event() scCancelled: EventEmitter<void>;

  async cancelSubscription() {
    try {
      this.error = '';
      this.busy = true;
      await apiFetch({
        path: `/surecart/v1/subscriptions/${this.subscription?.id}/cancel`,
        method: 'PATCH',
      });
      this.scCancelled.emit();
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
        {this?.protocol?.cancel_behavior === 'pending' ? (
          <div slot="description">
            {__('Your plan will be canceled, but is still available until the end of your billing period on', 'surecart')}{' '}
            <strong>
              <sc-format-date type="timestamp" date={this?.subscription?.current_period_end_at as number} month="long" day="numeric" year="numeric"></sc-format-date>
            </strong>
            . {__('If you change your mind, you can renew your subscription.', 'surecart')}
          </div>
        ) : (
          <div slot="description">{__('Your plan will be canceled immediately. You cannot change your mind.', 'surecart')}</div>
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
      <sc-dashboard-module
        heading={this.heading || __('Cancel your plan', 'surecart')}
        class="subscription-cancel"
        error={this.error}
        style={{ '--sc-dashboard-module-spacing': '1em' }}
      >
        {this.renderContent()}

        <sc-flex justifyContent="flex-start">
          <sc-button type="primary" loading={this.loading || this.busy} disabled={this.loading || this.busy} onClick={() => this.cancelSubscription()}>
            {__('Cancel Plan', 'surecart')}
          </sc-button>

          <sc-button
            style={{ color: 'var(--sc-color-gray-500' }}
            type="text"
            onClick={() => this.scAbandon.emit()}
            loading={this.loading || this.busy}
            disabled={this.loading || this.busy}
          >
            {__('Keep My Plan', 'surecart')}
          </sc-button>
        </sc-flex>

        {this.busy && <sc-block-ui></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
