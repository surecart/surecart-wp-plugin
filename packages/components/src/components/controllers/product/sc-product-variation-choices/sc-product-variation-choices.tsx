import { Component, h, State, Watch, Host } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { availableVariants, availableVariantOptions } from '@store/product/getters';
import { state } from '@store/product';

@Component({
  tag: 'sc-product-variation-choices',
  styleUrl: 'sc-product-variation-choices.css',
  shadow: true,
})
export class ScProductVariationChoices {
  @State() variantValues: Array<[]> = [];

  variantOptions = availableVariantOptions();
  variants = availableVariants();

  @Watch('variantValues')
  variantValuesChanged(newValue: Array<any>) {
    if ( newValue?.length === this.variantOptions?.length ) {
      let matchedVariant = '';
      for ( const variant of this.variants ) {
        if (variant?.variant_values?.length === newValue.length &&
          newValue.every(value => variant.variant_values.includes(value))) {
          matchedVariant = variant.id;
        }
      }

      if ( matchedVariant ) {
        state.selectedVariant = matchedVariant;
      }
    }
  }

  render() {  

    if (this.variants?.length < 2) return <Host style={{ display: 'none' }}></Host>;

    const options = [];

    this.variantOptions.forEach((variation) => {
      if (!variation.name) {
        return;
      }
      const { id, name, position, variant_values } = variation;
      
      options.push(
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

    return (
        <div
        style={{ 
            gap: '12px',
            display: 'flex',
            flexDirection: 'column' 
          }}
        >
          {(options || []).map(option => {
            return (
              <sc-form-control exportparts="label, help-text, form-control" label={option?.name} class="sc-product-variation-choices" part="control">
                <sc-select
                  exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, menu__base, spinner__base, empty"
                  part="name__input"
                  // value={state.selectedVariant}
                  onScChange={(e: any) => {
                    this.variantValues = [...this.variantValues, e?.target?.value];
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
