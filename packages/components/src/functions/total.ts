import { Coupon } from '../types';

/**
 * Handles coupon calculation
 * @param subtotal The subtotal from the form
 * @param coupon The coupon object
 * @returns The new total
 */
export function applyCoupon(subtotal: number, coupon: Coupon) {
  let result = subtotal;

  // not valid
  if (!coupon || !coupon.valid) {
    return result;
  }

  // amount off
  if (coupon.amount_off) {
    result = result - coupon.amount_off;
  }

  // percent off
  if (coupon.percent_off) {
    result = result * (coupon.amount_off / 100);
  }

  return result;
}
