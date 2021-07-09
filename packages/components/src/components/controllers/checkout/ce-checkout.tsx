import { Component, h, Prop, Element, State, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { Price, Coupon, CheckoutSession, Customer, LineItem } from '../../../types';
import { Universe } from 'stencil-wormhole';
import apiFetch from '../../../functions/fetch';
import { addQueryArgs } from '@wordpress/url';
@Component({
  tag: 'ce-checkout',
  styleUrl: 'ce-checkout.scss',
  shadow: false,
})
export class CECheckout {
  @Element() el: HTMLElement;

  @Prop() priceIds: Array<string>;
  @Prop() stripePublishableKey: string;
  @Prop() currencyCode: string = 'usd';

  @State() message: string = '';
  @State() prices: Array<Price>;
  @State() selectedPriceIds: Set<string>;
  @State() customer: Customer;
  @State() coupon: Coupon;
  @State() loading: boolean;
  @State() calculating: boolean;
  @State() subtotal: number = 0;
  @State() total: number = 0;
  @State() submitting: boolean;
  @State() checkoutSession: CheckoutSession;
  @State() metaData: Object;
  @Event() ceLoaded: EventEmitter<void>;

  @Listen('ceUpdateCheckoutSession')
  handleCheckoutSessionChange(e) {
    this.checkoutSession = e.detail;
  }

  /**
   * Update checkout session on server when it changes here
   */
  @Watch('checkoutSession')
  handleSelectChange() {
    this.updateSession();
  }

  componentWillLoad() {
    // @ts-ignore
    Universe.create(this, this.state());

    // fetch prices and create session
    this.loading = true;
    Promise.all([this.fetchPrices(), this.startSession()]).finally(() => (this.loading = false));
  }

  /**
   * Create a new checkout session
   */
  async startSession() {
    this.checkoutSession = (await apiFetch({
      method: 'POST', // create or update
      path: 'checkout-engine/v1/checkout_sessions',
      data: this.checkoutSession,
    })) as CheckoutSession;
  }

  /**
   * Create or update a session based on chosen line items
   */
  async updateSession() {
    if (!this.checkoutSession?.id) {
      return;
    }

    this.calculating = true;
    try {
      this.checkoutSession = (await apiFetch({
        method: 'PATCH', // create or update
        path: `checkout-engine/v1/checkout_sessions/${this.checkoutSession.id}`,
        data: this.checkoutSession,
      })) as CheckoutSession;
    } finally {
      this.calculating = false;
    }
  }

  /**
   * Fetch prices based on ids
   */
  @Watch('priceIds')
  async fetchPrices() {
    let res = (await apiFetch({
      path: addQueryArgs('checkout-engine/v1/price', {
        active: true,
        ids: this.priceIds,
      }),
    })) as Array<Price>;
    // this does not allow prices witha different currency than provided
    this.prices = res.filter(price => {
      return price.currency === this.currencyCode;
    });
  }

  state() {
    return {
      paymentMethod: 'stripe',
      checkoutSession: this.checkoutSession,
      stripePublishableKey: this.stripePublishableKey,
      priceIds: this.priceIds,
      selectedPriceIds: this.selectedPriceIds,
      currencyCode: this.currencyCode,
      prices: this.prices,
      loading: this.loading,
      calculating: this.calculating,
      subtotal: this.subtotal,
      total: this.total,
    };
  }

  render() {
    return (
      <div class="ce-checkout-container">
        <Universe.Provider state={this.state()}>
          <slot />
        </Universe.Provider>
      </div>
    );
  }
}
