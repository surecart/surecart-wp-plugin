import { Order, Processor } from '../../../../types';
import { Component, h, Prop, Host, Event, EventEmitter, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';
import { hasSubscription } from '../../../../functions/line-items';

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

  @Event() scSetOrderState: EventEmitter<object>;

  @Watch('order')
  handleOrderChange() {
    if (hasSubscription(this.order)) {
      setTimeout(() => {
        this.scSetOrderState.emit({ processor: 'stripe' });
      });
    }
  }

  renderStripeAndPayPal() {
    return (
      <sc-form-control label={this.label}>
        <sc-toggles collapsible={false} theme="container">
          <sc-toggle show-control shady borderless open={this.processor === 'stripe'} onScShow={() => this.scSetOrderState.emit({ processor: 'stripe' })}>
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="credit-card" style={{ fontSize: '24px' }}></sc-icon>
              <span>{__('Credit Card', 'surecart')}</span>
            </span>
            <sc-order-stripe-payment-element mode={this.mode} processors={this.processors} currency-code={this.currencyCode}></sc-order-stripe-payment-element>
          </sc-toggle>
          <sc-toggle
            disabled={hasSubscription(this.order)}
            show-control
            shady
            borderless
            open={this.processor === 'paypal'}
            onScShow={() => this.scSetOrderState.emit({ processor: 'paypal' })}
          >
            <span slot="summary" class="sc-payment-toggle-summary">
              <sc-icon name="paypal" style={{ width: '80px', fontSize: '24px' }}></sc-icon>
            </span>
            <div class="sc-payment-instructions">{__('You will be prompted by PayPal to complete your purchase securely.', 'surecart')}</div>
          </sc-toggle>
        </sc-toggles>
      </sc-form-control>
    );
  }

  renderPayPal() {
    return (
      <sc-form-control label={this.label}>
        <sc-toggles collapsible={false} theme="container">
          <sc-toggle show-control shady borderless open={this.processor === 'stripe'} onScShow={() => this.scSetOrderState.emit({ processor: 'stripe' })}>
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

  render() {
    if (!this.processor) {
      return <div>{__('Please contact us for payment', 'surecart')}</div>;
    }

    // both stripe and paypal are enabled.
    if (this.processors.find(processor => processor.processor_type === 'stripe') && this.processors.find(processor => processor.processor_type === 'paypal')) {
      return this.renderStripeAndPayPal();
    }

    if (this.processors.find(processor => processor.processor_type === 'stripe')) {
      return (
        <sc-form-control label={this.label}>
          <sc-card>
            <sc-order-stripe-payment-element mode={this.mode} processors={this.processors} currency-code={this.currencyCode}></sc-order-stripe-payment-element>
          </sc-card>
        </sc-form-control>
      );
    }

    if (!hasSubscription(this.order)) {
      if (this.processors.find(processor => processor.processor_type === 'paypal')) {
        return this.renderPayPal();
      }
    }

    // if ('paypal' === this.processor) {
    //   if (!this?.order?.processor_data?.paypal?.client_id || !this?.order?.processor_data?.paypal?.account_id) {
    //     return (
    //       <div>
    //         <sc-skeleton style={{ width: '100%', marginBottom: '1em' }}></sc-skeleton>
    //         <sc-skeleton style={{ width: '35%' }}></sc-skeleton>
    //       </div>
    //     );
    //   }

    //   return <sc-paypal-buttons label={this.label} mode={this.mode} order={this.order} client-id={this?.order?.processor_data?.paypal?.client_id}></sc-paypal-buttons>;
    // }

    // @ts-ignore
    if ('stripe' === this.processor) {
      if (!this?.order?.processor_data?.stripe?.publishable_key || !this?.order?.processor_data?.stripe?.account_id) {
        return this.renderLoading();
      }

      return (
        <Host>
          <sc-stripe-element
            label={this.label}
            mode={this.mode}
            order={this.order}
            stripeAccountId={this?.order?.processor_data?.stripe?.account_id}
            publishableKey={this?.order?.processor_data?.stripe?.publishable_key}
            disabled={!!this.paymentMethod}
          ></sc-stripe-element>
          <sc-secure-notice>
            {this.secureNotice}{' '}
            {this.mode === 'test' && (
              <sc-tooltip
                slot="suffix"
                type="warning"
                width={'220px'}
                text={__('In test mode, you can use the card 4242 4242 4242 4242 and any code/expiration date.', 'surecart')}
              >
                <sc-tag type="warning" size="small">
                  {__('Test Mode', 'surecart')}
                </sc-tag>
              </sc-tooltip>
            )}
          </sc-secure-notice>

          {this.busy && <sc-block-ui style={{ zIndex: '9' }}></sc-block-ui>}
        </Host>
      );
    }
  }
}

openWormhole(ScPayment, ['processor', 'processors', 'order', 'mode', 'paymentMethod', 'loading', 'busy', 'currencyCode'], false);
