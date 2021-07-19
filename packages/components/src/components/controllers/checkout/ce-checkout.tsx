import { Component, h, Prop, Element, State, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { Price, Coupon, CheckoutSession, Customer, LineItemData } from '../../../types';
import { pick } from '../../../functions/util';
import { updateSession, createSession, finalizeSession } from '../../../services/session/index';
import { getPrices } from '../../../services/price/index';

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
  @Prop({ mutable: true }) lineItemData: Array<LineItemData>;
  @Prop() i18n: Object;

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

  /**
   * Handles line items update.
   */
  @Listen('ceUpdateLineItems')
  handleLineItemChange(e) {
    this.lineItemData = e.detail;
  }

  /**
   * Handles the customer update.
   * @param e
   */
  @Listen('ceUpdateCustomer')
  async handleCustomerChange(e) {
    const { email, name } = e.detail;
    this.checkoutSession = {
      ...this.checkoutSession,
      ...{ email, name },
    };
    this.checkoutSession = await updateSession({
      id: this.checkoutSession.id,
      data: { email, name },
    });
  }

  /**
   * Handles the form submission.
   * @param e
   */
  @Listen('ceFormSubmit')
  async handleFormSubmit(e) {
    // first validate server-side and get key
    this.checkoutSession = await finalizeSession({
      id: this.checkoutSession.id,
      data: this.getSessionSaveData(),
      processor: 'stripe',
    });
  }

  /**
   * Update checkout session on server when it changes here
   */
  @Watch('lineItemData')
  handleSelectChange() {
    this.updateSession();
  }

  getSessionSaveData() {
    return {
      ...pick(this.checkoutSession || {}, ['customer_email', 'customer_first_name', 'customer_last_name', 'currency', 'meta_data']),
      line_items: this.lineItemData,
    };
  }

  componentWillLoad() {
    // @ts-ignore
    Universe.create(this, this.state());

    // fetch prices and create session
    this.loading = true;
    this.calculating = true;
    Promise.all([this.fetchPrices(), this.createSession()]).finally(() => (this.loading = false));
  }

  /**
   * Create a new checkout session
   */
  async createSession() {
    this.checkoutSession = await createSession(this.getSessionSaveData());
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
      this.checkoutSession = await updateSession({
        id: this.checkoutSession.id,
        data: this.getSessionSaveData(),
      });
    } finally {
      this.calculating = false;
    }
  }

  /**
   * Fetch prices based on ids
   */
  @Watch('priceIds')
  async fetchPrices() {
    this.prices = await getPrices({
      query: {
        active: true,
        ids: this.priceIds,
      },
      currencyCode: this.currencyCode,
    });
  }

  state() {
    return {
      paymentMethod: 'stripe',
      checkoutSession: this.checkoutSession,
      stripePublishableKey: this.stripePublishableKey,
      priceIds: this.priceIds,
      lineItemData: this.lineItemData,
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
