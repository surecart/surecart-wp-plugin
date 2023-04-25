import { newSpecPage } from '@stencil/core/testing';
import { dispose as disposeCheckout, state as checkoutState } from '@store/checkout';
import { dispose as disposeUser, state as userState } from '@store/user';
import { Checkout } from '../../../../../types';
import { ScCustomerEmail } from '../sc-customer-email';

describe('sc-customer-email', () => {
  beforeEach(() => {
    disposeCheckout();
    disposeUser();
  });

  const checkouts = [
    {
      testLabel: 'Customer and Checkout email provided',
      checkout: {
        email: 'CheckoutEmail',
        customer: {
          email: 'CustomerEmail',
        },
      } as Checkout,
    },
    {
      testLabel: 'Customer email provided',
      checkout: {
        customer: {
          email: 'CustomerEmail',
        },
      } as Checkout,
    },
    {
      testLabel: 'Checkout email provided',
      checkout: {
        email: 'CheckoutEmail',
      } as Checkout,
    },
  ];

  function addUrlParams(params: boolean) {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: params ? new URLSearchParams('?email=UrlEmail').toString() : '',
      },
      writable: true,
    });
  }

  describe.each(checkouts)('Logged In', test => {
    it(`${test.testLabel} with URL Params`, async () => {
      addUrlParams(true);
      userState.loggedIn = true;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerEmail],
        html: `<sc-customer-email></sc-customer-email>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });

    it(`${test.testLabel} without URL Params`, async () => {
      addUrlParams(false);
      userState.loggedIn = true;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerEmail],
        html: `<sc-customer-email></sc-customer-email>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });
  });

  describe.each(checkouts)('Logged Out', test => {
    it(`${test.testLabel} with URL Params`, async () => {
      addUrlParams(true);
      userState.loggedIn = false;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerEmail],
        html: `<sc-customer-email></sc-customer-email>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });

    it(`${test.testLabel} without URL Params`, async () => {
      addUrlParams(false);
      userState.loggedIn = false;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerEmail],
        html: `<sc-customer-email></sc-customer-email>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });
  });
});
