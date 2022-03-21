import { Order } from '../../../../types';
import { Component, h, Prop, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { openWormhole } from 'stencil-wormhole';

@Component({
  tag: 'ce-payment',
  styleUrl: 'ce-payment.scss',
  shadow: false,
})
export class CePayment {
  /** The current payment method for the payment */
  @Prop() processor: string = 'stripe';

  /** Checkout Session from ce-checkout. */
  @Prop() order: Order;

  /** Is this loading. */
  @Prop() loading: boolean;

  /** Is this created in "test" mode */
  @Prop() mode: 'test' | 'live' = 'live';

  /** Secure notice */
  @Prop() secureNotice: string;

  /** The input's label. */
  @Prop() label: string;

  /** Payment mode inside individual payment method (i.e. Payment Buttons) */
  @Prop() paymentMethod: 'stripe-payment-request' | null;

  render() {
    if (this.loading) {
      return <ce-skeleton></ce-skeleton>;
    }
    if (!this.processor) {
      return <div>Please contact us for payment</div>;
    }
    if ('stripe' === this.processor) {
      if (!this?.order?.processor_data?.stripe?.publishable_key || !this?.order?.processor_data?.stripe?.account_id) {
        return (
          <div>
            <ce-skeleton style={{ width: '100%', marginBottom: '1em' }}></ce-skeleton>
            <ce-skeleton style={{ width: '35%' }}></ce-skeleton>
          </div>
        );
      }
      return (
        <Host>
          <ce-stripe-element
            label={this.label}
            mode={this.mode}
            order={this.order}
            stripeAccountId={this?.order?.processor_data?.stripe?.account_id}
            publishableKey={this?.order?.processor_data?.stripe?.publishable_key}
            disabled={!!this.paymentMethod}
          ></ce-stripe-element>
          <ce-secure-notice>
            {this.secureNotice}{' '}
            {this.mode === 'test' && (
              <ce-tooltip
                slot="suffix"
                type="warning"
                width={'220px'}
                text={__('In test mode, you can use the card 4242 4242 4242 4242 and any code/expiration date.', 'surecart')}
              >
                <ce-tag type="warning" size="small">
                  {__('Test Mode', 'surecart')}
                </ce-tag>
              </ce-tooltip>
            )}
          </ce-secure-notice>
        </Host>
      );
    }
  }
}

openWormhole(CePayment, ['processor', 'order', 'mode', 'paymentMethod', 'loading'], false);
