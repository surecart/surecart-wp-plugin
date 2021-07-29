import { Component, h, Prop, Element, State, Watch, Listen } from '@stencil/core';
import { Price, Coupon, CheckoutSession, Customer, LineItemData, Loading, PriceData } from '../../../types';
import { pick } from '../../../functions/util';
import { getPrices } from '../../../services/price/index';
import { updateSession, createSession, finalizeSession } from '../../../services/session/index';

import { Universe } from 'stencil-wormhole';
@Component({
  tag: 'ce-checkout',
  styleUrl: 'ce-checkout.scss',
  shadow: false,
})
export class CECheckout {
  @Element() el: HTMLElement;

  /** Pass an array of ids for choice fields */
  @Prop() choicePriceIds: Array<string>;

  /** Pass an array of price information to load into the form. */
  @Prop({ attribute: 'prices' }) priceData: Array<PriceData>;

  /** Currency to use for this checkout. */
  @Prop() currencyCode: string = 'usd';

  /** Pass line item data to create with session. */
  @Prop({ mutable: true }) lineItemData: Array<LineItemData>;

  /** Optionally pass a coupon. */
  @Prop({ mutable: true }) coupon: Coupon;

  /** Translation object. */
  @Prop() i18n: Object;

  /** Stripe publishable key */
  @Prop() stripePublishableKey: string;

  /** Stores fetched prices for use throughout component.  */
  @State() prices: Array<Price>;

  /** Stores the users's selected price ids. */
  @State() selectedchoicePriceIds: Set<string>;

  /** Stores the customer. */
  @State() customer: Customer;

  /** Loading states for different parts of the form. */
  @State() loading: Loading = { prices: false, session: false };

  /** Calculation state for totals. */
  @State() calculating: boolean;

  /** State for form submission */
  @State() submitting: boolean;

  /** Stores the current CheckoutSession */
  @State() checkoutSession: CheckoutSession;

  /** Error to display. */
  @State() error: string;

  @Listen('ceFetchPrices')
  handleFetchPrices(e) {
    console.log(e);
  }

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
  async handleFormSubmit() {
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

    // create the checkout session.
    this.createSession();

    // maybe fetch prices for choice.
    // if (this?.choicePriceIds?.length || this?.priceData?.length) {
    //   this.fetchPrices();
    // }
  }

  /**
   * Create a new checkout session
   */
  async createSession() {
    this.calculating = true;
    this.loading.session = true;
    try {
      this.checkoutSession = await createSession(this.getSessionSaveData());
    } catch (e) {
      this.error = 'Something went wrong';
    } finally {
      this.loading.session = false;
      this.calculating = false;
    }
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
  @Watch('choicePriceIds')
  async fetchPrices() {
    this.loading.prices = true;
    try {
      this.prices = await getPrices({
        query: {
          active: true,
          ids: this.choicePriceIds,
        },
        currencyCode: this.currencyCode,
      });
    } finally {
      this.loading.prices = false;
    }
  }

  state() {
    return {
      paymentMethod: 'stripe',
      checkoutSession: this.checkoutSession,
      stripePublishableKey: this.stripePublishableKey,
      choicePriceIds: this.choicePriceIds,
      prices: this.prices,
      lineItemData: this.lineItemData,
      currencyCode: this.currencyCode,
      loading: this.loading,
      calculating: this.calculating,
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
