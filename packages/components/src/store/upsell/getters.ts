import { state } from './store';

export const getDiscountedAmount = amount => {
  if (state.upsell?.amount_off) {
    return Math.max(0, amount - state.upsell?.amount_off);
  }

  if (state.upsell?.percent_off) {
    const off = amount * (state.upsell?.percent_off / 100);
    return Math.max(0, amount - off);
  }

  return amount;
};
