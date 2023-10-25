import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { state as checkoutState, onChange } from '@store/checkout';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { __ } from '@wordpress/i18n';
import { createOrUpdateCheckout } from '../../../../services/session';

import { Address, Checkout, ResponseError, TaxIdentifier } from '../../../../types';
import { formBusy } from '@store/form/getters';

@Component({
  tag: 'sc-order-tax-id-input',
  styleUrl: 'sc-order-tax-id-input.css',
  shadow: true,
})
export class ScOrderTaxIdInput {
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

  @State() required: boolean;

  /** Error event */
  @Event() scError: EventEmitter<ResponseError>;

  getStatus() {
    if (checkoutState.checkout?.tax_identifier?.number_type !== 'eu_vat') {
      return 'unknown';
    }
    if (checkoutState.taxProtocol?.eu_vat_unverified_behavior === 'apply_reverse_charge') {
      return 'unknown';
    }
    return (checkoutState.checkout?.tax_identifier as TaxIdentifier)?.eu_vat_verified ? 'valid' : 'invalid';
  }

  async maybeUpdateOrder(tax_identifier) {
    this.updateTaxRequired(tax_identifier?.number_type);
    try {
      lockCheckout('tax_identifier');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: { tax_identifier },
      })) as Checkout;
    } catch (e) {
      console.error(e);
      this.scError.emit(e);
    } finally {
      unLockCheckout('tax_identifier');
    }
  }

  componentDidLoad() {
    this.removeCheckoutListener = onChange('checkout', (checkout: Checkout) => {
      this.updateTaxRequired(checkout?.tax_identifier?.number_type);
    });
  }

  disconnectedCallback() {
    this.removeCheckoutListener();
  }

  updateTaxRequired(taxIdentifierType: string) {
    this.required = checkoutState.taxProtocol?.eu_vat_required && taxIdentifierType === 'eu_vat';
  }

  render() {
    return (
      <sc-tax-id-input
        show={this.show}
        number={checkoutState.checkout?.tax_identifier?.number}
        type={checkoutState.checkout?.tax_identifier?.number_type}
        country={(checkoutState.checkout?.shipping_address as Address)?.country}
        status={this.getStatus()}
        loading={formBusy()}
        onScChange={e => {
          e.stopImmediatePropagation();
          this.maybeUpdateOrder(e.detail);
        }}
        otherLabel={this.otherLabel}
        caGstLabel={this.caGstLabel}
        auAbnLabel={this.auAbnLabel}
        gbVatLabel={this.gbVatLabel}
        euVatLabel={this.euVatLabel}
        required={this.required}
      ></sc-tax-id-input>
    );
  }
}
