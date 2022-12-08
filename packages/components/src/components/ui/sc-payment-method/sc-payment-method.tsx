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
  @Prop() full: boolean;
  @Prop() externalLink: string;
  @Prop() externalLinkTooltipText: string;

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
      const account = this.paymentMethod?.bank_account as BankAccount;
      return (
        <div class="payment-method" part="bank">
          <span>{this.renderBankAccountType(account?.account_type)}</span>
          **** {account?.last4}
        </div>
      );
    }

    if ((this?.paymentMethod?.payment_instrument as PaymentInstrument)?.instrument_type) {
      const type = (this?.paymentMethod?.payment_instrument as PaymentInstrument)?.instrument_type;
      return (
        <sc-tag exportparts="base:payment_instrument" type="info" pill>
          <span style={{ textTransform: 'capitalize' }}>{type} </span>
        </sc-tag>
      );
    }

    if (this.paymentMethod?.card?.brand) {
      return (
        <div class="payment-method" part="card">
          <sc-cc-logo style={{ fontSize: '36px' }} brand={this.paymentMethod?.card?.brand}></sc-cc-logo>
          <sc-text style={{ whiteSpace: 'nowrap', paddingRight: '6px' }}>**** {this.paymentMethod?.card?.last4}</sc-text>
          {!!this.externalLink && (
            <sc-tooltip text={this.externalLinkTooltipText} type="text">
              <sc-button type="link" size="small" href={this.externalLink} target="_blank">
                <sc-icon name="external-link" style={{ fontSize: '16px' }}></sc-icon>
              </sc-button>
            </sc-tooltip>
          )}
        </div>
      );
    }

    if (this.paymentMethod?.paypal_account?.id) {
      return (
        <div class="payment-method" part="base" style={{ gap: 'var(--sc-spacing-small)' }}>
          <sc-icon
            name="paypal"
            style={{
              fontSize: '56px',
              lineHeight: '1',
              height: '28px',
            }}
          ></sc-icon>
          {this.full && (
            <sc-text style={{ '--font-size': 'var(--sc-font-size-small)' }} truncate>
              {this.paymentMethod?.paypal_account?.email}
            </sc-text>
          )}
        </div>
      );
    }

    return this?.paymentMethod?.processor_type;
  }
}
