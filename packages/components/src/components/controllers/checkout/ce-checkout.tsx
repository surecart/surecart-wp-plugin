import { Component, h, Prop, Element, State, Listen } from '@stencil/core';
import { Coupon, CheckoutSession, Customer, Keys, PriceChoice, Prices, Products } from '../../../types';
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

  @Listen('cePaid')
  async handlePaid() {
    window.localStorage.removeItem(this.el.id);
    window.location.href = addQueryArgs(this.successUrl, { checkout_session: this.checkoutSession.id });
  }

  setState(name) {
    const { send } = this._stateService;
    return send(name);
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

  componentWillLoad() {
    // Start state machine.
    this._stateService.subscribe(state => (this.checkoutState = state));
    this._stateService.start();

    // @ts-ignore
    Universe.create(this, this.state());
  }

  /** Remove state machine on disconnect. */
  disconnectedCallback() {
    this._stateService.stop();
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
          <ce-session-provider
            checkoutSession={this.checkoutSession}
            persist={this.persistSession}
            setState={this._stateService.send}
            group-id={this.el.id}
            currency-code={this.currencyCode}
            onCeUpdateSession={e => (this.checkoutSession = e.detail)}
            onCeError={e => (this.error = e.detail)}
          >
            <slot />
          </ce-session-provider>
        </Universe.Provider>
      </div>
    );
  }
}
