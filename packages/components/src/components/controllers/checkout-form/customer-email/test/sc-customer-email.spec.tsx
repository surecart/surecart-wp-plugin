import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScCustomerEmail } from '../sc-customer-email';
import { Customer } from '../../../../../types';

const TEST_CUSTOMER: Customer = {
  id: 'd4f37b81-3448-4cae-ad46-4201432527ff',
  billing_matches_shipping: true,
  email: 'customer-21@example.com',
  first_name: 'Jack',
  last_name: null,
  live_mode: true,
  name: null,
  phone: null,
  unsubscribed: false,
  billing_address: null,
  default_payment_method: null,
  shipping_address: null,
  tax_identifier: null,
  created_at: 1679586369,
  updated_at: 1679586369,
};

describe('sc-customer-email', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerEmail],
      html: `<sc-customer-email></sc-customer-email>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Renders the url email when the customer is not logged in', async () => {
    const mockUrl = new URLSearchParams('?email=johndoe@gmail.com');

    // Set the mock URL as the window location
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: mockUrl.toString(),
      },
      writable: true,
    });

    const page = await newSpecPage({
      components: [ScCustomerEmail],
      html: `<sc-customer-email></sc-customer-email>`,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Renders the logged in customer email when the customer is logged in', async () => {
    const mockUrl = new URLSearchParams('?email=johndoe@gmail.com');

    // Set the mock URL as the window location
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: mockUrl.toString(),
      },
      writable: true,
    });

    const page = await newSpecPage({
      components: [ScCustomerEmail],
      template: () => <sc-customer-email customer={TEST_CUSTOMER} loggedIn={true}></sc-customer-email>,
    });

    expect(page.root).toMatchSnapshot();
  });
});
