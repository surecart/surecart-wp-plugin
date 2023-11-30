import { createStore } from '@stencil/store';
import { getSerializedState } from '@store/utils';
import { getLineItemByProductId } from '@store/checkout/getters';
import { Price, Product } from '../../types';
const { productDonation } = getSerializedState();

interface Store {
  [key: string]: {
    product: Product;
    selectedPrice: Price;
    ad_hoc_amount: number;
    custom_amount: number;
    amounts: number[];
  };
}

// This gets initial checkout line items and updates the product donation store to match on load.
const productDonationData = Object.keys(productDonation || {}).reduce((acc, productId) => {
  const lineItem = getLineItemByProductId(productId);
  if (lineItem?.id) {
    acc[productId] = {
      ...acc[productId],
      ...(lineItem?.ad_hoc_amount ? { ad_hoc_amount: lineItem.ad_hoc_amount } : {}),
      ...(lineItem?.price ? { selectedPrice: lineItem.price } : {}),
      custom_amount: (acc[productId].amounts || []).includes(lineItem.ad_hoc_amount) ? null : lineItem.ad_hoc_amount,
    };
  }
  return acc;
}, productDonation);

const { state, onChange, on, set, get, dispose } = createStore<Store>({ ...productDonationData }, (newValue, oldValue) => {
  return JSON.stringify(newValue) !== JSON.stringify(oldValue);
});

export default state;
export { state, onChange, on, set, get, dispose };
