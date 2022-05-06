import { Component, h, Prop, Watch, Element } from '@stencil/core';
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

  @Watch('order')
  handleOrderChange() {
    // bail if we don't have address invalid error or disabled.
    if (this.disabled) return;
    if (this?.order?.tax_status !== 'address_invalid') return;

    // check for these at runtime in case they were removed from the dom on load of this component.
    const paymentField = this.el.querySelector('sc-payment');
    const addressField = this.el.querySelector('sc-address');

    // if we are missing an address field and have a payment field, append it.
    if (!addressField && paymentField) {
      const address = document.createElement('sc-order-shipping-address');
      address.label = __('Address', 'surecart');
      paymentField.parentNode.insertBefore(address, paymentField);
    }
  }

  render() {
    return <slot />;
  }
}
