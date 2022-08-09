import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { Stripe } from '@stripe/stripe-js';

import apiFetch from '../../../../functions/fetch';
import { getProcessorData } from '../../../../functions/processor';
import { Checkout, PaymentIntent, Processor } from '../../../../types';
import { shouldReloadElement } from './functions';

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
  @Prop() order: Checkout;

  /** Should we collect an address? */
  @Prop() address: boolean;

  /** Holds the stripe instance. */
  @State() stripe: Stripe;

  /** Holds the stripe client secret for this element. */
  @State() clientSecret: string;

  /** Holds the current payment intent */
  @State() paymentIntent: PaymentIntent;

  @Event() scPaid: EventEmitter<void>;
  @Event() scPayError: EventEmitter<any>;
  @Event() scSetPaymentIntent: EventEmitter<{ processor: 'stripe'; payment_intent: PaymentIntent }>;

  @State() error: string;
  @State() confirming: boolean;

  async componentDidLoad() {
    this.paymentIntent = (await apiFetch({
      method: 'POST',
      path: 'surecart/v1/payment_intents',
      data: {
        amount: typeof this?.order?.amount_due === 'number' ? this.order.amount_due : 100,
        currency: this.currencyCode,
        processor_type: 'stripe',
        live_mode: this.mode === 'live',
      },
    })) as PaymentIntent;
    this.clientSecret = this.paymentIntent.processor_data?.stripe?.client_secret;
  }

  async updatePaymentIntent() {
    if (!this.paymentIntent?.id) {
      return;
    }
    this.paymentIntent = (await apiFetch({
      method: 'PATCH',
      path: `surecart/v1/payment_intents/${this.paymentIntent.id}`,
      data: {
        amount: this.order.amount_due,
        currency: this.currencyCode,
        processor_type: 'stripe',
        live_mode: this.mode === 'live',
      },
    })) as PaymentIntent;
    this.clientSecret = this.paymentIntent.processor_data?.stripe?.client_secret;
  }

  @Watch('order')
  async handleOrderChange() {
    if (!shouldReloadElement(this.paymentIntent, this.order)) return;
    this.clientSecret = null;
    await this.updatePaymentIntent();
  }

  /**
   * When the payment intent is first set,
   * we need to sync it if we have an order.
   */
  @Watch('paymentIntent')
  async handlePaymentIntentChange() {
    // check if we should reload the payment intent
    if (shouldReloadElement(this.paymentIntent, this.order)) {
      await this.updatePaymentIntent();
    }
    // update payment intent in form when it's set.
    this.scSetPaymentIntent.emit({ processor: 'stripe', payment_intent: this.paymentIntent });
  }

  render() {
    // get account id and publishable key from the stripe processor for this mode.
    const data = getProcessorData(this.processors, 'stripe', this.mode);
    return (
      <sc-stripe-payment-element
        order={this.order}
        address={this.address}
        client-secret={this.clientSecret}
        publishableKey={data?.publishable_key}
        accountId={data?.account_id}
        key={this.clientSecret}
      ></sc-stripe-payment-element>
    );
  }
}
