import { newE2EPage } from '@stencil/core/testing';

describe('sc-checkout-paystack-payment', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-checkout-paystack-payment></sc-checkout-paystack-payment>');

    const element = await page.find('sc-checkout-paystack-payment');
    expect(element).toHaveClass('hydrated');
  });
});
