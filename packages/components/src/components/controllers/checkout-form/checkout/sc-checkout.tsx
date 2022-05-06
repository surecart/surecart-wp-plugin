import { Order, Customer, PriceChoice, Prices, Products, ResponseError, FormState, Processor, PaymentIntents, PaymentIntent } from '../../../../types';
import { Component, h, Prop, Element, State, Listen, Method, Event, EventEmitter } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Universe } from 'stencil-wormhole';

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

  /** Is this user logged in? */
  @Prop() loggedIn: boolean;

  /** Should we disable components validation */
  @Prop() disableComponentsValidation: boolean;

  /** Processors enabled for this form. */
  @Prop({ mutable: true }) processors: Processor[];

  /** Can we edit line items? */
  @Prop() editLineItems: boolean = true;

  /** Can we remove line items? */
  @Prop() removeLineItems: boolean = true;

  /** Stores fetched prices for use throughout component.  */
  @State() pricesEntities: Prices = {};

  /** Stores fetched products for use throughout component.  */
  @State() productsEntities: Products = {};

  /** Loading states for different parts of the form. */
  @State() checkoutState: FormState = 'idle';

  /** Holds the current Order */
  @State() order: Order;

  /** Error to display. */
  @State() error: ResponseError | null;

  /** The currenly selected processor */
  @State() processor: 'stripe' | 'paypal' = 'stripe';

  /** Holds the payment intents for the checkout. */
  @State() paymentIntents: PaymentIntents = {};

  /** Order has been updated. */
  @Event() scOrderUpdated: EventEmitter<Order>;

  /** Order has been finalized. */
  @Event() scOrderFinalized: EventEmitter<Order>;

  /** Order has an error. */
  @Event() scOrderError: EventEmitter<ResponseError>;

  @Listen('scSetPaymentIntent')
  handleSetPaymentIntent(e) {
    const paymentIntent = e.detail?.payment_intent as PaymentIntent;
    const processor = e.detail?.processor;
    this.paymentIntents[processor] = paymentIntent;
  }

  @Listen('scSetProcessor')
  handleProcessorChange(e) {
    this.processor = e.detail;
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
    // @ts-ignore
    Universe.create(this, this.state());
  }

  state() {
    return {
      processor: this.processor,
      processors: this.processors,
      processor_data: this.order?.processor_data,
      state: this.checkoutState,
      paymentIntents: this.paymentIntents,
      successUrl: this.successUrl,

      order: this.order,
      lineItems: this.order?.line_items?.data || [],
      editLineItems: this.editLineItems,
      removeLineItems: this.removeLineItems,

      // checkout states
      loading: this.checkoutState === 'loading',
      busy: ['updating', 'finalizing', 'paid', 'confirmed'].includes(this.checkoutState),
      paying: ['finalizing', 'paid', 'confirmed'].includes(this.checkoutState),
      empty: !['loading', 'updating'].includes(this.checkoutState) && !this.order?.line_items?.pagination?.count,
      // checkout states

      error: this.error,
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
    };
  }

  render() {
    return (
      <div
        class={{
          'sc-checkout-container': true,
          'sc-align-center': this.alignment === 'center',
          'sc-align-wide': this.alignment === 'wide',
          'sc-align-full': this.alignment === 'full',
        }}
      >
        <Universe.Provider state={this.state()}>
          {/* Handles the current checkout form state. */}
          <sc-form-state-provider onScSetCheckoutFormState={e => (this.checkoutState = e.detail)}>
            {/* Handles errors in the form. */}
            <sc-form-error-provider order={this.order} onScUpdateError={e => (this.error = e.detail)}>
              {/* Validate components in the form based on order state. */}
              <sc-form-components-validator order={this.order} disabled={this.disableComponentsValidation}>
                {/* Handles the current session. */}
                <sc-session-provider
                  ref={el => (this.sessionProvider = el as HTMLScSessionProviderElement)}
                  order={this.order}
                  prices={this.prices}
                  paymentIntents={this.paymentIntents}
                  persist={this.persistSession}
                  modified={this.modified}
                  mode={this.mode}
                  form-id={this.formId}
                  group-id={this.el.id}
                  processor={this.processor}
                  currency-code={this.currencyCode}
                  onScUpdateOrderState={e => (this.order = e.detail)}
                  onScError={e => (this.error = e.detail as ResponseError)}
                >
                  {/* Maybe redirect to the success url if requirements are met. */}
                  <sc-order-redirect-provider order={this.order} success-url={this.successUrl}>
                    {/* Handle confirming of order after it is "Paid" by processors. */}
                    <sc-order-confirm-provider order={this.order}>
                      <slot />
                    </sc-order-confirm-provider>
                  </sc-order-redirect-provider>
                </sc-session-provider>
              </sc-form-components-validator>
            </sc-form-error-provider>
          </sc-form-state-provider>

          {this.state().busy && <sc-block-ui z-index={9}></sc-block-ui>}
        </Universe.Provider>
      </div>
    );
  }
}
