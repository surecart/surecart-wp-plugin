import state, { onChange } from './store';
import { getVariantFromValues } from '../../functions/util';
import { isStockNeedsToBeChecked } from './getters';
import { speak } from '@wordpress/a11y';
import { __, sprintf } from '@wordpress/i18n';

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

onChange('selectedVariant', () => {
  // we don't have a selected variant and stock does not need to be checked.
  if (!state.selectedVariant || !isStockNeedsToBeChecked) {
    return;
  }

  if (state?.selectedVariant.available_stock < state?.quantity) {
    state.quantity = state?.selectedVariant.available_stock || 1;
    // let the user to know that the quantity has changed since the only available item in stock is selectedVariant.available_stock
    speak(sprintf(__('There are just %d items left in stock, and the quantity has been adjusted to %d.', 'surecart'), state.quantity, state.quantity), 'assertive');
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
