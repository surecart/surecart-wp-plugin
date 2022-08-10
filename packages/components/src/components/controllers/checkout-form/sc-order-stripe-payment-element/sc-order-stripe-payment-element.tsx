import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { Stripe } from '@stripe/stripe-js';

import { Checkout, PaymentIntent, Processor } from '../../../../types';

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

  /** Payment intent */
  @Prop() paymentIntent: PaymentIntent;

  /** Holds the stripe instance. */
  @State() stripe: Stripe;

  @State() error: string;
  @State() confirming: boolean;

  render() {
    console.log(this.paymentIntent.updated_at);
    return (
      <sc-stripe-payment-element
        order={this.order}
        address={this.address}
        client-secret={this.paymentIntent.processor_data?.stripe?.client_secret}
        publishableKey={this.paymentIntent?.processor_data?.stripe?.publishable_key}
        accountId={this.paymentIntent?.processor_data?.stripe?.account_id}
        updated={this.paymentIntent.updated_at} /** Important: This key will reload the element when update_at changes */
      ></sc-stripe-payment-element>
    );
  }
}
