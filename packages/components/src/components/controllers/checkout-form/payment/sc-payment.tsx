import { Order } from '../../../../types';
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

  render() {
    if (this.loading) {
      return <sc-skeleton></sc-skeleton>;
    }
    if (!this.processor) {
      return <div>Please contact us for payment</div>;
    }
    if ('stripe' === this.processor) {
      if (!this?.order?.processor_data?.stripe?.publishable_key || !this?.order?.processor_data?.stripe?.account_id) {
        return (
          <div>
            <sc-skeleton style={{ width: '100%', marginBottom: '1em' }}></sc-skeleton>
            <sc-skeleton style={{ width: '35%' }}></sc-skeleton>
          </div>
        );
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

openWormhole(ScPayment, ['processor', 'order', 'mode', 'paymentMethod', 'loading', 'busy'], false);
