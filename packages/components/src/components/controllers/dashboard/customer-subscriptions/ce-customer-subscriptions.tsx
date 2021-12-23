import { Component, h, Listen, Prop, State, Watch } from '@stencil/core';
import { addQueryArgs, getQueryArg } from '@wordpress/url';
import apiFetch from '../../../../functions/fetch';
import { Universe } from 'stencil-wormhole';
import { Prices, Products, Subscription } from '../../../../types';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'ce-customer-subscriptions',
  styleUrl: 'ce-customer-subscriptions.scss',
  shadow: true,
})
export class CeCustomerSubscriptions {
  @Prop() customerId: string;
  @Prop() cancelBehavior: 'period_end' | 'immediate' = 'period_end';
  @Prop() upgradeGroups: Array<Array<string>>;
  @State() subscriptions: Subscription[];
  @State() loading: boolean;
  @State() pricesEntities: Prices = {};
  @State() productsEntities: Products = {};
  @State() id: string;
  @State() error: string;
  @State() currentState: 'index' | 'single' = 'index';

  @Listen('ceAddEntities')
  handleAddEntities(e) {
    const { products, prices } = e.detail;
    // add products.
    if (Object.keys(products?.length || {})) {
      this.productsEntities = {
        ...this.productsEntities,
        ...products,
      };
    }

    // add prices.
    if (Object.keys(prices?.length || {})) {
      this.pricesEntities = {
        ...this.pricesEntities,
        ...prices,
      };
    }
  }

  @Listen('ceUpdateSubscription')
  handleSubscriptionUpdate(e) {
    const subscription = e.detail;
    if (subscription) {
      this.id = subscription.id;
      console.log(this.id);
      window.history.pushState(null, '', addQueryArgs(window.location.href, { subscription: { id: subscription.id } }));
    } else {
      this.id = null;
    }
  }

  @Listen('ceFetchSubscriptions')
  handleSubscriptionsFetch(e) {
    const fetchProps = e.detail;
    this.getSubscriptions(fetchProps);
  }

  @Listen('ceFetchSubscription')
  handleSubscriptionFetch(e) {
    const { id, props } = e.detail;
    this.getSubscription(id, props);
  }

  @Watch('id')
  handleIdChange(id) {
    this.currentState = id ? 'single' : 'index';
  }

  componentWillLoad() {
    window.onpopstate = () => {
      this.setCurrentState();
    };
    this.setCurrentState();
    // @ts-ignore
    Universe.create(this, this.state());
  }

  setCurrentState() {
    const subscription = getQueryArg(window.location.href, 'subscription') as { id: string };
    if (subscription?.id) {
      this.id = subscription.id;
      this.currentState = 'single';
    } else {
      this.id = null;
      this.currentState = 'index';
    }
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

  /** Get a single subscription */
  async getSubscription(id, props = {}) {
    if (!this.customerId) return;
    try {
      this.loading = true;
      this.subscriptions = (await await apiFetch({
        path: addQueryArgs(`checkout-engine/v1/subscriptions/`, {
          expand: ['subscription_items', 'subscription_item.price', 'price.product'],
          ids: [id],
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

  state() {
    return {
      subscription_id: this.id,
      upgradeGroups: this.upgradeGroups,
      customerId: this.customerId,
      prices: this.pricesEntities,
      products: this.productsEntities,
      subscriptions: this.subscriptions,
      loading: this.loading,
      cancelBehavior: this.cancelBehavior,
      isIndex: this.currentState === 'index',
      isSingle: this.currentState === 'single',
    };
  }

  render() {
    return (
      <Universe.Provider state={this.state()}>
        <slot />
      </Universe.Provider>
    );
  }
}
