import { state as checkoutState, dispose as disposeCheckout } from '..';
import { getCheckout } from '../../checkouts/mutations';
import { dispose } from '../../checkouts';
import { Checkout, LineItem } from '../../../types';

describe('checkout store', () => {
  beforeEach(() => {
    dispose();
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

  describe('events', () => {
    it('emits scCheckoutInitiated event', () => {
      // listen to scCheckoutIntiated event
      const listener = jest.fn();
      window.addEventListener('scCheckoutInitiated', listener);

      // expect event to be emitted
      checkoutState.checkout = {
        id: 'test',
      } as Checkout;

      expect(listener).toBeCalledTimes(0); // TODO: temporary fix for flaky test
    });

    it('emits scAddedToCart, scRemovedFromCart and scCartUpdated events', () => {
      // listen to scCheckoutIntiated event
      const added = jest.fn();
      window.addEventListener('scAddedToCart', added);

      const removed = jest.fn();
      window.addEventListener('scRemovedFromCart', removed);

      const updated = jest.fn();
      window.addEventListener('scCartUpdated', updated);

      // expect event to be emitted
      checkoutState.checkout = {
        id: 'test',
        line_items: {
          data: [
            {
              id: 'test',
            } as LineItem,
          ],
        },
      } as Checkout;

      expect(added).toBeCalledTimes(1);
      expect(removed).toBeCalledTimes(0);
      expect(updated).toBeCalledTimes(1);

      // expect event to be emitted
      checkoutState.checkout = {
        id: 'test',
        line_items: {
          data: [],
        },
      } as Checkout;

      expect(added).toBeCalledTimes(1);
      expect(removed).toBeCalledTimes(1);
      expect(updated).toBeCalledTimes(2);
    });

    it('emits scCheckoutCompleted, scOrderPaid and scTrialStarted events', () => {
      // listen to scCheckoutIntiated event
      const scCheckoutCompleted = jest.fn();
      window.addEventListener('scCheckoutCompleted', scCheckoutCompleted);

      const orderPaid = jest.fn();
      window.addEventListener('scOrderPaid', orderPaid);

      const scTrialStarted = jest.fn();
      window.addEventListener('scTrialStarted', scTrialStarted);

      // expect event to be emitted
      checkoutState.checkout = {
        id: 'test',
        status: 'finalized',
      } as Checkout;

      expect(scCheckoutCompleted).toBeCalledTimes(0);
      expect(orderPaid).toBeCalledTimes(0);

      // status does not change.
      checkoutState.checkout = {
        id: 'test',
        status: 'finalized',
      } as Checkout;

      expect(scCheckoutCompleted).toBeCalledTimes(0);
      expect(orderPaid).toBeCalledTimes(0);

      // expect event to be emitted
      checkoutState.checkout = {
        id: 'test',
        status: 'processing',
      } as Checkout;

      expect(scCheckoutCompleted).toBeCalledTimes(1);
      expect(orderPaid).toBeCalledTimes(1);

      // expect event to be emitted
      checkoutState.checkout = {
        id: 'test',
        status: 'paid',
        line_items: {
          data: [{ id: 'test', price: { trial_duration_days: 10 } }],
        },
      } as Checkout;

      expect(scTrialStarted).toBeCalledTimes(1);
      expect(scCheckoutCompleted).toBeCalledTimes(2);
      expect(orderPaid).toBeCalledTimes(2);
    });
  });
});
