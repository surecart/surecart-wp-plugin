import { Component, h, Host, Element, EventEmitter, Event, Prop } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { availableVariants, availableVariantOptions } from '@store/product/getters';
import { state } from '@store/product';
import { state as checkoutState } from '@store/checkout';
import { getLineItemByProductId } from '@store/checkout/getters';
import { LineItemData } from '../../../../types';
import { getVariantFromValues } from '../../../../functions/util';
@Component({
  tag: 'sc-product-variation-choices',
  styleUrl: 'sc-product-variation-choices.css',
  shadow: true,
})
export class ScProductVariationChoices {

  /** The product id. */
  @Prop() productId: string;
  
  @Prop() type: 'product-page' | 'instant-checkout-page' = 'product-page';

  @Element() el: HTMLScProductVariationChoicesElement;
  
   /** Toggle line item event */
   @Event() scUpdateLineItem: EventEmitter<LineItemData>;

  componentWillLoad() {
    const variant = state?.variants?.find(variant => variant?.id === state?.selectedVariant?.id);
    
    const variantValues = {
      ...(variant?.option_1 && { option_1: variant.option_1 }),
      ...(variant?.option_2 && { option_2: variant.option_2 }),
      ...(variant?.option_3 && { option_3: variant.option_3 })
    };

    state.variantValues = variantValues;
  }

  /** The line item from state. */
  lineItem() {
    return getLineItemByProductId(this.productId);
  }

  availableVariants = availableVariants(this.type);

  maybeUpdateLineItems = (values: { [key: string]: string }) => {
    if (!values || !checkoutState?.checkout) return;

    const matchedVariant = getVariantFromValues({variants: this.availableVariants, values});

    if (!matchedVariant) return;

    this.scUpdateLineItem.emit({ price_id: this.lineItem()?.price?.id, quantity: 1, variant: matchedVariant?.id });
  }
  
  render() {  
    if ( this.availableVariants?.length < 2) return <Host style={{ display: 'none' }}></Host>;

    return (
        <div class="sc-product-variation-choice-wrap">
          {( availableVariantOptions(this.type) || []).map((option, index) => {
            return (
              <sc-select
                exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, menu__base, spinner__base, empty"
                part="name__input"
                value={state.variantValues?.[option.id] || option?.values?.[0]?.value || ''}
                onScChange={(e: any) => {
                  const variantValues = {
                    ...state.variantValues,
                    [`option_${index + 1}`]: e?.target?.value
                  };
                  state.variantValues = variantValues;
                  this.maybeUpdateLineItems(variantValues);
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
