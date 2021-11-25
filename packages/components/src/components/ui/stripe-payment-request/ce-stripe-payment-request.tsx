import { Component, Prop, State, h, Element, Watch, Event, EventEmitter } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js/pure';
import { PaymentRequestOptions, Stripe } from '@stripe/stripe-js';
import { openWormhole } from 'stencil-wormhole';
import { CheckoutSession, Keys, LineItem, Prices, Product, ResponseError } from '../../../types';
import { __ } from '@wordpress/i18n';

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

  /** Stripe publishable key */
  @Prop() keys: Keys = {
    stripe: '',
  };

  /** Stripe account id */
  @Prop() stripeAccountId: string;

  /** Country */
  @Prop() country: string = 'US';

  /** Currency */
  @Prop() currencyCode: string = 'usd';

  /** Checkout Session */
  @Prop() checkoutSession: CheckoutSession;

  @Prop() prices: Prices;

  /** Label */
  @Prop() label: string = 'total';

  /** Amount */
  @Prop() amount: number = 0;

  /** Payment request theme */
  @Prop() theme: string = 'dark';

  @Prop() error: ResponseError | null;

  /** Has this loaded */
  @State() loaded: boolean = false;

  @Event() ceFormSubmit: EventEmitter<any>;

  @Event() ceUpdateBillingAddress: EventEmitter<any>;

  private pendingEvent: any;

  async componentWillLoad() {
    if (!this.keys.stripe) {
      return true;
    }
    this.stripe = await loadStripe(this.keys.stripe);
    this.elements = this.stripe.elements();
    this.paymentRequest = this.stripe.paymentRequest({
      country: this.country,
      requestPayerEmail: true,
      ...(this.getRequestObject() as PaymentRequestOptions),
    });
  }

  @Watch('checkoutSession')
  handleCheckoutSessionChange() {
    if (!this.paymentRequest) return;
    if (this.pendingEvent) return;
    this.paymentRequest.update(this.getRequestObject());
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
    const displayItems = (this.checkoutSession?.line_items?.data || []).map(item => {
      return {
        label: this.getName(item),
        amount: item.ad_hoc_amount !== null ? item.ad_hoc_amount : item.price.amount,
      };
    });

    return {
      currency: this.currencyCode,
      total: {
        amount: this.checkoutSession?.total_amount || 0,
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

    this.paymentRequest.on('paymentmethod', ev => {
      this.pendingEvent = ev;
      const { billing_details } = ev?.paymentMethod;
      // const { shippingAddress } = ev;

      // update billing and shipping from paymentRequest
      this.ceFormSubmit.emit({
        email: ev?.payerEmail,
        // shipping_address: {
        //   ...(shippingAddress?.name ? { name: shippingAddress?.name } : {}),
        //   ...(shippingAddress?.addressLine?.[0] ? { line_1: shippingAddress?.addressLine?.[0] } : {}),
        //   ...(shippingAddress?.addressLine?.[1] ? { line_2: shippingAddress?.addressLine?.[1] } : {}),
        //   ...(shippingAddress?.city ? { city: shippingAddress?.city } : {}),
        //   ...(shippingAddress?.country ? { country: shippingAddress?.country } : {}),
        //   ...(shippingAddress?.postalCode ? { postal_code: shippingAddress?.postalCode } : {}),
        //   ...(shippingAddress?.region ? { region: shippingAddress?.region } : {}),
        // },
        billing_address: {
          ...(billing_details?.name ? { name: billing_details?.name } : {}),
          ...(billing_details?.address?.line_1 ? { line_1: billing_details?.address?.line_1 } : {}),
          ...(billing_details?.address?.line_2 ? { line_2: billing_details?.address?.line_2 } : {}),
          ...(billing_details?.address?.city ? { city: billing_details?.address?.city } : {}),
          ...(billing_details?.address?.country ? { country: billing_details?.address?.country } : {}),
          ...(billing_details?.address?.postal_code ? { postal_code: billing_details?.address?.postal_code } : {}),
        },
      });
    });

    const paymentRequestElement = this.elements.create('paymentRequestButton', {
      paymentRequest: this.paymentRequest,
      style: {
        paymentRequestButton: {
          theme: this.theme,
        },
      },
    });

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

  @Watch('checkoutSession')
  async confirmPayment(val: CheckoutSession) {
    // must have a pending payment event.
    if (!this.pendingEvent) return;
    // must be finalized
    if (val?.status !== 'finalized') return;
    // must have a secret
    if (!val?.payment_intent?.external_client_secret) return;
    // must have an external intent id
    if (!val?.payment_intent?.external_intent_id) return;
    // need an external_type
    if (!val?.payment_intent?.external_type) return;
    // // prevent possible double-charges
    // if (this.confirming) return;

    this.pendingEvent.complete('success');
    this.pendingEvent = null;

    // this.confirming = true;
    // try {
    //   let response;
    //   if (val?.payment_intent?.external_type == 'setup') {
    //     response = await this.confirmCardSetup(val.payment_intent.external_client_secret);
    //   } else {
    //     response = await this.confirmCardPayment(val.payment_intent.external_client_secret);
    //   }
    //   if (response?.error) {
    //     throw response.error;
    //   }
    //   // paid
    //   this.cePaid.emit();
    // } catch (e) {
    //   this.cePayError.emit(e);
    //   if (e.message) {
    //     this.error = e.message;
    //   }
    // } finally {
    //   this.confirming = false;
    // }
  }

  render() {
    return (
      <div class={{ 'request': true, 'request--loaded': this.loaded }}>
        <div class="ce-payment-request-button" part="button" ref={el => (this.request = el as HTMLDivElement)}></div>
        <div class="or" part="or">
          <slot></slot>
        </div>
      </div>
    );
  }
}

openWormhole(CeStripePaymentRequest, ['keys', 'checkoutSession', 'currencyCode', 'country', 'prices'], false);
