import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { PaymentMethod } from '../../../types';

@Component({
  tag: 'sc-payment-method',
  styleUrl: 'sc-payment-method.css',
  shadow: true,
})
export class ScPaymentMethod {
  @Prop() paymentMethod: PaymentMethod;

  render() {
    if (this.paymentMethod?.card?.brand) {
      return (
        <div class="payment-method" part="base">
          <sc-cc-logo
            style={{ fontSize: '36px' }}
            brand={this.paymentMethod?.card?.brand}
          ></sc-cc-logo>
          **** {this.paymentMethod?.card?.last4}
        </div>
      );
    }

    if (this.paymentMethod?.processor_type === 'paypal') {
      return <sc-tooltip
        class="payment-method" part="base"
        type="text"
        style={{ display: 'inline-block' }}
        text={
          this?.paymentMethod?.paypal_account?.payer_email || __('Unknown email', 'surecart')
        }
      >
        <sc-icon
          name="paypal"
          style={{
            fontSize: '56px',
            lineHeight: '1',
            height: '28px',
          }}
        ></sc-icon>
      </sc-tooltip>;
    }

    return this?.paymentMethod?.processor_type;
  }
}
