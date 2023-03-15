import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { state as processorsState } from '@store/processors';
import { __ } from '@wordpress/i18n';
import { Creator, Universe } from 'stencil-wormhole';

import {
  Bump,
  Checkout,
  Customer,
  FormState,
  ManualPaymentMethod,
  PaymentIntents,
  PriceChoice,
  Prices,
  Processor,
  ProcessorName,
  Product,
  Products,
  ResponseError,
  TaxProtocol,
} from '../../../../types';

@Component({
  tag: 'sc-checkout',
  styleUrl: 'sc-checkout.scss',
  shadow: false,
})
export class ScCheckout {
  /** Element */
  @Element() el: HTMLElement;

  /** Holds the session provider reference. */
  private sessionProvider: HTMLScSessionProviderElement;

  /** An array of prices to pre-fill in the form. */
  @Prop() prices: Array<PriceChoice> = [];

  /** A product to pre-fill the form. */
  @Prop() product: Product;

  /** Are we in test or live mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The checkout form id */
  @Prop() formId: number;

  /** When the form was modified. */
  @Prop() modified: string;

  /** Currency to use for this checkout. */
  @Prop() currencyCode: string = 'usd';

  /** Whether to persist the session in the browser between visits. */
  @Prop() persistSession: boolean = true;

  /** Where to go on success */
  @Prop() successUrl: string = '';

  /** Stores the current customer */
  @Prop({ mutable: true }) customer: Customer;

  /** Alignment */
  @Prop() alignment: 'center' | 'wide' | 'full';

  /** The account tax protocol */
  @Prop() taxProtocol: TaxProtocol;

  /** Is this user logged in? */
  @Prop({ mutable: true }) loggedIn: boolean;

  /** Should we disable components validation */
  @Prop() disableComponentsValidation: boolean;

  /** Processors enabled for this form. */
  @Prop({ mutable: true }) processors: Processor[];

  /** Manual payment methods enabled for this form. */
  @Prop() manualPaymentMethods: ManualPaymentMethod[];

  /** Can we edit line items? */
  @Prop() editLineItems: boolean = true;

  /** Can we remove line items? */
  @Prop() removeLineItems: boolean = true;

  /** The abandoned checkout return url. */
  @Prop() abandonedCheckoutReturnUrl: string;

  /** Use the Stripe payment element. */
  @Prop() stripePaymentElement: boolean = false;

  /** Text for the loading states of the form. */
  @Prop() loadingText: {
    finalizing: string;
    paying: string;
    confirming: string;
    confirmed: string;
  };

  /** Success text for the form. */
  @Prop() successText: {
    title: string;
    description: string;
    button: string;
  };

  /** Stores fetched prices for use throughout component.  */
  @State() pricesEntities: Prices = {};

  /** Stores fetched products for use throughout component.  */
  @State() productsEntities: Products = {};

  /** Loading states for different parts of the form. */
  @State() checkoutState: FormState = 'idle';

  /** Error to display. */
  @State() error: ResponseError | null;

  /** The currenly selected processor */
  @State() processor: ProcessorName = 'stripe';

  /** The processor method. */
  @State() method: string;

  /** Is the processor manual? */
  @State() isManualProcessor: boolean;

  /** Holds the payment intents for the checkout. */
  @State() paymentIntents: PaymentIntents = {};

  /** Is this form a duplicate form? (There's another on the page) */
  @State() isDuplicate: boolean;

  /** Checkout has been updated. */
  @Event() scOrderUpdated: EventEmitter<Checkout>;

  /** Checkout has been finalized. */
  @Event() scOrderFinalized: EventEmitter<Checkout>;

  /** Checkout has an error. */
  @Event() scOrderError: EventEmitter<ResponseError>;

  @Listen('scUpdateOrderState')
  handleOrderStateUpdate(e: { detail: Checkout }) {
    checkoutState.checkout = e.detail;
  }

