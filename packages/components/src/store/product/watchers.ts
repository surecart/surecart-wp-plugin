import state, { onChange } from './store';
import { availableVariants } from '@store/product/getters';

onChange('selectedPrice', value => {
  // update the total when the selected price changes.
  state.total = state.adHocAmount || value?.amount || 0;
  // set the ad hoc amount to the selected product amount.
  state.adHocAmount = value?.amount;
  // update disabled based on if price is archived or product is archived.
  state.disabled = value?.archived || state.product?.archived;
});

onChange('variantValues', value => {
  const variantValueKeys = Object.keys(value);

  let matchedVariant = '';

  const variants = availableVariants();

  for (const variant of variants) {
    if (
      variant?.variant_values?.length === variantValueKeys.length &&
      variantValueKeys.every(key => variant.variant_values.includes(value[key]))
    ) {
      matchedVariant = variant.id;
      break;
    }
  }
  
  if (matchedVariant) {
    state.selectedVariant = matchedVariant;
  }
});

// update the line item when any of these change.
onChange('selectedPrice', () => setLineItem());
onChange('selectedVariant', () => setLineItem());
onChange('adHocAmount', () => setLineItem());
onChange('quantity', () => setLineItem());

const setLineItem = () => {
  state.line_item = {
    price_id: state.selectedPrice?.id,
    quantity: state.selectedPrice?.ad_hoc ? 1 : state.quantity,
    ...(state.selectedPrice?.ad_hoc ? { ad_hoc_amount: state.adHocAmount } : {}),
    variant: state.selectedVariant,
  };
};
