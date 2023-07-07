import { Component, h, Prop, Host, Element } from '@stencil/core';
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
  
  @Element() el: HTMLScProductVariationChoicesElement;
  @Prop() isDummy: boolean;
 
  render() {  
    
    if ( ! this.isDummy && availableVariants()?.length < 2) return <Host style={{ display: 'none' }}></Host>;

    const options = ! this.isDummy ? availableVariantOptions() : dummyOptions;

    return (
        <div class="sc-product-variation-choice-wrap">
          {( options || []).map(option => {
            return (
              <sc-select
                exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, menu__base, spinner__base, empty"
                part="name__input"
                value={state.variantValues?.[option.id] || option?.values?.[0]?.value || ''}
                onScChange={(e: any) => {
                  if ( ! this.isDummy ) {
                    state.variantValues = {
                      ...state.variantValues,
                      [option?.id]: e?.target?.value
                    };
                  }
                }}
                label={option?.name}
                choices={option?.values}
                unselect={false}
                key={option?.id}
              />
            )
        })}
      </div>
    );
  }
}
