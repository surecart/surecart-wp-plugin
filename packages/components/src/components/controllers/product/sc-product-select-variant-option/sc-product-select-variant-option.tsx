import { Component, h, Prop } from '@stencil/core';
import { state } from '@store/product';
import { isOptionSoldOut } from '@store/product/getters';
import { __ } from '@wordpress/i18n';

@Component({
  tag: 'sc-product-select-variant-option',
  shadow: false,
})
export class ScProductSelectVariantOption {
  /** Label */
  @Prop() label: string;

  /** Which option number? */
  @Prop() optionNumber: 1 | 2 | 3 = 1;

  render() {
    return (
      <sc-select
        label={this.label}
        exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, menu__base, spinner__base, empty"
        value={state.selectedVariant[`option_${this.optionNumber}`] || ''}
        onScChange={(e: any) =>
          (state.variantValues = {
            ...state.variantValues,
            [`option_${this.optionNumber}`]: e.target.value,
          })
        }
        choices={(state.variant_options[this.optionNumber - 1].values || []).map(value => ({
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
