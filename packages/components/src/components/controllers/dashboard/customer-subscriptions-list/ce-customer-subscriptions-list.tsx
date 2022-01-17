import { Component, Element, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Pagination, Price, Subscription, SubscriptionItem } from '../../../../types';
import { onFirstVisible } from '../../../../functions/lazy';

@Component({
  tag: 'ce-customer-subscriptions-list',
  styleUrl: 'ce-customer-subscriptions-list.scss',
  shadow: true,
})
export class CeCustomerSubscriptionsList {
  @Element() el: HTMLCeCustomerSubscriptionsListElement;
  /** Customer id to fetch subscriptions */
  @Prop() customerId: string;
  @Prop() cancelBehavior: 'period_end' | 'immediate' = 'period_end';
  @Prop() loading: boolean;
  @Prop({ mutable: true }) subscriptions: Array<Subscription>;
  @Prop() error: string;
  @Prop() isIndex: boolean;

  @Event() ceFetchSubscriptions: EventEmitter<object>;

  @State() state: 'cancel' | 'update' | false;
  @State() fetched: boolean;

  renderName(subscription_items: { object: 'list'; pagination: Pagination; data: Array<SubscriptionItem> }) {
    if (subscription_items.pagination.count > 1) {
      return sprintf(__('%d items', 'checkout_engine'), subscription_items.pagination.count);
    }
    const price = subscription_items.data[0].price as Price;

    if (typeof price?.product === 'string') return sprintf(__('%d item', 'checkout_engine'), 1);

    if (price?.product?.name) {
      return price.product.name;
    }
  }

  componentWillLoad() {
    onFirstVisible(this.el, () => {
      this.getSubscriptions();
    });
  }

  /** Get all subscriptions */
  async getSubscriptions(props = {}) {
    if (!this.customerId) return;
    try {
      this.loading = true;
      this.subscriptions = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/subscriptions/`, {
          expand: ['subscription_items', 'subscription_item.price', 'price.product'],
          status: ['active', 'trialing'],
          customer_ids: [this.customerId],
          ...props,
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

  render() {
    if (this.loading) {
      return (
        <ce-card>
          <ce-flex>
            <ce-flex flex-direction="column" style={{ flex: '1' }}>
              <ce-skeleton style={{ width: '30%', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '20%', display: 'inline-block' }}></ce-skeleton>
              <ce-skeleton style={{ width: '40%', display: 'inline-block' }}></ce-skeleton>
            </ce-flex>
            <ce-flex flex-direction="column">
              <ce-skeleton style={{ width: '200px' }}></ce-skeleton>
              <ce-skeleton style={{ width: '200px' }}></ce-skeleton>
            </ce-flex>
          </ce-flex>
        </ce-card>
      );
    }

    if (this.error) {
      return (
        <ce-alert open type="danger">
          <span slot="title">{__('Error', 'checkout_engine')}</span>
          {this.error}
        </ce-alert>
      );
    }

    if (!this?.subscriptions?.length) {
      return <slot name="empty">{__('You have no subscriptions.', 'checkout_engine')}</slot>;
    }

    return (
      <ce-spacing style={{ '--spacing': 'var(--ce-spacing-large)' }}>
        <slot name="before-list" />
        {this.subscriptions.map(subscription => {
          return <ce-customer-subscription subscription={subscription}></ce-customer-subscription>;
        })}
        <slot name="after-list" />
      </ce-spacing>
    );
  }
}
