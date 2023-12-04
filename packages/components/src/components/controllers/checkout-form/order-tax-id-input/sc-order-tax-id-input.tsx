import { Component, h, Method, Prop, State, Watch } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { __ } from '@wordpress/i18n';
import { createOrUpdateCheckout } from '../../../../services/session';

import { Address, Checkout, TaxIdentifier } from '../../../../types';
import { formBusy } from '@store/form/getters';
import { createErrorNotice } from '@store/notices/mutations';
import { updateFormState } from '@store/form/mutations';

@Component({
  tag: 'sc-order-tax-id-input',
  styleUrl: 'sc-order-tax-id-input.css',
  shadow: true,
})
export class ScOrderTaxIdInput {
  /** The tax id input */
  private input: HTMLScTaxIdInputElement;

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

  /** Help text */
  @Prop() helpText: string;

  /** Tax ID Types which will be shown Eg: '["eu_vat", "gb_vat"]' */
  @Prop() taxIdTypes: string | string[];

  /** Tax ID Types data as array */
  @State() taxIdTypesData: string[] = [];

  @Watch('taxIdTypes')
  handleTaxIdTypesChange() {
    this.taxIdTypesData = typeof this.taxIdTypes === 'string' ? JSON.parse(this.taxIdTypes) : this.taxIdTypes;
  }

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

  async updateOrder(tax_identifier: { number: string; number_type: string }) {
    try {
      updateFormState('FETCH');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: { tax_identifier },
      })) as Checkout;
      updateFormState('RESOLVE');
    } catch (e) {
      console.error(e);
      createErrorNotice(e);
      updateFormState('REJECT');
    }
  }

  componentWillLoad() {
    if (this.taxIdTypes) {
      this.taxIdTypesData = typeof this.taxIdTypes === 'string' ? JSON.parse(this.taxIdTypes) : this.taxIdTypes;
    }
  }

  required() {
    return checkoutState.taxProtocol?.eu_vat_required && checkoutState.checkout?.tax_identifier?.number_type === 'eu_vat';
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
          this.updateOrder(e.detail);
        }}
        otherLabel={this.otherLabel}
        caGstLabel={this.caGstLabel}
        auAbnLabel={this.auAbnLabel}
        gbVatLabel={this.gbVatLabel}
        euVatLabel={this.euVatLabel}
        help={this.helpText}
        taxIdTypes={this.taxIdTypesData}
        required={this.required()}
      ></sc-tax-id-input>
    );
  }
}
