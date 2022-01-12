import { createOrUpdateSession, finalizeSession } from '../../../services/session';
import { Order, LineItem, Prices, Product, ResponseError } from '../../../types';
import { Component, Prop, State, h, Element, Watch, Event, EventEmitter } from '@stencil/core';
import { PaymentRequestOptions, Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-stripe-payment-request',
  styleUrl: 'ce-stripe-payment-request.scss',
  shadow: false,
})
export class CeStripePaymentRequest {
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

  /** This is required to validate the form on the server */
  @Prop() formId: number | string;

  /** Has this loaded */
  @State() loaded: boolean = false;

  @Event() ceFormSubmit: EventEmitter<any>;
  @Event() cePaid: EventEmitter<void>;
  @Event() cePayError: EventEmitter<any>;
  @Event() ceSetState: EventEmitter<string>;
  @Event() cePaymentRequestLoaded: EventEmitter<void>;

  private pendingEvent: any;

  private confirming: boolean;

  async componentWillLoad() {
    if (this?.order?.processor_data?.stripe?.publishable_key || !this?.order?.processor_data?.stripe?.account_id) {
      return true;
    }
    this.stripe = await loadStripe(this?.order?.processor_data?.stripe?.publishable_key, { stripeAccount: this?.order?.processor_data?.stripe?.account_id });
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
      ...(this.getRequestObject() as PaymentRequestOptions),
    });
  }

  @Watch('order')
  handleOrderChange() {
    if (!this.paymentRequest) return;
    if (this.pendingEvent) return;
    this.paymentRequest.update(this.getRequestObject());
  }

  @Watch('loaded')
  handleLoaded() {
    this.cePaymentRequestLoaded.emit();
  }

  @Watch('error')
  handleErrorChange() {
    if (this.pendingEvent) {
      this.pendingEvent.complete('error');
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

  getRequestObject() {
    const displayItems = (this.order?.line_items?.data || []).map(item => {
      return {
        label: this.getName(item),
        amount: item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.price.amount,
      };
    });

    return {
      currency: this.currencyCode,
      total: {
        amount: this.order?.total_amount || 0,
        label: __('Total', 'checkout_engine'),
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

    // mount button.
    this.paymentRequest
      .canMakePayment()
      .then(result => {
        if (!result) {
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
    this.ceSetState.emit('FETCH');

    try {
      // update session with shipping/billing
      (await createOrUpdateSession({
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
            ...(shippingAddress?.region ? { region: shippingAddress?.region } : {}),
          },
          billing_address: {
            ...(billing_details?.name ? { name: billing_details?.name } : {}),
            ...(billing_details?.address?.line_1 ? { line_1: billing_details?.address?.line_1 } : {}),
            ...(billing_details?.address?.line_2 ? { line_2: billing_details?.address?.line_2 } : {}),
            ...(billing_details?.address?.city ? { city: billing_details?.address?.city } : {}),
            ...(billing_details?.address?.country ? { country: billing_details?.address?.country } : {}),
            ...(billing_details?.address?.postal_code ? { postal_code: billing_details?.address?.postal_code } : {}),
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
      this.cePaid.emit();
      // Report to the browser that the confirmation was successful, prompting
      // it to close the browser payment method collection interface.
      console.log('complete');
      ev.complete('success');
    } catch (e) {
      console.error(e);
      this.cePayError.emit(e);
      ev.complete('fail');
    } finally {
      this.confirming = false;
      this.ceSetState.emit('RESOLVE');
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
        <div class="ce-payment-request-button" part="button" ref={el => (this.request = el as HTMLDivElement)}></div>
        <div class="or" part="or">
          <slot />
        </div>
      </div>
    );
  }
}

openWormhole(CeStripePaymentRequest, ['keys', 'currencyCode', 'country', 'prices', 'paymentMethod'], false);
