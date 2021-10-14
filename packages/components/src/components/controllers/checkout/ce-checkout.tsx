import { Component, h, Prop, Element, State, Watch, Listen } from '@stencil/core';
import { Price, Product, Coupon, CheckoutSession, Customer, LineItemData, PriceData, ProductChoices, Keys, ChoiceType } from '../../../types';
import { handleInputs } from './functions';
import { getProducts } from '../../../services/fetch';
import { calculateInitialLineItems } from '../../../functions/line-items';
import { getOrCreateSession, createOrUpdateSession, finalizeSession, getSession } from '../../../services/session/index';
import { Universe } from 'stencil-wormhole';
import { addQueryArgs } from '@wordpress/url';
import { interpret } from '@xstate/fsm';
import { checkoutMachine } from './helpers/checkout-machine';

@Component({
  tag: 'ce-checkout',
  styleUrl: 'ce-checkout.scss',
  shadow: false,
})
export class CECheckout {
  /** Holds our state machine service */
  private _stateService = interpret(checkoutMachine);

  /** Element */
  @Element() el: HTMLElement;

  /** Pass an array of ids for choice fields */
  @Prop() choicePriceIds: Array<string>;

  /** Pass an array of choices */
  @Prop() choices: ProductChoices;

  /** Pass an array of products */
  @Prop() products: ProductChoices;

  /** Give a user a choice to switch session prices */
  @Prop() choiceType: ChoiceType = 'all';

  /** Currency to use for this checkout. */
  @Prop() currencyCode: string = 'usd';

  /** Where to go on success */
  @Prop() successUrl: string = '';

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
  @State() productsData: Array<Product>;

  /** Stores the users's selected price ids. */
  @State() selectedchoicePriceIds: Set<string>;

  /** Stores the customer. */
  @State() customer: Customer;

  /** Loading states for different parts of the form. */
  @State() checkoutState = checkoutMachine.initialState;

  @State() loading: boolean = true;

  /** Calculation state for totals. */
  @State() calculating: boolean;

  /** State for form submission */
  @State() submitting: boolean;

  /** Stores the current CheckoutSession */
  @State() checkoutSession: CheckoutSession;

  /** Error to display. */
  @State() error: string;

  /** Is the checkout complete? */
  @State() complete: boolean;

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

  @Listen('cePaid')
  async handlePaid() {
    this.setState('PAID');
    window.localStorage.removeItem(this.el.id);
    window.location.href = addQueryArgs(this.successUrl, { checkout_session: this.checkoutSession.id });
  }

  @Listen('cePayError')
  handlePayError(e) {
    this.makeDraft();
  }

  /**
   * Handles coupon updates.
   */
  @Listen('ceApplyCoupon')
  async handleCouponApply(e) {
    const promotion_code = e.detail;
    const { send } = this._stateService;
    try {
      send('FETCH');
      this.calculating = true;
      this.checkoutSession = await createOrUpdateSession({
        id: this.checkoutSession.id,
        data: {
          discount: {
            ...(promotion_code ? { promotion_code } : {}),
          },
        },
      });
      send('REJECT');
    } finally {
      send('REJECT');
      this.calculating = false;
    }
  }

  setState(name) {
    const { send } = this._stateService;
    return send(name);
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
    if (!data) return;
    const { email, name, ...rest } = data;
    this.formState = {
      ...(data.email ? { email: data.email } : {}),
      ...(data.name ? { name: data.name } : {}),
      metadata: {
        ...rest,
      },
    };
  }

  @Watch('complete')
  handleComplete(val) {
    if (val && this.successUrl) {
      window.location.href = addQueryArgs(this.successUrl, { checkout_session: this.checkoutSession.id });
    }
  }

