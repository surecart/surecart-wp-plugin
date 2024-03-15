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
        <span slot="price">
          <sc-format-number type="currency" currency={checkoutState?.checkout?.currency || 'usd'} value={checkoutState?.checkout?.bump_amount}></sc-format-number>
        </span>
      </sc-line-item>
    );
  }
}

