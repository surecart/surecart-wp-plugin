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

  renderExternalLink() {
    return (
      !!this.externalLink && (
        <sc-tooltip text={this.externalLinkTooltipText} type="text">
          <sc-button style={{ color: 'var(--sc-color-gray-500)' }} type="text" size="small" href={this.externalLink} target="_blank">
            <sc-icon name="external-link" style={{ fontSize: '16px' }}></sc-icon>
          </sc-button>
        </sc-tooltip>
      )
    );
  }

  render() {
    if ((this.paymentMethod?.bank_account as BankAccount)?.id) {
      const account = this.paymentMethod?.bank_account as BankAccount;
      return (
        <div class="payment-method" part="bank">
          <span>{this.renderBankAccountType(account?.account_type)}</span>
          **** {account?.last4}
          {this.renderExternalLink()}
        </div>
      );
    }

    if ((this?.paymentMethod?.payment_instrument as PaymentInstrument)?.instrument_type) {
      const type = (this?.paymentMethod?.payment_instrument as PaymentInstrument)?.instrument_type;
      if (
        [
          'applepay',
          'bancontact',
          'banktransfer',
          'belfius',
          'creditcard',
          'directdebit',
          'eps',
          'giftcard',
          'giropay',
          'ideal',
          'in3',
          'kbc',
          'klarna',
          'mybank',
          'paysafecard',
          'przelewy24',
          'sofort',
          'Voucher',
        ].includes(type)
      ) {
        return (
          <div class="payment-method" part="instrument">
            <sc-icon style={{ fontSize: '36px' }} name={type} />
            <span style={{ textTransform: 'capitalize' }}>{type}</span>
            {this.renderExternalLink()}
          </div>
        );
      }

      if (type === 'paypal') {
        return (
          <div class="payment-method" part="instrument">
            <sc-icon style={{ fontSize: '56px', lineHeight: '1', height: '28px' }} name="paypal"></sc-icon>
          </div>
        );
      }

      return (
        <div class="payment-method" part="instrument">
          <sc-tag exportparts="base:payment_instrument" type="info" pill>
            <span style={{ textTransform: 'capitalize' }}>{type} </span>
          </sc-tag>
          {this.renderExternalLink()}
        </div>
      );
    }

    if (this.paymentMethod?.card?.brand) {
      return (
        <div class="payment-method" part="card">
          <sc-cc-logo style={{ fontSize: '36px' }} brand={this.paymentMethod?.card?.brand}></sc-cc-logo>
          <sc-text style={{ whiteSpace: 'nowrap', paddingRight: '6px' }}>**** {this.paymentMethod?.card?.last4}</sc-text>
          {this.renderExternalLink()}
        </div>
      );
    }

    if (this.paymentMethod?.paypal_account?.id) {
      return (
        <div class="payment-method" part="base" style={{ gap: 'var(--sc-spacing-small)' }}>
          <sc-icon style={{ fontSize: '56px', lineHeight: '1', height: '28px' }} name="paypal"></sc-icon>
          {this.full && (
            <sc-text style={{ '--font-size': 'var(--sc-font-size-small)' }} truncate>
              {this.paymentMethod?.paypal_account?.email}
            </sc-text>
          )}
          {this.renderExternalLink()}
        </div>
      );
    }

    return this?.paymentMethod?.processor_type;
  }
}
