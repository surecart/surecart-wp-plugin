import { Component, h, Prop } from '@stencil/core';
import { state } from '@store/product';
import { isOptionSoldOut } from '@store/product/getters';
import { __, sprintf } from '@wordpress/i18n';

@Component({
  tag: 'sc-product-pills-variant-option',
  styleUrl: 'sc-product-pills-variant-option.scss',
  shadow: false,
})
export class ScProductPillsVariantOption {
  /** Label */
  @Prop() label: string;

  /** Which option number? */
  @Prop() optionNumber: 1 | 2 | 3 = 1;

  render() {
    return (
      <div class="sc-product-pills-variant-option__wrapper">
        {(state.variant_options[this.optionNumber - 1].values || []).map(value => (
          <sc-pill-option
            isUnavailable={isOptionSoldOut(this.optionNumber, value)}
            isSelected={state.selectedVariant[`option_${this.optionNumber}`] === value}
            onClick={() =>
              (state.variantValues = {
                ...state.variantValues,
                [`option_${this.optionNumber}`]: value,
              })
            }
          >
            <span class="sc-sr-only">{sprintf(__('Select %s:', 'surecart'), this.label)} </span>
            {value}
            {isOptionSoldOut(this.optionNumber, value) && <span class="sc-sr-only"> {__('(option unavailable)', 'surecart')} </span>}
          </sc-pill-option>
        ))}
      </div>
    );
  }
}
