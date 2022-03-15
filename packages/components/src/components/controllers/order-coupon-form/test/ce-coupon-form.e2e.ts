import { newE2EPage } from '@stencil/core/testing';

describe('ce-order-coupon-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<ce-order-coupon-form></ce-order-coupon-form>');

    const element = await page.find('ce-order-coupon-form');
    expect(element).toHaveClass('hydrated');
  });
});
