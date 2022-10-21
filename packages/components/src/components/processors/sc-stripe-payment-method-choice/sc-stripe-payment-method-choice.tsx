import { Component, h, Event, EventEmitter, Prop } from '@stencil/core';
import { openWormhole } from 'stencil-wormhole';
import { getProcessorData } from '../../../functions/processor';
import { Checkout, PaymentIntent, Processor } from '../../../types';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-stripe-payment-method-choice',
  styleUrl: 'sc-stripe-payment-method-choice.css',
  shadow: false,
})
export class ScStripePaymentMethodChoice {
  /** The currently selected processor */
  @Prop() processor: string;

  /** List of available processors. */
  @Prop() processors: Processor[] = [];

  /** The checkout. */
  @Prop() checkout: Checkout;

  /** Use the Stripe payment element. */
  @Prop() stripePaymentElement: boolean;

  /** The stripe payment intent. */
  @Prop() stripePaymentIntent: PaymentIntent;

  /** The secure notice. */
  @Prop() secureNotice: string;

  /** Is this created in "test" mode */
  @Prop() mode: 'test' | 'live' = 'live';

  /** Set the order procesor. */
  @Event() scSetProcessor: EventEmitter<string>;

  renderContent() {
    if (this.stripePaymentElement) {
      return <sc-stripe-payment-element order={this.checkout} paymentIntent={this.stripePaymentIntent} />;
    }

    const data = getProcessorData(this.processors, 'stripe', this.mode);
    return (
      <div class="sc-payment__stripe-card-element">
        <sc-stripe-element order={this.checkout} mode={this.mode} publishableKey={data?.publishable_key} accountId={data?.account_id} secureText={this.secureNotice} />
        <sc-secure-notice>{this.secureNotice}</sc-secure-notice>
      </div>
    );
  }

  render() {
    return (
      <sc-payment-method-choice open={this.processor === 'stripe'} onScShow={() => this.scSetProcessor.emit('stripe')} hasOthers>
        <span slot="summary" class="sc-payment-toggle-summary">
          <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
          <span>{__('Credit Card', 'surecart')}</span>
        </span>
        {this.renderContent()}
      </sc-payment-method-choice>
    );
  }
}

openWormhole(ScStripePaymentMethodChoice, ['processor', 'processors', 'checkout', 'stripePaymentElement', 'stripePaymentIntent', 'mode'], true);
