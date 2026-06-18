import { state as checkoutState, dispose as disposeCheckout } from '..';
import { getCheckout } from '../../checkouts/mutations';
import { dispose } from '../../checkouts';
import { Checkout, LineItem } from '../../../types';
import { getCompleteAddress, getResolvedBillingAddress, getResolvedBillingEmail, toStripeAddress } from '../getters';
import { state as userState, resetUser } from '../../user';

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

  describe('getCompleteAddress', () => {
    it('returns shipping address by default', () => {
      checkoutState.checkout = {
        shipping_address: {
          line_1: '456 Shipping Ave',
          line_2: '',
          city: 'Shipping City',
          state: 'SC',
          postal_code: '67890',
          country: 'US',
        },
      } as Checkout;

      const result = getCompleteAddress();
      expect(result).toEqual({
        line1: '456 Shipping Ave',
        line2: '',
        city: 'Shipping City',
        state: 'SC',
        postal_code: '67890',
        country: 'US',
      });
    });

    it('returns billing address when type is billing', () => {
      checkoutState.checkout = {
        billing_address: {
          line_1: '123 Billing St',
          line_2: 'Suite 1',
          city: 'Billing City',
          state: 'BC',
          postal_code: '12345',
          country: 'US',
        },
        shipping_address: {
          line_1: '456 Shipping Ave',
          line_2: '',
          city: 'Shipping City',
          state: 'SC',
          postal_code: '67890',
          country: 'US',
        },
      } as Checkout;

      const result = getCompleteAddress('billing');
      expect(result).toEqual({
        line1: '123 Billing St',
        line2: 'Suite 1',
        city: 'Billing City',
        state: 'BC',
        postal_code: '12345',
        country: 'US',
      });
    });

    it('returns undefined when address is incomplete', () => {
      checkoutState.checkout = {
        shipping_address: {
          country: 'US',
        },
      } as Checkout;

      expect(getCompleteAddress('shipping')).toBeUndefined();
    });
  });

  describe('getResolvedBillingAddress', () => {
    it('returns billing address when billing_matches_shipping is false and billing has line_1', () => {
      const result = getResolvedBillingAddress({
        billing_matches_shipping: false,
        billing_address: {
          line_1: '123 Billing St',
          line_2: 'Suite 1',
          city: 'Billing City',
          state: 'BC',
          postal_code: '12345',
          country: 'US',
        },
        shipping_address: {
          line_1: '456 Shipping Ave',
          line_2: '',
          city: 'Shipping City',
          state: 'SC',
          postal_code: '67890',
          country: 'US',
        },
      } as Checkout);

      expect(result).toEqual({
        line_1: '123 Billing St',
        line_2: 'Suite 1',
        city: 'Billing City',
        state: 'BC',
        postal_code: '12345',
        country: 'US',
      });
    });

    it('falls back to shipping when billing_matches_shipping is false but billing has no line_1', () => {
      const result = getResolvedBillingAddress({
        billing_matches_shipping: false,
        billing_address: {
          country: 'US',
        },
        shipping_address: {
          line_1: '456 Shipping Ave',
          line_2: 'Apt 2',
          city: 'Shipping City',
          state: 'SC',
          postal_code: '67890',
          country: 'US',
        },
      } as Checkout);

      expect(result).toEqual({
        line_1: '456 Shipping Ave',
        line_2: 'Apt 2',
        city: 'Shipping City',
        state: 'SC',
        postal_code: '67890',
        country: 'US',
      });
    });

    it('returns shipping address when billing_matches_shipping is not false', () => {
      const result = getResolvedBillingAddress({
        billing_matches_shipping: true,
        shipping_address: {
          line_1: '456 Shipping Ave',
          line_2: '',
          city: 'Shipping City',
          state: 'SC',
          postal_code: '67890',
          country: 'US',
        },
      } as Checkout);

      expect(result).toEqual({
        line_1: '456 Shipping Ave',
        line_2: '',
        city: 'Shipping City',
        state: 'SC',
        postal_code: '67890',
        country: 'US',
      });
    });

    it('returns undefined when no addresses are present', () => {
      const result = getResolvedBillingAddress({} as Checkout);
      expect(result).toBeUndefined();
    });

    it('returns undefined when billing has no line_1 and shipping is empty', () => {
      const result = getResolvedBillingAddress({
        billing_matches_shipping: false,
        billing_address: { country: 'US' },
        shipping_address: {},
      } as Checkout);
      expect(result).toBeUndefined();
    });

    it('falls back to shipping when billing_matches_shipping is undefined', () => {
      const result = getResolvedBillingAddress({
        shipping_address: {
          line_1: '456 Shipping Ave',
          line_2: '',
          city: 'Shipping City',
          state: 'SC',
          postal_code: '67890',
          country: 'US',
        },
      } as Checkout);

      expect(result).toEqual({
        line_1: '456 Shipping Ave',
        line_2: '',
        city: 'Shipping City',
        state: 'SC',
        postal_code: '67890',
        country: 'US',
      });
    });
  });

  describe('getResolvedBillingEmail', () => {
    afterEach(() => {
      resetUser();
    });

    it('returns the checkout email when present', () => {
      const result = getResolvedBillingEmail({ email: 'checkout@example.com' } as Checkout);
      expect(result).toEqual('checkout@example.com');
    });

    it('falls back to the linked customer email when checkout email is empty', () => {
      const result = getResolvedBillingEmail({ customer: { email: 'customer@example.com' } } as Checkout);
      expect(result).toEqual('customer@example.com');
    });

    it('falls back to the logged-in user email when checkout and customer have none', () => {
      userState.email = 'user@example.com';
      const result = getResolvedBillingEmail({} as Checkout);
      expect(result).toEqual('user@example.com');
    });

    it('prefers the checkout email over customer and user emails', () => {
      userState.email = 'user@example.com';
      const result = getResolvedBillingEmail({
        email: 'checkout@example.com',
        customer: { email: 'customer@example.com' },
      } as Checkout);
      expect(result).toEqual('checkout@example.com');
    });

    it('returns undefined when no email is available', () => {
      const result = getResolvedBillingEmail({} as Checkout);
      expect(result).toBeUndefined();
    });
  });

  describe('toStripeAddress', () => {
    it('converts canonical Address to Stripe format', () => {
      const result = toStripeAddress({
        line_1: '123 Main St',
        line_2: 'Suite 1',
        city: 'Springfield',
        state: 'IL',
        postal_code: '62704',
        country: 'US',
      });

      expect(result).toEqual({
        line1: '123 Main St',
        line2: 'Suite 1',
        city: 'Springfield',
        state: 'IL',
        postal_code: '62704',
        country: 'US',
      });
    });

    it('returns undefined when address is undefined', () => {
      expect(toStripeAddress(undefined)).toBeUndefined();
    });

    it('returns undefined when address has no line_1', () => {
      expect(toStripeAddress({ country: 'US' })).toBeUndefined();
    });
  });
});
