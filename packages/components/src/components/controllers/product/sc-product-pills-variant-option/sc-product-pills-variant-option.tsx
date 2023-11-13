import { Component, Fragment, h, Prop } from '@stencil/core';
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
          <span aria-hidden="true">{this.label}</span>
          <sc-visually-hidden>
            {sprintf(__('%s options selector. There are %d options in this selector.', 'surecart'), this.label, state.variant_options[this.optionNumber - 1].values.length)}
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
                <span aria-hidden="true">{value}</span>
                <sc-visually-hidden>
                  {sprintf(__('Select %s.', 'surecart'), this.label)}
                  {isUnavailable && <Fragment> {__('(option unavailable)', 'surecart')}</Fragment>}
                  {state.variantValues[`option_${this.optionNumber}`] === value && <Fragment> {__('This option is currently selected.', 'surecart')}</Fragment>}
                </sc-visually-hidden>
              </sc-pill-option>
            );
          })}
        </div>
      </sc-form-control>
    );
  }
}
