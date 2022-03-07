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

  /**  */
  @State() renewing: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getSubscription();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
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
        this.error = __('Something went wrong', 'checkout_engine');
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
    return __('Subscription', 'checkout_engine');
  }

  renderRenewalText(subscription) {
    const tag = <ce-subscription-status-badge subscription={subscription}></ce-subscription-status-badge>;

    if (subscription?.cancel_at_period_end && subscription.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan will be canceled on', 'checkout_engine'))}{' '}
          <ce-format-date date={subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }
    if (subscription.status === 'trialing' && subscription.trial_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan begins on', 'checkout_engine'))}{' '}
          <ce-format-date date={subscription.trial_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }
    if (subscription.status === 'active' && subscription.current_period_end_at) {
      return (
        <span>
          {tag} {sprintf(__('Your plan renews on', 'checkout_engine'))}{' '}
          <ce-format-date date={subscription.current_period_end_at * 1000} month="long" day="numeric" year="numeric"></ce-format-date>
        </span>
      );
    }

    return tag;
  }

  renderEmpty() {
    return <slot name="empty">{__('This subscription does not exist.', 'checkout_engine')}</slot>;
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
      <ce-dashboard-module heading={this.heading || __('Current Plan', 'checkout_engine')} class="subscription" error={this.error}>
        {!!this.subscription && (
          <ce-flex slot="end">
            {this?.subscription?.cancel_at_period_end ? (
              <ce-button
                type="link"
                href={addQueryArgs(window.location.href, {
                  action: 'renew',
                })}
              >
                <ce-icon name="repeat" slot="prefix"></ce-icon>
                {__('Renew Plan', 'checkout_engine')}
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
                  {__('Cancel', 'checkout_engine')}
                </ce-button>
              )
            )}
          </ce-flex>
        )}

        <ce-card no-padding style={{ '--overflow': 'hidden' }}>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>
      </ce-dashboard-module>
    );
  }
}
