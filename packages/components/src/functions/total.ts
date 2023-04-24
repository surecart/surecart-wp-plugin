import { Coupon } from '../types';

/**
 * Handles coupon calculation
 * @param amount The amount from the form
 * @param coupon The coupon object
 * @returns The new total
 */
export function applyCoupon(amount: number, coupon: Coupon) {
  // not valid
  if (!coupon) {
    return amount;
  }

  // amount off
  if (coupon?.amount_off) {
    return amount - coupon.amount_off;
  }

  // percent off
  if (coupon?.percent_off) {
    return amount - amount * (coupon.percent_off / 100);
  }

  return amount;
}
