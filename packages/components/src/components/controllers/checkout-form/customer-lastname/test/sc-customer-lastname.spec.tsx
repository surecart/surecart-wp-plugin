import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import { Customer } from '../../../../../types';
import { ScCustomerLastname } from '../sc-customer-lastname';

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

describe('sc-customer-lastname', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerLastname],
      html: `<sc-customer-lastname></sc-customer-lastname>`,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('renders the url last name when  not logged in', async () => {
    const mockUrl = new URLSearchParams('?last_name=Doe');

    // Set the mock URL as the window location
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: mockUrl.toString(),
      },
      writable: true,
    });

    const page = await newSpecPage({
      components: [ScCustomerLastname],
      html: `<sc-customer-lastname></sc-customer-lastname>`,
    });

    expect(page.root).toMatchSnapshot();
  });

  it('renders the logged in customer last name when logged in', async () => {
    const mockUrl = new URLSearchParams('?last_name=Doe');

    // Set the mock URL as the window location
    global.window = Object.create(window);
    Object.defineProperty(window, 'location', {
      value: {
        search: mockUrl.toString(),
      },
      writable: true,
    });

    const page = await newSpecPage({
      components: [ScCustomerLastname],
      template: () => <sc-customer-lastname loggedIn={true} customer={TEST_CUSTOMER}></sc-customer-lastname>,
    });

    expect(page.root).toMatchSnapshot();
  });
});
