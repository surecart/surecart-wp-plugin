import { Component, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { getProcessorData } from '../../../../functions/processor';
import { Checkout, PaymentIntent, Processor, ProcessorName } from '../../../../types';

@Component({
  tag: 'sc-payment',
  styleUrl: 'sc-payment.scss',
  shadow: false,
})
export class ScPayment {
  /** The current payment method for the payment */
  @Prop() processor: string = 'stripe';

  /** List of available processors. */
  @Prop() processors: Processor[] = [];

  /** Checkout Session from sc-checkout. */
  @Prop() order: Checkout;

  /** Is this loading. */
  @Prop() loading: boolean;

  /** Is this busy. */
  @Prop() busy: boolean;

  /** Is this created in "test" mode */
  @Prop() mode: 'test' | 'live' = 'live';

  /** Secure notice */
  @Prop() secureNotice: string;

  /** The input's label. */
  @Prop() label: string;

  /** Payment mode inside individual payment method (i.e. Payment Buttons) */
  @Prop() paymentMethod: 'stripe-payment-request' | null;

  /** The currency code. */
  @Prop() currencyCode: string = 'usd';

  /** Default */
  @Prop() defaultProcessor: ProcessorName = 'stripe';

  /** Hide the test mode badge */
  @Prop() hideTestModeBadge: boolean;

  /** Use the Stripe payment element. */
  @Prop() stripePaymentElement: boolean;

  /** The stripe payment intent. */
  @Prop() stripePaymentIntent: PaymentIntent;

  @Prop() previewStripePaymentElement: boolean;

  /** Hold the stripe processor */
  @State() stripe: Processor;

  /** Holds the paypal processor. */
  @State() paypal: Processor;

  /** Set the order procesor. */
  @Event() scSetProcessor: EventEmitter<ProcessorName>;

  @Watch('order')
  handleOrderChange(_, prev) {
    if (!prev) {
      this.handleDefaultChange();
    }
  }

  @Watch('defaultProcessor')
  handleDefaultChange() {
    if (this.defaultProcessor) {
      this.scSetProcessor.emit(this.defaultProcessor);
    }
  }

  componentWillLoad() {
    this.setProcessors();
  }

  /** Set the processors for this order. */
  @Watch('processors')
  @Watch('mode')
  setProcessors() {
    this.stripe = (this.processors || []).find(processor => processor.processor_type === 'stripe' && processor?.live_mode === (this.mode === 'live'));
    this.paypal = (this.processors || []).find(processor => processor.processor_type === 'paypal' && processor?.live_mode === (this.mode === 'live'));
  }

  /**
   * Render the payment element.
   */
  renderStripePaymentElement() {
    if (this.stripePaymentElement) {
      if (this.previewStripePaymentElement) {
        return <sc-card>{__('The Stripe Payment element will appear here when something is added to the checkout.', 'surecart')}</sc-card>;
      }
      return <sc-stripe-payment-element order={this.order} paymentIntent={this.stripePaymentIntent} />
    }

    const data = getProcessorData(this.processors, 'stripe', this.mode);
    return (
      <div class="sc-payment__stripe-card-element">
        <sc-stripe-element
          order={this.order}
          mode={this.mode}
          publishableKey={data?.publishable_key}
          accountId={data?.account_id}
          secureText={this.secureNotice}
        />
        <sc-secure-notice>{this.secureNotice}</sc-secure-notice>
      </div>
    );
  }

  renderTestModeBadge() {
    if (this.hideTestModeBadge) return null;
    return (
      this.mode === 'test' && (
        <sc-tag type="warning" size="small">
          {__('Test Mode', 'surecart')}
        </sc-tag>
      )
    );
  }

  /**
   * Render Stripe and Paypal radio buttons.
   */
  renderStripeAndPayPal() {
    return (
      <sc-form-control label={this.label}>
        <div class="sc-payment-label" slot="label">
          <div>{this.label}</div>
          {this.renderTestModeBadge()}
        </div>
        <sc-toggles collapsible={false} theme="container">
          <sc-toggle class="sc-stripe-toggle" show-control shady borderless open={this.processor === 'stripe'} onScShow={() => this.scSetProcessor.emit('stripe')}>
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
              <span>{__('Credit Card', 'surecart')}</span>
            </span>
            {this.renderStripePaymentElement()}
          </sc-toggle>

          <sc-toggle class="sc-paypal-toggle" show-control shady borderless open={this.processor === 'paypal'} onScShow={() => this.scSetProcessor.emit('paypal')}>
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="paypal" style={{ width: '80px', fontSize: '24px' }}></sc-icon>
            </span>
            <sc-card>
              <sc-payment-selected
                iconName="paypal"
                label={__(
                  'PayPal selected for check out.',
                  'surecart'
                )}>
                  {__(
                    'Another step will appear after submitting your order to complete your purchase details.',
                    'surecart'
                  )}
              </sc-payment-selected>
            </sc-card>
          </sc-toggle>
        </sc-toggles>
      </sc-form-control>
    );
  }

  /**
   * Render PayPal options.
   */
  renderPayPal() {
    return (
      <sc-form-control label={this.label}>
        <div class="sc-payment-label" slot="label">
          <div>{this.label}</div>
          {this.renderTestModeBadge()}
        </div>
        <sc-toggles collapsible={false} theme="container">
          <sc-toggle
            data-test-id="paypal-credit-card-toggle"
            show-control
            shady
            borderless
            open={this.processor === 'paypal-card'}
            onScShow={() => this.scSetProcessor.emit('paypal-card')}
          >
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
              <span>{__('Credit Card', 'surecart')}</span>
            </span>
            <div class="sc-payment-instructions">{__('You will be prompted to complete your purchase securely.', 'surecart')}</div>
          </sc-toggle>
          <sc-toggle data-test-id="paypal-toggle" show-control shady borderless open={this.processor === 'paypal'} onScShow={() => this.scSetProcessor.emit('paypal')}>
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="paypal" style={{ width: '80px', fontSize: '24px' }}></sc-icon>
            </span>
            <div class="sc-payment-instructions">{__('You will be prompted by PayPal to complete your purchase securely.', 'surecart')}</div>
          </sc-toggle>
        </sc-toggles>
      </sc-form-control>
    );
  }

  renderLoading() {
    return (
      <div>
        <sc-skeleton style={{ width: '10%', marginBottom: '1em' }}></sc-skeleton>
        <sc-skeleton style={{ width: '100%', marginBottom: '1em' }}></sc-skeleton>
        <sc-skeleton style={{ width: '35%' }}></sc-skeleton>
      </div>
    );
  }

  getProcessor() {
    switch (this.processor) {
      case 'paypal':
      case 'paypal-card':
        return 'paypal';
      default:
        return 'stripe';
    }
  }

  renderNoProcessors() {
    return (
      <sc-form-control label={this.label}>
        <sc-alert type="info" open>
          {__('Please contact us for payment', 'surecart')}
        </sc-alert>
      </sc-form-control>
    );
  }

  render() {
    // payment is not required for this order.
    if (this.order.payment_required === false) {
      return null;
    }

    // we don't have any processors.
    if (!this.processors?.length) {
      console.warn('No processors are configured for this merchant.');
      return this.renderNoProcessors();
    }

    // both stripe and paypal are enabled.
    if (this.stripe && this.paypal) {
      return this.renderStripeAndPayPal();
    }

    // we have stripe.
    if (this.stripe) {
      return (
        <sc-form-control label={this.label}>
          <div class="sc-payment-label" slot="label">
            <div>{this.label}</div>
            {this.renderTestModeBadge()}
          </div>
          {this.stripePaymentElement ? <sc-card>{this.renderStripePaymentElement()}</sc-card> : this.renderStripePaymentElement()}
        </sc-form-control>
      );
    }

    // we have paypal.
    if (this.paypal) {
      return this.renderPayPal();
    }

    console.warn(`No processors are configured for the current cart items and mode. (${this.mode})`);
    // render no processors message.
    return this.renderNoProcessors();
  }
}

openWormhole(ScPayment, ['processor', 'processors', 'order', 'mode', 'paymentMethod', 'loading', 'busy', 'currencyCode', 'stripePaymentElement', 'stripePaymentIntent'], false);
