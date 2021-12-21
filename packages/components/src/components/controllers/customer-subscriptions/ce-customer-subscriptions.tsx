import { Component, h, Prop, State } from '@stencil/core';
import apiFetch from '../../../functions/fetch';
import { sprintf, __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { Pagination, Price, Subscription, SubscriptionItem } from '../../../types';

@Component({
  tag: 'ce-customer-subscriptions',
  styleUrl: 'ce-customer-subscriptions.scss',
  shadow: true,
})
export class CeCustomerSubscriptions {
  /** Customer id to fetch subscriptions */
  @Prop() customerId: string;

  @State() subscriptions: Array<Subscription>;
  @State() loading: boolean;
  @State() error: string;

  componentWillLoad() {
    this.getSubscriptions();
  }

  /** Update a session */
  async getSubscriptions() {
    if (!this.customerId) return;
    try {
      this.loading = true;
      this.subscriptions = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/subscriptions/`, {
          expand: ['subscription_items', 'subscription_item.price', 'price.product'],
          customer_ids: [this.customerId],
        }),
      })) as Subscription[];
    } catch (e) {
      if (e?.message) {
        this.error = e.message;
      } else {
        this.error = __('Something went wrong', 'checkout_engine');
      }
      console.log(this.error);
    } finally {
      this.loading = false;
    }
  }

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
      return __('You have no subscriptions.', 'checkout_engine');
    }

    return this.subscriptions.map(subscription => (
      <ce-customer-subscription subscription={subscription}>
        <ce-button type="primary" slot="actions">
          {__('Update Plan', 'checkout_engine')}
        </ce-button>
        <ce-button slot="actions">{__('Cancel Plan', 'checkout_engine')}</ce-button>
      </ce-customer-subscription>
    ));
  }
}
