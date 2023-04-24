import { newSpecPage } from '@stencil/core/testing';
import { ScCustomerName } from '../sc-customer-name';
import { Checkout } from '../../../../../types';
import { dispose as disposeCheckout, state as checkoutState } from '@store/checkout';
import { dispose as disposeUser, state as userState } from '@store/user';

describe('sc-customer-name', () => {
  beforeEach(() => {
    disposeCheckout();
    disposeUser();
  });

  const checkouts = [
    {
      testLabel: 'Customer and Checkout names provided',
      checkout: {
        name: 'CheckoutFirst CheckoutLast',
        customer: {
          name: 'CustomerFirst CustomerLast',
        },
      } as Checkout,
    },
    {
      testLabel: 'Customer name provided',
      checkout: {
        customer: {
          name: 'CustomerFirst CustomerLast',
        },
      } as Checkout,
    },
    {
      testLabel: 'Checkout name provided',
      checkout: {
        name: 'CheckoutFirst CheckoutLast',
      } as Checkout,
    },
  ];

  function addUrlParams(params) {
    // Set the mock URL as the window location
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: params ? new URLSearchParams('?full_name=UrlFirst UrlLast').toString() : '',
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
        components: [ScCustomerName],
        html: `<sc-customer-name></sc-customer-name>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });

    it(`${test.testLabel} without URL Params`, async () => {
      addUrlParams(false);
      userState.loggedIn = true;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerName],
        html: `<sc-customer-name></sc-customer-name>`,
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
        components: [ScCustomerName],
        html: `<sc-customer-name></sc-customer-name>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });

    it(`${test.testLabel} without URL Params`, async () => {
      addUrlParams(false);
      userState.loggedIn = false;
      checkoutState.checkout = test.checkout;

      const page = await newSpecPage({
        components: [ScCustomerName],
        html: `<sc-customer-name></sc-customer-name>`,
      });

      expect(page.root).toMatchSnapshot();
      page.rootInstance.disconnectedCallback();
    });
  });

  // it('renders', async () => {
  //   const page = await newSpecPage({
  //     components: [ScCustomerName],
  //     html: `<sc-customer-name></sc-customer-name>`,
  //   });
  //   expect(page.root).toMatchSnapshot();
  //   page.rootInstance.disconnectedCallback();
  // });

  // it('Renders the passed full name when the customer is not logged in', async () => {
  //   addUrlParams(true);
  //   userState.loggedIn = false;

  //   const page = await newSpecPage({
  //     components: [ScCustomerName],
  //     html: `<sc-customer-name></sc-customer-name>`,
  //   });

  //   expect(page.root).toMatchSnapshot();
  //   page.rootInstance.disconnectedCallback();
  // });

  // it('Renders the logged in customer full name from checkout', async () => {
  //   addUrlParams(true);
  //   userState.loggedIn = true;
  //   checkoutState.checkout = {
  //     customer: {
  //       name: 'CustomerFirst CustomerLast',
  //     },
  //   } as Checkout;

  //   const page = await newSpecPage({
  //     components: [ScCustomerName],
  //     template: () => <sc-customer-name></sc-customer-name>,
  //   });

  //   expect(page.root).toMatchSnapshot();
  //   page.rootInstance.disconnectedCallback();
  // });

  // it('Renders the checkout name if no url params', async () => {
  //   addUrlParams(false);

  //   userState.loggedIn = false;
  //   checkoutState.checkout = {
  //     name: 'CheckoutFirst CheckoutLast',
  //     customer: {
  //       name: 'CustomerFirst CustomerLast',
  //     },
  //   } as Checkout;

  //   const page = await newSpecPage({
  //     components: [ScCustomerName],
  //     template: () => <sc-customer-name></sc-customer-name>,
  //   });

  //   expect(page.root).toMatchSnapshot();
  //   page.rootInstance.disconnectedCallback();
  // });

  // it('Uses url params if checkout name is provided and not logged in.', async () => {
  //   addUrlParams(true);

  //   userState.loggedIn = false;
  //   checkoutState.checkout = {
  //     name: 'CheckoutFirst CheckoutLast',
  //     customer: {
  //       name: 'CustomerFirst CustomerLast',
  //     },
  //   } as Checkout;

  //   const page = await newSpecPage({
  //     components: [ScCustomerName],
  //     template: () => <sc-customer-name></sc-customer-name>,
  //   });

  //   expect(page.root).toMatchSnapshot();
  //   page.rootInstance.disconnectedCallback();
  // });
});
