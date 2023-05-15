import { newSpecPage } from '@stencil/core/testing';
import { dispose as disposeCheckout, state as checkoutState } from '@store/checkout';
import { dispose as disposeUser, state as userState } from '@store/user';
import { Checkout } from '../../../../../types';
import { ScCustomerFirstname } from '../sc-customer-firstname';

describe('sc-customer-firstname', () => {
  beforeEach(() => {
    disposeCheckout();
    disposeUser();
  });

  const checkouts = [
    {
      testLabel: 'Customer and Checkout first name provided',
      checkout: {
        first_name: 'CheckoutFirst',
        customer: {
          first_name: 'CustomerFirst',
        },
      } as Checkout,
    },
    {
      testLabel: 'Customer first name provided',
      checkout: {
        customer: {
          first_name: 'CustomerFirst',
        },
      } as Checkout,
    },
    {
      testLabel: 'Checkout first name provided',
      checkout: {
        first_name: 'CheckoutFirst',
      } as Checkout,
    },
  ];

  function addUrlParams(params: boolean) {
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: params ? new URLSearchParams('?first_name=UrlFirst').toString() : '',
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
        components: [ScCustomerFirstname],
        html: `<sc-customer-firstname></sc-customer-firstname>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });

    it(`${test.testLabel} without URL Params`, async () => {
      addUrlParams(false);
      userState.loggedIn = true;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerFirstname],
        html: `<sc-customer-firstname></sc-customer-firstname>`,
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
        components: [ScCustomerFirstname],
        html: `<sc-customer-firstname></sc-customer-firstname>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });

    it(`${test.testLabel} without URL Params`, async () => {
      addUrlParams(false);
      userState.loggedIn = false;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerFirstname],
        html: `<sc-customer-firstname></sc-customer-firstname>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });
  });
});
