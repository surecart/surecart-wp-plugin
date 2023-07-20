import { Component, h, Host, Element, EventEmitter, Event } from '@stencil/core';
import { __ } from '@wordpress/i18n';
import { availableVariants, availableVariantOptions } from '@store/product/getters';
import { state } from '@store/product';
import { lockCheckout, unLockCheckout } from '@store/checkout/mutations';
import { state as checkoutState } from '@store/checkout';
import { createOrUpdateCheckout } from '@services/session';
import { Checkout, ResponseError } from '../../../../types';
import { getVariantFromValues } from '../../../../functions/util';
@Component({
  tag: 'sc-product-variation-choices',
  styleUrl: 'sc-product-variation-choices.css',
  shadow: true,
})
export class ScProductVariationChoices {
  
  @Element() el: HTMLScProductVariationChoicesElement;
  
  /** Error event */
  @Event() scError: EventEmitter<ResponseError>;

  updateCheckout = async (values: { [key: string]: string }) => {
    
    if (!values || !checkoutState?.checkout) return;

    const matchedVariant = getVariantFromValues({variants: availableVariants(), values});

    if (!matchedVariant) return;

    try {
      lockCheckout('variant');
      checkoutState.checkout = (await createOrUpdateCheckout({
        id: checkoutState.checkout.id,
        data: {
          variant: matchedVariant,
        },
      })) as Checkout;
    } catch (e) {
      console.error(e);
      this.scError.emit(e);
    } finally {
      unLockCheckout('variant');
    }
  }
  
  render() {  
    
    if ( availableVariants()?.length < 2) return <Host style={{ display: 'none' }}></Host>;

    return (
        <div class="sc-product-variation-choice-wrap">
          {( availableVariantOptions() || []).map(option => {
            return (
              <sc-select
                exportparts="base:select__base, input, form-control, label, help-text, trigger, panel, caret, menu__base, spinner__base, empty"
                part="name__input"
                value={state.variantValues?.[option.id] || option?.values?.[0]?.value || ''}
                onScChange={(e: any) => {
                  const variantValues = {
                    ...state.variantValues,
                    [option?.id]: e?.target?.value
                  };
                  state.variantValues = variantValues;
                  this.updateCheckout(variantValues)
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
