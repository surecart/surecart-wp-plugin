import { newE2EPage } from '@stencil/core/testing';

describe('sc-payment-method', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-payment-method></sc-payment-method>');

    const element = await page.find('sc-payment-method');
    expect(element).toHaveClass('hydrated');
  });
});
