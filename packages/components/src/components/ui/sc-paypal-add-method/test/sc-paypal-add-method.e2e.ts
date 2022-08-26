import { newE2EPage } from '@stencil/core/testing';

describe('sc-paypal-add-method', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-paypal-add-method></sc-paypal-add-method>');

    const element = await page.find('sc-paypal-add-method');
    expect(element).toHaveClass('hydrated');
  });
});
