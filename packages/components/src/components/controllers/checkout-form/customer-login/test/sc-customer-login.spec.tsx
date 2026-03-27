import { newSpecPage } from '@stencil/core/testing';
import { dispose as disposeCheckout } from '@store/checkout';
import { dispose as disposeUser, state as userState, CODE_SENT, UNVERIFIED } from '@store/user';
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
    userState.verificationStatus = CODE_SENT;
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
    userState.verificationStatus = UNVERIFIED;
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
    userState.verificationStatus = CODE_SENT;
    userState.email = 'test@example.com';
    userState.name = 'Test User';

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });
    expect(page.root).toMatchSnapshot();
  });

  it('displays user email in the login view', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    const emailValue = page.root.shadowRoot.querySelector('.customer-login__email-value');
    expect(emailValue?.textContent).toBe('user@example.com');
  });

  it('defaults to code mode and shows verification code view', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    const codeView = page.root.shadowRoot.querySelector('.customer-code');
    const passwordView = page.root.shadowRoot.querySelector('.customer-password');
    expect(codeView).not.toBeNull();
    expect(passwordView).toBeNull();
  });

  it('switches to password mode when Use Password is clicked', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    // Find the mode toggle button (Use Password).
    const modeButtons = page.root.shadowRoot.querySelectorAll('.customer-login__mode sc-button');
    const usePasswordBtn = modeButtons[0];
    expect(usePasswordBtn).toBeDefined();

    usePasswordBtn.dispatchEvent(new Event('click'));
    await page.waitForChanges();

    const passwordView = page.root.shadowRoot.querySelector('.customer-password');
    const codeView = page.root.shadowRoot.querySelector('.customer-code');
    expect(passwordView).not.toBeNull();
    expect(codeView).toBeNull();
  });

  it('displays error from codeError prop', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login code-error="Something went wrong"></sc-customer-login>`,
    });

    const errorEl = page.root.shadowRoot.querySelector('.customer-code__error');
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toBe('Something went wrong');
    expect(errorEl.getAttribute('role')).toBe('alert');
  });

  it('error elements have role="alert" for accessibility', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login code-error="Error message"></sc-customer-login>`,
    });

    const alerts = page.root.shadowRoot.querySelectorAll('[role="alert"]');
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('renders change email button with accessible label', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    const backIcon = page.root.shadowRoot.querySelector('.customer-login__back-icon');
    expect(backIcon).not.toBeNull();
    expect(backIcon.getAttribute('aria-label')).toContain('Change email');
  });
});
