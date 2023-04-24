import { newE2EPage } from '@stencil/core/testing';

describe('sc-checkout-mollie-payment', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-checkout-mollie-payment></sc-checkout-mollie-payment>');

    const element = await page.find('sc-checkout-mollie-payment');
    expect(element).toHaveClass('hydrated');
  });
});
