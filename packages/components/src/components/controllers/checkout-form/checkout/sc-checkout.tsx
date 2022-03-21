import { Coupon, Order, Customer, PriceChoice, Prices, Products, ResponseError } from '../../../../types';
import { checkoutMachine } from './helpers/checkout-machine';
import { Component, h, Prop, Element, State, Listen, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import { interpret } from '@xstate/fsm';
import { Universe } from 'stencil-wormhole';

@Component({
  tag: 'sc-checkout',
  styleUrl: 'sc-checkout.scss',
  shadow: false,
})
export class ScCheckout {
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

  /** When the form was modified. */
  @Prop() modified: string;

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

  /** Is this user logged in? */
  @Prop() loggedIn: boolean;

  /** Should we disable components validation */
  @Prop() disableComponentsValidation: boolean;

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

  @State() missingAddress: boolean;

  /** Payment mode inside individual payment method (i.e. Payment Buttons) */
  @State() paymentMethod: 'stripe-payment-request' | null;

  @Watch('order')
  handleOrderChange() {
    this.error = null;
  }

  @Listen('scFormSubmit')
  handlePaymentModeChange(e) {
    this.paymentMethod = e?.detail?.payentMethod;
  }

  @Listen('scPaid')
  async handlePaid() {
    console.log(this.order);
    window.localStorage.removeItem(this.el.id);
    window.location.assign(addQueryArgs(this.successUrl, { order: this.order.id }));
  }

  @Listen('scPayError')
  handlePayError(e) {
    this.error = e.detail?.message || {
      code: '',
      message: 'Something went wrong with your payment.',
    };
  }

  @Listen('scSetState')
  handleSetStateEvent(e) {
    this.setState(e.detail);
  }

  setState(name) {
    const { send } = this._stateService;
    return send(name);
  }

  @Listen('scAddEntities')
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
      return __('This product is no longer purchasable.', 'surecart');
    }
    return error?.message;
  }

  state() {
    return {
      processor: 'stripe',
      processor_data: this.order?.processor_data,
      state: this.checkoutState.value,

      // checkout states
      loading: this.checkoutState.value === 'loading',
      busy: ['updating', 'finalizing', 'paid'].includes(this.checkoutState.value),
      paying: ['finalizing', 'paid'].includes(this.checkoutState.value),
      empty: !['loading', 'updating'].includes(this.checkoutState.value) && !this.order?.line_items?.pagination?.count,
      // checkout states

      error: this.error,
      order: this.order,
      lineItems: this.order?.line_items?.data || [],
      customer: this.customer,
      tax_status: this?.order?.tax_status,
      customerShippingAddress: typeof this.order?.customer !== 'string' ? this?.order?.customer?.shipping_address : {},
      shippingAddress: this.order?.shipping_address,
      taxStatus: this.order?.tax_status,
      lockedChoices: this.prices,
      products: this.productsEntities,
      prices: this.pricesEntities,
      country: 'US',
      loggedIn: this.loggedIn,
      formId: this.formId,
      mode: this.mode,
      currencyCode: this.currencyCode,
      paymentMethod: this.paymentMethod,
      i18n: this.i18n,
    };
  }

  render() {
    if (this?.order?.status === 'paid') {
      return (
        <sc-alert type="success" open>
          <span slot="title">{__('You have already paid for this order.', 'surecart')}</span>
          {__('Please visit your account dashboard to view your order.', 'surecart')}
        </sc-alert>
      );
    }

    if (this.checkoutState.value === 'expired') {
      return (
        <sc-block-ui>
          <div>{__('Please refresh the page.', 'surecart')}</div>
        </sc-block-ui>
      );
    }

    return (
      <div
        class={{
          'sc-checkout-container': true,
          'sc-align-center': this.alignment === 'center',
          'sc-align-wide': this.alignment === 'wide',
          'sc-align-full': this.alignment === 'full',
        }}
      >
        <sc-alert
          type="danger"
          onScShow={e => {
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
        </sc-alert>
        <Universe.Provider state={this.state()}>
          <sc-form-components-validator order={this.order} disabled={this.disableComponentsValidation}>
            <sc-session-provider
              order={this.order}
              prices={this.prices}
              persist={this.persistSession}
              modified={this.modified}
              mode={this.mode}
              form-id={this.formId}
              group-id={this.el.id}
              currency-code={this.currencyCode}
              onScUpdateOrderState={e => (this.order = e.detail)}
              onScError={e => (this.error = e.detail as ResponseError)}
            >
              <slot />
            </sc-session-provider>
          </sc-form-components-validator>
          {this.state().busy && <sc-block-ui z-index={9}></sc-block-ui>}
        </Universe.Provider>
      </div>
    );
  }
}
