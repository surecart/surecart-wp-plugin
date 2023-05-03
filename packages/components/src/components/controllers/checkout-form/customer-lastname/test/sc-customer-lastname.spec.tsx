import { newSpecPage } from '@stencil/core/testing';
import { ScCustomerLastname } from '../sc-customer-lastname';
import { dispose as disposeCheckout, state as checkoutState } from '@store/checkout';
import { dispose as disposeUser, state as userState } from '@store/user';
import { Checkout } from '../../../../../types';

describe('sc-customer-lastname', () => {
  beforeEach(() => {
    disposeCheckout();
    disposeUser();
  });

  const checkouts = [
    {
      testLabel: 'Customer and Checkout last name provided',
      checkout: {
        last_name: 'CheckoutLast',
        customer: {
          last_name: 'CustomerLast',
        },
      } as Checkout,
    },
    {
      testLabel: 'Customer last name provided',
      checkout: {
        customer: {
          last_name: 'CustomerLast',
        },
      } as Checkout,
    },
    {
      testLabel: 'Checkout last name provided',
      checkout: {
        last_name: 'CheckoutLast',
      } as Checkout,
    },
  ];

  function addUrlParams(params: boolean) {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: params ? new URLSearchParams('?last_name=UrlLast').toString() : '',
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
        components: [ScCustomerLastname],
        html: `<sc-customer-lastname></sc-customer-lastname>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });

    it(`${test.testLabel} without URL Params`, async () => {
      addUrlParams(false);
      userState.loggedIn = true;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerLastname],
        html: `<sc-customer-lastname></sc-customer-lastname>`,
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
        components: [ScCustomerLastname],
        html: `<sc-customer-lastname></sc-customer-lastname>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });

    it(`${test.testLabel} without URL Params`, async () => {
      addUrlParams(false);
      userState.loggedIn = false;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerLastname],
        html: `<sc-customer-lastname></sc-customer-lastname>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });
  });
});
