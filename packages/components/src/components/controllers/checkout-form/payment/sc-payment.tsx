import { Component, Event, EventEmitter, h, Prop, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

import { hasSubscription } from '../../../../functions/line-items';
import { Order, Processor } from '../../../../types';

@Component({
  tag: 'sc-payment',
  styleUrl: 'sc-payment.scss',
  shadow: false,
})
export class ScPayment {
  /** The current payment method for the payment */
  @Prop() processor: string = 'stripe';

  /** List of available processors. */
  @Prop() processors: Processor[];

  /** Checkout Session from sc-checkout. */
  @Prop() order: Order;

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

  /** Set the order state. */
  @Event() scSetOrderState: EventEmitter<object>;

  @Watch('order')
  handleOrderChange() {
    if (hasSubscription(this.order)) {
      setTimeout(() => {
        this.scSetOrderState.emit({ processor: 'stripe' });
      });
    }
  }

  /**
   * Render the payment element.
   */
  renderStripePaymentElement() {
    return <sc-order-stripe-payment-element order={this.order} mode={this.mode} processors={this.processors} currency-code={this.currencyCode}></sc-order-stripe-payment-element>;
  }

  /**
   * Render Stripe and Paypal radio buttons.
   */
  renderStripeAndPayPal() {
    const showPayPal = hasSubscription(this.order);
    return (
      <sc-form-control label={this.label}>
        <div class="sc-payment-label" slot="label">
          <div>{this.label}</div>
          {this.mode === 'test' && (
            <sc-tag type="warning" size="small">
              {__('Test Mode', 'surecart')}
            </sc-tag>
          )}
        </div>
        <sc-toggles collapsible={false} theme="container">
          <sc-toggle
            show-control={!showPayPal}
            show-icon={!showPayPal}
            shady
            borderless
            open={this.processor === 'stripe'}
            onScShow={() => this.scSetOrderState.emit({ processor: 'stripe' })}
          >
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
              <span>{__('Credit Card', 'surecart')}</span>
            </span>
            {this.renderStripePaymentElement()}
          </sc-toggle>
          {!showPayPal && (
            <sc-toggle show-control shady borderless open={this.processor === 'paypal'} onScShow={() => this.scSetOrderState.emit({ processor: 'paypal' })}>
              <span slot="summary" class="sc-payment-toggle-summary">
                <sc-icon name="paypal" style={{ width: '80px', fontSize: '24px' }}></sc-icon>
              </span>
              <div class="sc-payment-instructions">{__('You will be prompted by PayPal to complete your purchase securely.', 'surecart')}</div>
            </sc-toggle>
          )}
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
          {this.mode === 'test' && (
            <sc-tag type="warning" size="small">
              {__('Test Mode', 'surecart')}
            </sc-tag>
          )}
        </div>
        <sc-toggles collapsible={false} theme="container">
          <sc-toggle show-control shady borderless open={this.processor === 'paypal-card'} onScShow={() => this.scSetOrderState.emit({ processor: 'paypal-card' })}>
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
              <span>{__('Credit Card', 'surecart')}</span>
            </span>
            <div class="sc-payment-instructions">{__('You will be prompted to complete your purchase securely.', 'surecart')}</div>
          </sc-toggle>
          <sc-toggle show-control shady borderless open={this.processor === 'paypal'} onScShow={() => this.scSetOrderState.emit({ processor: 'paypal' })}>
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

  renderNoProcessors() {
    return (
      <sc-alert type="info" open>
        {__('Please contact us for payment', 'surecart')}
      </sc-alert>
    );
  }

  render() {
    // we don't have any processors.
    if (!this.processors?.length) {
      console.error('No processors are configured for this merchant.');
      return this.renderNoProcessors();
    }

    // both stripe and paypal are enabled.
    if (
      this.processors.find(processor => processor.processor_type === 'stripe' && processor?.live_mode === (this.mode === 'live')) &&
      this.processors.find(processor => processor.processor_type === 'paypal' && processor?.live_mode === (this.mode === 'live'))
    ) {
      return this.renderStripeAndPayPal();
    }

    // we have stripe.
    if (this.processors.find(processor => processor.processor_type === 'stripe' && processor?.live_mode === (this.mode === 'live'))) {
      return (
        <sc-form-control>
          <div class="sc-payment-label" slot="label">
            <div>{this.label}</div>
            {this.mode === 'test' && (
              <sc-tag type="warning" size="small">
                {__('Test Mode', 'surecart')}
              </sc-tag>
            )}
          </div>
          <sc-card>{this.renderStripePaymentElement()}</sc-card>
        </sc-form-control>
      );
    }

    // we have paypal.
    if (!hasSubscription(this.order)) {
      if (this.processors.find(processor => processor.processor_type === 'paypal' && processor?.live_mode === (this.mode === 'live'))) {
        return this.renderPayPal();
      }
    }

    console.error(`No processors are configured for the current cart items and mode. (${this.mode})`);
    // render no processors message.
    return this.renderNoProcessors();
  }
}

openWormhole(ScPayment, ['processor', 'processors', 'order', 'mode', 'paymentMethod', 'loading', 'busy', 'currencyCode'], false);
