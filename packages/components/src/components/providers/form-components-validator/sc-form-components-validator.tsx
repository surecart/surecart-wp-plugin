import { Component, h, Prop, Watch, Element, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Order, TaxProtocol } from '../../../types';

@Component({
  tag: 'sc-form-components-validator',
  shadow: true,
})
export class ScFormComponentsValidator {
  @Element() el: HTMLElement;

  /** Disable validation? */
  @Prop() disabled: boolean;

  /** The order */
  @Prop() order: Order;

  /** The tax protocol */
  @Prop() taxProtocol: TaxProtocol;

  /** Is there an address field? */
  @State() hasAddress: boolean;

  /** Is there a tax id field? */
  @State() hasTaxIDField: boolean;

  @Watch('order')
  handleOrderChange() {
    // bail if we don't have address invalid error or disabled.
    if (this.disabled) return;
    // make sure to add the address field if it's not there.
    if (this?.order?.tax_status === 'address_invalid' || this?.order?.shipping_enabled) {
      this.addAddressField();
    }
  }

  componentWillLoad() {
    this.hasAddress = !!this.el.querySelector('sc-order-shipping-address');
    this.hasTaxIDField = !!this.el.querySelector('sc-order-tax-id-input');

    // automatically add address field if tax is enabled.
    if (this.taxProtocol.tax_enabled) {
      this.addAddressField();
    }

    // if eu vat is required, add the tax id field.
    if (this?.taxProtocol?.eu_vat_required) {
      this.addTaxIDField();
    }
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
    taxInput.taxIdentifier.number_type === 'eu_vat';
    payment.parentNode.insertBefore(taxInput, payment);
    this.hasTaxIDField = true;
  }

  render() {
    return <slot />;
  }
}
