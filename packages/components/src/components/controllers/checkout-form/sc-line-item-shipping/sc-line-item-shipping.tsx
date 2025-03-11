import { Component, Host, Prop, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as formState } from '@store/form';
import { state as checkoutState } from '@store/checkout';

@Component({
  tag: 'sc-line-item-shipping',
  styleUrl: 'sc-line-item-shipping.scss',
  shadow: true,
})
export class ScLineItemShipping {
  /**Label */
  @Prop() label: string;

  render() {
    const { checkout } = checkoutState;

    // don't show if no shipping amount if no choice selected
    if (!checkout?.selected_shipping_choice) {
      return <Host style={{ display: 'none' }}></Host>;
    }

    if (formState.formState.value === 'loading') {
      return (
        <sc-line-item>
          <sc-skeleton slot="title" style={{ width: '120px', display: 'inline-block' }}></sc-skeleton>
          <sc-skeleton slot="price" style={{ 'width': '70px', 'display': 'inline-block', '--border-radius': '6px' }}></sc-skeleton>
        </sc-line-item>
      );
    }

    return (
      <sc-line-item>
        <span slot="description">{this.label || __('Shipping', 'surecart')}</span>
        <span slot="price">{checkout?.shipping_display_amount}</span>
      </sc-line-item>
    );
  }
}
