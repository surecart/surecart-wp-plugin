import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { getProcessorData } from '../../../../functions/processor';
import { Checkout, PaymentIntent, Processor, ProcessorName } from '../../../../types';

/**
 * @part base - The elements base wrapper.
 * @part form-control - The form control wrapper.
 * @part label - The input label.
 * @part help-text - Help text that describes how to use the input.
 * @part secure-notice__base - Secure notice base.
 * @part secure-notice__icon - Secure notice icon.
 * @part secure-notice__text - Secure notice text.
 * @part test-badge__base - Test badge base.
 * @part test-badge__content - Test badge content.
 * @part toggle__base - Toggle base.
 * @part toggle__header - Toggle header
 * @part toggle__radio - Toggle radio
 * @part toggle__summary - Toggle summary
 * @part toggle__summary-icon - Toggle icon
 * @part toggle__content - Toggle content
 * @part instructions - Payment instructions.
 * @part instructions__divider - Payment instructions divider.
 * @part instructions__divider-line - Payment instructions divider line.
 * @part instructions__text  - Payment instructions text.

 */
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

  /** Hold the stripe processor */
  @State() stripe: Processor;

  /** Holds the paypal processor. */
  @State() paypal: Processor;

  /** Set the order procesor. */
  @Event() scSetProcessor: EventEmitter<ProcessorName>;

  componentWillLoad() {
    this.scSetProcessor.emit(this.defaultProcessor);
    this.processor = this.defaultProcessor;
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
      return <sc-stripe-payment-element order={this.order} paymentIntent={this.stripePaymentIntent} />;
    }

    const data = getProcessorData(this.processors, 'stripe', this.mode);
    return (
      <div class="sc-payment__stripe-card-element">
        <sc-stripe-element order={this.order} mode={this.mode} publishableKey={data?.publishable_key} accountId={data?.account_id} secureText={this.secureNotice} />
        <sc-secure-notice exportparts="base:secure-notice__base, icon:secure-notice__icon, text:secure-notice__text">{this.secureNotice}</sc-secure-notice>
      </div>
    );
  }

  renderTestModeBadge() {
    if (this.hideTestModeBadge) return null;
    return (
      this.mode === 'test' && (
        <sc-tag exportparts="base:test-badge__base, content:test-badge__content" type="warning" size="small">
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
      <sc-form-control label={this.label} exportparts="label, help-text, form-control">
        <div class="sc-payment-label" slot="label">
          <div>{this.label}</div>
          {this.renderTestModeBadge()}
        </div>
        <sc-toggles collapsible={false} theme="container" part="toggles">
          <sc-toggle
            part="toggle"
            exportparts="base:toggle__base, header:toggle__header, radio:toggle__radio, summary:toggle__summary, summary-icon:toggle__summary-icon, content:toggle__content"
            class="sc-stripe-toggle"
            show-control
            shady
            borderless
            open={this.processor === 'stripe'}
            onScShow={() => this.scSetProcessor.emit('stripe')}
          >
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
              <span>{__('Credit Card', 'surecart')}</span>
            </span>
            {this.renderStripePaymentElement()}
          </sc-toggle>

          <sc-toggle
            part="toggle"
            exportparts="base:toggle__base, header:toggle__header, radio:toggle__radio, summary:toggle__summary, summary-icon:toggle__summary-icon, content:toggle__content"
            class="sc-paypal-toggle"
            show-control
            shady
            borderless
            open={this.processor === 'paypal'}
            onScShow={() => this.scSetProcessor.emit('paypal')}
          >
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name={window?.scData?.theme === 'dark' ? 'paypal-white' : 'paypal'} style={{ width: '80px', fontSize: '24px' }}></sc-icon>
            </span>
            <sc-card>
              <sc-payment-selected
                exportparts="base:instructions, divider:instructions__divider, divider-line:instructions__divider-line, text:instructions__text, "
                label={__('PayPal selected for check out.', 'surecart')}
              >
                <sc-icon slot="icon" name={window?.scData?.theme === 'dark' ? 'paypal-white' : 'paypal'} style={{ width: '80px' }} />
                {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
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
      <sc-form-control label={this.label} exportparts="label, help-text, form-control">
        <div class="sc-payment-label" slot="label">
          <div>{this.label}</div>
          {this.renderTestModeBadge()}
        </div>
        <sc-toggles collapsible={false} theme="container">
          <sc-toggle
            data-test-id="paypal-credit-card-toggle"
            part="toggle"
            exportparts="base:toggle__base, header:toggle__header, radio:toggle__radio, summary:toggle__summary, summary-icon:toggle__summary-icon, content:toggle__content"
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
            <sc-card>
              <sc-payment-selected
                exportparts="base:instructions, divider:instructions__divider, divider-line:instructions__divider-line, text:instructions__text, "
                label={__('Credit Card selected for check out.', 'surecart')}
              >
                <sc-icon slot="icon" name="credit-card" />
                {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
              </sc-payment-selected>
            </sc-card>
          </sc-toggle>
          <sc-toggle
            part="toggle"
            exportparts="base:toggle__base, header:toggle__header, radio:toggle__radio, summary:toggle__summary, summary-icon:toggle__summary-icon, content:toggle__content"
            data-test-id="paypal-toggle"
            show-control
            shady
            borderless
            open={this.processor === 'paypal'}
            onScShow={() => this.scSetProcessor.emit('paypal')}
          >
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name={window?.scData?.theme === 'dark' ? 'paypal-white' : 'paypal'} style={{ width: '80px', fontSize: '24px' }}></sc-icon>
            </span>
            <sc-card>
              <sc-payment-selected
                exportparts="base:instructions, divider:instructions__divider, divider-line:instructions__divider-line, text:instructions__text, "
                label={__('PayPal selected for check out.', 'surecart')}
              >
                <sc-icon slot="icon" name={window?.scData?.theme === 'dark' ? 'paypal-white' : 'paypal'} style={{ width: '80px' }} />
                {__('Another step will appear after submitting your order to complete your purchase details.', 'surecart')}
              </sc-payment-selected>
            </sc-card>
          </sc-toggle>
        </sc-toggles>
      </sc-form-control>
    );
  }

  renderLoading() {
    return (
      <div part="loading">
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
      <sc-form-control label={this.label} exportparts="label, help-text, form-control">
        <sc-alert type="info" open>
          {__('Please contact us for payment', 'surecart')}
        </sc-alert>
      </sc-form-control>
    );
  }

  renderProcessors() {
    // payment is not required for this order.
    if (this.order?.payment_method_required === false) {
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
        <sc-form-control label={this.label} exportparts="label, help-text, form-control">
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

  render() {
    return (
      <Host>
        {/* Handles the automatic filtering and selection of processors */}
        <sc-processor-provider checkout={this.order} processors={this.processors} processor={this.processor} />
        {this.renderProcessors()}
      </Host>
    );
  }
}

openWormhole(ScPayment, ['processor', 'processors', 'order', 'mode', 'paymentMethod', 'loading', 'busy', 'currencyCode', 'stripePaymentElement', 'stripePaymentIntent'], false);
