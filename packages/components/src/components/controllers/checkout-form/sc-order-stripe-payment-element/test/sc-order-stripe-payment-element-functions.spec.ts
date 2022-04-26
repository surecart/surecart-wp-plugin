import { Order, PaymentIntent } from '../../../../../types';
import { shouldReloadElement } from '../functions';

describe('sc-order-stripe-payment-element functions', () => {
  it('shouldReloadElement', async () => {
    expect(shouldReloadElement({ amount: 100 } as PaymentIntent, { amount_due: 100 } as Order)).toBe(false);
    expect(shouldReloadElement({ amount: 0 } as PaymentIntent, { amount_due: 0 } as Order)).toBe(false);
    expect(shouldReloadElement({ amount: 0 } as PaymentIntent, { amount_due: 100 } as Order)).toBe(true);
    expect(shouldReloadElement({ amount: 100 } as PaymentIntent, { amount_due: 0 } as Order)).toBe(true);
  });
});
