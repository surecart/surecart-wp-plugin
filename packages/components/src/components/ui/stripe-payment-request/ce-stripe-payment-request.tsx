import { Component, Prop, State, h, Element } from '@stencil/core';
import { loadStripe } from '@stripe/stripe-js/pure';
import { Stripe } from '@stripe/stripe-js';

@Component({
  tag: 'ce-stripe-payment-request',
  styleUrl: 'ce-stripe-payment-request.scss',
  shadow: false,
})
export class CEStripePaymentRequest {
  @Element() el: HTMLElement;
  private request: HTMLDivElement;
  private stripe: Stripe;
  private paymentRequest: any;
  private elements: any;

  /** Stripe publishable key */
  @Prop() stripePublishableKey: string;

  /** Stripe account id */
  @Prop() stripeAccountId: string;

  /** Country */
  @Prop() country: string = 'US';

  /** Currency */
  @Prop() currency: string = 'usd';

  /** Label */
  @Prop() label: string = 'total';

  /** Amount */
  @Prop() amount: number = 0;

  /** Payment request theme */
  @Prop() theme: string = 'dark';

  /** Has this loaded */
  @State() loaded: boolean = false;

  async componentWillLoad() {
    if (!this.stripePublishableKey) {
      return true;
    }
    this.stripe = await loadStripe(this.stripePublishableKey);
    this.elements = this.stripe.elements();

    this.paymentRequest = this.stripe.paymentRequest({
      country: this.country,
      currency: this.currency,
      total: {
        amount: this.amount,
        label: this.label,
      },
    });
  }

  componentDidLoad() {
    if (!this.elements) {
      return;
    }

    this.paymentRequest.on('token', function (result) {
      // TODO: broadcast success
      result.complete('success');
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
