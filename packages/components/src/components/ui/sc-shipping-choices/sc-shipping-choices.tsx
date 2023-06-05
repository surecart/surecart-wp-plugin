import { Component, Prop, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState } from '@store/checkout';
import { ShippingMethod } from '../../../types';

@Component({
  tag: 'sc-shipping-choices',
  styleUrl: 'sc-shipping-choices.scss',
  shadow: true,
})
export class ScShippingChoices {
  /** The shipping section label */
  @Prop() label: string;

  /** Show control on shipping option */
  @Prop() showControl: boolean = true;

  render() {
    return (
      <sc-form-control label={this.label || __('Shipping', 'surecart')}>
        <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-small)' }}>
          {(checkoutState?.checkout?.shipping_choices?.data || []).map(({ id, amount, currency, shipping_method }) => (
            <sc-choice-container showControl={this.showControl} checked={checkoutState?.checkout?.selected_shipping_choice === id}>
              <div class="shipping-choice">
                <div class="shipping-choice__name">{(shipping_method as ShippingMethod)?.name}</div>
                <div class="shipping-choice__price">
                  <sc-format-number type="currency" value={amount} currency={currency} />
                </div>
              </div>
            </sc-choice-container>
          ))}
        </sc-flex>
      </sc-form-control>
    );
  }
}
