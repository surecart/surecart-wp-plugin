import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Order } from '../../../types';

@Component({
  tag: 'sc-form-components-validator',
  shadow: true,
})
export class ScFormComponentsValidator {
  @Element() el: HTMLElement;

  @Prop() disabled: boolean;

  /** The order */
  @Prop() order: Order;

  /** Is there an address field? */
  @State() hasAddress: boolean;

  private paymentField: HTMLScPaymentElement;

  @Watch('order')
  handleOrderChange() {
    if (this.disabled) return;
    // address is required, add before the payment field
    if (this?.order?.tax_status === 'address_invalid' && !this.hasAddress) {
      const address = document.createElement('sc-order-shipping-address');
      address.label = __('Address', 'surecart');
      this.paymentField.parentNode.insertBefore(address, this.paymentField);
      this.hasAddress = true;
    }
  }

  componentWillLoad() {
    this.hasAddress = !!this.el.querySelector('sc-address');
    this.paymentField = this.el.querySelector('sc-payment');
  }

  render() {
    return <slot />;
  }
}
