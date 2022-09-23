import { Component, Element, h, Prop, State, Watch } from '@stencil/core';
import { __ } from '@wordpress/i18n';

import { Checkout, TaxProtocol } from '../../../types';

@Component({
  tag: 'sc-form-components-validator',
  shadow: true,
})
export class ScFormComponentsValidator {
  @Element() el: HTMLElement;

  /** Disable validation? */
  @Prop() disabled: boolean;

  /** The order */
  @Prop() order: Checkout;

  /** The tax protocol */
  @Prop() taxProtocol: TaxProtocol;

  /** Is there an address field? */
  @State() hasAddress: boolean;

  /** Is there a tax id field? */
  @State() hasTaxIDField: boolean;

  /** Is there a bumps field? */
  @State() hasBumpsField: boolean;

  /** Is there a tax line? */
  @State() hasTaxLine: boolean;

  /** Is there a bump line? */
  @State() hasBumpLine: boolean;

  @Watch('order')
  handleOrderChange() {
    // bail if we don't have address invalid error or disabled.
    if (this.disabled) return;
    // make sure to add the address field if it's not there.
    if (this?.order?.tax_status === 'address_invalid' || this?.order?.shipping_enabled) {
      this.addAddressField();
    }
    // add order bumps.
    if (this?.order?.recommended_bumps?.data?.length) {
      this.addBumps();
    }
    if (!!this.order?.bump_amount) {
      this.addBumpLine();
    }
    if (!!this.order?.tax_amount) {
      this.addTaxLine();
    }
  }

  componentWillLoad() {
    this.hasAddress = !!this.el.querySelector('sc-order-shipping-address');
    this.hasTaxIDField = !!this.el.querySelector('sc-order-tax-id-input');
    this.hasBumpsField = !!this.el.querySelector('sc-order-bumps');
    this.hasTaxLine = !!this.el.querySelector('sc-line-item-tax');
    this.hasBumpLine = !!this.el.querySelector('sc-line-item-bump');

    // automatically add address field if tax is enabled.
    if (this.taxProtocol?.tax_enabled) {
      this.addAddressField();

      // if eu vat is required, add the tax id field.
      if (this.taxProtocol?.eu_vat_required) {
        this.addTaxIDField();
      }
    }

    // make sure to check order on load.
    this.handleOrderChange();
  }

  addAddressField() {
    if (this.hasAddress) return;
    const payment = this.el.querySelector('sc-payment');
    const address = document.createElement('sc-order-shipping-address');
    address.label = __('Address', 'surecart');
    payment.parentNode.insertBefore(address, payment);
    this.hasAddress = true;
  }

  addTaxIDField() {
    if (this.hasTaxIDField) return;
    const payment = this.el.querySelector('sc-payment');
    const taxInput = document.createElement('sc-order-tax-id-input');
    taxInput.taxIdentifier?.number_type === 'eu_vat';
    payment.parentNode.insertBefore(taxInput, payment);
    this.hasTaxIDField = true;
  }

  addBumps() {
    if (this.hasBumpsField) return;
    const payment = this.el.querySelector('sc-payment');
    const bumps = document.createElement('sc-order-bumps');
    bumps.bumps === this.order?.recommended_bumps?.data;
    payment.parentNode.insertBefore(bumps, payment.nextSibling);
    this.hasBumpsField = true;
  }

  addTaxLine() {
    if (this.hasTaxLine) return;
    const total = this.el.querySelector('sc-line-item-total[total=total]');
    const tax = document.createElement('sc-line-item-tax');
    if (total?.previousElementSibling?.tagName === 'SC-DIVIDER') {
      total.parentNode.insertBefore(tax, total.previousElementSibling);
    } else {
      total.parentNode.insertBefore(tax, total);
    }
    this.hasTaxLine = true;
  }

  addBumpLine() {
    if (this.hasBumpLine) return;
    const total = this.el.querySelector('sc-line-item-total[total=total]');
    const tax = document.createElement('sc-line-item-bump');
    if (total?.previousElementSibling?.tagName === 'SC-DIVIDER') {
      total.parentNode.insertBefore(tax, total.previousElementSibling);
    } else {
      total.parentNode.insertBefore(tax, total);
    }
    this.hasBumpLine = true;
  }

  render() {
    return <slot />;
  }
}
