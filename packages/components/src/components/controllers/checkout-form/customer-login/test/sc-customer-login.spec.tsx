import { newSpecPage } from '@stencil/core/testing';
import { dispose as disposeCheckout } from '@store/checkout';
import { dispose as disposeUser, state as userState, CODE_SENT, UNVERIFIED, CODE_EXPIRED } from '@store/user';
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

  it('displays user email in the sent info line', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    const sentEmail = page.root.shadowRoot.querySelector('.customer-code__sent-email');
    expect(sentEmail?.textContent).toBe('user@example.com');
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

    // Find the Use Password link in the footer.
    const modeLink = page.root.shadowRoot.querySelector('.customer-code__mode-link') as HTMLElement;
    expect(modeLink).not.toBeNull();

    modeLink.click();
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

  it('starts in password mode silently when initialMode="password" (rate-limit fallback)', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = UNVERIFIED;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login initial-mode="password"></sc-customer-login>`,
    });

    const passwordView = page.root.shadowRoot.querySelector('.customer-password');
    const codeView = page.root.shadowRoot.querySelector('.customer-code');
    expect(passwordView).not.toBeNull();
    expect(codeView).toBeNull();

    // No red error on first load — header + input is enough context.
    const errorEl = page.root.shadowRoot.querySelector('.customer-password__error');
    expect(errorEl).toBeNull();
  });

  it('hides the "Use Login Code" toggle and rephrases header when codeUnavailable (initialMode=password)', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = UNVERIFIED;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login initial-mode="password"></sc-customer-login>`,
    });

    // No bounce-back link — prevents the 429 -> code -> resend -> 429 loop.
    const modeLink = page.root.shadowRoot.querySelector('.customer-code__mode-link');
    expect(modeLink).toBeNull();

    // Header should not claim a code was sent, since none was.
    const headerText = page.root.shadowRoot.querySelector('.customer-code__sent-info span')?.textContent;
    expect(headerText).toContain('Signing in as');
    expect(headerText).not.toContain('Code sent to');
  });

  it('keeps the "Use Login Code" toggle when password mode reached via manual switch (no 429)', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    // Manual switch to password from the code footer.
    const useCodePassword = page.root.shadowRoot.querySelector('.customer-code__mode-link') as HTMLElement;
    useCodePassword.click();
    await page.waitForChanges();

    // In password view now — toggle back to code mode should still be available.
    const passwordModeLink = page.root.shadowRoot.querySelector('.customer-code__mode-link');
    expect(passwordModeLink).not.toBeNull();
    expect(passwordModeLink.textContent).toContain('Use Login Code');
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

  it('renders change link with accessible text', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    const changeLink = page.root.shadowRoot.querySelector('.customer-code__change-link');
    expect(changeLink).not.toBeNull();
    expect(changeLink.textContent).toContain('Change');
  });

  it('shows expired state with send new code link', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_EXPIRED;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    const expiredEl = page.root.shadowRoot.querySelector('.customer-code__expired');
    expect(expiredEl).not.toBeNull();
    expect(expiredEl.getAttribute('role')).toBe('alert');
    expect(expiredEl.textContent).toContain('Code expired');
    expect(expiredEl.textContent).toContain('Send new code');
  });

  it('shows resend timer in footer', async () => {
    userState.email = 'user@example.com';
    userState.verificationStatus = CODE_SENT;

    const page = await newSpecPage({
      components: [ScCustomerLogin],
      html: `<sc-customer-login></sc-customer-login>`,
    });

    const timer = page.root.shadowRoot.querySelector('.customer-code__resend-timer');
    expect(timer).not.toBeNull();
    expect(timer.textContent).toContain('Resend code in');
  });
});
