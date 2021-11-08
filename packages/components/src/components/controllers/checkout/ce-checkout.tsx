import { Component, h, Prop, Element, State, Watch, Listen } from '@stencil/core';
import { Coupon, CheckoutSession, Customer, LineItemData, Keys, PriceChoice, LineItemsData, Prices, Products } from '../../../types';
import { handleInputs } from './functions';
import { getSessionId } from './helpers/session';
import { createOrUpdateSession, finalizeSession, getSession } from '../../../services/session/index';
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

  /** An array of prices to pre-fill in the form. */
  @Prop() prices: Array<PriceChoice> = [];

  /** Currency to use for this checkout. */
  @Prop() currencyCode: string = 'usd';

  /** Where to go on success */
  @Prop() persistSession: boolean = true;

  /** Where to go on success */
  @Prop() successUrl: string = '';

  /** Optionally pass a coupon. */
  @Prop({ mutable: true }) coupon: Coupon;

  /** Stores the current customer */
  @Prop({ mutable: true }) customer: Customer;

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
  @State() pricesEntities: Prices = {};

  /** Stores fetched products for use throughout component.  */
  @State() productsEntities: Products = {};

  /** Loading states for different parts of the form. */
  @State() checkoutState = checkoutMachine.initialState;

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

  // stores line items data based on key.
  @State() lineItemsData: LineItemsData = {
    choices: [],
  };

  observer = null;

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

  /** Handles coupon updates. */
  @Listen('ceApplyCoupon')
  async handleCouponApply(e) {
    const promotion_code = e.detail;
    try {
      this.setState('FETCH');
      this.checkoutSession = await createOrUpdateSession({
        id: this.checkoutSession.id,
        data: {
          discount: {
            ...(promotion_code ? { promotion_code } : {}),
          },
        },
      });
      this.setState('RESOLVE');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  setState(name) {
    const { send } = this._stateService;
    return send(name);
  }

  /** Update form state when form data changes */
  @Listen('ceFormChange')
  handleFormChange(e) {
    const data = e.detail;
    if (Object.values(data || {}).every(item => item === undefined)) return;
    const { email, name, ...rest } = data;
    this.formState = {
      ...(data.email ? { email: data.email } : {}),
      ...(data.name ? { name: data.name } : {}),
      metadata: {
        ...rest,
      },
    };
  }

  handleComplete(val) {
    if (val && this.successUrl) {
      window.location.href = addQueryArgs(this.successUrl, { checkout_session: this.checkoutSession.id });
    }
  }

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

  /**
   * Handles the form submission.
   * @param e
   */
  @Listen('ceFormSubmit')
  async handleFormSubmit(e) {
    this.handleFormChange(e);

    // first validate server-side and get key
    try {
      this.setState('UPDATING');
      this.checkoutSession = await finalizeSession({
        id: this.checkoutSession.id,
        data: {
          status: 'draft',
        },
        processor: 'stripe',
      });
      // TODO: process payment with token
    } catch (e) {
      if (e?.code === 'checkout_session.invalid_status_transition') {
        await createOrUpdateSession({
          id: this.checkoutSession.id,
          data: {
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
    try {
      this.setState('UPDATING');
      await createOrUpdateSession({
        id: this.checkoutSession.id,
        data: {
          status: 'draft',
        },
      });
      this.setState('DRAFT');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  async updateSessionLineItems(line_items) {
    try {
      this.setState('FETCH');
      this.checkoutSession = (await createOrUpdateSession({
        id: this.checkoutSession?.id,
        data: {
          currency: this.currencyCode || 'usd',
          line_items,
        },
      })) as CheckoutSession;
      this.setState('RESOLVE');
    } catch (e) {
      this.handleErrorResponse(e);
    }
  }

  @Watch('formState')
  handleDraftSessionChanges(val, oldVal) {
    if (oldVal && JSON.stringify(val) === JSON.stringify(oldVal)) return;
    // this.createOrUpdateSession();
  }

  // async createOrUpdateSession() {
  //   const id = getSessionId(this.el.id, this.checkoutSession, true);
  //   const line_items = calculateInitialLineItems(this.prices, this.choiceType);

  //   this.setState('FETCH');

  //   if (!line_items?.length) {
  //     this.setState('RESOLVE');
  //     return;
  //   }

  //   try {
  //     this.checkoutSession = (await createOrUpdateSession({
  //       id,
  //       data: {
  //         currency: this.currencyCode || 'usd',
  //         line_items,
  //       },
  //     })) as CheckoutSession;
  //     this.setState('RESOLVE');
  //   } catch (e) {
  //     this.setState('REJECT');
  //     this.handleErrorResponse(e);
  //     window.localStorage.removeItem(this.el.id);
  //   }
  // }

  /**
   * When we have a checkout session, we are done loading.
   */
  @Watch('checkoutSession')
  handleCheckoutSessionChange(val) {
    if (val?.id) {
      localStorage.setItem(this.el.id, val.id);
    }
    if (val.status === 'paid') {
      window.localStorage.removeItem(this.el.id);
    }
    handleInputs(this.el, val);
  }

  /** Looks through children and finds items needed for initial session. */
  getInitialSession() {
    let line_items = [];

    // add prices that are passed into this component.
    if (this?.prices.length) {
      line_items = this.prices.map(price => {
        return {
          price_id: price.id,
          quantity: price.quantity,
        };
      });
    }

    const elements = this.el.querySelectorAll('[price-id]') as any;

    elements.forEach(el => {
      if (el.checked) {
        line_items.push({
          quantity: el.quantity || 1,
          price_id: el.priceId,
        });
      }
    });

    if (line_items?.length) {
      return this.updateSessionLineItems(line_items);
    }
  }

  componentWillLoad() {
    // Start state machine.
    this._stateService.subscribe(state => (this.checkoutState = state));
    this._stateService.start();

    // @ts-ignore
    Universe.create(this, this.state());

    // find existing session.
    const id = getSessionId(this.el.id, this.checkoutSession);

    if (id && this.persistSession) {
      this.getSession(id);
    } else {
      this.getInitialSession();
    }
  }

  /** Remove state machine on disconnect. */
  disconnectedCallback() {
    this._stateService.stop();
  }

  handleErrorResponse(e) {
    // expired
    if (e?.code === 'rest_cookie_invalid_nonce') {
      this.setState('EXPIRE');
      return;
    }

    // something went wrong
    if (e?.message) {
      this.error = e.message;
    }

    // handle curl timeout errors.
    if (e?.code === 'http_request_failed') {
      this.error = 'Something went wrong. Please reload the page and try again.';
    }

    this.setState('REJECT');
  }

  async getSession(id) {
    try {
      this.setState('FETCH');
      this.checkoutSession = (await getSession(id)) as CheckoutSession;
      this.setState('RESOLVE');
    } catch (e) {
      this.handleErrorResponse(e);
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
      priceChoices: this.prices,
      products: this.productsEntities,
      prices: this.pricesEntities,
      currencyCode: this.currencyCode,
    };
  }

  render() {
    if (this.checkoutState.value === 'paid') {
      return (
        <ce-card>
          <ce-alert type="success" open>
            <span slot="title">Session Expired.</span>
            Please reload the page.
          </ce-alert>
        </ce-card>
      );
    }

    if (this.checkoutState.value === 'expired') {
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
          <ce-cart-provider onCeUpdateLineItems={e => this.updateSessionLineItems(e.detail as Array<LineItemData>)}>
            <slot />
          </ce-cart-provider>
        </Universe.Provider>
      </div>
    );
  }
}
