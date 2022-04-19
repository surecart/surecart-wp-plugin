import { Order, Processor } from '../../../../types';
import { Component, h, Prop, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

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

  renderStripeAndPayPal() {
    return (
      <sc-choices label={this.label}>
        <sc-choice checked={this.processor === 'stripe'}>{__('Credit Card', 'surecart')}</sc-choice>
        <sc-choice checked={this.processor === 'paypal'}>{__('PayPal', 'surecart')}</sc-choice>
      </sc-choices>
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
    if (this.loading) {
      return this.renderLoading();
    }

    if (!this.processor) {
      return <div>{__('Please contact us for payment', 'surecart')}</div>;
    }

    // @ts-ignore

    // both stripe and paypal are enabled.
    // if (this.processors.find(processor => processor.processor_type === 'stripe') && this.processors.find(processor => processor.processor_type === 'paypal')) {
    return this.renderStripeAndPayPal();
    // }

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
