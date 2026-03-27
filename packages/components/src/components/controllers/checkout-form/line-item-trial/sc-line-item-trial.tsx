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
        <span slot="price-description">{checkoutState?.checkout?.trial_display_amount}</span>
      </sc-line-item>
    );
  }
}
