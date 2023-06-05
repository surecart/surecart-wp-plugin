import { Component, Prop, h } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { state as checkoutState, onChange } from '@store/checkout';
import { ShippingChoice, ShippingMethod } from '../../../types';

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

  /** Shipping choices */
  @Prop({ mutable: true }) shippingChoices: ShippingChoice[] = [];

  componentDidLoad() {
    if (checkoutState?.checkout?.shipping_choices?.data) this.shippingChoices = checkoutState?.checkout?.shipping_choices?.data || [];

    onChange('checkout', () => {
      this.shippingChoices = checkoutState?.checkout?.shipping_choices?.data || [];
    });
  }

  render() {
    return (
      <sc-form-control label={this.label || __('Shipping', 'surecart')}>
        <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-small)' }}>
          {(this.shippingChoices || []).map(({ id, amount, currency, shipping_method }) => (
            <sc-choice-container
              showControl={this.showControl}
              checked={checkoutState?.checkout?.selected_shipping_choice === id}
              onScChange={checked => (checkoutState.checkout.selected_shipping_choice = checked ? id : null)}
            >
              <div class="shipping-choice">
                <sc-flex flexDirection="column" style={{ '--sc-flex-column-gap': 'var(--sc-spacing-xx-small)' }}>
                  <div class="shipping-choice__name">{(shipping_method as ShippingMethod)?.name}</div>
                  <div class="shipping-choice__description">{(shipping_method as ShippingMethod)?.description}</div>
                </sc-flex>
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
