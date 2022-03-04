import { Component, Element, h, Prop, State } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Invoice, Subscription } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';
import { translatedInterval } from '../../../../functions/price';

@Component({
  tag: 'ce-subscriptions-list',
  styleUrl: 'ce-subscriptions-list.scss',
  shadow: true,
})
export class CeSubscriptionsList {
  @Element() el: HTMLCeSubscriptionsListElement;
  /** Customer id to fetch subscriptions */
  @Prop() query: object;
  @Prop() listTitle: string;
  @Prop() cancelBehavior: 'period_end' | 'immediate' = 'period_end';

  @State() subscriptions: Array<Subscription> = [];

  /** Loading state */
  @State() loading: boolean;

  /** Error message */
  @State() error: string;

  /** Does this have a title slot */
  @State() hasTitleSlot: boolean;

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getSubscriptions();
    });
    this.handleSlotChange();
  }

  handleSlotChange() {
    this.hasTitleSlot = !!this.el.querySelector('[slot="title"]');
  }

  /** Get all subscriptions */
  async getSubscriptions() {
    if (!this.query) return;
    try {
      this.loading = true;
      this.subscriptions = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/subscriptions/`, {
          expand: ['price', 'price.product', 'latest_invoice'],
          ...this.query,
        }),
      })) as Subscription[];
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

    if (Object.keys(subscription?.pending_update ?? {}).length > 0) {
      return 'Updating';
    }

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
          <ce-format-date date={subscription.trial_end_at} type="timestamp" month="long" day="numeric" year="numeric"></ce-format-date>
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
    return <slot name="empty">{__('You have no subscriptions.', 'checkout_engine')}</slot>;
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

    if (this.subscriptions?.length === 0) {
      return this.renderEmpty();
    }

    return this.subscriptions.map(subscription => {
      return (
        <ce-stacked-list-row
          href={addQueryArgs(window.location.href, {
            action: 'edit',
            model: 'subscription',
            id: subscription.id,
          })}
          style={{ '--columns': '2' }}
          mobile-size={0}
        >
          <div>
            <ce-text style={{ '--font-weight': 'var(--ce-font-weight-bold)' }}>
              {this.renderName(subscription)}{' '}
              {Object.keys(subscription?.pending_update || {}).length > 0 && <ce-tag size="small">{__('Update Scheduled', 'checkout_engine')}</ce-tag>}
            </ce-text>
            <ce-format-number
              type="currency"
              currency={(subscription?.latest_invoice as Invoice)?.currency}
              value={(subscription?.latest_invoice as Invoice)?.total_amount}
            ></ce-format-number>
            {translatedInterval(subscription?.price?.recurring_interval_count || 0, subscription?.price?.recurring_interval, '/', '')}
            <div>{this.renderRenewalText(subscription)}</div>
          </div>
          <ce-icon name="chevron-right" slot="suffix"></ce-icon>
        </ce-stacked-list-row>
      );
    });
  }

  render() {
    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
      );
    }

    return (
      <div
        class={{
          'subscriptions-list': true,
        }}
      >
        {this.listTitle && (
          <ce-heading>
            {this.listTitle || __('Subscriptions', 'checkout_engine')}
            <ce-button
              type="link"
              href={addQueryArgs(window.location.href, {
                action: 'index',
                model: 'subscription',
              })}
              slot="end"
            >
              {__('View all', 'checkout_engine')}
              <ce-icon name="chevron-right" slot="suffix"></ce-icon>
            </ce-button>
          </ce-heading>
        )}
        <ce-card no-padding style={{ '--overflow': 'hidden' }}>
          <ce-stacked-list>{this.renderContent()}</ce-stacked-list>
        </ce-card>
      </div>
    );
  }
}
