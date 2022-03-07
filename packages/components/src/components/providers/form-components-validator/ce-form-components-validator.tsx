import { Component, h, Prop, State, Watch, Element } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Order } from '../../../types';

@Component({
  tag: 'ce-form-components-validator',
  shadow: true,
})
export class CeFormComponentsValidator {
  @Element() el: HTMLElement;

  @Prop() disabled: boolean;

  /** The order */
  @Prop() order: Order;

  /** Is there an address field? */
  @State() hasAddress: boolean;

  private paymentField: HTMLCePaymentElement;

  @Watch('order')
  handleOrderChange() {
    if (this.disabled) return;
    // address is required, add before the payment field
    if (this?.order?.tax_status === 'address_invalid' && !this.hasAddress) {
      const address = document.createElement('ce-order-shipping-address');
      address.label = __('Address', 'checkout_engine');
      this.paymentField.before(address);
      this.hasAddress = true;
    }
  }

  componentDidLoad() {
    this.hasAddress = !!this.el.querySelector('ce-address');
    this.paymentField = this.el.querySelector('ce-payment');
  }

  render() {
    return <slot />;
  }
}
