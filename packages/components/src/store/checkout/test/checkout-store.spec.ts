import { state as checkoutState, dispose as disposeCheckout } from '..';
import store, { getCheckout } from '../../checkouts';
import { Checkout } from '../../../types';

describe('Checkout Store store', () => {
  beforeEach(() => {
    store.dispose();
    disposeCheckout();
  });

  describe('watchers', () => {
    it('syncs checkout object with checkout store', () => {
      checkoutState.formId = 1;
      checkoutState.mode = 'test';
      checkoutState.checkout = {
        id: 'test',
      } as Checkout;
      expect(getCheckout(1, 'test')).toEqual(checkoutState.checkout);
      expect(checkoutState.checkout).toEqual(getCheckout(1, 'test'));
    });
  });
});
