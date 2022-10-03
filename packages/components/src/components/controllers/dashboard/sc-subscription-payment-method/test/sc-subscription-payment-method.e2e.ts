import { newE2EPage } from '@stencil/core/testing';

describe('sc-subscription-payment-method', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-subscription-payment-method></sc-subscription-payment-method>');

    const element = await page.find('sc-subscription-payment-method');
    expect(element).toHaveClass('hydrated');
  });
});
