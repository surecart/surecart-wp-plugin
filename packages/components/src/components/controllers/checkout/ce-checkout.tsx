import { Component, h, Prop, Element, State, Watch, Listen } from '@stencil/core';
import { Price, Product, Coupon, CheckoutSession, Customer, LineItemData, PriceData, ProductChoices, Keys } from '../../../types';
import { handleInputs } from './functions';
import { getProducts } from '../../../services/fetch';
import { calculateInitialLineItems } from '../../../functions/line-items';
import { getOrCreateSession, createOrUpdateSession, finalizeSession } from '../../../services/session/index';
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

  /** Pass an array of choices */
  @Prop() choices: ProductChoices;

  /** Pass an array of price information to load into the form. */
  @Prop({ attribute: 'prices' }) priceData: Array<PriceData>;

  /** Currency to use for this checkout. */
  @Prop() currencyCode: string = 'usd';

  /** Pass line item data to create with session. */
  @Prop({ mutable: true }) lineItemData: Array<LineItemData>;

  /** Optionally pass a coupon. */
  @Prop({ mutable: true }) coupon: Coupon;

  /** Publishable keys for providers */
  @Prop() keys: Keys = {
    stripe: '',
    paypal: '',
  };

  /** Alignment */
  @Prop() alignment: 'center' | 'wide' | 'full';

  /** Translation object. */
  @Prop() i18n: Object;

  /** Stripe publishable key */
  @Prop() stripePublishableKey: string;

  /** Stores fetched prices for use throughout component.  */
  @State() prices: Array<Price>;

  /** Stores fetched prices for use throughout component.  */
  @State() products: Array<Product>;

  /** Stores the users's selected price ids. */
  @State() selectedchoicePriceIds: Set<string>;

  /** Stores the customer. */
  @State() customer: Customer;

  /** Loading states for different parts of the form. */
  @State() loading: boolean = true;

  /** Calculation state for totals. */
  @State() calculating: boolean;

  /** State for form submission */
  @State() submitting: boolean;

  /** Stores the current CheckoutSession */
  @State() checkoutSession: CheckoutSession;

  /** Error to display. */
  @State() error: string;

  /** Has the users nonce/session expired */
  @State() expired: boolean;

  /** Loading state */
  @State() loaded: {
    session: boolean;
    products: boolean;
  } = {
    session: false,
    products: false,
  };

  @State() formState: any;
  @State() updateSession: CheckoutSession;

  /** Watch choices and fetch if changed */
  @Watch('choices')
  async handleChoicesChange() {
    this.fetchProducts();
  }

  /**
   * Handles coupon updates.
   */
  @Listen('ceApplyCoupon')
  async handleCouponApply(e) {
    const promotion_code = e.detail;
    try {
      this.calculating = true;
      this.checkoutSession = await createOrUpdateSession({
        id: this.checkoutSession.id,
        data: {
          discount: {
            ...(promotion_code ? { promotion_code } : {}),
          },
        },
      });
    } finally {
      this.calculating = false;
    }
  }

  /**
   * Handles line items update.
   */
  @Listen('ceUpdateLineItems')
  handleUpdateLineItemChange(e) {
    this.lineItemData = e.detail;
  }

  @Listen('ceUpdateLineItem')
  handleLineItemChange(e) {
    const { id, amount } = e.detail;
    this.lineItemData = this.checkoutSession.line_items.map(item => {
      return {
        price_id: item.price.id,
        quantity: item.id === id ? amount : item.quantity,
      };
    });
  }

  /** Update form state when form data changes */
  @Listen('ceFormChange')
  handleFormChange(e) {
    const data = e.detail;
    const { email, name, ...rest } = data;
    this.formState = {
      ...(data.email ? { email: data.email } : {}),
      ...(data.name ? { name: data.name } : {}),
      metadata: {
        ...rest,
      },
    };
  }

  /**
   * Handles the form submission.
   * @param e
   */
  @Listen('ceFormSubmit')
  async handleFormSubmit(e) {
    this.handleFormChange(e);

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
    this.calculating = true;
    this.createOrUpdateSession();
  }

  @Watch('formState')
  handleDraftSessionChanges(val, oldVal) {
    if (oldVal && JSON.stringify(val) === JSON.stringify(oldVal)) return;
    this.createOrUpdateSession();
  }

  /**
   * When we have a checkout session, we are done loading.
   */
  @Watch('checkoutSession')
  handleCheckoutSessionChange(val) {
    if (val?.id) {
      this.loaded.session = true; // session loaded
      localStorage.setItem(this.el.id, val.id);
    }
    handleInputs(this.el, val);
  }

  getSessionSaveData() {
    return {
      currency: this.currencyCode,
      email: this.checkoutSession.email,
      name: this.checkoutSession.name,
      metadata: this.checkoutSession.metadata,
      line_items: this.lineItemData,
      ...this.formState,
    };
  }

  componentWillLoad() {
    // @ts-ignore
    Universe.create(this, this.state());

    // fetch products
    this.fetchProducts();
    // get or create session
    this.getOrCreateSession();
  }

  handleErrorResponse(e) {
    if (e?.code === 'rest_cookie_invalid_nonce') {
      this.expired = true;
      return;
    }
    if (e?.message) {
      this.error = e.message;
    }
  }

  async getOrCreateSession() {
    try {
      this.checkoutSession = (await getOrCreateSession({
        id: window.localStorage.getItem(this.el.id),
        data: {
          currency: this.currencyCode || 'usd',
          line_items: calculateInitialLineItems(this.choices, this.priceData),
        },
      })) as CheckoutSession;
    } catch (e) {
      this.handleErrorResponse(e);
    } finally {
      this.calculating = false;
    }
  }

  /**
   * Create or update a session based on chosen line items
   */
  async createOrUpdateSession() {
    const id = localStorage.getItem(this.el.id) || this.checkoutSession?.id;
    try {
      this.checkoutSession = (await createOrUpdateSession({
        id,
        data: this.getSessionSaveData(),
      })) as CheckoutSession;
    } catch (e) {
      this.handleErrorResponse(e);
    } finally {
      this.calculating = false;
    }
  }

  async fetchProducts() {
    try {
      this.products = await getProducts({
        query: {
          active: true,
          ids: Object.keys(this.choices),
        },
      });
    } catch (e) {
      this.handleErrorResponse(e);
    } finally {
      this.loaded.products = true;
    }
  }

  state() {
    return {
      paymentMethod: 'stripe',
      keys: this.keys,
      error: this.error,
      checkoutSession: this.checkoutSession,
      stripePublishableKey: this.stripePublishableKey,
      choices: this.choices,
      choicePriceIds: this.choicePriceIds,
      prices: this.prices,
      products: this.products,
      lineItemData: this.lineItemData,
      currencyCode: this.currencyCode,
      loading: !Object.keys(this.loaded).every(key => !!this.loaded[key]),
      calculating: this.calculating,
    };
  }

  render() {
    if (this.expired) {
      return (
        <ce-block-ui>
          <div>Please refresh the page.</div>
        </ce-block-ui>
      );
    }

    return (
      <div
        class={{
          'ce-checkout-container': true,
          'ce-align-center': this.alignment === 'center',
          'ce-align-wide': this.alignment === 'wide',
          'ce-align-full': this.alignment === 'full',
        }}
      >
        <Universe.Provider state={this.state()}>
          <slot />
        </Universe.Provider>
      </div>
    );
  }
}
