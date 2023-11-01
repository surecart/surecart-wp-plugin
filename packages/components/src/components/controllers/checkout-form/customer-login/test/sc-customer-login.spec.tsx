import { newSpecPage } from '@stencil/core/testing';
import { dispose as disposeCheckout } from '@store/checkout';
import { dispose as disposeUser, state as userState } from '@store/user';
import { ScCustomerLogin } from '../sc-customer-login';

describe('sc-customer-login', () => {
  beforeEach(() => {
    disposeCheckout();
    disposeUser();
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with user logged in and matched', async () => {
    userState.loggedIn = true;
    userState.matched = true;
    userState.email = 'test@example.com';
    userState.name = 'Test User';

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with user logged in and not matched', async () => {
    userState.loggedIn = true;
    userState.matched = false;
    userState.email = 'test@example.com';
    userState.name = 'Test User';

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with user not logged in and matched', async () => {
    userState.loggedIn = false;
    userState.matched = true;
    userState.email = 'test@example.com';
    userState.name = 'Test User';

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
