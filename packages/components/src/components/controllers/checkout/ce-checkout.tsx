import { Component, h, Prop, Element, State, Watch, Listen } from '@stencil/core';
import { Price, Product, Coupon, CheckoutSession, Customer, LineItemData, Keys, ChoiceType, PriceChoice, LineItemsData } from '../../../types';
import { handleInputs } from './functions';
import { getSessionId } from './helpers/session';
import { getPricesAndProducts } from '../../../services/fetch';
import { calculateInitialLineItems, convertLineItemsToLineItemData } from '../../../functions/line-items';
import { getOrCreateSession, createOrUpdateSession, finalizeSession } from '../../../services/session/index';
import { Universe } from 'stencil-wormhole';
import { addQueryArgs } from '@wordpress/url';
import { interpret } from '@xstate/fsm';
import { checkoutMachine } from './helpers/checkout-machine';
import { getChoicePrices } from '../../../functions/choices';

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

  /** An array of prices to pre-fill in the form. */
  @Prop({ attribute: 'prices' }) priceChoices: Array<PriceChoice>;

  /** Give a user a choice to switch session prices */
  @Prop({ attribute: 'choice-type' }) choiceType: ChoiceType = 'all';

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

  /** Stores fetched prices for use throughout component.  */
  @State() prices: Array<Price>;

  /** Stores fetched products for use throughout component.  */
  @State() products: Array<Product>;

  /** Stores the customer. */
  @State() customer: Customer;

  /** Loading states for different parts of the form. */
  @State() checkoutState = checkoutMachine.initialState;

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

  // stores line items data based on key.
  @State() lineItemsData: LineItemsData = {
    choices: [],
  };

  /** Watch choices and fetch if changed */
  @Watch('priceChoices')
  async handlePricesChange() {
    this.fetchPrices();
  }

  @Listen('cePaid')
  async handlePaid() {
    this.setState('PAID');
    window.localStorage.removeItem(this.el.id);
    window.location.href = addQueryArgs(this.successUrl, { checkout_session: this.checkoutSession.id });
  }

  @Listen('cePayError')
  handlePayError() {
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
    }
  }

  setState(name) {
    const { send } = this._stateService;
    return send(name);
  }

  /**
   * Handles line items update.
   * We use a key to store each line item change separately
   * then flatten before we send the request. This makes sure
   * components can't override line_item changes from other components.
   */
  @Listen('ceUpdateLineItems')
  handleUpdateLineItemChange(e) {
    if (e.detail.key) {
      this.lineItemsData = {
        ...this.lineItemsData,
        [e.detail.key]: e.detail.value,
      };
    }
  }

  /**
   * Update a specific line item by line item id.
   */
  @Listen('ceUpdateLineItem')
  handleLineItemChange(e) {
    const { id, data } = e.detail;
    const line_item = this.checkoutSession.line_items.data.find(item => item.id === id);
    if (!line_item?.id) return;
    const price_id = line_item.price.id;
    const lineItemData = convertLineItemsToLineItemData(this.checkoutSession.line_items);
    this.updateSessionLineItems(
      lineItemData.map(item => {
        if (item.price_id === price_id) {
          item = {
            ...item,
            ...data,
          };
        }
        return item;
      }),
    );
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

  async updateSessionLineItems(line_items) {
    const { send } = this._stateService;
    try {
      send('FETCH');
      this.checkoutSession = (await createOrUpdateSession({
        id: this.checkoutSession.id,
        data: {
          currency: this.currencyCode || 'usd',
          line_items,
        },
      })) as CheckoutSession;
      send('RESOLVE');
    } catch (e) {
      send('REJECT');
      this.handleErrorResponse(e);
      window.localStorage.removeItem(this.el.id);
    }
  }

  @Watch('lineItemsData')
  async handleLineItemsDataChange(val) {
    this.updateSessionLineItems(Object.values(val || {}).flat());
  }

  @Watch('formState')
  handleDraftSessionChanges(val, oldVal) {
    if (oldVal && JSON.stringify(val) === JSON.stringify(oldVal)) return;
    this.createOrUpdateSession();
  }

  @Watch('priceChoices')
  async createOrUpdateSession() {
    const { send } = this._stateService;
    const id = getSessionId(this.el.id, this.checkoutSession, true);
    const line_items = calculateInitialLineItems(this.priceChoices, this.choiceType);

    send('FETCH');

    if (!line_items?.length) {
      send('RESOLVE');
      return;
    }

    try {
      this.checkoutSession = (await createOrUpdateSession({
        id,
        data: {
          currency: this.currencyCode || 'usd',
          line_items,
        },
      })) as CheckoutSession;
      console.log(this.checkoutSession);
      send('RESOLVE');
    } catch (e) {
      send('REJECT');
      this.handleErrorResponse(e);
      window.localStorage.removeItem(this.el.id);
      // this.getOrCreateSession();
    }
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

    // fetch products
    this.fetchPrices();
    // get or create session
    this.createOrUpdateSession();
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
          line_items: calculateInitialLineItems(this.priceChoices, this.choiceType),
        },
      })) as CheckoutSession;
      send('RESOLVE');
    } catch (e) {
      send('REJECT');
      this.handleErrorResponse(e);
      window.localStorage.removeItem(this.el.id);
      // this.getOrCreateSession();
    }
  }

  @Watch('priceChoices')
  test() {
    console.log(this.priceChoices);
  }

  /**
   * Create or update a session based on chosen line items
   */
  // async createOrUpdateSession() {
  //   const { send } = this._stateService;
  //   const id = localStorage.getItem(this.el.id) || this.checkoutSession?.id;
  //   try {
  //     send('FETCH');
  //     this.checkoutSession = (await createOrUpdateSession({
  //       id,
  //       data: this.getSessionSaveData(),
  //     })) as CheckoutSession;
  //     send('RESOLVE');
  //   } catch (e) {
  //     send('REJECT');
  //     this.handleErrorResponse(e);
  //   }
  // }

  async fetchPrices() {
    try {
      const { products, prices } = await getPricesAndProducts({
        active: true,
        ids: getChoicePrices(this.priceChoices).map(p => p.id),
      });
      this.products = products;
      this.prices = prices;
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
      loading: this.checkoutState.value === 'loading',
      busy: this.checkoutState.value === 'updating',
      empty: !['loading', 'updating'].includes(this.checkoutState.value) && !this.checkoutSession?.line_items?.pagination?.count,
      keys: this.keys,
      error: this.error,
      checkoutSession: this.checkoutSession,
      choiceType: this.choiceType,
      prices: this.prices,
      products: this.products,
      priceChoices: this.priceChoices,
      lineItemData: this.lineItemData,
      currencyCode: this.currencyCode,
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
