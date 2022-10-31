import { Component, h, State, Element, Watch, Prop } from '@stencil/core';
import { Checkout } from '../../../types';

@Component({
  tag: 'sc-order-confirm-components-validator',
  shadow: true,
})
export class ScOrderConfirmComponentsValidator {
  /** The element. */
  @Element() el: HTMLScOrderConfirmComponentsValidatorElement;

  /** The checkout */
  @Prop() checkout: Checkout;

  /** Does it have manual instructions? */
  @State() hasManualInstructions: boolean;

  @Watch('checkout')
  handleOrderChange() {
    if (this.checkout?.manual_payment) {
      this.addManualPaymentInstructions();
    }
  }

  addManualPaymentInstructions() {
    if (this.hasManualInstructions) return;
    console.log(this.el.querySelectorAll('*'));
    const details = this.el.shadowRoot
      .querySelector('slot')
      .assignedElements({ flatten: true })
      .find(element => element.tagName === 'SC-ORDER-CONFIRMATION-DETAILS');
    const address = document.createElement('sc-order-manual-instructions');
    details.parentNode.insertBefore(address, details);
    this.hasManualInstructions = true;
  }

  componentWillLoad() {
    this.hasManualInstructions = !!this.el.querySelector('sc-order-manual-instructions');
  }

  render() {
    return <slot />;
  }
}
