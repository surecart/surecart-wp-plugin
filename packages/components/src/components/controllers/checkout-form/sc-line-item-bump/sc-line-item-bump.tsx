import { Component, h, Host, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';

@Component({
  tag: 'sc-line-item-bump',
  styleUrl: 'sc-line-item-bump.scss',
  shadow: true,
})
export class ScLineItemBump {
  @Prop() label: string;
  @Prop() loading: boolean;

  render() {
    if (!checkoutState?.checkout?.bump_amount) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    return (
      <sc-line-item>
        <span slot="description">{this.label || __('Bundle Discount', 'surecart')}</span>
        <span slot="price">{checkoutState?.checkout?.bump_display_amount}</span>
      </sc-line-item>
    );
  }
}
