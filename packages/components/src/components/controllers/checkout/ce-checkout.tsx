import { Coupon, Order, Customer, PriceChoice, Prices, Products, ResponseError } from '../../../types';
import { checkoutMachine } from './helpers/checkout-machine';
import { Component, h, Prop, Element, State, Listen, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { interpret } from '@xstate/fsm';
import { Universe } from 'stencil-wormhole';

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

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The checkout form id */
  @Prop() formId: number;

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

  /** Stores the current Order */
  @State() order: Order;

  /** Error to display. */
  @State() error: ResponseError | null;

  /** Payment mode inside individual payment method (i.e. Payment Buttons) */
  @State() paymentMethod: 'stripe-payment-request' | null;

  @Watch('order')
  handleOrderChange() {
    this.error = null;
  }

  @Listen('ceFormSubmit')
  handlePaymentModeChange(e) {
    this.paymentMethod = e?.detail?.payentMethod;
  }

  @Listen('cePaid')
  async handlePaid() {
    window.localStorage.removeItem(this.el.id);
    window.location.href = addQueryArgs(this.successUrl, { order: this.order.id });
  }

  @Listen('cePayError')
  handlePayError(e) {
    this.error = e.detail?.message || {
      code: '',
      message: 'Something went wrong with your payment.',
    };
  }

  @Listen('ceSetState')
  handleSetStateEvent(e) {
    this.setState(e.detail);
  }

  setState(name) {
    const { send } = this._stateService;
    return send(name);
  }

  handleComplete(val) {
    if (val && this.successUrl) {
      window.location.href = addQueryArgs(this.successUrl, { order: this.order.id });
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

  /** First will display validation error, then main error if no validation errors. */
  errorMessage() {
    if (this.error?.additional_errors?.[0]?.message) {
      return this.getErrorMessage(this.error?.additional_errors?.[0]);
    } else if (this?.error?.message) {
      return this.getErrorMessage(this?.error);
    }
    return '';
  }

  getErrorMessage(error) {
    if (error.code === 'order.line_items.price.blank') {
      return __('This product is no longer purchasable.', 'checkout_engine');
    }
    return error?.message;
  }

  state() {
    return {
      processor: 'stripe',
      processor_data: this.order?.processor_data,
      state: this.checkoutState.value,
      loading: this.checkoutState.value === 'loading',
      busy: this.checkoutState.value === 'updating',
      empty: !['loading', 'updating'].includes(this.checkoutState.value) && !this.order?.line_items?.pagination?.count,
      error: this.error,
      order: this.order,
      customer: this.customer,
      customerShippingAddress: typeof this.order?.customer !== 'string' ? this?.order?.customer?.shipping_address : {},
      shippingAddress: this.order?.shipping_address,
      lockedChoices: this.prices,
      products: this.productsEntities,
      prices: this.pricesEntities,
      country: 'US',
      formId: this.formId,
      mode: this.mode,
      currencyCode: this.currencyCode,
      paymentMethod: this.paymentMethod,
      i18n: this.i18n,
    };
  }

  render() {
    if (this.checkoutState.value === 'paid') {
      return (
        <ce-alert type="success" open>
          <span slot="title">{__('You have already paid for this order.', 'checkout_engine')}</span>
          {__('Please visit your account dashboard to view your order.', 'checkout_engine')}
        </ce-alert>
      );
    }

    if (this.checkoutState.value === 'expired') {
      return (
        <ce-block-ui>
          <div>{__('Please refresh the page.', 'checkout_engine')}</div>
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
        <ce-alert
          type="danger"
          onCeShow={e => {
            const target = e.target as HTMLElement;
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            });
          }}
          open={!!this.errorMessage()}
        >
          <span slot="title">{this.errorMessage()}</span>
        </ce-alert>
        <Universe.Provider state={this.state()}>
          <ce-session-provider
            order={this.order}
            prices={this.prices}
            persist={this.persistSession}
            mode={this.mode}
            form-id={this.formId}
            group-id={this.el.id}
            currency-code={this.currencyCode}
            onCeUpdateOrderState={e => (this.order = e.detail)}
            onCeError={e => {
              this.error = e.detail as ResponseError;
            }}
          >
            <slot />
          </ce-session-provider>
          {this.state().busy && <ce-block-ui z-index={9}></ce-block-ui>}
        </Universe.Provider>
      </div>
    );
  }
}
