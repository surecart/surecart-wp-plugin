import { Price } from 'src/types';
import { state } from './store';
import { on, state as productState } from '@store/product';
import { ProductState } from 'src/types';
import { setProduct } from '@store/product/setters';

const updateScratchPrices = (productId, value) => {
  if (productId !== state.product?.id) {
    return;
  }

  // If price doesn't match, don't proceed.
  const upsellPrice = state.upsell?.price as Price;
  let price = value?.prices.find(priceData => priceData?.id === upsellPrice?.id);
  if (!price) return;

  let amount = price?.amount || 0;
  let initialAmount = upsellPrice?.amount || 0;
  let scratchAmount = initialAmount;

  if (state.upsell?.amount_off) {
    amount = Math.max(0, initialAmount - state.upsell?.amount_off);
  }

  if (state.upsell?.percent_off) {
    const off = initialAmount * (state.upsell?.percent_off / 100);
    amount = Math.max(0, initialAmount - off);
  }

  setProduct(productId, {
    selectedPrice: {
      ...price,
      amount,
      scratch_amount: scratchAmount,
    },
  });
};
// update amount and scratch amount for upsell
updateScratchPrices(state.product?.id, productState[state.product?.id]);
on('set', (productId: string, value: ProductState) => updateScratchPrices(productId, value));