  @Listen('scSetMethod')
  handleMethodChange(e) {
    this.method = e.detail;
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

  /**
   * Submit the form
   */
  @Method()
  async submit({ skip_validation } = { skip_validation: false }) {
    if (!skip_validation) {
      await this.validate();
    }
    return await this.sessionProvider.finalize();
  }

  /**
   * Validate the form.
   */
  @Method()
  async validate() {
    const form = this.el.querySelector('sc-form') as HTMLScFormElement;
    return await form.validate();
  }

  componentWillLoad() {
    const checkout = document.querySelector('sc-checkout');
    this.isDuplicate = !!checkout && checkout !== this.el;
    if (this.isDuplicate) return;

    Universe.create(this as Creator, this.state());
    processorsState.processors = this.processors;
    processorsState.manualPaymentMethods = this.manualPaymentMethods;
    processorsState.config.stripe.paymentElement = this.stripePaymentElement;
    checkoutState.formId = this.formId;
    checkoutState.mode = this.mode;
    checkoutState.product = this.product || null;
    checkoutState.currencyCode = this.currencyCode;
    checkoutState.groupId = this.el.id;
  }

  state() {
    return {
      processor: this.processor,
      method: this.method,
      selectedProcessorId: this.processor,
      manualPaymentMethods: this.manualPaymentMethods,
      processor_data: checkoutState.checkout?.processor_data,
      state: this.checkoutState,
      formState: this.checkoutState,
      paymentIntents: this.paymentIntents,
      successUrl: this.successUrl,
      bumps: checkoutState.checkout?.recommended_bumps?.data as Bump[],

      order: checkoutState.checkout,
      abandonedCheckoutEnabled: checkoutState.checkout?.abandoned_checkout_enabled,
      checkout: checkoutState.checkout,
      shippingEnabled: checkoutState.checkout?.shipping_enabled,
      lineItems: checkoutState.checkout?.line_items?.data || [],
      editLineItems: this.editLineItems,
      removeLineItems: this.removeLineItems,

      // checkout states
      loading: this.checkoutState === 'loading',
      busy: ['updating', 'finalizing', 'paying', 'confirming'].includes(this?.checkoutState),
      paying: ['finalizing', 'paying', 'confirming'].includes(this?.checkoutState),
      empty: !['loading', 'updating'].includes(this.checkoutState) && !checkoutState.checkout?.line_items?.pagination?.count,
      // checkout states

      // stripe.
      stripePaymentElement: this.stripePaymentElement,
      stripePaymentIntent: (checkoutState.checkout?.staged_payment_intents?.data || []).find(intent => intent.processor_type === 'stripe'),

      error: this.error,
      customer: this.customer,
      tax_status: checkoutState.checkout?.tax_status,
      taxEnabled: checkoutState.checkout?.tax_enabled,
      customerShippingAddress: typeof checkoutState.checkout?.customer !== 'string' ? checkoutState.checkout?.customer?.shipping_address : {},
      shippingAddress: checkoutState.checkout?.shipping_address,
      taxStatus: checkoutState.checkout?.tax_status,
      taxIdentifier: checkoutState.checkout?.tax_identifier,
      totalAmount: checkoutState.checkout?.total_amount,
      taxProtocol: this.taxProtocol,
      lockedChoices: this.prices,
      products: this.productsEntities,
      prices: this.pricesEntities,
      country: 'US',
      loggedIn: this.loggedIn,
      emailExists: checkoutState.checkout?.email_exists,
      formId: this.formId,
      mode: this.mode,
      currencyCode: this.currencyCode,
    };
  }

  render() {
    if (this.isDuplicate) {
      return <sc-alert open>{__('Due to processor restrictions, only one checkout form is allowed on the page.', 'surecart')}</sc-alert>;
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
        {/* Handles unsaved changes warning depending on checkout state */}
        <sc-checkout-unsaved-changes-warning state={this.checkoutState} />
        {/* Univers provider */}
        <Universe.Provider state={this.state()}>
          {/** Handles login form prompts. */}
          <sc-login-provider
            loggedIn={this.loggedIn}
            onScSetCustomer={e => (this.customer = e.detail as Customer)}
            onScSetLoggedIn={e => (this.loggedIn = e.detail)}
            order={checkoutState.checkout}
          >
            {/* Handles the current checkout form state. */}
            <sc-form-state-provider onScSetCheckoutFormState={e => (this.checkoutState = e.detail)}>
              {/* Handles errors in the form. */}
              <sc-form-error-provider checkoutState={this.checkoutState} onScUpdateError={e => (this.error = e.detail)}>
                {/* Validate components in the form based on order state. */}
                <sc-form-components-validator order={checkoutState.checkout} disabled={this.disableComponentsValidation} taxProtocol={this.taxProtocol}>
                  {/* Handle confirming of order after it is "Paid" by processors. */}
                  <sc-order-confirm-provider success-url={this.successUrl} successText={this.successText}>
                    {/* Handles the current session. */}
                    <sc-session-provider
                      ref={el => (this.sessionProvider = el as HTMLScSessionProviderElement)}
                      prices={this.prices}
                      persist={this.persistSession}
                      onScError={e => (this.error = e.detail as ResponseError)}
                    >
                      <slot />
                    </sc-session-provider>
                  </sc-order-confirm-provider>
                </sc-form-components-validator>
              </sc-form-error-provider>
            </sc-form-state-provider>
          </sc-login-provider>

          {this.state().busy && <sc-block-ui class="busy-block-ui" z-index={9}></sc-block-ui>}
          {this.checkoutState === 'finalizing' && (
            <sc-block-ui z-index={9} spinner style={{ '--sc-block-ui-opacity': '0.75' }}>
              {this.loadingText?.finalizing || __('Submitting order...', 'surecart')}
            </sc-block-ui>
          )}
          {this.checkoutState === 'paying' && (
            <sc-block-ui z-index={9} spinner style={{ '--sc-block-ui-opacity': '0.75' }}>
              {this.loadingText?.paying || __('Processing payment...', 'surecart')}
            </sc-block-ui>
          )}
          {this.checkoutState === 'confirming' && (
            <sc-block-ui z-index={9} spinner style={{ '--sc-block-ui-opacity': '0.75' }}>
              {this.loadingText?.confirming || __('Finalizing order...', 'surecart')}
            </sc-block-ui>
          )}
          {this.checkoutState === 'redirecting' && (
            <sc-block-ui z-index={9} spinner style={{ '--sc-block-ui-opacity': '0.75' }}>
              {this.loadingText?.confirmed || __('Success! Redirecting...', 'surecart')}
            </sc-block-ui>
          )}
        </Universe.Provider>
      </div>
    );
  }
}
