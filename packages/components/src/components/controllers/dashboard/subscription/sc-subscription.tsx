import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Subscription } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'sc-subscription',
  styleUrl: 'sc-subscription.scss',
  shadow: true,
})
export class ScSubscription {
  @Element() el: HTMLScSubscriptionsListElement;
  /** Customer id to fetch subscriptions */
  @Prop() subscriptionId: string;
  @Prop() showCancel: boolean;
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
        path: addQueryArgs(`surecart/v1/subscriptions/${this.subscription?.id}/`, { expand: ['price', 'price.product', 'current_period', 'period.checkout'] }),
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
        path: addQueryArgs(`surecart/v1/subscriptions/${this.subscriptionId}`, {
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
    const tag = <sc-subscription-status-badge subscription={subscription}></sc-subscription-status-badge>;

    if (subscription?.cancel_at_period_end && subscription.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan will be canceled on', 'surecart'))}{' '}
          <sc-format-date date={subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }
    if (subscription.status === 'trialing' && subscription.trial_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan begins on', 'surecart'))} <sc-format-date date={subscription.trial_end_at * 1000} month="long" day="numeric" year="numeric"></sc-format-date>
        </span>
      );
    }
    if (subscription.status === 'active' && subscription.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan renews on', 'surecart'))}{' '}
          <sc-format-date date={subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></sc-format-date>
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
      <sc-stacked-list-row style={{ '--columns': '2' }} mobile-size={0}>
        <div style={{ padding: '0.5em' }}>
          <sc-skeleton style={{ width: '30%', marginBottom: '0.75em' }}></sc-skeleton>
          <sc-skeleton style={{ width: '20%', marginBottom: '0.75em' }}></sc-skeleton>
          <sc-skeleton style={{ width: '40%' }}></sc-skeleton>
        </div>
      </sc-stacked-list-row>
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
      <sc-stacked-list-row mobile-size={0}>
        <sc-subscription-details subscription={this.subscription}></sc-subscription-details>
      </sc-stacked-list-row>
    );
  }

  render() {
    return (
      <sc-dashboard-module heading={this.heading || __('Current Plan', 'surecart')} class="subscription" error={this.error}>
        {!!this.subscription && (
          <sc-flex slot="end">
            {!!Object.keys(this.subscription?.pending_update).length && (
              <sc-button type="link" onClick={() => this.cancelPendingUpdate()}>
                <sc-icon name="x-octagon" slot="prefix"></sc-icon>
                {__('Cancel Scheduled Update', 'surecart')}
              </sc-button>
            )}
            {this?.subscription?.cancel_at_period_end ? (
              <sc-button
                type="link"
                href={addQueryArgs(window.location.href, {
                  action: 'renew',
                })}
              >
                <sc-icon name="repeat" slot="prefix"></sc-icon>
                {__('Renew Plan', 'surecart')}
              </sc-button>
            ) : (
              this.subscription?.status !== 'canceled' &&
              this.subscription?.current_period_end_at &&
              this.showCancel && (
                <sc-button
                  type="link"
                  href={addQueryArgs(window.location.href, {
                    action: 'cancel',
                  })}
                >
                  <sc-icon name="x" slot="prefix"></sc-icon>
                  {__('Cancel Plan', 'surecart')}
                </sc-button>
              )
            )}
          </sc-flex>
        )}

        <sc-card no-padding style={{ '--overflow': 'hidden' }}>
          <sc-stacked-list>{this.renderContent()}</sc-stacked-list>
        </sc-card>

        {this.busy && <sc-block-ui spinner></sc-block-ui>}
      </sc-dashboard-module>
    );
  }
}
