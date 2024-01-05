import { Checkout } from 'src/types';
import { state } from './store';

export const setCheckout = (checkout: Checkout) => {
  state.checkout = checkout;
}