import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { PaymentRequestOptions, Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { createOrUpdateOrder, finalizeSession } from '../../../services/session';
import { LineItem, Order, Prices, Product, ResponseError } from '../../../types';

@Component({
  tag: 'sc-stripe-payment-request',
  styleUrl: 'sc-stripe-payment-request.scss',
  shadow: false,
})
export class ScStripePaymentRequest {
  @Element() el: HTMLElement;
  private request: HTMLDivElement;
  private stripe: Stripe;
  private paymentRequest: any;
  private elements: any;

  /** Your stripe connected account id. */
  @Prop() stripeAccountId: string;

  /** Stripe publishable key */
  @Prop() publishableKey: string;

  /** Country */
  @Prop() country: string = 'US';

  /** Currency */
  @Prop() currencyCode: string = 'usd';

  /** Checkout Session */
  @Prop() order: Order;

  @Prop() prices: Prices;

  /** Label */
  @Prop() label: string = 'total';

  /** Amount */
  @Prop() amount: number = 0;

  /** Payment request theme */
  @Prop() theme: string = 'dark';

  @Prop() error: ResponseError | null;

  @Prop() paymentMethod: string;

  /** Is this in debug mode. */
  @Prop() debug: boolean = false;

  /** This is required to validate the form on the server */
  @Prop() formId: number | string;

  /** Has this loaded */
  @State() loaded: boolean = false;
  @State() debugError: string;

  @Event() scFormSubmit: EventEmitter<any>;
  @Event() scPaid: EventEmitter<void>;
  @Event() scPayError: EventEmitter<any>;
  @Event() scSetState: EventEmitter<string>;
  @Event() scPaymentRequestLoaded: EventEmitter<boolean>;
  @Event() scUpdateOrderState: EventEmitter<any>;

  private pendingEvent: any;

  private confirming: boolean;

  async componentWillLoad() {
    if (!this?.publishableKey || !this?.stripeAccountId) {
      return true;
    }
    this.stripe = await loadStripe(this.publishableKey, { stripeAccount: this.stripeAccountId });
    this.elements = this.stripe.elements();
    this.paymentRequest = this.stripe.paymentRequest({
      country: this.country,
      requestShipping: true,
      requestPayerEmail: true,
      shippingOptions: [
        {
          id: 'free',
          label: 'Free Shipping',
          detail: 'No shipping required',
          amount: 0,
        },
      ],
      ...(this.getRequestObject(this.order) as PaymentRequestOptions),
    });
  }

  @Watch('order')
  handleOrderChange() {
    if (!this.paymentRequest) return;
    if (this.pendingEvent) return;
    this.paymentRequest.update(this.getRequestObject(this.order));
  }

  @Watch('loaded')
  handleLoaded() {
    this.scPaymentRequestLoaded.emit(true);
  }

  @Watch('error')
  handleErrorChange() {
    if (this.pendingEvent) {
      this.pendingEvent.complete('error');
    }
  }

  async handleShippingChange(ev: any) {
    const { shippingAddress, updateWith } = ev;
    try {
      const order = (await createOrUpdateOrder({
        id: this.order?.id,
        data: {
          shipping_address: {
            ...(shippingAddress?.name ? { name: shippingAddress?.name } : {}),
            ...(shippingAddress?.addressLine?.[0] ? { line_1: shippingAddress?.addressLine?.[0] } : {}),
            ...(shippingAddress?.addressLine?.[1] ? { line_2: shippingAddress?.addressLine?.[1] } : {}),
            ...(shippingAddress?.city ? { city: shippingAddress?.city } : {}),
            ...(shippingAddress?.country ? { country: shippingAddress?.country } : {}),
            ...(shippingAddress?.postalCode ? { postal_code: shippingAddress?.postalCode } : {}),
            ...(shippingAddress?.region ? { state: shippingAddress?.region } : {}),
          },
        },
      })) as Order;
      updateWith({
        status: 'success',
        total: {
          amount: order?.amount_due || 0,
          label: __('Total', 'surecart'),
          pending: true,
        },
      });
    } catch (e) {
      e.updateWith({ status: 'invalid_shipping_address' });
    }
  }

  /** Only append price name if there's more than one product price in the session. */
  getName(item: LineItem) {
    const otherPrices = Object.keys(this.prices || {}).filter(key => {
      const price = this.prices[key];
      // @ts-ignore
      return price.product === item.price.product.id;
    });

    let name = '';
    if (otherPrices.length > 1) {
      name = `${(item?.price?.product as Product)?.name} \u2013 ${item?.price?.name}`;
    } else {
      name = (item?.price?.product as Product)?.name;
    }
    return name;
  }

  getRequestObject(order: Order) {
    const displayItems = (order?.line_items?.data || []).map(item => {
      return {
        label: this.getName(item),
        amount: item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.price.amount,
      };
    });

    return {
      currency: this.currencyCode,
      total: {
        amount: order?.amount_due || 0,
        label: __('Total', 'surecart'),
        pending: true,
      },
      displayItems,
    };
  }

  componentDidLoad() {
    if (!this.elements) {
      return;
    }

    const paymentRequestElement = this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      style: {
        paymentRequestButton: {
          theme: this.theme,
        },
      },
    });

    // handle payment method.
    this.paymentRequest.on('paymentmethod', e => this.handlePaymentMethod(e));
    this.paymentRequest.on('shippingaddresschange', async ev => await this.handleShippingChange(ev));

    // mount button.
    this.paymentRequest
      .canMakePayment()
      .then(result => {
        if (!result) {
          if (location.protocol !== 'https:') {
            if (this.debug) {
              this.debugError = __('You must serve this page over HTTPS to display express payment buttons.', 'surecart');
            }
            console.log('SSL needed to display payment buttons.');
          } else {
            if (this.debug) {
              this.debugError = __('You do not have any wallets set up in your browser.', 'surecart');
            }
            console.log('No wallets available.');
          }
          return;
        }
        paymentRequestElement.mount(this.request);
        this.loaded = true;
      })
      .catch(e => {
        console.error(e);
      });
  }

  /** Handle the payment method. */
  async handlePaymentMethod(ev) {
    const { billing_details } = ev?.paymentMethod;
    const { shippingAddress } = ev;
    this.scSetState.emit('FETCH');

    try {
      // update session with shipping/billing
      (await createOrUpdateOrder({
        id: this.order?.id,
        data: {
          email: billing_details?.email,
          name: billing_details?.name,
          shipping_address: {
            ...(shippingAddress?.name ? { name: shippingAddress?.name } : {}),
            ...(shippingAddress?.addressLine?.[0] ? { line_1: shippingAddress?.addressLine?.[0] } : {}),
            ...(shippingAddress?.addressLine?.[1] ? { line_2: shippingAddress?.addressLine?.[1] } : {}),
            ...(shippingAddress?.city ? { city: shippingAddress?.city } : {}),
            ...(shippingAddress?.country ? { country: shippingAddress?.country } : {}),
            ...(shippingAddress?.postalCode ? { postal_code: shippingAddress?.postalCode } : {}),
            ...(shippingAddress?.region ? { state: shippingAddress?.region } : {}),
          },
        },
      })) as Order;

      // finalize
      const session = (await finalizeSession({
        id: this.order.id,
        processor: 'stripe',
        query: {
          form_id: this.formId,
        },
      })) as Order;

      // confirm payment
      await this.confirmPayment(session, ev);
      // paid.
      console.log('paid');
      this.scPaid.emit();
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      console.log('complete');
      ev.complete('success');
    } catch (e) {
      console.error(e);
      this.scPayError.emit(e);
      ev.complete('fail');
    } finally {
      this.confirming = false;
      this.scSetState.emit('RESOLVE');
    }
  }

  async confirmPayment(val: Order, ev) {
    // must be finalized
    if (val?.status !== 'finalized') return;
    // must have a secret
    if (!val?.payment_intent?.processor_data?.stripe?.client_secret) return;
    // need an external_type
    if (!val?.payment_intent?.processor_data?.stripe?.type) return;
    // must have an external intent id
    if (!val?.payment_intent?.external_intent_id) return;
    // prevent possible double-charges
    if (this.confirming) return;
    this.confirming = true;

    let response;
    if (val?.payment_intent?.processor_data?.stripe?.type == 'setup') {
      response = await this.confirmCardSetup(val?.payment_intent?.processor_data?.stripe.client_secret, ev);
    } else {
      response = await this.confirmCardPayment(val?.payment_intent?.processor_data?.stripe.client_secret, ev);
    }
    if (response?.error) {
      throw response.error;
    }
    // Check if the PaymentIntent requires any actions and if so let Stripe.js
    // handle the flow. If using an API version older than "2019-02-11"
    // instead check for: `paymentIntent.status === "requires_source_action"`.
    if (response?.paymentIntent?.status === 'requires_action' || response?.paymentIntent?.status === 'requires_source_action') {
      // Let Stripe.js handle the rest of the payment flow.
      const result = await this.stripe.confirmCardPayment(val?.payment_intent?.processor_data?.stripe.client_secret);
      // The payment failed -- ask your customer for a new payment method.
      if (result.error) {
        throw result.error;
      }
      return result;
    }

    return response;
  }

  /** Confirm card payment. */
  confirmCardPayment(secret, ev) {
    return this.stripe.confirmCardPayment(secret, { payment_method: ev.paymentMethod.id }, { handleActions: false });
  }

  /** Confirm card setup. */
  confirmCardSetup(secret, ev) {
    return this.stripe.confirmCardSetup(secret, { payment_method: ev.paymentMethod.id }, { handleActions: false });
  }

  render() {
    return (
      <div class={{ 'request': true, 'request--loaded': this.loaded }}>
        {this.debug && this.debugError && (
          <div>
            <slot name="debug-fallback" />
            <sc-alert type="info" open>
              <span slot="title">{__('Express Payment', 'surecart')}</span>
              {this.debugError}
            </sc-alert>
          </div>
        )}
        <div class="sc-payment-request-button" part="button" ref={el => (this.request = el as HTMLDivElement)}></div>
      </div>
    );
  }
}

openWormhole(ScStripePaymentRequest, ['currencyCode', 'country', 'prices', 'paymentMethod'], false);
