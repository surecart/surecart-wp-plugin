import { Component, h, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { BankAccount, PaymentInstrument, PaymentMethod } from '../../../types';

@Component({
  tag: 'sc-payment-method',
  styleUrl: 'sc-payment-method.css',
  shadow: true,
})
export class ScPaymentMethod {
  @Prop() paymentMethod: PaymentMethod;

  renderBankAccountType(type) {
    if (type === 'checking') {
      return __('Checking', 'surecart');
    }
    if (type === 'savings') {
      return __('Savings', 'surecart');
    }
  }

  render() {
    if ((this.paymentMethod?.bank_account as BankAccount)?.id) {
      const account = (this.paymentMethod?.bank_account as BankAccount);
      return <div class="payment-method" part="base">
        <span>{this.renderBankAccountType(account?.account_type)}</span>
        **** {account?.last4}
      </div>
    }

    if ((this?.paymentMethod?.payment_instrument as PaymentInstrument)?.instrument_type) {
      return (
        <sc-tag type="info" pill>
          <span style={{ textTransform: 'capitalize' }}>
            {
              (this?.paymentMethod?.payment_instrument as PaymentInstrument)?.instrument_type
            }{' '}
          </span>
        </sc-tag>
      );
    }

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
