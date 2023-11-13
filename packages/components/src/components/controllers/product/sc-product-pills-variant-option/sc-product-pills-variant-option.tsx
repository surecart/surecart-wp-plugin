import { Component, h, Prop } from '@stencil/core';
import { state } from '@store/product';
import { isOptionMissing, isOptionSoldOut } from '@store/product/getters';
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
      <sc-form-control label={this.label}>
        <span slot="label">
          {this.label}
          <sc-visually-hidden>
            {' '}
            {sprintf(__('options selector. There are %d options in this selector.', 'surecart'), state.variant_options[this.optionNumber - 1].values.length)}
          </sc-visually-hidden>

        </span>
        <div class="sc-product-pills-variant-option__wrapper">
          {(state.variant_options[this.optionNumber - 1].values || []).map(value => {
            const isUnavailable = isOptionSoldOut(this.optionNumber, value) || isOptionMissing(this.optionNumber, value);
            return (
              <sc-pill-option
                isUnavailable={isUnavailable}
                isSelected={state.variantValues[`option_${this.optionNumber}`] === value}
                onClick={() =>
                  (state.variantValues = {
                    ...state.variantValues,
                    [`option_${this.optionNumber}`]: value,
                  })
                }
              >
                <sc-visually-hidden>{sprintf(__('Select %s', 'surecart'), this.label)} </sc-visually-hidden>
                {value}
                {state.variantValues[`option_${this.optionNumber}`] === value && <sc-visually-hidden>. {__('This option is currently selected.', 'surecart')}</sc-visually-hidden>}
                {isUnavailable && <sc-visually-hidden> {__('(option unavailable)', 'surecart')} </sc-visually-hidden>}
              </sc-pill-option>
            );
          })}
        </div>
      </sc-form-control>
    );
  }
}
