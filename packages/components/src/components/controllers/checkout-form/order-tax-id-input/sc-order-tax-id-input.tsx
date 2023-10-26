import { Component, h, Method, Prop, Watch } from '@stencil/core';
import { state as checkoutState, onChange } from '@store/checkout';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { __ } from '@wordpress/i18n';
import { createOrUpdateCheckout } from '../../../../services/session';

import { Address, Checkout, TaxIdentifier } from '../../../../types';
import { formBusy } from '@store/form/getters';
import { createErrorNotice } from '@store/notices/mutations';

@Component({
  tag: 'sc-order-tax-id-input',
  styleUrl: 'sc-order-tax-id-input.css',
  shadow: true,
})
export class ScOrderTaxIdInput {
  /** The tax id input */
  private input: HTMLScTaxIdInputElement;

  private removeCheckoutListener: () => void;

  /** Force show the field. */
  @Prop() show: boolean = false;

  /** Other zones label */
  @Prop() otherLabel: string;

  /** GST zone label */
  @Prop() caGstLabel: string;

  /** AU zone label */
  @Prop() auAbnLabel: string;

  /** UK zone label */
  @Prop() gbVatLabel: string;

  /** EU zone label */
  @Prop() euVatLabel: string;

  @Prop({ mutable: true }) taxIdentifier: {
    number: string;
    number_type: string;
  };

  @Method()
  async reportValidity() {
   return this.input.reportValidity();
  }

  getStatus() {
    if (checkoutState.checkout?.tax_identifier?.number_type !== 'eu_vat') {
      return 'unknown';
    }
    if (checkoutState.taxProtocol?.eu_vat_unverified_behavior === 'apply_reverse_charge') {
      return 'unknown';
    }
    return (checkoutState.checkout?.tax_identifier as TaxIdentifier)?.eu_vat_verified ? 'valid' : 'invalid';
  }

  async maybeUpdateOrder() {
    try {
      lockCheckout('tax_identifier');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: { tax_identifier: this.taxIdentifier },
      })) as Checkout;
    } catch (e) {
      console.error(e);
      createErrorNotice(e);
    } finally {
      unLockCheckout('tax_identifier');
    }
  }

  componentDidLoad() {
    this.removeCheckoutListener = onChange('checkout', (checkout: Checkout) => {
      this.taxIdentifier = checkout?.tax_identifier;
    });
  }

  disconnectedCallback() {
    this.removeCheckoutListener();
  }

  required() {
    return checkoutState.taxProtocol?.eu_vat_required && this.taxIdentifier?.number_type === 'eu_vat';
  }

  @Watch('taxIdentifier')
  handleTaxIdentifierChange() {
    this.maybeUpdateOrder();
  }

  render() {
    return (
      <sc-tax-id-input
        ref={el => (this.input = el as HTMLScTaxIdInputElement)}
        show={this.show}
        number={checkoutState.checkout?.tax_identifier?.number}
        type={checkoutState.checkout?.tax_identifier?.number_type}
        country={(checkoutState.checkout?.shipping_address as Address)?.country}
        status={this.getStatus()}
        loading={formBusy()}
        onScChange={e => {
          e.stopImmediatePropagation();
          this.taxIdentifier = e.detail;
        }}
        otherLabel={this.otherLabel}
        caGstLabel={this.caGstLabel}
        auAbnLabel={this.auAbnLabel}
        gbVatLabel={this.gbVatLabel}
        euVatLabel={this.euVatLabel}
        required={this.required()}
      ></sc-tax-id-input>
    );
  }
}
