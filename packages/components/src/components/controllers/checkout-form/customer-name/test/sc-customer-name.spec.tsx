import { newSpecPage } from '@stencil/core/testing';
import { h } from '@stencil/core';
import { ScCustomerName } from '../sc-customer-name';
import { Customer } from '../../../../../types';

const TEST_CUSTOMER: Customer = {
  id: 'd4f37b81-3448-4cae-ad46-4201432527ff',
  billing_matches_shipping: true,
  email: 'customer-21@example.com',
  first_name: 'Jack',
  last_name: null,
  live_mode: true,
  name: 'Jack Burrows',
  phone: null,
  unsubscribed: false,
  billing_address: null,
  default_payment_method: null,
  shipping_address: null,
  tax_identifier: null,
  created_at: 1679586369,
  updated_at: 1679586369,
};

describe('sc-customer-name', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerName],
      html: `<sc-customer-name></sc-customer-name>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('Renders the passed full name when the customer is not logged in', async () => {
    const mockUrl = new URLSearchParams('?full_name=John Doe');

    // Set the mock URL as the window location
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: mockUrl.toString(),
      },
      writable: true,
    });

    const page = await newSpecPage({
      components: [ScCustomerName],
      html: `<sc-customer-name></sc-customer-name>`,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('Renders the logged in customer full name when logged in is true', async () => {
    const mockUrl = new URLSearchParams('?full_name=John Doe');

    // Set the mock URL as the window location
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: mockUrl.toString(),
      },
      writable: true,
    });

    const page = await newSpecPage({
      components: [ScCustomerName],
      template: () => <sc-customer-name customer={TEST_CUSTOMER} loggedIn={true}></sc-customer-name>,
    });

    expect(page.root).toMatchSnapshot();
  });
});
