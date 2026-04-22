import { newE2EPage } from '@stencil/core/testing';

describe('sc-checkout-razorpay-payment', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-checkout-razorpay-payment></sc-checkout-razorpay-payment>');

    const element = await page.find('sc-checkout-razorpay-payment');
    expect(element).toHaveClass('hydrated');
  });
});
