import state, { onChange } from './store';
import { getVariantFromValues } from '../../functions/util';

onChange('selectedPrice', value => {
  // update the total when the selected price changes.
  state.total = state.adHocAmount || value?.amount || 0;
  // set the ad hoc amount to the selected product amount.
  state.adHocAmount = value?.amount;
  // update disabled based on if price is archived or product is archived.
  state.disabled = value?.archived || state.product?.archived;
});

onChange('variantValues', values => {
  const matchedVariant = getVariantFromValues({ variants: state.variants, values });

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
    variant: state.selectedVariant?.id,
  };
};
