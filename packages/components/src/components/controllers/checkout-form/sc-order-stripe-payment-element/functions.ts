import { Order, PaymentIntent } from '../../../../types';

export const shouldReloadElement = (intent: PaymentIntent, order: Order) => {
  if (intent?.amount === 0 && order?.amount_due !== 0) return true;
  if (intent?.amount > 0 && order?.amount_due === 0) return true;
  return false;
};
