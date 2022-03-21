import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Subscription } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-subscription',
  styleUrl: 'ce-subscription.scss',
  shadow: true,
})
export class CeSubscription {
  @Element() el: HTMLCeSubscriptionsListElement;
  /** Customer id to fetch subscriptions */
  @Prop() subscriptionId: string;
  @Prop() heading: string;
  @Prop() query: object;

  @Prop({ mutable: true }) subscription: Subscription;

  /** Loading state */
  @State() loading: boolean;

  /**  Busy state */
  @State() busy: boolean;

  /** Error message */
  @State() error: string;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getSubscription();
    });
  }

  async cancelPendingUpdate() {
    const r = confirm(__('Are you sure you want to cancel the pending update to your plan?', 'surecart'));
    if (!r) return;
    try {
      this.busy = true;
      this.subscription = (await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/subscriptions/${this.subscription?.id}/`, { expand: ['price', 'price.product', 'latest_invoice', 'product'] }),
        method: 'PATCH',
        data: {
          purge_pending_update: true,
        },
      })) as Subscription;
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'surecart');
      }
      console.error(this.error);
    } finally {
      this.busy = false;
    }
  }

  /** Get all subscriptions */
  async getSubscription() {
    if (this.subscription) return;
    try {
      this.loading = true;
      this.subscription = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/subscriptions/${this.subscriptionId}`, {
          expand: ['price', 'price.product', 'latest_invoice'],
          ...(this.query || {}),
        }),
      })) as Subscription;
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'surecart');
      }
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  renderName(subscription: Subscription) {
    if (typeof subscription?.price?.product !== 'string') {
      return subscription?.price?.product?.name;
    }
    return __('Subscription', 'surecart');
  }

  renderRenewalText(subscription) {
    const tag = <ce-subscription-status-badge subscription={subscription}></ce-subscription-status-badge>;

    if (subscription?.cancel_at_period_end && subscription.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan will be canceled on', 'surecart'))}{' '}
          <ce-format-date date={subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }
    if (subscription.status === 'trialing' && subscription.trial_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan begins on', 'surecart'))} <ce-format-date date={subscription.trial_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }
    if (subscription.status === 'active' && subscription.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan renews on', 'surecart'))}{' '}
          <ce-format-date date={subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }

    return tag;
  }

  renderEmpty() {
    return <slot name="empty">{__('This subscription does not exist.', 'surecart')}</slot>;
  }

  renderLoading() {
    return (
      <ce-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
        <div style={{ padding: '0.5em' }}>
          <ce-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></ce-skeleton>
          <ce-skeleton style={{ width: '40%' }}></ce-skeleton>
        </div>
      </ce-stacked-list-row>
    );
  }

  renderContent() {
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.subscription) {
      return this.renderEmpty();
    }

    return (
      <ce-stacked-list-row mobile-size={0}>
        <ce-subscription-details subscription={this.subscription}></ce-subscription-details>
      </ce-stacked-list-row>
    );
  }

  render() {
    return (
      <ce-dashboard-module heading={this.heading || __('Current Plan', 'surecart')} class="subscription" error={this.error}>
        {!!this.subscription && (
          <ce-flex slot="end">
            {!!Object.keys(this.subscription?.pending_update).length && (
              <ce-button type="link" onClick={() => this.cancelPendingUpdate()}>
                <ce-icon name="x-octagon" slot="prefix"></ce-icon>
                {__('Cancel Scheduled Update', 'surecart')}
              </ce-button>
            )}
            {this?.subscription?.cancel_at_period_end ? (
              <ce-button
                type="link"
                href={addQueryArgs(window.location.href, {
                  action: 'renew',
                })}
              >
                <ce-icon name="repeat" slot="prefix"></ce-icon>
                {__('Renew Plan', 'surecart')}
              </ce-button>
            ) : (
              this.subscription?.status !== 'canceled' &&
              this.subscription?.current_period_end_at && (
                <ce-button
                  type="link"
                  href={addQueryArgs(window.location.href, {
                    action: 'cancel',
                  })}
                >
                  <ce-icon name="x" slot="prefix"></ce-icon>
                  {__('Cancel Plan', 'surecart')}
                </ce-button>
              )
            )}
          </ce-flex>
        )}

        <ce-card no-padding style={{ '--overflow': 'hidden' }}>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>

        {this.busy && <ce-block-ui spinner></ce-block-ui>}
      </ce-dashboard-module>
    );
  }
}
