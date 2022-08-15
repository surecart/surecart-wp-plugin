import { Component, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { FormState } from '../../../types';

@Component({
  tag: 'sc-checkout-unsaved-changes-warning',
  shadow: true,
})
export class ScCheckoutUnsavedChangesWarning {
  @Prop() state: FormState

  /**
   * Add event listener for beforeunload.
   */
  componentDidLoad() {
    window.addEventListener('beforeunload', (e) => this.warnIfUnsavedChanges(e), {capture: true});
  }

  /**
   * Warn if status is updaing, finalizing, paying or confirming.
   */
  warnIfUnsavedChanges(e) {
    if (['updating', 'finalizing', 'confirming'].includes(this.state)) {
      console.log({e});
      e.preventDefault();
      e.returnValue = __("Your payment is processing. Exiting this page could cause an error in your order. Please do not navigate away from this page.", 'surecart');
      return e.returnValue;
    }
  }
}
