import { Component, h, Host, Prop } from '@stencil/core';
import { state as checkoutState } from '@store/checkout';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-line-item-trial',
  styleUrl: 'sc-line-item-trial.scss',
  shadow: true,
})
export class ScLineItemTrial {
  /**
   * The label for the trial item
   */
  @Prop() label: string;

  render() {
    if (!checkoutState?.checkout?.trial_amount) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <sc-line-item>
        <span slot="description">{this.label || __('Trial', 'surecart')}</span>
        <sc-format-number slot="price" type="currency" currency={checkoutState.checkout.currency} value={checkoutState.checkout.trial_amount}></sc-format-number>
      </sc-line-item>
    );
  }
}
