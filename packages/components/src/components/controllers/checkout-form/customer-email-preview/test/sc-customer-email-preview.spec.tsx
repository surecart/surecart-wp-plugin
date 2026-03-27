import { newSpecPage } from '@stencil/core/testing';
import { dispose as disposeCheckout } from '@store/checkout';
import { dispose as disposeUser, state as userState } from '@store/user';
import { ScCustomerEmailPreview } from '../sc-customer-email-preview';
import { CODE_SENT } from '@store/user/constants';

describe('sc-customer-email-preview', () => {
  beforeEach(() => {
    disposeCheckout();
    disposeUser();
  });

  it('renders', async () => {
    const page = await newSpecPage({
      components: [ScCustomerEmailPreview],
      html: `<sc-customer-email-preview></sc-customer-email-preview>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('renders with user logged in', async () => {
    userState.loggedIn = true;
    userState.email = 'test@example.com';
    userState.verificationStatus = CODE_SENT;
    userState.name = 'Test User';

    const page = await newSpecPage({
      components: [ScCustomerEmailPreview],
      html: `<sc-customer-email-preview></sc-customer-email-preview>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