  /**
   * Handles the form submission.
   * @param e
   */
  @Listen('ceFormSubmit')
  async handleFormSubmit(e) {
    this.handleFormChange(e);

    const { send } = this._stateService;

    // first validate server-side and get key
    try {
      send('UPDATING');
      this.checkoutSession = await finalizeSession({
        id: this.checkoutSession.id,
        data: {
          ...this.getSessionSaveData(),
          status: 'draft',
        },
        processor: 'stripe',
      });
      // send('FINALIZE');
      // TODO: process payment with token
    } catch (e) {
      if (e?.code === 'checkout_session.invalid_status_transition') {
        await createOrUpdateSession({
          id: this.checkoutSession.id,
          data: {
            ...this.getSessionSaveData(),
            status: 'draft',
          },
        });
        this.handleFormSubmit(e);
        return;
      }
      this.handleErrorResponse(e);
      this.calculating = false;
    }
  }

  async makeDraft() {
    this.setState('DRAFT');
    await createOrUpdateSession({
      id: this.checkoutSession.id,
      data: {
        ...this.getSessionSaveData(),
        status: 'draft',
      },
    });
    this.setState('RESOLVE');
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
    if (val.status === 'paid') {
      window.localStorage.removeItem(this.el.id);
    }

    handleInputs(this.el, val);
  }

  getSessionSaveData() {
    return {
      currency: this.currencyCode,
      email: this.checkoutSession.email,
      name: this.checkoutSession.name,
      metadata: this.checkoutSession.metadata,
      live_mode: false,
      group_key: this.el.id,
      line_items: this.lineItemData,
      ...this.formState,
    };
  }

  componentWillLoad() {
    // Start state machine.
    this._stateService.subscribe(state => (this.checkoutState = state));
    this._stateService.start();

    // @ts-ignore
    Universe.create(this, this.state());

    // // fetch products
    // this.fetchProducts();
    // // get or create session
    // this.getOrCreateSession();
  }

  /** Remove state machine on disconnect. */
  disconnectedCallback() {
    this._stateService.stop();
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
    const { send } = this._stateService;
    const id = window.localStorage.getItem(this.el.id);

    try {
      send('FETCH');
      this.checkoutSession = (await getOrCreateSession({
        id,
        data: {
          currency: this.currencyCode || 'usd',
          line_items: calculateInitialLineItems(this.choices, this.choiceType),
        },
      })) as CheckoutSession;
      send('RESOLVE');
    } catch (e) {
      send('REJECT');
      this.handleErrorResponse(e);
      window.localStorage.removeItem(this.el.id);
      this.getOrCreateSession();
    }
  }

  /**
   * Create or update a session based on chosen line items
   */
  async createOrUpdateSession() {
    const { send } = this._stateService;
    const id = localStorage.getItem(this.el.id) || this.checkoutSession?.id;
    try {
      send('FETCH');
      this.checkoutSession = (await createOrUpdateSession({
        id,
        data: this.getSessionSaveData(),
      })) as CheckoutSession;
      send('RESOLVE');
    } catch (e) {
      send('REJECT');
      this.handleErrorResponse(e);
    }
  }

  async fetchProducts() {
    try {
      this.productsData = await getProducts({
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
      state: this.checkoutState.value,
      keys: this.keys,
      error: this.error,
      checkoutSession: this.checkoutSession,
      stripePublishableKey: this.stripePublishableKey,
      choices: this.choices,
      choicePriceIds: this.choicePriceIds,
      prices: this.prices,
      products: this.productsData,
      lineItemData: this.lineItemData,
      currencyCode: this.currencyCode,
      loading: !Object.keys(this.loaded).every(key => !!this.loaded[key]),
    };
  }

  render() {
    if (!this.complete && this.checkoutSession?.status === 'paid') {
      return (
        <ce-card>
          <ce-alert type="success" open>
            <span slot="title">Session Expired.</span>
            Please reload the page.
          </ce-alert>
        </ce-card>
      );
    }

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
        {this.error && <ce-alert type="danger">{this.error}</ce-alert>}
        <Universe.Provider state={this.state()}>
          <slot />
        </Universe.Provider>
      </div>
    );
  }
}
