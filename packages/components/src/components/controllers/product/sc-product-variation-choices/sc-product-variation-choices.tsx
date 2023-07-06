import { Component, h, State, Prop, Watch, Host, Element } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { availableVariants, availableVariantOptions } from '@store/product/getters';
import { state } from '@store/product';
import dummyOptions from './dummy-options.js';
@Component({
  tag: 'sc-product-variation-choices',
  styleUrl: 'sc-product-variation-choices.css',
  shadow: true,
})
export class ScProductVariationChoices {
  variantOptions = availableVariantOptions();
  variants = availableVariants();
  options = [];

  @Element() el: HTMLScProductVariationChoicesElement;
  @Prop() isDummy: boolean;
  @State() variantValues: { [key: string]: string } = {};

  componentWillLoad() {
    if ( ! this.isDummy ) {
      this.variantOptions.forEach((variation) => {
        if (!variation.name) {
          return;
        }
        const { id, name, position, variant_values } = variation;
        
        this.options.push(
          {
            id,
            name,
            position,
            values: variant_values.data.map(({ label, position, id }) => ({
              label,
              value: id,
              position
            }))
          }
        );
      });
    } else {
      this.options = [...dummyOptions];
    }
    for (const option of this.options) {
      this.variantValues = {
        ...this.variantValues,
        [option?.id]: option?.values?.[0]?.value
      };
    }

  }

  @Watch('variantValues')
  variantValuesChanged(newValue: { [key: string]: string }) {
    if ( !this.isDummy ) {
      const variantValueKeys = Object.keys(newValue);

      if (variantValueKeys.length === this.variantOptions.length) {
        let matchedVariant = '';

        for (const variant of this.variants) {
          if (
            variant?.variant_values?.length === variantValueKeys.length &&
            variantValueKeys.every(key => variant.variant_values.includes(newValue[key]))
          ) {
            matchedVariant = variant.id;
            break;
          }
        }
        
        if (matchedVariant) {
          state.selectedVariant = matchedVariant;
        }
      }
    }
  }

  render() {  
    
    if ( ! this.isDummy && this.variants?.length < 2) return <Host style={{ display: 'none' }}></Host>;

    return (
        <div
        style={{ 
            gap: '12px',
            display: 'flex',
            flexDirection: 'column' 
          }}
        >
          {( this.options || []).map(option => {
            return (
              <sc-form-control exportparts="label, help-text, form-control" label={option?.name} class="sc-product-variation-choices" part="control">
                <sc-select
                  exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, menu__base, spinner__base, empty"
                  part="name__input"
                  value={this.variantValues?.[option.id] || option?.values?.[0]?.value || false}
                  onScChange={(e: any) => {
                    if ( !this.isDummy ) {
                      this.variantValues = {
                        ...this.variantValues,
                        [option?.id]: e?.target?.value
                      };
                    }
                  }}
                  choices={option?.values}
                  placeholder={__('Select Variation', 'surecart')}
                  name={__('Select Variation', 'surecart')}
                  unselect={false}
                  squared-bottom
                  squared={true}
                  required={true}
                />
              </sc-form-control>
            )
        })}
      </div>
    );
  }
}
