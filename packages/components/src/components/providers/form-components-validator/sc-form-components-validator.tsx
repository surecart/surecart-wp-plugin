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

  @Watch('order')
  handleOrderChange() {
    if (this.disabled) return;
    // address is required, add before the payment field
    if (this?.order?.tax_status === 'address_invalid' && !this.hasAddress) {
      // create the element.
      const address = document.createElement('sc-order-shipping-address');
      address.label = __('Address', 'surecart');

      // insert before the payment field.
      const paymentField = this.el.querySelector('sc-payment');
      if (!paymentField) {
        console.warn('Payment field is missing.');
        return;
      }

      // insert.
      paymentField.before(address);
      this.hasAddress = true;
    }
  }

  componentWillLoad() {
    this.hasAddress = !!this.el.querySelector('sc-address');
  }

  render() {
    return <slot />;
  }
}
