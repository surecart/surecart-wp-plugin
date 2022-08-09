import { Checkout, PaymentIntent } from '../../../../types';

export const shouldReloadElement = (intent: PaymentIntent, order: Checkout) => {
  if (order?.line_items?.pagination?.count === 0) return false; // we need items in the cart.
  if (intent?.amount === 0 && order?.amount_due !== 0) return true;
  if (intent?.amount > 0 && order?.amount_due === 0) return true;
  return false;
};
