import { newE2EPage } from '@stencil/core/testing';

describe('sc-login-provider', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-login-provider></sc-login-provider>');

    const element = await page.find('sc-login-provider');
    expect(element).toHaveClass('hydrated');
  });
});
