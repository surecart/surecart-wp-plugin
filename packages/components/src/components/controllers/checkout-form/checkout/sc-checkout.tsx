import { Order, Customer, PriceChoice, Prices, Products, ResponseError, FormState } from '../../../../types';
import { Component, h, Prop, Element, State, Listen } from '@stencil/core';
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
    // @ts-ignore
    Universe.create(this, this.state());
  }

  state() {
    return {
      processor: 'stripe',
      processor_data: this.order?.processor_data,
      state: this.checkoutState,

      // checkout states
      loading: this.checkoutState === 'loading',
      busy: ['updating', 'finalizing', 'paid', 'confirmed'].includes(this.checkoutState),
      paying: ['finalizing', 'paid', 'confirmed'].includes(this.checkoutState),
      empty: !['loading', 'updating'].includes(this.checkoutState) && !this.order?.line_items?.pagination?.count,
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
          {/* Handles errors in the form. */}
          <sc-form-error-provider order={this.order} onScUpdateError={e => (this.error = e.detail)}>
            {/* Handles the current checkout form state. */}
            <sc-form-state-provider onScSetCheckoutFormState={e => (this.checkoutState = e.detail)}>
              {/* Validate components in the form based on order state. */}
              <sc-form-components-validator order={this.order} disabled={this.disableComponentsValidation}>
                {/* Handles the current session. */}
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
                  {/* Maybe redirect to the success url if requirements are met. */}
                  <sc-order-redirect-provider order={this.order} success-url={this.successUrl}>
                    {/* Handle confirming of order after it is "Paid" by processors. */}
                    <sc-order-confirm-provider order={this.order}>
                      <slot />
                    </sc-order-confirm-provider>
                  </sc-order-redirect-provider>
                </sc-session-provider>
              </sc-form-components-validator>
            </sc-form-state-provider>
          </sc-form-error-provider>

          {this.state().busy && <sc-block-ui z-index={9}></sc-block-ui>}
        </Universe.Provider>
      </div>
    );
  }
}
