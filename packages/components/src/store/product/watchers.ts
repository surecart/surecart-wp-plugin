import { ProductState } from 'src/types';
import state, { on } from './store';
import { setProduct } from './setters';
import { getVariantFromValues } from '../../functions/util';
import { isStockNeedsToBeChecked } from './getters';
import { speak } from '@wordpress/a11y';
import { __, sprintf } from '@wordpress/i18n';

on('set', (productId: string, newValue: ProductState, oldValue: ProductState) => {
  if (JSON.stringify(newValue?.selectedPrice) !== JSON.stringify(oldValue?.selectedPrice)) {
    updateSelectedPrice(productId, newValue);
  }

  if (JSON.stringify(newValue?.selectedVariant) !== JSON.stringify(oldValue?.selectedVariant)) {
    onSelectedVariantChange(productId);
  }

  const shouldUpdateLineItem = !oldValue || ['selectedPrice', 'adHocAmount', 'quantity'].some(key => JSON.stringify(newValue[key]) !== JSON.stringify(oldValue[key]));
  const shouldUpdateVariants = !oldValue || JSON.stringify(newValue?.variantValues) !== JSON.stringify(oldValue?.variantValues);

  if (shouldUpdateLineItem) {
    setLineItem(productId);
  }

  if (shouldUpdateVariants) {
    updateSelectedVariant(productId, newValue);
  }
});

const updateSelectedVariant = (productId: string, newValue: ProductState) => {
  const matchedVariant = getVariantFromValues({ variants: state[productId].variants, values: newValue?.variantValues });

  if (matchedVariant) {
    state[productId].selectedVariant = matchedVariant;
  }
}

const onSelectedVariantChange = (productId: string) => {
  if(!state[productId].selectedVariant || !isStockNeedsToBeChecked) {
    return;
  }

  if (state[productId]?.selectedVariant.available_stock < state[productId]?.quantity) {
    state[productId].quantity = state[productId]?.selectedVariant.available_stock || 1;
    speak(sprintf(__('There are just %d items left in stock, and the quantity has been adjusted to %d.', 'surecart'), state[productId].quantity, state[productId].quantity), 'assertive');
  }
};

const updateSelectedPrice = (productId: string, newValue: ProductState) => {
  // update the total when the selected price changes.
  state[productId].total = state[productId].adHocAmount || newValue?.selectedPrice?.amount || 0;
  // set the ad hoc amount to the selected product amount.
  state[productId].adHocAmount = newValue?.selectedPrice?.amount;
  // update disabled based on if price is archived or product is archived.
  state[productId].disabled = newValue?.selectedPrice?.archived || state[productId].product?.archived;
};

const setLineItem = (productId: string) => {
  setProduct(productId, {
    line_item: {
      price_id: state[productId]?.selectedPrice?.id,
      quantity: state[productId]?.selectedPrice?.ad_hoc ? 1 : state[productId].quantity,
      ...(state[productId]?.selectedPrice?.ad_hoc ? { ad_hoc_amount: state[productId]?.adHocAmount } : {}),
      variant: state[productId].selectedVariant?.id,
    },
  });
}


