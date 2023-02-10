import { Component, Element, Event, EventEmitter, h, Listen, Method, Prop, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Creator, Universe } from 'stencil-wormhole';
import processorsState from '../../../../store/processors';
import checkoutState from '../../../../store/checkout';
import { getOrder, setOrder } from '../../../../store/checkouts';
import {
  Bump,
  Checkout,
  Customer,
  FormState,
  ManualPaymentMethod,
  PaymentIntent,
  PaymentIntents,
  PriceChoice,
  Prices,
  Processor,
  ProcessorName,
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

  @Prop() loadingText: {
    finalizing: string;
    paying: string;
    confirming: string;
    confirmed: string;
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

  @Listen('scSetPaymentIntent')
  handleSetPaymentIntent(e) {
    const paymentIntent = e.detail?.payment_intent as PaymentIntent;
    const processor = e.detail?.processor;
    this.paymentIntents[processor] = paymentIntent;
  }

  @Listen('scUpdateOrderState')
  handleOrderStateUpdate(e: { detail: Checkout }) {
    setOrder(e?.detail, this?.formId);
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
    this.isDuplicate = document.querySelector('sc-checkout') !== this.el;
    if (this.isDuplicate) return;
    Universe.create(this as Creator, this.state());
    processorsState.processors = this.processors;
    checkoutState.formId = this.formId;
    checkoutState.mode = this.mode;
  }

  order() {
    return getOrder(this?.formId, this.mode);
  }

  state() {
    return {
      processor: this.processor,
      method: this.method,
      selectedProcessorId: this.processor,
      processors: (this.processors || []).filter(processor => {
        return !(this?.order().reusable_payment_method_required && !processor?.recurring_enabled);
      }),
      reusablePaymentMethodRequired: this?.order().reusable_payment_method_required,
      manualPaymentMethods: this.manualPaymentMethods,
      processor_data: this.order()?.processor_data,
      state: this.checkoutState,
      formState: this.checkoutState,
      paymentIntents: this.paymentIntents,
      successUrl: this.successUrl,
      bumps: this.order()?.recommended_bumps?.data as Bump[],

      order: this.order(),
      abandonedCheckoutEnabled: this.order()?.abandoned_checkout_enabled,
      checkout: this.order(),
      shippingEnabled: this.order()?.shipping_enabled,
      lineItems: this.order()?.line_items?.data || [],
      editLineItems: this.editLineItems,
      removeLineItems: this.removeLineItems,

      // checkout states
      loading: this.checkoutState === 'loading',
      busy: ['updating', 'finalizing', 'paying', 'confirming', 'confirmed'].includes(this?.checkoutState),
      paying: ['finalizing', 'paying', 'confirming', 'confirmed'].includes(this?.checkoutState),
      empty: !['loading', 'updating'].includes(this.checkoutState) && !this.order()?.line_items?.pagination?.count,
      // checkout states

      // stripe.
      stripePaymentElement: this.stripePaymentElement,
      stripePaymentIntent: (this.order()?.staged_payment_intents?.data || []).find(intent => intent.processor_type === 'stripe'),

      error: this.error,
      customer: this.customer,
      tax_status: this.order()?.tax_status,
      taxEnabled: this.order()?.tax_enabled,
      customerShippingAddress: typeof this.order()?.customer !== 'string' ? this.order()?.customer?.shipping_address : {},
      shippingAddress: this.order()?.shipping_address,
      taxStatus: this.order()?.tax_status,
      taxIdentifier: this.order()?.tax_identifier,
      totalAmount: this.order()?.total_amount,
      taxProtocol: this.taxProtocol,
      lockedChoices: this.prices,
      products: this.productsEntities,
      prices: this.pricesEntities,
      country: 'US',
      loggedIn: this.loggedIn,
      emailExists: this.order()?.email_exists,
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
            order={this.order()}
          >
            {/* Handles the current checkout form state. */}
            <sc-form-state-provider onScSetCheckoutFormState={e => (this.checkoutState = e.detail)}>
              {/* Handles errors in the form. */}
              <sc-form-error-provider checkoutState={this.checkoutState} onScUpdateError={e => (this.error = e.detail)}>
                {/* Validate components in the form based on order state. */}
                <sc-form-components-validator order={this.order()} disabled={this.disableComponentsValidation} taxProtocol={this.taxProtocol}>
                  {/* Handle confirming of order after it is "Paid" by processors. */}
                  <sc-order-confirm-provider order={this.order()} success-url={this.successUrl} form-id={this.formId} mode={this.mode}>
                    {/* Handles the current session. */}
                    <sc-session-provider
                      ref={el => (this.sessionProvider = el as HTMLScSessionProviderElement)}
                      prices={this.prices}
                      abandonedCheckoutReturnUrl={this.abandonedCheckoutReturnUrl}
                      stripePaymentElement={this.stripePaymentElement}
                      paymentIntents={this.paymentIntents}
                      persist={this.persistSession}
                      modified={this.modified}
                      mode={this.mode}
                      isManualProcessor={this.isManualProcessor}
                      form-id={this.formId}
                      group-id={this.el.id}
                      processor={this.processor}
                      method={this.method}
                      currency-code={this.currencyCode}
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
          {this.checkoutState === 'confirmed' && (
            <sc-block-ui z-index={9} spinner style={{ '--sc-block-ui-opacity': '0.75' }}>
              {this.loadingText?.confirmed || __('Success! Redirecting...', 'surecart')}
            </sc-block-ui>
          )}
        </Universe.Provider>
      </div>
    );
  }
}
