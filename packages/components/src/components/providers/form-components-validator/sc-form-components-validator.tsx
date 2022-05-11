import { Component, h, Prop, Watch, Element, State } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { Order } from '../../../types';

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

  /** Is tax enabled. */
  @Prop() taxEnabled: boolean;

  /** Is there an address field? */
  @State() hasAddress: boolean;

  @Watch('order')
  handleOrderChange() {
    // bail if we don't have address invalid error or disabled.
    if (this.disabled) return;
    // make sure to add the address field if it's not there.
    if (this?.order?.tax_status === 'address_invalid') {
      this.addAddressField();
    }
  }

  componentWillLoad() {
    this.hasAddress = !!this.el.querySelector('sc-address');
    if (this.taxEnabled) {
      this.addAddressField();
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

  render() {
    return <slot />;
  }
}
