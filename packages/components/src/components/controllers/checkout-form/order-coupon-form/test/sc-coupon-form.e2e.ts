import { newE2EPage } from '@stencil/core/testing';

describe('sc-order-coupon-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-order-coupon-form></sc-order-coupon-form>');

    const element = await page.find('sc-order-coupon-form');
    expect(element).toHaveClass('hydrated');
  });
});
