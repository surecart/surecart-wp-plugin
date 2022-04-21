import { Component, Fragment, h, Prop, State, Watch } from '@stencil/core';
import { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { getProcessorData } from '../../../../functions/processor';
import apiFetch from '../../../../functions/fetch';
import { Order, PaymentIntent, Processor } from '../../../../types';

@Component({
  tag: 'sc-order-stripe-payment-element',
  styleUrl: 'sc-order-stripe-payment-element.scss',
  shadow: false,
})
export class ScOrderStripePaymentElement {
  /** Available processors */
  @Prop() processors: Processor[] = [];

  /** Payment mode. */
  @Prop() mode: 'test' | 'live' = 'live';

  /** The currency code for the payment element. */
  @Prop() currencyCode: string = 'usd';

  /** The order. */
  @Prop() order: Order;

  /** Has the element loaded yet? */
  @State() loaded: boolean = false;

  /** Holds the stripe instance. */
  @State() stripe: Stripe;

  /** Holds the stripe client secret for this element. */
  @State() clientSecret: string;

  /** Holds the current payment intent */
  @State() paymentIntent: PaymentIntent;

  async componentWillLoad() {
    const { publishable_key, account_id } = getProcessorData(this.processors, 'stripe', this.mode);
    if (!publishable_key || !account_id) {
      return;
    }
    this.stripe = await loadStripe(publishable_key, { stripeAccount: account_id });
  }

  async componentDidLoad() {
    this.paymentIntent = (await apiFetch({
      method: 'POST',
      path: 'surecart/v1/payment_intents',
      data: {
        amount: 100,
        currency: this.currencyCode,
        processor_type: 'stripe',
        live_mode: this.mode === 'live',
      },
    })) as PaymentIntent;
    this.clientSecret = this.paymentIntent.processor_data?.stripe?.client_secret;
  }

  async updatePaymentIntent() {
    this.paymentIntent = (await apiFetch({
      method: 'PATCH',
      path: `surecart/v1/payment_intents`,
      data: {
        amount: this.order.amount_due,
        currency: this.currencyCode,
        processor_type: 'stripe',
        live_mode: this.mode === 'live',
      },
    })) as PaymentIntent;
  }

  @Watch('order')
  handleOrderChange(val, prev) {
    // update the payment intent if the amount due changes.
    if (prev?.amount_due !== val?.amount_due) {
      this.updatePaymentIntent();
    }
  }

  renderLoading() {
    return (
      <div class="loader">
        <div class="loader__row">
          <div style={{ width: '50%' }}>
            <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
            <sc-skeleton></sc-skeleton>
          </div>
          <div style={{ flex: '1' }}>
            <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
            <sc-skeleton></sc-skeleton>
          </div>
          <div style={{ flex: '1' }}>
            <sc-skeleton style={{ width: '50%', marginBottom: '0.5em' }}></sc-skeleton>
            <sc-skeleton></sc-skeleton>
          </div>
        </div>
        <div class="loader__details">
          <sc-skeleton style={{ height: '1rem' }}></sc-skeleton>
          <sc-skeleton style={{ height: '1rem', width: '30%' }}></sc-skeleton>
        </div>
      </div>
    );
  }

  render() {
    if (!this.stripe || !this.clientSecret) return this.renderLoading();
    return (
      <Fragment>
        {!this.loaded && this.renderLoading()}
        <sc-stripe-payment-element
          hidden={!this.loaded}
          stripe={this.stripe}
          client-secret={this.clientSecret}
          onScStripeElementReady={() => (this.loaded = true)}
        ></sc-stripe-payment-element>
      </Fragment>
    );
  }
}
