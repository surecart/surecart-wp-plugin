import { Event, EventEmitter } from '@stencil/core';
import { Component, h, Prop } from '@stencil/core';
import { state } from '@store/checkout';
import { isOptionSoldOut } from '@store/product/getters';
import { __ } from '@wordpress/i18n';
import { getVariantFromValues } from '../../../../functions/util';
import { LineItemData } from '../../../../types';
import { getLineItemByProductId } from '@store/checkout/getters';

@Component({
  tag: 'sc-product-checkout-select-variant-option',
  shadow: false,
})
export class ScProductCheckoutSelectVariantOption {
  /** Label */
  @Prop() label: string;

  @Prop() selected: string;

  /** Which option number? */
  @Prop() optionNumber: 1 | 2 | 3 = 1;

  /** Toggle line item event */
  @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  maybeUpdateLineItems = (values: { [key: string]: string }) => {
    if (!values || !state?.checkout || !state?.product?.variants?.data?.length) return;

    // no variant that matches.
    const matchedVariant = getVariantFromValues({ variants: state?.product.variants.data, values });
    if (!matchedVariant) return;

    // there is no line item for this product, we should create one.
    if (!this.lineItem()?.price?.id) return;
    this.scUpdateLineItem.emit({ price_id: this.lineItem().price.id, quantity: this.lineItem()?.quantity, variant: matchedVariant?.id });
  };

  lineItem() {
    return getLineItemByProductId(state?.product?.id);
  }

  render() {
    return (
      <sc-select
        label={this.label}
        exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, menu__base, spinner__base, empty"
        value={this.lineItem()?.variant?.[`option_${this.optionNumber}`] || this.selected}
        onScChange={(e: any) => {
          const values = {
            ...(this.lineItem()?.variant?.option_1 ? { option_1: this.lineItem()?.variant?.option_1 } : {}),
            ...(this.lineItem()?.variant?.option_2 ? { option_2: this.lineItem()?.variant?.option_2 } : {}),
            ...(this.lineItem()?.variant?.option_3 ? { option_3: this.lineItem()?.variant?.option_3 } : {}),
          };
          this.maybeUpdateLineItems({ ...values, [`option_${this.optionNumber}`]: e.target.value });
        }}
        choices={(state?.product?.variant_options?.data?.[this.optionNumber - 1]?.values || []).map(value => ({
          label: value,
          value,
          suffix: isOptionSoldOut(this.optionNumber, value) ? __('Unavailable', 'surecart') : '',
          unavailable: isOptionSoldOut(this.optionNumber, value),
        }))}
        unselect={false}
      />
    );
  }
}
